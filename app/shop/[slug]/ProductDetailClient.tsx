'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../../../context/CartContext';
import { useAuth, AuthUser } from '../../../context/AuthContext';
import ProductGallery from '../../../components/ProductGallery';
import ProductCard from '../../../components/ProductCard';
import MountainRidgeDivider from '../../../components/MountainRidgeDivider';
import ScrollReveal from '../../../components/ScrollReveal';
import SafeImage from '../../../components/SafeImage';
import { getColorImages, getProductPrimaryImage, normalizeProduct } from '../../../lib/product-utils';
import type { Product } from '../../../types/product';
import type { Review } from '../../../types/review';

interface ProductDetailClientProps {
  product: Product;
  similarProducts: Product[];
}

export default function ProductDetailClient({ product, similarProducts }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const { user, isMock } = useAuth();
  
  const [colorIndex, setColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? 'One Size');
  const [error, setError] = useState('');

  // Reviews states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  // Lightbox media
  const [activeMediaUrl, setActiveMediaUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const normalized = normalizeProduct(product);

  const getDisplayPrice = () => {
    if (normalized.sizePrices && normalized.sizePrices[selectedSize]) {
      return normalized.sizePrices[selectedSize];
    }
    return normalized.price;
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      setError('Please select a size.');
      return;
    }
    const color = product.colors[colorIndex];
    setError('');
    addToCart({
      productId: product.id,
      name: product.name,
      price: getDisplayPrice(),
      image: getProductPrimaryImage(product, colorIndex),
      size: selectedSize,
      color: color?.name ?? 'Default',
    });
  };

  const activeColor = normalized.colors[colorIndex] ?? normalized.colors[0];
  const galleryImages = getColorImages(normalized, colorIndex);
  const detailLines = normalized.details.split('\n').filter(Boolean);

  // Fetch reviews on load
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?productId=${product.id}`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoadingReviews(false);
      }
    }
    fetchReviews();
  }, [product.id]);

  // Check review eligibility
  useEffect(() => {
    const currentUser = user;
    if (!currentUser) {
      setCanReview(false);
      return;
    }
    async function checkEligibility(currUser: AuthUser) {
      try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (!isMock && currUser.token) {
          headers['Authorization'] = `Bearer ${currUser.token}`;
        }
        const url = isMock
          ? `/api/orders/my-orders?email=${encodeURIComponent(currUser.email)}`
          : `/api/orders/my-orders`;
        const res = await fetch(url, { headers });
        if (res.ok) {
          const data = await res.json();
          const orders = data.orders || [];
          const hasPaid = orders.some((order: any) => {
            const isPaid = order.status === 'prebook_paid' || order.status === 'confirmed';
            if (!isPaid) return false;
            return order.items.some((item: any) => {
              const parsed = item.id.split('::')[0];
              return parsed === product.id || item.id === product.id;
            });
          });
          setCanReview(hasPaid);
        }
      } catch (e) {
        console.error('Error checking review eligibility:', e);
      }
    }
    checkEligibility(currentUser);
  }, [user, product.id, isMock]);

  // Handle Review Media Upload
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingMedia(true);
    setReviewError('');

    try {
      const urls: string[] = [];
      const headers: Record<string, string> = {};
      if (!isMock && user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const formData = new FormData();
        formData.append('file', file);

        const uploadUrl = isMock
          ? `/api/reviews/upload?email=${encodeURIComponent(user?.email || '')}`
          : `/api/reviews/upload`;

        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers,
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to upload media file.');
        }

        const data = await res.json();
        urls.push(data.url);
      }

      setUploadedMedia((prev) => [...prev, ...urls]);
    } catch (err: any) {
      setReviewError(err.message || 'File upload failed. Images/videos only.');
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeUploadedMedia = (index: number) => {
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Review Form
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReview(true);
    setReviewError('');
    setReviewSuccess(false);

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (!isMock && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      const postUrl = isMock
        ? `/api/reviews?email=${encodeURIComponent(user.email)}&userId=${encodeURIComponent(user.id)}`
        : `/api/reviews`;

      const res = await fetch(postUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          comment: reviewComment,
          userName: user.profile?.fullName || user.email.split('@')[0],
          media: uploadedMedia,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      setReviews((prev) => [data.review, ...prev]);
      setReviewSuccess(true);
      setReviewComment('');
      setUploadedMedia([]);
      setReviewRating(5);
    } catch (err: any) {
      setReviewError(err.message || 'Error occurred while saving review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Statistics calculation
  const totalReviewsCount = reviews.length;
  const avgRating = totalReviewsCount > 0
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1))
    : 0;

  const renderStars = (rating: number, interactive = false, onSelect?: (r: number) => void) => {
    return (
      <div className="flex gap-1 items-center">
        {Array.from({ length: 5 }).map((_, i) => {
          const starVal = i + 1;
          const filled = starVal <= rating;
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => onSelect?.(starVal)}
              className={`${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : ''} text-lg ${
                filled ? 'text-summitGold' : 'text-midnightNavy/20'
              }`}
            >
              ★
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-storeWhite min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <nav className="text-xs font-bold uppercase tracking-widest text-midnightNavy/40 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-summitGoldDark">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-summitGoldDark">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-midnightNavy">{normalized.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <ProductGallery
            key={activeColor.name}
            images={galleryImages}
            alt={normalized.name}
            isNew={normalized.isNew}
          />

          <div className="lg:pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-summitGoldDark mb-2">{normalized.category}</p>
            <h1 className="font-display text-4xl md:text-5xl text-midnightNavy uppercase tracking-wide leading-tight mb-2">
              {normalized.name}
            </h1>
            
            {/* Reviews Summary Header */}
            {totalReviewsCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                {renderStars(Math.round(avgRating))}
                <span className="text-xs font-bold text-midnightNavy/70">
                  {avgRating} ({totalReviewsCount} {totalReviewsCount === 1 ? 'Review' : 'Reviews'})
                </span>
              </div>
            )}

            <p className="text-2xl font-bold text-summitGoldDark mb-6">
              ₹{getDisplayPrice().toLocaleString('en-IN')}
            </p>

            <p className="text-sm text-midnightNavy/75 leading-relaxed mb-8">{normalized.description}</p>

            {normalized.colors.length > 1 && (
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-3">
                  Color — <span className="text-midnightNavy">{activeColor.name}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {normalized.colors.map((color, i) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setColorIndex(i)}
                      title={color.name}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        colorIndex === i
                          ? 'border-midnightNavy ring-2 ring-summitGold ring-offset-2 scale-110'
                          : 'border-borderGray hover:border-summitGold'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {normalized.sizes.length > 0 && (
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-midnightNavy/60 mb-3">
                  Size — <span className="text-midnightNavy">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {normalized.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => { setSelectedSize(size); setError(''); }}
                      className={`min-w-[3rem] px-4 py-3 text-xs font-bold uppercase tracking-wider border-2 transition-colors ${
                        selectedSize === size
                          ? 'border-midnightNavy bg-midnightNavy text-summitGold'
                          : 'border-borderGray text-midnightNavy hover:border-summitGold'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-600 font-medium mb-4">{error}</p>}

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!normalized.inStock}
                className="flex-1 bg-midnightNavy text-summitGold py-4 text-sm font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors disabled:opacity-40"
              >
                {normalized.inStock ? 'Add to Cart' : 'Sold Out'}
              </button>
              {normalized.buyLink && (
                <a
                  href={normalized.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center border-2 border-midnightNavy text-midnightNavy py-4 text-sm font-black uppercase tracking-widest hover:bg-midnightNavy hover:text-summitGold transition-colors"
                >
                  Supplier Link ↗
                </a>
              )}
            </div>

            {detailLines.length > 0 && (
              <div className="border-t border-borderGray pt-8">
                <h2 className="font-display text-xl text-midnightNavy uppercase tracking-wide mb-4">Details</h2>
                <ul className="space-y-2">
                  {detailLines.map((line) => (
                    <li key={line} className="text-sm text-midnightNavy/70 flex items-start gap-2">
                      <span className="text-summitGold mt-0.5">◆</span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ─── Ratings & Reviews Section ─── */}
        <section className="mt-20 pt-16 border-t border-borderGray">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Reviews Summary Stats */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="font-display text-3xl text-midnightNavy uppercase tracking-wide">
                Customer Reviews
              </h2>

              <div className="bg-cardGray border border-borderGray p-6 space-y-4">
                {totalReviewsCount > 0 ? (
                  <div className="space-y-2">
                    <p className="text-5xl font-black text-midnightNavy font-display">{avgRating}</p>
                    <div className="flex items-center gap-1.5">
                      {renderStars(Math.round(avgRating))}
                      <span className="text-xs font-bold text-midnightNavy/50 uppercase tracking-wider">
                        Based on {totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-midnightNavy/50 font-bold uppercase tracking-wider">No reviews yet.</p>
                )}
                <div className="text-xs font-bold text-midnightNavy/60 leading-relaxed uppercase tracking-wider">
                  Verified buyers who purchased this item are eligible to leave custom reviews and upload photos/videos.
                </div>
              </div>

              {/* Review Input Box Form */}
              {user ? (
                canReview ? (
                  <div className="bg-cardGray border border-borderGray p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-midnightNavy mb-4">
                      Write a Review
                    </h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="field-label">Overall Rating</label>
                        {renderStars(reviewRating, true, setReviewRating)}
                      </div>

                      <div>
                        <label className="field-label">Comments</label>
                        <textarea
                          required
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="What did you think of the fit, comfort, quality, and style?"
                          className="field-input resize-none bg-storeWhite"
                        />
                      </div>

                      {/* Photo/Video upload section */}
                      <div>
                        <label className="field-label">Add Photos or Videos</label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          multiple
                          accept="image/*,video/*"
                          onChange={handleMediaUpload}
                          className="hidden"
                          id="review-media-upload-input"
                        />
                        <button
                          type="button"
                          disabled={uploadingMedia}
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full text-center border-2 border-dashed border-borderGray py-3 text-xs font-black uppercase tracking-wider text-midnightNavy hover:border-summitGold transition-colors bg-storeWhite"
                        >
                          {uploadingMedia ? 'Uploading...' : '📤 Choose Files (Max 5)'}
                        </button>
                      </div>

                      {/* Upload previews */}
                      {uploadedMedia.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {uploadedMedia.map((url, index) => {
                            const isVideo = url.endsWith('.mp4') || url.includes('_video_') || url.includes('/video');
                            return (
                              <div key={index} className="relative aspect-square border border-borderGray bg-storeWhite group rounded overflow-hidden">
                                {isVideo ? (
                                  <video src={url} className="w-full h-full object-cover" muted />
                                ) : (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={url} alt="Review thumb" className="w-full h-full object-cover" />
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeUploadedMedia(index)}
                                  className="absolute top-1 right-1 bg-midnightNavy text-summitGold hover:bg-red-600 hover:text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold"
                                >
                                  ✕
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {reviewError && (
                        <div className="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200">
                          {reviewError}
                        </div>
                      )}

                      {reviewSuccess && (
                        <div className="p-3 text-xs font-semibold text-green-700 bg-green-50 border border-green-200">
                          Thank you! Your review has been submitted successfully.
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submittingReview || uploadingMedia}
                        className="w-full bg-midnightNavy text-summitGold py-3.5 text-xs font-black uppercase tracking-widest hover:bg-midnightNavyLight transition-colors disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="border border-summitGold/25 bg-summitGold/5 p-5 text-center text-xs font-bold text-midnightNavy/70 uppercase tracking-wider leading-relaxed">
                    🔒 Only verified purchasers who bought this clothing item can write a review.
                  </div>
                )
              ) : (
                <div className="border border-borderGray p-5 text-center bg-cardGray text-xs font-bold text-midnightNavy/70 uppercase tracking-wider leading-relaxed">
                  🔐 Please <Link href="/login" className="text-summitGoldDark underline hover:text-summitGold">Log In</Link> to leave a review and upload files.
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-8 space-y-6">
              <h3 className="font-display text-xl text-midnightNavy uppercase tracking-wide border-b border-borderGray pb-3">
                Reviews ({totalReviewsCount})
              </h3>

              {loadingReviews ? (
                <div className="py-10 text-center">
                  <div className="w-6 h-6 border-2 border-summitGold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs uppercase font-bold tracking-widest text-midnightNavy/50">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <p className="text-sm font-medium text-midnightNavy/50 py-10 text-center">
                  No verified reviews yet. Be the first to buy and leave a review!
                </p>
              ) : (
                <div className="space-y-6 divide-y divide-borderGray/60">
                  {reviews.map((review, idx) => (
                    <div key={review.id} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} space-y-3`}>
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-midnightNavy">{review.userName}</p>
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
                              Verified Purchase
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-midnightNavy/40 font-bold uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-midnightNavy/75 leading-relaxed">{review.comment}</p>

                      {/* Display Uploaded Photos / Videos */}
                      {review.media && review.media.length > 0 && (
                        <div className="flex flex-wrap gap-2.5 pt-2">
                          {review.media.map((url, index) => {
                            const isVideo = url.endsWith('.mp4') || url.includes('_video_') || url.includes('/video');
                            return (
                              <div
                                key={index}
                                onClick={() => setActiveMediaUrl(url)}
                                className="relative w-24 h-24 sm:w-28 sm:h-28 border border-borderGray bg-cardGray hover:opacity-85 transition-opacity cursor-pointer rounded overflow-hidden shadow-sm"
                              >
                                {isVideo ? (
                                  <div className="relative w-full h-full">
                                    <video src={url} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                      </svg>
                                    </div>
                                  </div>
                                ) : (
                                  <SafeImage src={url} alt="User upload" className="w-full h-full object-cover" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ─── Similar Products / Drops ─── */}
        {similarProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-borderGray">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-xs font-bold uppercase tracking-widest text-summitGoldDark mb-2">Similar Drops</p>
                <h2 className="font-display text-4xl md:text-5xl text-midnightNavy uppercase tracking-wide">
                  You May Also Like
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {similarProducts.map((simProd, index) => (
                <ScrollReveal key={simProd.id} delay={index * 100}>
                  <ProductCard product={simProd} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </div>

      <MountainRidgeDivider />

      {/* Lightbox Modal */}
      {activeMediaUrl && (
        <div
          onClick={() => setActiveMediaUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <button
            type="button"
            onClick={() => setActiveMediaUrl(null)}
            className="absolute top-4 right-4 text-white text-3xl font-bold cursor-pointer hover:text-summitGold"
          >
            ✕
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex items-center justify-center bg-storeBlack/40"
          >
            {activeMediaUrl.endsWith('.mp4') || activeMediaUrl.includes('_video_') || activeMediaUrl.includes('/video') ? (
              <video src={activeMediaUrl} controls autoPlay className="max-w-full max-h-[85vh] object-contain" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeMediaUrl} alt="Review attachment" className="max-w-full max-h-[85vh] object-contain shadow-2xl" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

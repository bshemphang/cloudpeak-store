'use client';
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe.');
      }

      setMessage(data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err: any) {
      setIsError(true);
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollReveal>
      <div className="bg-cardGray py-16 md:py-20 border-t border-borderGray text-center px-4">
        <h2 className="font-display text-3xl md:text-5xl uppercase tracking-widest text-midnightNavy mb-4">
          Join Our Community!
        </h2>
        <p className="text-midnightNavy/60 text-sm mb-8 max-w-lg mx-auto">
          Subscribe for early collection access, exclusive streetwear drops, and brand updates.
        </p>
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 bg-storeWhite px-6 py-4 text-sm font-medium outline-none border border-borderGray focus:border-summitGold transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-midnightNavy text-summitGold px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-midnightNavyLight transition-colors disabled:opacity-50"
          >
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
        {message && (
          <p className={`text-xs font-bold uppercase tracking-widest mt-4 ${isError ? 'text-red-600' : 'text-green-700'}`}>
            {message}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}

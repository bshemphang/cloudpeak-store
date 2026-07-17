export type Review = {
  id: string;
  productId: string;
  userId: string;
  userEmail: string;
  userName: string;
  rating: number;
  comment: string;
  media: string[]; // URLs of pictures or videos
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  type: 'short' | 'long';
  uploaderId: string;
  country: string;
  tags: string[];
  thumbnailUrl: string;
  videoUrl: string;
  likes: number;
  shares: number;
  commentsCount: number;
  createdAt: string; // ISO string
  isPremium?: boolean;
};

export type Comment = {
  id: string;
  videoId: string;
  authorId: string;
  content: string;
  parentId: string | null;
  upvotes: number;
  downvotes: number;
  createdAt: string; // ISO string
};

import { type User, type Video, type Comment } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const imageMap = new Map(PlaceHolderImages.map(img => [img.id, img]));

const users: User[] = Array.from({ length: 10 }, (_, i) => ({
  id: `user_${i + 1}`,
  name: `User ${i + 1}`,
  avatarUrl: imageMap.get(`user${i + 1}`)?.imageUrl ?? '',
}));

const countries = ['USA', 'Japan', 'Brazil', 'UK', 'India', 'Germany', 'France', 'Canada', 'Australia', 'Russia'];
const tags = ['Lifestyle', 'Gaming', 'Music', 'Dance', 'Comedy', 'Education', 'Travel', 'Tech', 'Fashion', 'Art'];
const descriptions = [
  'Exploring the vibrant nightlife and neon-lit streets.',
  'A deep dive into the latest trends and styles.',
  'Capturing moments of pure joy and excitement.',
  'Unforgettable journey through stunning landscapes.',
  'Behind the scenes look at creating digital art.',
];

const videos: Video[] = [
  // Long Videos
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `long_${i + 1}`,
    title: `A Long Journey Part ${i + 1}`,
    description: descriptions[i % descriptions.length],
    type: 'long' as const,
    uploaderId: users[i % users.length].id,
    country: countries[i % countries.length],
    tags: [tags[i % tags.length], tags[(i + 1) % tags.length]],
    thumbnailUrl: imageMap.get(`long_video_${i + 1}`)?.imageUrl ?? '',
    videoUrl: '',
    likes: Math.floor(Math.random() * 10000),
    shares: Math.floor(Math.random() * 1000),
    commentsCount: Math.floor(Math.random() * 500),
    createdAt: new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 30).toISOString(),
    isPremium: i % 3 === 0, // Mark every 3rd long video as premium
  })),
  // Short Videos
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `short_${i + 1}`,
    title: `Quick Clip #${i + 1}`,
    description: `A quick look at something cool. ${descriptions[i % descriptions.length]}`,
    type: 'short' as const,
    uploaderId: users[i % users.length].id,
    country: countries[(i + 5) % countries.length],
    tags: [tags[(i + 2) % tags.length]],
    thumbnailUrl: imageMap.get(`short_video_${i + 1}`)?.imageUrl ?? '',
    videoUrl: '',
    likes: Math.floor(Math.random() * 5000),
    shares: Math.floor(Math.random() * 500),
    commentsCount: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.random() * 1000 * 3600 * 24 * 7).toISOString(),
    isPremium: i % 4 === 0, // Mark every 4th short video as premium
  })),
];

const comments: Comment[] = videos.flatMap(video =>
  Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, i) => {
    const hasParent = Math.random() > 0.5 && i > 1;
    return {
      id: `comment_${video.id}_${i}`,
      videoId: video.id,
      authorId: users[i % users.length].id,
      content: `This is an amazing video! Can't believe what I'm seeing. #${i+1}`,
      parentId: hasParent ? `comment_${video.id}_${Math.floor(Math.random() * (i - 1))}` : null,
      upvotes: Math.floor(Math.random() * 200),
      downvotes: Math.floor(Math.random() * 20),
      createdAt: new Date(Date.now() - Math.random() * 1000 * 3600 * 24).toISOString(),
    };
  })
);


export function getUsers(): User[] {
  return users;
}

export function getUser(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getVideos(): Video[] {
  return videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getVideo(id: string): Video | undefined {
  return videos.find(v => v.id === id);
}

export function getComments(videoId: string): Comment[] {
  return comments
    .filter(c => c.videoId === videoId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getCountries(): string[] {
    return [...new Set(videos.map(v => v.country))].sort();
}

export function getTags(): string[] {
    return [...new Set(videos.flatMap(v => v.tags))].sort();
}

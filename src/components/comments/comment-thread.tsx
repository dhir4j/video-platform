"use client";

import { getComments } from '@/lib/data';
import { CommentItem } from './comment-item';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send } from 'lucide-react';

export function CommentThread({ videoId, isShorts = false }: { videoId: string; isShorts?: boolean }) {
  const allComments = getComments(videoId);
  const rootComments = allComments.filter(comment => comment.parentId === null);

  const getReplies = (commentId: string) => {
    return allComments.filter(comment => comment.parentId === commentId);
  };

  if (isShorts) {
    return (
      <div className="space-y-4">
        {rootComments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={getReplies(comment.id)}
            getReplies={getReplies}
            isShorts
          />
        ))}
        {rootComments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{allComments.length} Comments</h2>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by: Newest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4">
        <Textarea placeholder="Add a comment..." />
        <Button className="self-end">
          <Send className="mr-2 h-4 w-4" />
          Post Comment
        </Button>
      </div>
      <div className="space-y-6">
        {rootComments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={getReplies(comment.id)}
            getReplies={getReplies}
          />
        ))}
      </div>
    </div>
  );
}
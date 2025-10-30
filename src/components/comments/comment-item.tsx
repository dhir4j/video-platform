'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/types';
import { getUser } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ArrowBigUp, ArrowBigDown, MessageSquare, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  getReplies: (commentId: string) => Comment[];
  isShorts?: boolean;
}

export function CommentItem({ comment, replies, getReplies, isShorts = false }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true);
  const author = getUser(comment.authorId);
  const voteCount = comment.upvotes - comment.downvotes;

  if (isShorts) {
    return (
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={author?.avatarUrl} alt={author?.name} />
          <AvatarFallback>{author?.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm">{author?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }).replace('about ', '')}
                </span>
              </div>
              <p className="mt-0.5 text-sm leading-snug">{comment.content}</p>
              <div className="flex items-center gap-4 mt-2">
                <button className="text-xs text-muted-foreground hover:text-foreground">
                  {comment.upvotes} likes
                </button>
                <button className="text-xs text-muted-foreground hover:text-foreground">
                  Reply
                </button>
                {replies.length > 0 && (
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    onClick={() => setShowReplies(!showReplies)}
                  >
                    {showReplies ? 'Hide' : 'View'} {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                  </button>
                )}
              </div>
            </div>
            <button className="shrink-0 text-muted-foreground hover:text-foreground">
              <Heart className="h-3 w-3" />
            </button>
          </div>

          {replies.length > 0 && showReplies && (
            <div className="mt-3 space-y-3 pl-3 border-l-2 border-border">
              {replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  replies={getReplies(reply.id)}
                  getReplies={getReplies}
                  isShorts
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Avatar className="h-10 w-10 mt-1">
        <AvatarImage src={author?.avatarUrl} alt={author?.name} />
        <AvatarFallback>{author?.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{author?.name}</span>
          <span className="text-xs text-muted-foreground">
            • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="mt-1 text-foreground/90">{comment.content}</p>
        <div className="flex items-center gap-2 mt-2 text-muted-foreground">
          <Button variant="ghost" size="sm" className="gap-1 px-2">
            <ArrowBigUp className="h-4 w-4" />
            <span>{comment.upvotes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="px-2">
            <ArrowBigDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            Reply
          </Button>
        </div>

        {replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {showReplies && replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                replies={getReplies(reply.id)}
                getReplies={getReplies}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

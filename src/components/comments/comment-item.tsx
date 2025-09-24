'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/types';
import { getUser } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ArrowBigUp, ArrowBigDown, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
  comment: Comment;
  replies: Comment[];
  getReplies: (commentId: string) => Comment[];
}

export function CommentItem({ comment, replies, getReplies }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true);
  const author = getUser(comment.authorId);
  const voteCount = comment.upvotes - comment.downvotes;

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

"use client";

import { useState } from 'react';
import { CommentThread } from './comment-thread';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { getComments } from '@/lib/data';

interface CommentSectionProps {
  videoId: string;
}

export function CommentSection({ videoId }: CommentSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const allComments = getComments(videoId);

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden transition-all duration-300">
      {/* Dropdown Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold">Comments</h2>
            <p className="text-sm text-muted-foreground">
              {allComments.length} {allComments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {isOpen ? 'Hide' : 'Show'} comments
          </span>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </div>
      </button>

      {/* Dropdown Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-6 py-4 border-t bg-background/30">
          <CommentThread videoId={videoId} />
        </div>
      </div>
    </div>
  );
}

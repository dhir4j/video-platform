
import { redirect } from 'next/navigation';

// This page is no longer needed with the feed-based approach.
// We redirect to the main shorts feed.
export default function ShortsIdPage({ params }: { params: { id: string } }) {
  redirect('/shorts');
}


import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  categoryName: string;
  videoCount: number;
}

export function CategoryCard({ categoryName, videoCount }: CategoryCardProps) {
  const imageId = `category_${categoryName.toLowerCase().replace(' ', '_')}`;
  const placeholderImage = PlaceHolderImages.find(img => img.id === imageId);

  return (
    <Link href={`/categories/${categoryName.toLowerCase()}`} className="group">
      <Card className="relative aspect-video w-full overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:border-primary/60">
        <Image
          src={placeholderImage?.imageUrl || 'https://placehold.co/600x400/000000/FFFFFF/png?text=VibeVerse'}
          alt={categoryName}
          fill
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
          data-ai-hint={placeholderImage?.imageHint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
          <h3 className="font-bold text-lg text-white truncate">{categoryName}</h3>
          <p className="text-sm text-white/80">{videoCount.toLocaleString()} Videos</p>
        </div>
      </Card>
    </Link>
  );
}

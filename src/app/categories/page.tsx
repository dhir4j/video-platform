import { getTags } from "@/lib/data";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function CategoriesPage() {
  const tags = getTags();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {tags.map((tag) => (
          <Link href={`/categories/${tag.toLowerCase()}`} key={tag}>
            <Card className="aspect-video flex items-center justify-center p-4 bg-secondary hover:bg-primary/20 hover:border-primary/50 transition-all duration-300 cursor-pointer">
              <h2 className="text-lg font-semibold text-center">{tag}</h2>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

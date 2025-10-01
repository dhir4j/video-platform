
import { getTags, getVideos } from "@/lib/data";
import { CategoryCard } from "@/components/categories/category-card";

export default function CategoriesPage() {
  const tags = getTags();
  const allVideos = getVideos();

  const categoriesWithCounts = tags.map(tag => {
    const count = allVideos.filter(video => video.tags.includes(tag)).length;
    return { name: tag, count };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse All Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categoriesWithCounts.map((category) => (
          <CategoryCard 
            key={category.name} 
            categoryName={category.name} 
            videoCount={category.count} 
          />
        ))}
      </div>
    </div>
  );
}

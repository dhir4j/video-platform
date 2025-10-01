
"use client"

import Link from "next/link";
import { getTags } from "@/lib/data";

export function CategoryHoverMenu() {
  const tags = getTags();

  return (
    <div className="flex flex-col space-y-1 p-2">
      <h3 className="px-2 py-1.5 text-sm font-semibold text-foreground">Categories</h3>
      {tags.map((tag) => (
        <Link
          href={`/categories/${tag.toLowerCase()}`}
          key={tag}
          className="rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}

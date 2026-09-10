"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BlogPostsManager } from "@/components/admin/blog-posts-manager";
import { AlbumsManager } from "@/components/admin/albums-manager";
import type { AlbumImageRow, AlbumRow, BlogPostRow } from "@/lib/types/database";

export function BlogAdminTabs({
  initialPosts,
  initialAlbums,
  initialAlbumImages,
}: {
  initialPosts: BlogPostRow[];
  initialAlbums: AlbumRow[];
  initialAlbumImages: AlbumImageRow[];
}) {
  const [tab, setTab] = useState<"posts" | "albums">("posts");

  return (
    <div>
      <div className="mb-6 inline-flex rounded-lg border border-black/10 bg-white p-1">
        {(["posts", "albums"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
              tab === t ? "bg-navy text-white" : "text-text-grey hover:text-navy"
            )}
          >
            {t === "posts" ? "Blog Posts" : "Photo Albums"}
          </button>
        ))}
      </div>

      {tab === "posts" ? (
        <BlogPostsManager initialPosts={initialPosts} />
      ) : (
        <AlbumsManager initialAlbums={initialAlbums} initialAlbumImages={initialAlbumImages} />
      )}
    </div>
  );
}

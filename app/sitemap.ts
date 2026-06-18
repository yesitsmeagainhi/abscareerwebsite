import type { MetadataRoute } from "next";

import { getBranchSlugs, getCourseSlugs } from "@/lib/content";
import { getBlogPosts } from "@/lib/blog";
import { getLocationSlugs } from "@/lib/locations";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courseSlugs, branchSlugs, locationSlugs] = await Promise.all([
    getCourseSlugs(),
    getBranchSlugs(),
    getLocationSlugs(),
  ]);
  const posts = await getBlogPosts();
  const lastModified = new Date(CONTENT_UPDATED);

  const staticRoutes = ["", "/courses", "/branches", "/blog", "/about", "/contact"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  // Course landing pages live at the root (flat SEO URLs).
  const courseRoutes = courseSlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Course × location money pages (e.g. /d-pharma-admission-thane).
  const locationRoutes = locationSlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const branchRoutes = branchSlugs.map((slug) => ({
    url: `${SITE_URL}/branches/${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogRoutes = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.dateModified || p.datePublished),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...courseRoutes,
    ...locationRoutes,
    ...branchRoutes,
    ...blogRoutes,
  ];
}

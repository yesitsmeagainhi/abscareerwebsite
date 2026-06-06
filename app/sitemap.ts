import type { MetadataRoute } from "next";

import { getBranchSlugs, getCourseSlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courseSlugs, branchSlugs] = await Promise.all([
    getCourseSlugs(),
    getBranchSlugs(),
  ]);

  const staticRoutes = ["", "/courses", "/branches", "/about", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  // Course landing pages live at the root (flat SEO URLs).
  const courseRoutes = courseSlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const branchRoutes = branchSlugs.map((slug) => ({
    url: `${SITE_URL}/branches/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...courseRoutes, ...branchRoutes];
}

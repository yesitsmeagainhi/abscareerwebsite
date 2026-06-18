import Link from "next/link";

// Visible breadcrumb trail. Pair with breadcrumbSchema() for the JSON-LD twin —
// visible breadcrumbs help both users and crawlers understand site structure.
export default function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.path} className="flex items-center gap-1">
              {last ? (
                <span className="text-gray-700">{it.name}</span>
              ) : (
                <>
                  <Link href={it.path} className="hover:text-brand">
                    {it.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

import Link from "next/link";

const filters = [
  { label: "All", href: "/" },
  { label: "Tops", href: "/category/tops" },
  { label: "Shorts", href: "/category/shorts" },
  { label: "Bags", href: "/category/bags" },
  { label: "Accessories", href: "/category/accessories" },
];

export default function FilterTabs() {
  return (
    // overflow-x-auto lets this scroll horizontally on narrow screens instead
    // of wrapping or squeezing — the chips stay one clean row on any device.
    // scrollbar-hide-ish: we just don't style a scrollbar, keeping it minimal.
    <div className="flex gap-3 overflow-x-auto px-6 pb-8 md:justify-center md:px-16">
      {filters.map((filter, i) => (
        <Link
          key={filter.label}
          href={filter.href}
          className={`flex-shrink-0 rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
            i === 0
              ? "border-ink bg-ink text-paper" // "All" is styled as active by default
              : "border-line text-muted hover:border-ink hover:text-ink"
          }`}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  );
}

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500 py-4">
      {items.map((item, index) => (
        <span key={index} className="flex items-center space-x-2">
          {index > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-cyan-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}


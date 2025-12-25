import type { BlockStats, StatItem } from "@/lib/types";
import { Star } from "lucide-react";

interface StatsBlockProps {
  data?: BlockStats | null;
}

// Icon mapping helper
const getIcon = (iconName?: string) => {
  const iconMap: Record<string, any> = {
    star: Star,
    // Add more icons as needed
  };
  return iconMap[iconName || ""] || null;
};

// Icon color mapping helper
const getIconColorClass = (color?: string) => {
  const colorMap: Record<string, string> = {
    amber: "text-amber-400 fill-amber-400",
    blue: "text-blue-400 fill-blue-400",
    green: "text-green-400 fill-green-400",
    red: "text-red-400 fill-red-400",
  };
  return colorMap[color || "amber"] || "text-amber-400 fill-amber-400";
};

export default function StatsBlock({ data }: StatsBlockProps) {
  if (!data) return null;

  // Parse stats JSON field
  const stats: StatItem[] = Array.isArray(data.stats)
    ? data.stats
    : typeof data.stats === "string"
      ? JSON.parse(data.stats || "[]")
      : [];

  if (stats.length === 0) {
    return null;
  }

  const columns = data.columns || 4;
  const showIcons = data.show_icons ?? true;

  // Grid column classes based on number of columns
  const gridColsClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }[columns] || "grid-cols-2 md:grid-cols-4";

  return (
    <section className="pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-card rounded-3xl border border-white/50 shadow-xl p-6 md:p-8">
          <div className={`grid ${gridColsClass} gap-6 md:gap-8`}>
            {stats.map((stat, index) => {
              const Icon = stat.icon && showIcons ? getIcon(stat.icon) : null;
              const iconColorClass = stat.icon_color && showIcons 
                ? getIconColorClass(stat.icon_color) 
                : "";

              return (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1">
                    {Icon && (
                      <Icon className={`w-4 h-4 ${iconColorClass}`} />
                    )}
                    <span>{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


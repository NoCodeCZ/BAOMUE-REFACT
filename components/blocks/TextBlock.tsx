import type { BlockText } from "@/lib/types";

interface TextBlockProps {
  data?: BlockText | null;
}

export default function TextBlock({ data }: TextBlockProps) {
  if (!data) return null;

  const title = data.title ?? "";
  const subtitle = data.subtitle ?? "";
  const content = data.content ?? "";
  const alignment = data.alignment ?? "left";
  const bgColor = data.background_color;

  return (
    <section
      className={`py-16 px-4 ${bgColor ? "" : "bg-white"}`}
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    >
      <div className="max-w-4xl mx-auto">
        {title && (
          <h2
            className={`text-3xl font-bold mb-4 ${
              alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"
            }`}
          >
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            className={`text-lg text-slate-600 mb-6 ${
              alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"
            }`}
          >
            {subtitle}
          </p>
        )}
        {content && (
          <div
            className={`prose prose-slate max-w-none ${
              alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"
            }`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}


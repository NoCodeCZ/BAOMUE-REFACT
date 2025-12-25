interface ServicesPageHeaderProps {
  title?: string;
  description?: string;
}

export default function ServicesPageHeader({
  title = "Our Services",
  description = "Comprehensive dental care for the whole family"
}: ServicesPageHeaderProps) {
  return (
    <div className="pt-10 md:pt-20 text-center max-w-3xl mx-auto px-4">
      <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-slate-900 font-medium tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-lg md:text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}


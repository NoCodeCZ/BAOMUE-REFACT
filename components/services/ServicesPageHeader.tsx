interface ServicesPageHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function ServicesPageHeader({
  title = "Our Services!",
  subtitle = "บริการทางทันตกรรมของ Baomue"
}: ServicesPageHeaderProps) {
  return (
    <div className="text-center pt-12 md:pt-16 pb-10">
      <h1 className="text-5xl md:text-6xl font-black text-[#0F3FA1] mb-2 tracking-tighter uppercase font-sans">
        {title}
      </h1>
      <p className="text-[#1e3a8a] text-lg font-bold">
        {subtitle}
      </p>
    </div>
  );
}

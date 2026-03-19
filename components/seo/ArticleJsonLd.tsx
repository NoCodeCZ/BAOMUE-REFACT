interface ArticleJsonLdProps {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string | null;
  publishedDate?: string;
  authorName?: string;
  tags?: string[];
}

export default function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  publishedDate,
  authorName,
  tags,
}: ArticleJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://baomuedentalclinic.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description || title,
    "url": url.startsWith("http") ? url : `${siteUrl}${url}`,
    ...(imageUrl && { "image": imageUrl }),
    ...(publishedDate && { "datePublished": publishedDate }),
    ...(authorName && {
      "author": {
        "@type": "Person",
        "name": authorName,
      },
    }),
    "publisher": {
      "@type": "Organization",
      "name": "BAOMUE Dental Clinic",
      "url": siteUrl,
    },
    ...(tags && tags.length > 0 && { "keywords": tags.join(", ") }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

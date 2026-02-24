/** @type {import('next').NextConfig} */

// Security: Extract hostname from Directus URL to restrict image domains
function getDirectusHostname() {
  const url = process.env.NEXT_PUBLIC_DIRECTUS_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const directusHostname = getDirectusHostname();

const nextConfig = {
  images: {
    remotePatterns: [
      // Only allow images from the configured Directus instance (not all HTTPS domains)
      ...(directusHostname
        ? [
            { protocol: 'https', hostname: directusHostname },
            { protocol: 'http', hostname: directusHostname },
          ]
        : []),
      // Allow localhost for development
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
};

module.exports = nextConfig;

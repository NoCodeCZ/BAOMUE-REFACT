export const analyticsConfig = {
  gtm: {
    enabled: true,
    containerId: process.env.NEXT_PUBLIC_GTM_ID,
  },
  googleAds: {
    enabled: process.env.NEXT_PUBLIC_GADS_CONVERSION_ID ? true : false,
    conversionId: process.env.NEXT_PUBLIC_GADS_CONVERSION_ID,
    conversionLabel: process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL,
  },
  metaPixel: {
    enabled: process.env.NEXT_PUBLIC_META_PIXEL_ID ? true : false,
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  },
};


"use client";
import Script from "next/script";

const GADS_ID = process.env.NEXT_PUBLIC_GADS_CONVERSION_ID;

/**
 * Google tag (gtag.js) for Google Ads conversion tracking + remarketing.
 * Loads gtag.js and configures the Ads account (AW-XXXXXXXXX).
 * Renders nothing if NEXT_PUBLIC_GADS_CONVERSION_ID is not set.
 */
export function GoogleAdsScript() {
  if (!GADS_ID) return null;

  return (
    <>
      <Script
        id="gtag-js"
        src={`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${GADS_ID}');`}
      </Script>
    </>
  );
}

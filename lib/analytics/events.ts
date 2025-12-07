declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}

// Pre-defined events for consistency
export const events = {
  bookingClick: (service?: string, location?: string) =>
    trackEvent("booking_click", { service, location }),

  phoneClick: (location: string) =>
    trackEvent("phone_click", { location }),

  formSubmit: (formName: string) =>
    trackEvent("form_submit", { form_name: formName }),

  serviceView: (serviceName: string, serviceId: number) =>
    trackEvent("service_view", { service_name: serviceName, service_id: serviceId }),

  promotionClick: (promoName: string) =>
    trackEvent("promotion_click", { promo_name: promoName }),
};


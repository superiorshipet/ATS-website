type GtmEventPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<GtmEventPayload & { event?: string }>;
  }
}

const pushToDataLayer = (payload: GtmEventPayload & { event: string }) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
};

export const trackPageView = (path: string, title = document.title) => {
  pushToDataLayer({
    event: 'page_view',
    page_path: path,
    page_title: title,
  });
};

export const trackEvent = (event: string, payload: GtmEventPayload = {}) => {
  pushToDataLayer({
    event,
    ...payload,
  });
};

// Google Analytics 4 Helper Functions

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Page view tracking
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom event helpers
export const trackBlogCreated = (blogId, category) => {
  event({
    action: 'blog_created',
    category: 'Blog',
    label: category,
    value: blogId,
  });
};

export const trackBlogViewed = (blogId, category) => {
  event({
    action: 'blog_viewed',
    category: 'Blog',
    label: category,
    value: blogId,
  });
};

export const trackBlogLiked = (blogId) => {
  event({
    action: 'blog_liked',
    category: 'Engagement',
    label: blogId,
  });
};

export const trackBlogShared = (blogId, platform) => {
  event({
    action: 'blog_shared',
    category: 'Social',
    label: platform,
    value: blogId,
  });
};

export const trackTokenEarned = (amount, source) => {
  event({
    action: 'token_earned',
    category: 'Rewards',
    label: source,
    value: amount,
  });
};

export const trackDomainConnected = (domain) => {
  event({
    action: 'domain_connected',
    category: 'Settings',
    label: domain,
  });
};

export const trackSearch = (query, resultCount) => {
  event({
    action: 'search',
    category: 'Discovery',
    label: query,
    value: resultCount,
  });
};

export const trackSignup = (method) => {
  event({
    action: 'sign_up',
    category: 'Auth',
    label: method,
  });
};

export const trackLogin = (method) => {
  event({
    action: 'login',
    category: 'Auth',
    label: method,
  });
};

// Time tracking
export const trackTimeOnPage = (pageName, seconds) => {
  event({
    action: 'time_on_page',
    category: 'Engagement',
    label: pageName,
    value: Math.round(seconds),
  });
};

// Error tracking
export const trackError = (errorMessage, errorLocation) => {
  event({
    action: 'error',
    category: 'Error',
    label: `${errorLocation}: ${errorMessage}`,
  });
};

// User properties
export const setUserProperties = (userId, properties) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('set', 'user_properties', {
      user_id: userId,
      ...properties,
    });
  }
};

export async function getTemplateByHost(host) {
  // Normally you'd fetch from your DB; we'll mock this for now
  const templates = {
    'growth.cybev.io': 'modern',
    'techtalks.io': 'classic',
    'default': 'modern',
  };

  return templates[host] || templates['default'];
}
import { useEffect } from 'react';

/**
 * Injects a JSON-LD <script> into <head> for the lifetime of the component.
 * Used for SEO/GEO structured data (Organization, WebSite, Article, FAQPage, etc.).
 *
 * @param {{ id: string, data: object | object[] }} props
 */
function StructuredData({ id, data }) {
  useEffect(() => {
    if (!data) return undefined;
    const scriptId = `ld-${id}`;
    let el = document.getElementById(scriptId);
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = scriptId;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [id, data]);

  return null;
}

export default StructuredData;

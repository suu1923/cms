import DOMPurify from 'dompurify';

type SanitizeHtml = (dirty: string, _options?: unknown) => string;

const sanitizeHtml: SanitizeHtml = (dirty, _options) => {
  // Strapi Admin（浏览器端）只需要基础的 XSS 清理能力即可。
  return DOMPurify.sanitize(dirty ?? '');
};

export default sanitizeHtml;


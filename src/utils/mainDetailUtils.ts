import DOMPurify from 'dompurify';

/** 게시글 작성 시간 → 몇 분/시간/일 전 텍스트 반환 */
export const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diff = now.getTime() - postDate.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  return `${days}일 전`;
};

/** HTML 문자열 sanitize (React Quill 등에서 사용한 content용) */
export const cleanContent = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a',
      'h1', 'h2', 'h3', 'p', 'span',
      'ul', 'ol', 'li', 'br', 'gt', 'lt', 'amp'
    ],
    ALLOWED_ATTR: ['href', 'target', 'style', 'class'],
  });
};

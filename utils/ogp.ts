/**
 * OGP (Open Graph Protocol) メタタグを動的に設定するユーティリティ
 */

interface OGPConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * 現在のベースURLを取得
 */
export function getBaseUrl(): string {
  if (typeof window === 'undefined') return 'https://deeptech-hunter-j73y.vercel.app';
  
  const { protocol, host } = window.location;
  
  // 本番環境のドメインを優先
  if (host === 'deeptech-hunter-j73y.vercel.app') {
    return 'https://deeptech-hunter-j73y.vercel.app';
  }
  
  return `${protocol}//${host}`;
}

/**
 * OGPメタタグを動的に更新
 */
export function updateOGPTags(config: OGPConfig): void {
  const baseUrl = getBaseUrl();
  
  // デフォルト値
  const defaults = {
    title: 'ディープテックハンター | 日本の大学技術を発掘',
    description: '日本の大学・研究機関の最先端ディープテクノロジーを発見・分析するAI搭載投資プラットフォーム。ベンチャーキャピタル向けの包括的な技術評価と投資機会の発掘をサポートします。',
    image: '/ogp.png',
    url: baseUrl,
    type: 'website'
  };

  const finalConfig = { ...defaults, ...config };

  // 画像URLを絶対URLに変換
  const imageUrl = finalConfig.image.startsWith('http') 
    ? finalConfig.image 
    : `${baseUrl}${finalConfig.image}`;

  // メタタグを更新
  updateMetaTag('og:title', finalConfig.title);
  updateMetaTag('og:description', finalConfig.description);
  updateMetaTag('og:image', imageUrl);
  updateMetaTag('og:url', finalConfig.url);
  updateMetaTag('og:type', finalConfig.type);
  
  // Twitter Card
  updateMetaTag('twitter:title', finalConfig.title);
  updateMetaTag('twitter:description', finalConfig.description);
  updateMetaTag('twitter:image', imageUrl);
  updateMetaTag('twitter:url', finalConfig.url);
  
  // canonical URL
  updateCanonicalUrl(finalConfig.url);
  
  // ページタイトル
  if (finalConfig.title) {
    document.title = finalConfig.title;
  }
}

/**
 * メタタグを更新または作成
 */
function updateMetaTag(property: string, content: string): void {
  if (!content) return;
  
  // property属性で検索（og:xxx用）
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  
  // name属性で検索（twitter:xxx用）
  if (!meta) {
    meta = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
  }
  
  if (meta) {
    meta.content = content;
  } else {
    // 新しいメタタグを作成
    meta = document.createElement('meta');
    if (property.startsWith('og:')) {
      meta.setAttribute('property', property);
    } else {
      meta.setAttribute('name', property);
    }
    meta.content = content;
    document.head.appendChild(meta);
  }
}

/**
 * canonical URLを更新
 */
function updateCanonicalUrl(url: string): void {
  if (!url) return;
  
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (canonical) {
    canonical.href = url;
  } else {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = url;
    document.head.appendChild(canonical);
  }
}

/**
 * OGP画像のプリロード
 */
export function preloadOGPImage(imagePath: string = '/ogp.png'): void {
  const baseUrl = getBaseUrl();
  const imageUrl = imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`;
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = imageUrl;
  document.head.appendChild(link);
}

/**
 * OGP画像が存在するかチェック
 */
export async function checkOGPImageExists(imagePath: string = '/ogp.png'): Promise<boolean> {
  try {
    const baseUrl = getBaseUrl();
    const imageUrl = imagePath.startsWith('http') ? imagePath : `${baseUrl}${imagePath}`;
    
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
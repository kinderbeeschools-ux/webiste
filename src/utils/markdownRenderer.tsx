import React from 'react';

/**
 * Helper to extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  return match ? match[1] : null;
}

/**
 * Parses inline formatting like **bold**, *italic*, [link text](url), and bare URLs
 */
function parseInline(text: string): React.ReactNode[] {
  if (!text) return [];

  const elements: React.ReactNode[] = [];
  
  // Combined Regex matching:
  // 1. **bold** -> group 2
  // 2. *italic* -> group 3
  // 3. [link text](url) -> group 4 (text), group 5 (url)
  // 4. bare URL (https://... or http://...) -> group 6
  const regex = /(\*\*(.*?)\*\*|\*(.*?)\*|\[(.*?)\]\((.*?)\)|(https?:\/\/[^\s<]+))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const fullMatch = match[0];
    const boldContent = match[2];
    const italicContent = match[3];
    const linkText = match[4];
    const linkUrl = match[5];
    const bareUrl = match[6];

    if (boldContent !== undefined) {
      elements.push(
        <strong key={`b-${keyIndex++}`} className="font-bold text-stone-900">
          {parseInline(boldContent)}
        </strong>
      );
    } else if (italicContent !== undefined) {
      elements.push(
        <em key={`i-${keyIndex++}`} className="italic text-stone-800">
          {parseInline(italicContent)}
        </em>
      );
    } else if (linkText !== undefined && linkUrl !== undefined) {
      // Check if this link is a YouTube video
      const ytId = extractYouTubeId(linkUrl);
      if (ytId) {
        elements.push(
          <div key={`yt-${keyIndex++}`} className="my-6 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              title={linkText || "YouTube Video Player"}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      } else {
        elements.push(
          <a
            key={`l-${keyIndex++}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E1007A] font-bold underline hover:text-pink-700 transition"
          >
            {parseInline(linkText)}
          </a>
        );
      }
    } else if (bareUrl !== undefined) {
      const ytId = extractYouTubeId(bareUrl);
      if (ytId) {
        elements.push(
          <div key={`yt-${keyIndex++}`} className="my-6 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              title="YouTube Video Player"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      } else {
        // Clean display text for bare URL (e.g. kinderbee.in instead of full long URL string)
        let displayUrl = bareUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
        if (displayUrl.length > 35) displayUrl = displayUrl.substring(0, 32) + '...';

        elements.push(
          <a
            key={`u-${keyIndex++}`}
            href={bareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E1007A] font-bold underline hover:text-pink-700 transition"
          >
            {displayUrl}
          </a>
        );
      }
    } else {
      elements.push(fullMatch);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

/**
 * Renders raw markdown text into fully formatted React JSX elements.
 */
export function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Clean erroneous multi-asterisks (e.g. ****text**** -> **text**)
  const cleanedText = text.replace(/\*{4,}/g, '**');

  // Split lines
  const lines = cleanedText.split('\n');

  return (
    <div className="space-y-4">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return null; // Ignore empty lines, space-y handles paragraph gaps
        }

        // Check standalone YouTube URL or Embed line
        const standaloneYt = extractYouTubeId(trimmed);
        if (standaloneYt && (trimmed.startsWith('http') || trimmed.startsWith('[youtube') || trimmed.startsWith('[video'))) {
          return (
            <div key={idx} className="my-6 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${standaloneYt}`}
                title="YouTube Video Player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }

        // 1. Headings
        if (trimmed.startsWith('###### ')) {
          return (
            <h6 key={idx} className="font-display font-bold text-sm text-stone-900 mt-4 mb-1">
              {parseInline(trimmed.replace(/^######\s+/, ''))}
            </h6>
          );
        }
        if (trimmed.startsWith('##### ')) {
          return (
            <h5 key={idx} className="font-display font-bold text-base text-stone-900 mt-4 mb-1">
              {parseInline(trimmed.replace(/^#####\s+/, ''))}
            </h5>
          );
        }
        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={idx} className="font-display font-bold text-lg text-stone-900 mt-5 mb-2">
              {parseInline(trimmed.replace(/^####\s+/, ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="font-display font-bold text-xl sm:text-2xl text-stone-900 mt-6 mb-2">
              {parseInline(trimmed.replace(/^###\s+/, ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={idx} className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900 mt-7 mb-3">
              {parseInline(trimmed.replace(/^##\s+/, ''))}
            </h2>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h1 key={idx} className="font-display font-black text-3xl sm:text-4xl text-stone-900 mt-8 mb-4">
              {parseInline(trimmed.replace(/^#\s+/, ''))}
            </h1>
          );
        }

        // 2. Blockquotes
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote key={idx} className="border-l-4 border-[#E1007A] bg-pink-50/50 p-4 rounded-r-xl italic text-stone-700 my-4">
              {parseInline(trimmed.replace(/^>\s+/, ''))}
            </blockquote>
          );
        }

        // 3. Bullet lists (- or *)
        if (/^[-*]\s+/.test(trimmed)) {
          const content = trimmed.replace(/^[-*]\s+/, '');
          return (
            <li key={idx} className="ml-5 list-disc text-stone-800 leading-relaxed">
              {parseInline(content)}
            </li>
          );
        }

        // 4. Numbered lists (1. , 2. )
        if (/^\d+\.\s+/.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s+/, '');
          return (
            <li key={idx} className="ml-5 list-decimal text-stone-800 leading-relaxed">
              {parseInline(content)}
            </li>
          );
        }

        // 5. Default Paragraph
        return (
          <p key={idx} className="leading-relaxed text-stone-800">
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

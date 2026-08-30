import React, { useState } from 'react';
import { generateDescriptiveAlt, ImageAltContext } from '../utils/seoImageAlt';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  altContext?: string | ImageAltContext;
  fallbackSrc?: string;
  className?: string;
}

/**
 * SmartImage Component
 * Automatically guarantees descriptive, accessible, and SEO-optimized alt attributes
 * for images across the entire website and blog articles.
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  altContext,
  fallbackSrc = 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Derive descriptive alt text automatically
  const computedAlt = generateDescriptiveAlt(src, altContext || alt, alt);

  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <img
      {...props}
      src={currentSrc}
      alt={computedAlt}
      title={props.title || computedAlt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
};

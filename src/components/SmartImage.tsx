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
  fallbackSrc,
  className = '',
  loading = 'lazy',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  // Derive descriptive alt text automatically
  const computedAlt = generateDescriptiveAlt(src, altContext || alt, alt);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      {...props}
      key={src}
      src={imgSrc}
      alt={computedAlt}
      title={props.title || computedAlt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
};

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BlogPost, SystemSettings } from '../types';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  blogPost?: BlogPost;
  settings?: SystemSettings | null;
  noIndex?: boolean; // keep a page out of search results
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  blogPost,
  settings,
  noIndex = false
}) => {
  const brandName = settings?.logoText || 'Kinderbee';
  const siteUrl = 'https://www.kinderbeeschools.com';
  
  // Format dynamic title
  let finalTitle = '';
  if (blogPost) {
    finalTitle = `${blogPost.title} | ${brandName} Research & Pedagogy Blog`;
  } else if (title) {
    // Titles that already name the brand are used as written (keyword-map titles, <= 60 chars)
    finalTitle = title.toLowerCase().includes(brandName.toLowerCase()) ? title : `${title} | ${brandName}`;
  } else if (settings?.metaTitle) {
    finalTitle = settings.metaTitle;
  } else {
    finalTitle = `${brandName} - Finnish-Inspired Zero Royalty Preschool Franchise & School Setup India`;
  }

  // Format meta description
  let finalDescription = '';
  if (blogPost) {
    finalDescription = blogPost.excerpt || `${blogPost.title} - Published by Kinderbee Research Desk on ${blogPost.date}.`;
  } else if (description) {
    finalDescription = description;
  } else if (settings?.metaDescription) {
    finalDescription = settings.metaDescription;
  } else {
    finalDescription = "Discover Kinderbee, India's leading Zero Royalty preschool franchise system and FinnishWay teacher training academy. 18-month payback, Nordic play-based pedagogy & NEP 2020 compliance.";
  }

  // Keywords
  const defaultKeywords = "preschool franchise, zero royalty preschool, finnish education india, play based learning, school setup consultancy, NEP 2020 curriculum, teacher training NTT";
  const finalKeywords = keywords || settings?.metaKeywords || defaultKeywords;

  // OG Image
  const finalOgImage = blogPost?.image || ogImage || settings?.logoUrl || 'https://uvsqqvhjtdtsexfsinvp.supabase.co/storage/v1/object/public/website%20Images/Logo.png';

  // Canonical URL
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const finalCanonical = canonicalUrl || `${siteUrl}${currentPath}`;

  // JSON-LD Structured Data Schema for Search Engines
  const schemaData = blogPost ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogPost.title,
    "image": [blogPost.image],
    "datePublished": blogPost.date,
    "dateModified": blogPost.date,
    "author": [{
      "@type": "Person",
      "name": blogPost.author,
      "jobTitle": "Curriculum & Nordic Pedagogy Specialist"
    }],
    "publisher": {
      "@type": "Organization",
      "name": brandName,
      "logo": {
        "@type": "ImageObject",
        "url": finalOgImage
      }
    },
    "description": blogPost.excerpt,
    "articleBody": blogPost.content,
    "articleSection": blogPost.category
  } : {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": brandName,
    "url": siteUrl,
    "logo": finalOgImage,
    "description": finalDescription,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings?.officeAddress || "No. 1, Old UCO Bank Road, Rajarajeshwari Layout, Ramamurthy Nagar, Bengaluru – 560016",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings?.phone || "+91 81223 44040",
      "contactType": "Customer Support & Franchise Enquiries"
    }
  };

  return (
    <Helmet>
      {/* Primary Dynamic HTML Meta */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={blogPost ? 'article' : ogType} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content={brandName} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />

      {/* Google Structured Data JSON-LD Schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

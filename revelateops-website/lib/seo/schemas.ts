/**
 * Comprehensive Schema.org structured data for SEO
 * Helps search engines understand the website content and relationships
 */

const siteUrl = 'https://www.revelateops.com';

// Organization Schema - Primary entity
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: 'Revelate Operations',
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/revelate-logo.png`,
    width: '512',
    height: '512',
  },
  image: `${siteUrl}/og/revelate-hero.png`,
  description:
    'Legacy Salesforce modernization for Series B SaaS teams. Expert RevOps consulting specializing in fixing routing, forecasting, and integrations without rebuilding.',
  founder: {
    '@type': 'Person',
    '@id': `${siteUrl}/#founder`,
    name: 'Drew Lambert',
    jobTitle: 'Founder & Senior Revenue Systems Engineer',
    url: `${siteUrl}/about`,
    sameAs: [
      'https://www.linkedin.com/in/drew-lambert/',
    ],
    knowsAbout: [
      'Salesforce Administration',
      'Revenue Operations',
      'CRM Integration',
      'Sales Operations',
      'GTM Operations',
      'Salesforce CPQ',
    ],
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Boston',
    addressRegion: 'MA',
    addressCountry: 'US',
  },
  areaServed: {
    '@type': 'Country',
    name: 'United States',
  },
  email: 'drew@revelateops.com',
  sameAs: [
    'https://www.linkedin.com/company/revelate-operations/',
  ],
  serviceType: [
    'Salesforce Modernization',
    'Revenue Operations Consulting',
    'CRM Integration',
    'Sales Operations',
    'Technical Debt Remediation',
  ],
  knowsAbout: [
    'Salesforce',
    'Revenue Operations',
    'Series B SaaS',
    'CRM Modernization',
    'Sales Operations',
    'Integration Architecture',
  ],
  slogan: 'Modernize your Salesforce without the rebuild',
};

// Local Business Schema
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${siteUrl}/#business`,
  name: 'Revelate Operations',
  url: siteUrl,
  logo: `${siteUrl}/revelate-logo.png`,
  image: `${siteUrl}/og/revelate-hero.png`,
  description:
    'Expert Salesforce and RevOps consulting for Series B SaaS companies. Modernize your CRM, fix integrations, and optimize revenue operations.',
  priceRange: '$$$',
  telephone: '+1-XXX-XXX-XXXX', // Replace with actual phone
  email: 'drew@revelateops.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Boston',
    addressRegion: 'MA',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '42.3601',
    longitude: '-71.0589',
  },
  areaServed: [
    {
      '@type': 'Country',
      name: 'United States',
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'RevOps Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Salesforce Modernization',
          description:
            'Legacy Salesforce org modernization for Series B SaaS teams. Fix routing, forecasting, and integrations.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Integration Architecture',
          description:
            'Design and implement robust integration architecture between Salesforce and your revenue stack.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Technical Debt Remediation',
          description:
            'Systematic cleanup of Salesforce technical debt accumulated during rapid growth.',
        },
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '12',
    bestRating: '5',
    worstRating: '1',
  },
};

// Website Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'Revelate Operations',
  description:
    'RevOps consulting and Salesforce modernization for Series B SaaS companies',
  publisher: {
    '@id': `${siteUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// Breadcrumb Schema Generator
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Service Schema Generator
export function generateServiceSchema(service: {
  name: string;
  description: string;
  price?: string;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@id': `${siteUrl}/#organization`,
    },
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'USD',
      },
    }),
    ...(service.url && {
      url: service.url,
    }),
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
  };
}

// FAQ Page Schema Generator
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Person Schema (Founder)
export const founderSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteUrl}/#founder`,
  name: 'Drew Lambert',
  jobTitle: 'Founder & Senior Revenue Systems Engineer',
  description:
    'Former Senior Revenue Systems Engineer at $100M+ Series C. Expert in Salesforce modernization and revenue operations for Series B SaaS companies.',
  url: `${siteUrl}/about`,
  image: `${siteUrl}/founder-portrait.png`,
  sameAs: [
    'https://www.linkedin.com/in/drew-lambert/',
  ],
  worksFor: {
    '@id': `${siteUrl}/#organization`,
  },
  knowsAbout: [
    'Salesforce Administration',
    'Revenue Operations',
    'CRM Integration',
    'Sales Operations',
    'GTM Operations',
    'Salesforce CPQ',
    'Integration Architecture',
    'Technical Debt Management',
  ],
  alumniOf: {
    '@type': 'Organization',
    name: '$100M+ Series C SaaS Company',
  },
};

// Article Schema Generator (for blog posts)
export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${siteUrl}/og/revelate-hero.png`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@id': `${siteUrl}/#founder`,
    },
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

// Aggregate all schemas for homepage
export const homepageSchemas = {
  '@context': 'https://schema.org',
  '@graph': [
    organizationSchema,
    websiteSchema,
    localBusinessSchema,
    founderSchema,
  ],
};

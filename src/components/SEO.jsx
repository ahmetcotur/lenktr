import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'LENK.TR - Modern Link Management & Bio Pages',
    description = 'Create beautiful bio pages and manage your links with LENK.TR. Modern, fast, and easy to use link management platform.',
    image = '/og-image.png',
    url = '',
    type = 'website',
    keywords = 'link management, bio page, linktree alternative, social media links, bio link, link in bio',
    author = 'LENK.TR',
    twitterHandle = '@lenktr'
}) => {
    const siteUrl = 'https://lenk.tr';
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
    const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content="LENK.TR" />
            <meta property="og:locale" content="tr_TR" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={fullImage} />
            <meta property="twitter:creator" content={twitterHandle} />

            {/* Additional SEO */}
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Turkish" />
            <meta name="revisit-after" content="7 days" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Helmet>
    );
};

export default SEO;

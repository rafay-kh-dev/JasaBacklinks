import { Helmet } from "react-helmet-async";

const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "https://www.jasabacklinks.net");

export default function SEO({
  title = "Jasa Backlinks | Powered by SeoHub Ltd",
  description = "Scale your Google rankings with Jasa Backlinks (by SeoHub Ltd). Verified DA/DR 50+ Homepage PBN Posts, Sidebar Blogrolls, .ID Regional, and .EDU/.GOV backlinks starting at $1/link.",
  canonicalUrl = SITE_URL,
  ogImage = `${SITE_URL}/logo.png`,
  ogType = "website",
  schemaGraph = null,
  noindex = false,
  manageMeta = true,
}) {
  const fullJsonLd = schemaGraph
    ? {
        "@context": "https://schema.org",
        "@graph": schemaGraph,
      }
    : null;

  return (
    <Helmet prioritizeSeoTags>
      {manageMeta && <title>{title}</title>}
      {manageMeta && <meta name="description" content={description} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <link rel="canonical" href={canonicalUrl} />

      {manageMeta && <meta property="og:type" content={ogType} />}
      {manageMeta && <meta property="og:title" content={title} />}
      {manageMeta && <meta property="og:description" content={description} />}
      {manageMeta && <meta property="og:url" content={canonicalUrl} />}
      {manageMeta && <meta property="og:image" content={ogImage} />}
      {manageMeta && <meta property="og:site_name" content="Jasa Backlinks" />}

      {manageMeta && <meta name="twitter:card" content="summary_large_image" />}
      {manageMeta && <meta name="twitter:title" content={title} />}
      {manageMeta && <meta name="twitter:description" content={description} />}
      {manageMeta && <meta name="twitter:image" content={ogImage} />}

      {fullJsonLd && (
        <script id="jasa-jsonld-schema" type="application/ld+json">
          {JSON.stringify(fullJsonLd)}
        </script>
      )}
    </Helmet>
  );
}

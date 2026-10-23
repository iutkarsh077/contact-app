export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://contact-desk.local";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Google-Extended",
          "Applebot-Extended",
        ],
        allow: [
          "/",
          "/volunteers",
          "/volunteers/register",
          "/requests",
          "/requests/new",
          "/appointments",
          "/contacts",
          "/visits",
          "/stats",
          "/signup",
          "/login",
        ],
        disallow: ["/admin"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

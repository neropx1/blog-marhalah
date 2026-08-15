import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import styles from "./app.css?url";
import Navbar from "./components/Navbar";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com",
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Texturina:wght@300;400;700&family=Bricolage+Grotesque:wght@300;400;500;600;700;800&display=swap",
  },
  { rel: "icon", href: "favicon.ico", type: "image/ico" },
];

export const meta: MetaFunction = () => [
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: "Impervious Generation — Official Platform" },
  {
    name: "description",
    content: "Official Website Impervious Generation - 2027. Berbagi cerita, pengetahuan, dan inspirasi dari perjalanan kami.",
  },
  { name: "keywords", content: "blog, artikel, inspirasi, pengetahuan, komunitas" },
  { name: "author", content: "Impervious Generation" },
  { name: "robots", content: "index, follow" },
  { property: "og:title", content: "Impervious Generation — Official Platform" },
  { property: "og:description", content: "Official Website Impervious Generation - 2027. Berbagi cerita, pengetahuan, dan inspirasi dari perjalanan kami." },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "id_ID" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Impervious Generation — Official Platform" },
  { name: "twitter:description", content: "Official Website Impervious Generation - 2027. Berbagi cerita, pengetahuan, dan inspirasi dari perjalanan kami." },
  { icon: "favicon.ico" }
];

// Initialize theme - always dark mode
// Script runs inline in head — body is NOT yet available here,
// so we target documentElement (html) and defer body class to DOMContentLoaded
const themeScript = `
  (function(){
    document.addEventListener('DOMContentLoaded', function(){
      document.body.classList.remove('light-mode');
    });
  })();
`;

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {!isAdminRoute && <Navbar />}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

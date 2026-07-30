import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLocation } from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
// 1. Ambil URL dari file CSS yang baru dibuat tadi
import stylesheet from "~/app.css?url";
import Navbar from "~/components/Navbar";

// 2. Daftarkan CSS ke dalam fungsi links bawaan Remix
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
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
    href: "https://fonts.googleapis.com/css2?family=Texturina:wght@300;400;700&display=swap",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap",
  },

  { rel: "icon", href: "  favicon.ico", type: "image/ico" },
];

export const meta: MetaFunction = () => [
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: "Impervious Generation — Official Platform" },
  {
    name: "description",
    content:
      "Official Website Impervious Generation - 2027",
  },
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

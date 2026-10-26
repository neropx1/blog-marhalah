import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, useLocation, Link, Meta, Links, Outlet, ScrollRestoration, Scripts, useNavigate, useLoaderData, useFetcher, useSearchParams, Form } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { IconSearch, IconHome, IconArticle, IconInfoCircle } from "@tabler/icons-react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const styles = "/assets/app-BjI2m9eK.css";
function Navbar() {
  const location = useLocation();
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 bg-[#0C0A08]/95 backdrop-blur-sm border-b border-[#241E16] md:block hidden", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center gap-3 hover:opacity-90 transition", children: /* @__PURE__ */ jsx(
          "img",
          {
            className: "h-8 w-auto",
            src: "/logo-horizontal-negative.webp",
            alt: "Impervious Generation",
            loading: "eager"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "hidden lg:block h-4 w-[1px] bg-[#2E251A]" }),
        /* @__PURE__ */ jsx("span", { className: "hidden lg:inline text-xs tracking-wider uppercase text-[#8C7E68] font-[Bricolage_Grotesque]", children: "Jurnal & Warta Angkatan" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-8", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/",
            className: `text-sm tracking-wide transition relative py-1 font-[Bricolage_Grotesque] ${isActive("/") ? "text-amber-400 font-semibold" : "text-[#C8BA9E] hover:text-amber-300"}`,
            children: [
              "Beranda",
              isActive("/") && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/jelajahi",
            className: `text-sm tracking-wide transition relative py-1 font-[Bricolage_Grotesque] ${isActive("/jelajahi") ? "text-amber-400 font-semibold" : "text-[#C8BA9E] hover:text-amber-300"}`,
            children: [
              "Jelajahi",
              isActive("/jelajahi") && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/tentang",
            className: `text-sm tracking-wide transition relative py-1 font-[Bricolage_Grotesque] ${isActive("/tentang") ? "text-amber-400 font-semibold" : "text-[#C8BA9E] hover:text-amber-300"}`,
            children: [
              "Tentang",
              isActive("/tentang") && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/jelajahi",
          className: "btn-secondary btn-sm flex items-center gap-1.5 text-xs font-[Bricolage_Grotesque]",
          children: [
            /* @__PURE__ */ jsx(IconSearch, { className: "w-3.5 h-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Cari Artikel" })
          ]
        }
      ) })
    ] }) }) }),
    /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 bg-[#0C0A08]/95 backdrop-blur-sm border-b border-[#241E16] md:hidden", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
        "img",
        {
          className: "h-7 w-auto",
          src: "/logo-horizontal-negative.webp",
          alt: "Impervious Generation",
          loading: "eager"
        }
      ) }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/jelajahi",
          className: "p-1.5 text-[#C8BA9E] hover:text-amber-300 transition",
          "aria-label": "Cari artikel",
          children: /* @__PURE__ */ jsx(IconSearch, { className: "w-5 h-5" })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("nav", { className: "fixed bottom-0 left-0 right-0 z-50 bg-[#0E0B08] border-t border-[#241E16] md:hidden", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 h-14", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: `flex flex-col items-center justify-center gap-1 transition ${isActive("/") ? "text-amber-400 font-semibold" : "text-[#9A8B74] hover:text-amber-300"}`,
          children: [
            /* @__PURE__ */ jsx(IconHome, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-[Bricolage_Grotesque]", children: "Beranda" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/jelajahi",
          className: `flex flex-col items-center justify-center gap-1 transition ${isActive("/jelajahi") ? "text-amber-400 font-semibold" : "text-[#9A8B74] hover:text-amber-300"}`,
          children: [
            /* @__PURE__ */ jsx(IconArticle, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-[Bricolage_Grotesque]", children: "Artikel" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/tentang",
          className: `flex flex-col items-center justify-center gap-1 transition ${isActive("/tentang") ? "text-amber-400 font-semibold" : "text-[#9A8B74] hover:text-amber-300"}`,
          children: [
            /* @__PURE__ */ jsx(IconInfoCircle, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-[Bricolage_Grotesque]", children: "Tentang" })
          ]
        }
      )
    ] }) })
  ] });
}
function LoadingScreen() {
  const [active, setActive] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);
  if (!active) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-[#0C0A08]/75 backdrop-blur-xs transition-opacity duration-200",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "/horizontal.webp",
            alt: "Impervious Generation",
            className: "h-8 w-auto"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" }),
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse", style: { animationDelay: "150ms" } }),
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse", style: { animationDelay: "300ms" } })
        ] })
      ] })
    }
  );
}
const links = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "preconnect",
    href: "https://fonts.googleapis.com"
  },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "dns-prefetch",
    href: "https://cdn.jsdelivr.net"
  },
  {
    rel: "dns-prefetch",
    href: "https://api.github.com"
  },
  {
    rel: "dns-prefetch",
    href: "https://data.jsdelivr.com"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&family=Texturina:wght@300;400;700&family=Bricolage+Grotesque:wght@300;400;500;600;700;800&display=swap"
  },
  { rel: "icon", href: "favicon.ico", type: "image/ico" },
  {
    rel: "preload",
    as: "image",
    href: "/horizontal.webp"
  },
  {
    rel: "prefetch",
    as: "image",
    href: "/lambang.webp"
  },
  {
    rel: "prefetch",
    as: "page",
    href: "/jelajahi"
  },
  {
    rel: "prefetch",
    as: "page",
    href: "/tentang"
  },
  {
    rel: "prefetch",
    as: "page",
    href: "/not-found"
  }
];
const meta$5 = () => [
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: "Impervious Generation — Official Platform" },
  {
    name: "description",
    content: "Official Website Impervious Generation - 2027. Berbagi cerita, pengetahuan, dan inspirasi dari perjalanan kami."
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
const themeScript = `
  (function(){
    document.addEventListener('DOMContentLoaded', function(){
      document.body.classList.remove('light-mode');
    });
  })();
`;
function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return /* @__PURE__ */ jsxs("html", { lang: "id", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: themeScript } })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(LoadingScreen, {}),
      !isAdminRoute && /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  links,
  meta: meta$5
}, Symbol.toStringTag, { value: "Module" }));
const signInWithEmail = void 0;
const signUpWithEmail = void 0;
const getSession = void 0;
const ADMIN_INVITE_CODES = "marhalah-admin-2025".split(",").map((c) => c.trim());
function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        const isAdmin = ADMIN_INVITE_CODES.includes(inviteCode);
        const role = isAdmin ? "admin" : "editor";
        if (!inviteCode) {
          throw new Error("Invite code diperlukan");
        }
        await signUpWithEmail(email, password, role);
        setError(`✅ Akun ${role} dibuat! Silakan login.`);
        setIsSignUp(false);
        setPassword("");
        setInviteCode("");
      } else {
        await signInWithEmail(email, password);
        navigate("/admin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("main", { className: "min-h-screen bg-[#0C0A08] text-[#FAF4E8] flex items-center justify-center px-6", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-md relative z-10 py-12", children: /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded bg-[#16120D] border border-amber-500/30 mx-auto mb-4 flex items-center justify-center text-amber-400", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-[#FAF4E8] font-[Bricolage_Grotesque]", children: "Impervious Generation" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#8F816B] text-xs mt-1 font-[Bricolage_Grotesque]", children: "Portal Administrasi Konten" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-1.5", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "nama@email.com",
            required: true,
            className: "w-full editorial-input px-3.5 py-2.5 text-xs text-[#FAF4E8] placeholder-[#736652] font-[Bricolage_Grotesque]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-1.5", children: "Kata Sandi" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: "••••••••",
            required: true,
            className: "w-full editorial-input px-3.5 py-2.5 text-xs text-[#FAF4E8] placeholder-[#736652] font-[Bricolage_Grotesque]"
          }
        )
      ] }),
      isSignUp && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-xs font-semibold uppercase tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-1.5", children: "Kode Undangan (Invite Code)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: inviteCode,
            onChange: (e) => setInviteCode(e.target.value),
            placeholder: "Masukkan kode undangan",
            required: isSignUp,
            className: "w-full editorial-input px-3.5 py-2.5 text-xs text-[#FAF4E8] placeholder-[#736652] font-[Bricolage_Grotesque]"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx(
        "div",
        {
          className: `p-3 rounded text-xs border ${error.startsWith("✅") ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/30" : "bg-red-950/40 text-red-300 border-red-500/30"}`,
          children: error
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full btn-primary btn-md mt-2 font-[Bricolage_Grotesque]",
          children: loading ? "Memproses..." : isSignUp ? "Daftar Akun" : "Masuk ke Panel"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 text-center pt-4 border-t border-[#1F1912]", children: /* @__PURE__ */ jsxs("p", { className: "text-[#8F816B] text-xs font-[Bricolage_Grotesque]", children: [
      isSignUp ? "Sudah memiliki akun?" : "Perlu mendaftar akun baru?",
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setIsSignUp(!isSignUp);
            setError("");
          },
          className: "ml-2 text-amber-400 hover:underline font-semibold",
          children: isSignUp ? "Masuk" : "Daftar"
        }
      )
    ] }) })
  ] }) }) });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdminLogin
}, Symbol.toStringTag, { value: "Module" }));
const getSupabaseUrl = () => {
  var _a, _b, _c, _d;
  return (typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : null) || (typeof process !== "undefined" ? process.env.SUPABASE_URL : null) || ((_b = (_a = import.meta) == null ? void 0 : _a.env) == null ? void 0 : _b.VITE_SUPABASE_URL) || ((_d = (_c = import.meta) == null ? void 0 : _c.env) == null ? void 0 : _d.SUPABASE_URL) || "";
};
const getSupabaseServiceKey = () => {
  var _a, _b;
  return (typeof process !== "undefined" ? process.env.SUPABASE_SERVICE_ROLE_KEY : null) || ((_b = (_a = import.meta) == null ? void 0 : _a.env) == null ? void 0 : _b.SUPABASE_SERVICE_ROLE_KEY) || "";
};
const supabaseUrl = getSupabaseUrl();
const supabaseServiceKey = getSupabaseServiceKey();
if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "Warning: Missing Supabase credentials for admin operations"
  );
}
const supabaseAdmin = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : createClient("https://example.supabase.co", "dummy");
async function getAllUsers() {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }
    return (data.users || []).map((user) => {
      var _a;
      return {
        id: user.id,
        email: user.email || "",
        role: ((_a = user.user_metadata) == null ? void 0 : _a.role) || "editor",
        createdAt: user.created_at || "",
        lastLogin: user.last_sign_in_at || void 0
      };
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return [];
  }
}
async function deleteUser(userId) {
  try {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error("Error deleting user:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return false;
  }
}
async function updateUserRole(userId, role) {
  try {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role }
    });
    if (error) {
      console.error("Error updating user role:", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return false;
  }
}
function generateInviteCode(role) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${role}-${random}-${timestamp}`;
}
function getInviteCodes() {
  var _a, _b;
  const inviteCodes = ((_a = process.env.VITE_INVITE_CODES) == null ? void 0 : _a.split(",")) || [];
  const adminCodes = ((_b = process.env.ADMIN_INVITE_CODES) == null ? void 0 : _b.split(",")) || [];
  return [
    ...adminCodes.map((code) => ({
      code: code.trim(),
      role: "admin",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      createdBy: "System",
      isActive: true
    })),
    ...inviteCodes.slice(1).map((code) => ({
      code: code.trim(),
      role: "editor",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      createdBy: "System",
      isActive: true
    }))
  ];
}
const loader$3 = async ({ request }) => {
  try {
    const users = await getAllUsers();
    const inviteCodes = getInviteCodes();
    return json({
      users,
      inviteCodes,
      adminEmail: "admin@marhalah.local"
    });
  } catch (error) {
    console.error("Error loading admin panel:", error);
    return json({
      users: [],
      inviteCodes: [],
      adminEmail: "admin@marhalah.local"
    });
  }
};
const action = async ({ request }) => {
  if (request.method !== "POST" && request.method !== "DELETE") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
  const formData = await request.formData();
  const action2 = formData.get("action");
  const userId = formData.get("userId");
  if (action2 === "delete-user") {
    const success = await deleteUser(userId);
    if (!success) {
      return json({ error: "Failed to delete user" }, { status: 500 });
    }
    return json({ success: true, message: "User deleted successfully" });
  }
  if (action2 === "update-role") {
    const role = formData.get("role");
    const success = await updateUserRole(userId, role);
    if (!success) {
      return json({ error: "Failed to update role" }, { status: 500 });
    }
    return json({ success: true, message: "Role updated successfully" });
  }
  return json({ error: "Invalid action" }, { status: 400 });
};
function AdminPanel() {
  const { users, inviteCodes } = useLoaderData();
  const fetcher = useFetcher();
  const [notification, setNotification] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newInviteCode, setNewInviteCode] = useState("");
  useEffect(() => {
    const data = fetcher.data;
    if (data == null ? void 0 : data.message) {
      setNotification({
        type: (data == null ? void 0 : data.success) ? "success" : "error",
        message: data.message || data.error || "Unknown error"
      });
      setTimeout(() => setNotification(null), 3e3);
    }
  }, [fetcher.data]);
  const handleGenerateCode = () => {
    const code = generateInviteCode("editor");
    setNewInviteCode(code);
  };
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setNotification({
      type: "success",
      message: "Kode invite disalin!"
    });
    setTimeout(() => setNotification(null), 2e3);
  };
  return /* @__PURE__ */ jsx("main", { className: "min-h-screen bg-[#0C0A08] text-[#FAF4E8]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "liquid-card p-8 mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-amber-200 mb-2 font-[Bricolage_Grotesque]", children: "Admin Panel" }),
      /* @__PURE__ */ jsx("p", { className: "text-amber-100/70 font-[Bricolage_Grotesque]", children: "Kelola pengguna dan kode undangan" })
    ] }),
    notification && /* @__PURE__ */ jsx(
      "div",
      {
        className: `mb-6 p-4 rounded-lg liquid-card ${notification.type === "success" ? "text-emerald-400 border-emerald-500/30" : "text-red-400 border-red-500/30"}`,
        children: notification.message
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "liquid-card p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-amber-300 mb-4 font-[Bricolage_Grotesque]", children: "Buat Kode Undangan" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-100/70 mb-4 font-[Bricolage_Grotesque]", children: "Buat kode undangan baru untuk pengguna editor" }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleGenerateCode,
              className: "w-full liquid-btn",
              children: "Generate Kode"
            }
          ),
          newInviteCode && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 glass-input rounded border border-amber-400/30", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-200/50 mb-2", children: "Kode Baru:" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("code", { className: "flex-1 text-amber-400 font-mono text-sm break-all", children: newInviteCode }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleCopyCode(newInviteCode),
                  className: "p-2 hover:bg-amber-900/30 rounded transition liquid-btn btn-sm",
                  children: /* @__PURE__ */ jsx(
                    "svg",
                    {
                      className: "w-4 h-4 text-amber-400",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      children: /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        }
                      )
                    }
                  )
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "liquid-card p-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-amber-300 mb-4 font-[Bricolage_Grotesque]", children: "Statistik" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-amber-100/70", children: "Total Pengguna" }),
              /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold text-amber-400", children: users.length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-amber-100/70", children: "Admin" }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-amber-400", children: users.filter((u) => u.role === "admin").length })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsx("span", { className: "text-amber-100/70", children: "Editor" }),
              /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold text-amber-400", children: users.filter((u) => u.role === "editor").length })
            ] })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "liquid-card overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-amber-500/20", children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-amber-300 font-[Bricolage_Grotesque]", children: "Daftar Pengguna" }) }),
          users.length > 0 ? /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-amber-900/20 border-b border-amber-500/20", children: [
              /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-amber-200", children: "Email" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-amber-200", children: "Role" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-amber-200", children: "Terdaftar" }),
              /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right text-sm font-semibold text-amber-200", children: "Aksi" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-amber-500/15", children: users.map((user) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-amber-900/20 transition", children: [
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-amber-100", children: user.email }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user.role === "admin" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"}`,
                  children: user.role === "admin" ? "👑 Admin" : "✏️ Editor"
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-sm text-amber-200/60", children: new Date(user.createdAt).toLocaleDateString("id-ID") }),
              /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs(fetcher.Form, { method: "post", className: "inline", children: [
                /* @__PURE__ */ jsx("input", { type: "hidden", name: "userId", value: user.id }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2 justify-end", children: [
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      name: "role",
                      defaultValue: user.role,
                      onChange: (e) => {
                        if (e.target.value !== user.role) {
                          const form = e.currentTarget.form;
                          if (form) {
                            const roleInput = document.createElement("input");
                            roleInput.type = "hidden";
                            roleInput.name = "action";
                            roleInput.value = "update-role";
                            form.appendChild(roleInput);
                            form.submit();
                            form.removeChild(roleInput);
                          }
                        }
                      },
                      className: "px-2 py-1 rounded text-xs glass-input text-amber-100 border-amber-500/20",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "admin", children: "Admin" }),
                        /* @__PURE__ */ jsx("option", { value: "editor", children: "Editor" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        if (confirm(
                          `Yakin hapus pengguna ${user.email}?`
                        )) {
                          const form = document.createElement("form");
                          form.method = "post";
                          form.innerHTML = `
                                        <input type="hidden" name="action" value="delete-user">
                                        <input type="hidden" name="userId" value="${user.id}">
                                      `;
                          document.body.appendChild(form);
                          form.submit();
                          document.body.removeChild(form);
                        }
                      },
                      className: "px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition liquid-btn btn-sm",
                      children: "Hapus"
                    }
                  )
                ] })
              ] }) })
            ] }, user.id)) })
          ] }) }) : /* @__PURE__ */ jsx("div", { className: "p-12 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-amber-100/60", children: "Belum ada pengguna terdaftar" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "liquid-card overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "p-6 border-b border-amber-500/20", children: /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-amber-300 font-[Bricolage_Grotesque]", children: "Kode Undangan" }) }),
          inviteCodes.length > 0 ? /* @__PURE__ */ jsx("div", { className: "p-6 space-y-3", children: inviteCodes.map((code) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "flex items-center justify-between p-4 glass-input rounded-lg border border-amber-500/20",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsx("code", { className: "font-mono text-amber-400 font-semibold", children: code.code }),
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: `text-xs px-2 py-1 rounded ${code.role === "admin" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"}`,
                        children: code.role === "admin" ? "👑 Admin" : "✏️ Editor"
                      }
                    ),
                    code.usedBy && /* @__PURE__ */ jsxs("span", { className: "text-xs text-emerald-400", children: [
                      "✓ Digunakan oleh ",
                      code.usedBy
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-amber-200/40", children: [
                    "Dibuat: ",
                    new Date(code.createdAt).toLocaleDateString("id-ID")
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => handleCopyCode(code.code),
                    className: "p-2 hover:bg-amber-900/30 rounded transition text-amber-200/60 hover:text-amber-400 liquid-btn btn-sm",
                    children: /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "w-5 h-5",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          }
                        )
                      }
                    )
                  }
                )
              ]
            },
            code.code
          )) }) : /* @__PURE__ */ jsx("div", { className: "p-12 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-amber-100/60", children: "Belum ada kode undangan" }) })
        ] })
      ] })
    ] })
  ] }) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: AdminPanel,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const fallbackPosts = [
  {
    id: "2026-07-30-membangun-blog-modern",
    title: "Membangun Blog Modern dengan Remix",
    description: "Panduan singkat untuk memulai blog profesional dengan CMS yang mudah dikelola.",
    excerpt: "Panduan singkat untuk memulai blog profesional dengan CMS yang mudah dikelola.",
    date: "30 Juli 2026",
    category: "Artikel",
    author: "Admin",
    body: "## Membangun Blog Modern dengan Remix\n\nRemix adalah framework full-stack modern yang dibangun di atas standar web. Dengan pendekatan server-rendered dan progressive enhancement, Remix memberikan performa tinggi dan pengalaman membaca yang responsif.\n\n### Keunggulan Arsitektur\n\n1. **Nested Routing**: Mengorganisir halaman dan data secara hierarkis tanpa cascading request.\n2. **Server-Side Rendering (SSR)**: Konten langsung tersedia dalam HTML pertama sehingga ramah SEO dan cepat diakses pembaca.\n3. **Integrasi Headless CMS**: Menghubungkan konten Markdown dengan antarmuka modern secara elegan.\n\nDengan perpaduan arsitektur ini, seluruh publikasi dapat disajikan dengan kecepatan tinggi, tipografi yang nyaman, dan tampilan yang ramping serta bersih.",
    tags: ["Remix", "Web Development"],
    cover_image: void 0
  },
  {
    id: "default-1",
    title: "Membangun Blog Modern dengan Remix",
    description: "Panduan singkat untuk memulai blog profesional dengan CMS yang mudah dikelola.",
    excerpt: "Panduan singkat untuk memulai blog profesional dengan CMS yang mudah dikelola.",
    date: "30 Juli 2026",
    category: "Artikel",
    author: "Admin",
    body: "## Membangun Blog Modern dengan Remix\n\nRemix adalah framework full-stack modern yang dibangun di atas standar web. Dengan pendekatan server-rendered dan progressive enhancement, Remix memberikan performa tinggi dan pengalaman membaca yang responsif.\n\n### Keunggulan Arsitektur\n\n1. **Nested Routing**: Mengorganisir halaman dan data secara hierarkis tanpa cascading request.\n2. **Server-Side Rendering (SSR)**: Konten langsung tersedia dalam HTML pertama sehingga ramah SEO dan cepat diakses pembaca.\n3. **Integrasi Headless CMS**: Menghubungkan konten Markdown dengan antarmuka modern secara elegan.\n\nDengan perpaduan arsitektur ini, seluruh publikasi dapat disajikan dengan kecepatan tinggi, tipografi yang nyaman, dan tampilan yang ramping serta bersih.",
    tags: ["Remix", "Web Development"],
    cover_image: void 0
  },
  {
    id: "default-2",
    title: "Decap CMS untuk Konten yang Fleksibel",
    description: "Kelola artikel tanpa harus menyentuh kode setiap kali ada update konten.",
    excerpt: "Kelola artikel tanpa harus menyentuh kode setiap kali ada update konten.",
    date: "28 Juli 2026",
    category: "Berita",
    author: "Developer",
    body: "## Decap CMS untuk Konten yang Fleksibel\n\nDecap CMS memungkinkan tim redaksi untuk menulis, menyunting, dan menerbitkan artikel secara mandiri tanpa harus menyentuh kode sumber.\n\n### Alur Kerja Git-Based CMS\n\n- **Penyimpanan Berkas Markdown**: Seluruh tulisan disimpan sebagai berkas teks terbuka di repositori Git.\n- **Transparansi & Riwayat**: Setiap revisi tercatat dalam Git commits sehingga aman dan terlacak.\n- **Kemudahan Akses**: Panel admin menyediakan editor WYSIWYG yang ramah pengguna untuk pengelolaan media dan takarir.",
    tags: ["CMS", "Open Source"],
    cover_image: void 0
  }
];
const CACHE_TTL = 5 * 60 * 1e3;
let commitCache = null;
let postsCache = null;
function parseYamlFrontmatter(frontmatterStr) {
  const result = {};
  const lines = frontmatterStr.split(/\r?\n/);
  let currentKey = null;
  let currentList = null;
  let currentObject = null;
  for (let line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const listItemMatch = line.match(/^(\s+)-\s+(.*)$/);
    if (listItemMatch) {
      const content = listItemMatch[2].trim();
      if (!currentList && currentKey) {
        currentList = [];
        result[currentKey] = currentList;
      }
      const kvMatch = content.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (kvMatch) {
        currentObject = {};
        const key = kvMatch[1].trim();
        let val = kvMatch[2].trim().replace(/^['"]|['"]$/g, "");
        currentObject[key] = val;
        if (currentList) currentList.push(currentObject);
      } else {
        currentObject = null;
        let val = content.replace(/^['"]|['"]$/g, "");
        if (currentList) currentList.push(val);
      }
      continue;
    }
    const nestedKvMatch = line.match(/^(\s+)([a-zA-Z0-9_]+):\s*(.*)$/);
    if (nestedKvMatch && currentObject && currentList) {
      const indent = nestedKvMatch[1].length;
      if (indent >= 4) {
        const key = nestedKvMatch[2].trim();
        let val = nestedKvMatch[3].trim().replace(/^['"]|['"]$/g, "");
        currentObject[key] = val;
        continue;
      }
    }
    const topKvMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (topKvMatch) {
      currentKey = topKvMatch[1].trim();
      currentList = null;
      currentObject = null;
      let val = topKvMatch[2].trim();
      if (val) {
        if (val.startsWith('"') && val.endsWith('"') || val.startsWith("'") && val.endsWith("'")) {
          val = val.slice(1, -1);
        }
        result[currentKey] = val;
      }
      continue;
    }
  }
  return result;
}
async function getLatestCommitSha(owner, repo, branch = "main") {
  var _a, _b, _c;
  const now = Date.now();
  if (commitCache && now - commitCache.time < CACHE_TTL) {
    return commitCache.data;
  }
  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`;
  const token = typeof process !== "undefined" && ((_a = process.env) == null ? void 0 : _a.GITHUB_PAT) ? process.env.GITHUB_PAT : (_c = (_b = import.meta) == null ? void 0 : _b.env) == null ? void 0 : _c.GITHUB_PAT;
  const headers = {
    Accept: "application/vnd.github+json",
    ...token ? { Authorization: `token ${token}` } : {}
  };
  if (commitCache == null ? void 0 : commitCache.etag) {
    headers["If-None-Match"] = commitCache.etag;
  }
  let res;
  try {
    res = await fetch(url, { headers, signal: AbortSignal.timeout(6e3) });
  } catch {
    if (commitCache) return commitCache.data;
    return branch;
  }
  if (res.status === 304 && commitCache) {
    commitCache.time = now;
    return commitCache.data;
  }
  if (!res.ok) {
    if (commitCache) return commitCache.data;
    return branch;
  }
  try {
    const data = await res.json();
    const sha = data.sha || branch;
    const etag = res.headers.get("ETag");
    commitCache = {
      data: sha,
      etag,
      time: now
    };
    return sha;
  } catch {
    return branch;
  }
}
async function readLocalPosts() {
  try {
    if (typeof process !== "undefined" && typeof process.cwd === "function") {
      const fs = await import("fs");
      const pathModule = await import("path");
      const postsDir = pathModule.join(process.cwd(), "content", "posts");
      if (fs.existsSync(postsDir)) {
        const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
        const parsed = files.map((file) => {
          try {
            const raw = fs.readFileSync(pathModule.join(postsDir, file), "utf-8");
            const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
            const match = raw.match(frontmatterRegex);
            if (!match) return null;
            const [, fmStr, body] = match;
            const frontmatter = parseYamlFrontmatter(fmStr);
            const cleanedTags = frontmatter.tags ? parseTags(frontmatter.tags) : [];
            return {
              id: file.replace(/\.md$/, ""),
              title: frontmatter.title || "Untitled",
              description: frontmatter.description || "",
              excerpt: frontmatter.description || body.slice(0, 150).trim() + "...",
              category: (() => {
                const rawCat = frontmatter.category || frontmatter.categories;
                if (Array.isArray(rawCat) && rawCat.length > 0) return String(rawCat[0]).trim();
                if (typeof rawCat === "string" && rawCat.trim()) return rawCat.trim();
                if (Array.isArray(cleanedTags) && cleanedTags.length > 0) return cleanedTags[0];
                return "Artikel";
              })(),
              date: frontmatter.date ? new Date(frontmatter.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "30 Juli 2026",
              author: frontmatter.author || "Admin",
              photographer: frontmatter.photographer || null,
              editor: frontmatter.editor || null,
              body,
              tags: cleanedTags,
              cover_image: frontmatter.image || frontmatter.cover_image,
              cover_images: frontmatter.image || frontmatter.cover_image ? [{ url: frontmatter.image || frontmatter.cover_image }] : []
            };
          } catch {
            return null;
          }
        }).filter(Boolean);
        return parsed;
      }
    }
  } catch {
  }
  return [];
}
async function fetchPostsFromGithub() {
  const now = Date.now();
  if (postsCache && now - postsCache.time < CACHE_TTL && postsCache.data.length > 0) {
    return postsCache.data;
  }
  const localPosts = await readLocalPosts();
  const owner = "neropx1";
  const repo = "blog-marhalah";
  const path = "content/posts";
  try {
    const branch = await getLatestCommitSha(owner, repo, "main");
    const apiUrl = `https://data.jsdelivr.com/v1/package/gh/${owner}/${repo}@${branch}/flat`;
    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(8e3) });
    if (response.ok) {
      const data = await response.json();
      if (data.files && Array.isArray(data.files)) {
        const mdFiles = data.files.filter(
          (file) => file.name.startsWith(`/${path}/`) && file.name.endsWith(".md")
        ).map((file) => {
          const filename = file.name.split("/").pop();
          return {
            name: filename,
            path: file.name.replace("/", ""),
            download_url: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}${file.name}`
          };
        });
        const remotePosts = await Promise.all(
          mdFiles.map(async (file) => {
            var _a;
            try {
              const contentResponse = await fetch(file.download_url, { signal: AbortSignal.timeout(8e3) });
              if (!contentResponse.ok) return null;
              const markdown = await contentResponse.text();
              const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
              const match = markdown.match(frontmatterRegex);
              if (!match) return null;
              const [, frontmatterStr, body] = match;
              const frontmatter = parseYamlFrontmatter(frontmatterStr);
              const cleanedTags = frontmatter.tags ? parseTags(frontmatter.tags) : [];
              const coverImageItems = [];
              const rawList = Array.isArray(frontmatter.cover_images) ? frontmatter.cover_images : Array.isArray(frontmatter.gallery) ? frontmatter.gallery : [];
              for (let item of rawList) {
                if (typeof item === "string" && item.trim()) {
                  const resolvedUrl = resolveCoverImage(item, owner, repo, branch);
                  if (resolvedUrl) coverImageItems.push({ url: resolvedUrl });
                } else if (item && typeof item === "object") {
                  const rawUrl = item.image || item.url || item.path || item.src;
                  const caption = item.caption || item.description || item.title || item.alt;
                  if (rawUrl && typeof rawUrl === "string") {
                    const resolvedUrl = resolveCoverImage(rawUrl, owner, repo, branch);
                    if (resolvedUrl) {
                      coverImageItems.push({
                        url: resolvedUrl,
                        caption: typeof caption === "string" && caption.trim() ? caption.trim() : void 0
                      });
                    }
                  }
                }
              }
              const singleCover = frontmatter.thumbnail || frontmatter.cover_image || frontmatter.image;
              const singleCaption = frontmatter.cover_image_caption || frontmatter.caption;
              if (singleCover && typeof singleCover === "string") {
                const resolvedUrl = resolveCoverImage(singleCover, owner, repo, branch);
                if (resolvedUrl && !coverImageItems.some((i) => i.url === resolvedUrl)) {
                  coverImageItems.unshift({
                    url: resolvedUrl,
                    caption: typeof singleCaption === "string" && singleCaption.trim() ? singleCaption.trim() : void 0
                  });
                }
              }
              return {
                id: file.name.replace(/\.md$/, ""),
                title: frontmatter.title || "Untitled",
                description: frontmatter.description || "",
                excerpt: frontmatter.description || body.slice(0, 150).trim() + "...",
                category: (() => {
                  const rawCat = frontmatter.category || frontmatter.categories;
                  if (Array.isArray(rawCat) && rawCat.length > 0) return String(rawCat[0]).trim();
                  if (typeof rawCat === "string" && rawCat.trim()) return rawCat.trim();
                  if (Array.isArray(cleanedTags) && cleanedTags.length > 0) return cleanedTags[0];
                  return "Artikel";
                })(),
                date: frontmatter.date || (/* @__PURE__ */ new Date()).toLocaleDateString("id-ID"),
                author: frontmatter.author || "Admin",
                photographer: frontmatter.photographer || null,
                editor: frontmatter.editor || null,
                body,
                tags: cleanedTags,
                cover_image: (_a = coverImageItems[0]) == null ? void 0 : _a.url,
                cover_images: coverImageItems
              };
            } catch {
              return null;
            }
          })
        );
        const validRemote = remotePosts.filter(Boolean);
        if (validRemote.length > 0) {
          postsCache = { data: validRemote, time: now };
          return validRemote;
        }
      }
    }
  } catch (error) {
    console.error("Gagal fetch remote posts:", error);
  }
  const result = localPosts.length > 0 ? localPosts : fallbackPosts;
  postsCache = { data: result, time: now };
  return result;
}
function parseTags(tagsInput) {
  if (!tagsInput) return [];
  if (Array.isArray(tagsInput)) return tagsInput.map((t) => String(t).trim());
  const tagsStr = String(tagsInput);
  const match = tagsStr.match(/\[(.*?)\]/);
  if (match) {
    return match[1].split(",").map((tag) => tag.trim().replace(/['"\s]/g, ""));
  }
  return [tagsStr];
}
function resolveCoverImage(rawPath, owner, repo, branch) {
  if (!rawPath) return void 0;
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }
  const cleanPath = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${cleanPath}`;
}
function Footer({ categories = [], links: links2 = {} }) {
  const defaultCategories = ["Artikel", "Berita", "Santri", "Maklumat"];
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  const defaultLinks = {
    "Beranda": "/",
    "Jelajahi Artikel": "/jelajahi",
    "Tentang Kami": "/tentang",
    "Admin Panel": "/admin-panel"
  };
  const displayLinks = Object.keys(links2).length > 0 ? links2 : defaultLinks;
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ jsx("footer", { className: "bg-[#0A0806] border-t border-[#221C14] mt-16 md:mt-24 text-[#8F816B] font-[Bricolage_Grotesque]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#1C1711]", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "inline-block mb-4", children: /* @__PURE__ */ jsx(
          "img",
          {
            className: "h-8 w-auto",
            src: "/logo-horizontal-negative.webp",
            alt: "Impervious Generation",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-[Merriweather] text-[#9A8D76] leading-relaxed max-w-sm mb-5", children: "Generasi tonggak 100 Tahun Kedua Gontor yang tangguh dalam mengupayakan perbaikan umat, teguh dalam mempertahankan prinsip, kokoh dalam integritas demi mewujudkan pusat peradaban dunia." }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://instagram.com",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "w-8 h-8 rounded bg-[#14110D] border border-[#272118] text-[#9A8D76] hover:text-amber-400 hover:border-amber-500/40 flex items-center justify-center transition",
              "aria-label": "Instagram",
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" }) })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://youtube.com",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "w-8 h-8 rounded bg-[#14110D] border border-[#272118] text-[#9A8D76] hover:text-amber-400 hover:border-amber-500/40 flex items-center justify-center transition",
              "aria-label": "YouTube",
              children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" }) })
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://x.com",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "w-8 h-8 rounded bg-[#14110D] border border-[#272118] text-[#9A8D76] hover:text-amber-400 hover:border-amber-500/40 flex items-center justify-center transition",
              "aria-label": "X",
              children: /* @__PURE__ */ jsx("svg", { className: "w-3.5 h-3.5", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }) })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-[11px] font-bold uppercase tracking-widest text-[#FAF4E8] mb-3", children: "Navigasi" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-xs", children: Object.entries(displayLinks).map(([label, href]) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: href,
            className: "text-[#9A8D76] hover:text-amber-400 transition",
            children: label
          }
        ) }, label)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-[11px] font-bold uppercase tracking-widest text-[#FAF4E8] mb-3", children: "Kategori" }),
        /* @__PURE__ */ jsx("ul", { className: "space-y-2 text-xs", children: displayCategories.map((category) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          Link,
          {
            to: `/jelajahi?category=${encodeURIComponent(category)}`,
            className: "text-[#9A8D76] hover:text-amber-400 transition",
            children: category
          }
        ) }, category)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-[11px] font-bold uppercase tracking-widest text-[#FAF4E8] mb-3", children: "Sekretariat" }),
        /* @__PURE__ */ jsxs("address", { className: "not-italic text-xs text-[#9A8D76] space-y-2 leading-relaxed", children: [
          /* @__PURE__ */ jsx("p", { children: "Pondok Modern Darussalam Gontor, Ponorogo, Jawa Timur" }),
          /* @__PURE__ */ jsxs("p", { children: [
            "Email:",
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "mailto:siswaakhir2027@gontor.ac.id",
                className: "text-amber-400/90 hover:underline",
                children: "siswaakhir2027@gontor.ac.id"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A6D5A] gap-3", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "© ",
        currentYear,
        " Impervious Generation. Seluruh hak cipta dilindungi."
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 text-[11px]", children: [
        /* @__PURE__ */ jsx("span", { children: "Edisi Daring" }),
        /* @__PURE__ */ jsx("span", { children: "•" }),
        /* @__PURE__ */ jsx("span", { children: "Generasi ke-100 Kedua" })
      ] })
    ] })
  ] }) });
}
function LazyImage({ src, alt, className = "", placeholder = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const inViewRef = useRef(false);
  const hasObservedRef = useRef(false);
  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement || hasObservedRef.current) return;
    inViewRef.current = false;
    hasObservedRef.current = true;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry2 of entries) {
          if (entry2.isIntersecting) {
            inViewRef.current = true;
            setIsInView(true);
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
            break;
          }
        }
      },
      { rootMargin: "400px 0px", threshold: 0 }
    );
    observerRef.current.observe(imgElement);
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      hasObservedRef.current = false;
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { ref: imgRef, className: `relative overflow-hidden ${className}`, children: [
    !isLoaded && placeholder && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-slate-800 animate-pulse" }),
    isInView && /* @__PURE__ */ jsx(
      "img",
      {
        src,
        alt,
        className: `transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`,
        onLoad: () => setIsLoaded(true),
        loading: "lazy",
        decoding: "async",
        fetchPriority: isLoaded ? "low" : "auto"
      }
    )
  ] });
}
const loader$2 = async () => {
  const posts = await fetchPostsFromGithub();
  return json(
    { posts: posts.length > 0 ? posts : fallbackPosts },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "Vary": "Accept-Encoding"
      }
    }
  );
};
const meta$4 = () => [
  { title: "Jelajahi Artikel — Impervious Generation" },
  { name: "description", content: "Katalog arsip artikel, warta, berita, dan maklumat resmi Impervious Generation." }
];
function getReadTime$2(text) {
  const words = text ? text.trim().split(/\s+/).length : 100;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} mnt`;
}
function Browse() {
  const { posts } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get("q") || "");
  const searchQuery = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === "" || post.title.toLowerCase().includes(q) || post.description.toLowerCase().includes(q) || post.tags && post.tags.some((tag) => tag.toLowerCase().includes(q));
      const matchesCategory = selectedCategory === "" || post.category.toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);
  const availableCategories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return Array.from(cats).sort();
  }, [posts]);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearchQuery.trim()) {
      params.set("q", localSearchQuery.trim());
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };
  const handleCategory = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };
  const handleClearFilters = () => {
    setSearchParams("");
    setLocalSearchQuery("");
  };
  return /* @__PURE__ */ jsxs("main", { className: "min-h-screen bg-[#0C0A08] text-[#FAF4E8] pb-16 md:pb-0", children: [
    /* @__PURE__ */ jsx("section", { className: "border-b border-[#221C14] bg-[#0E0C09] py-8 md:py-12", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]", children: "Arsip & Warta" }),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold font-[Texturina] text-[#FAF4E8] mt-1 mb-3", children: "Jelajahi Artikel" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-[Merriweather] text-[#BFB39B] leading-relaxed", children: "Koleksi tulisan, gagasan pemikiran, kabar terkini, dan panduan perjalanan generasi." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 max-w-xl", children: /* @__PURE__ */ jsxs(Form, { onSubmit: handleSearchSubmit, className: "relative", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Cari judul, topik, atau kata kunci...",
            value: localSearchQuery,
            onChange: (e) => setLocalSearchQuery(e.target.value),
            className: "w-full editorial-input px-4 py-2.5 text-xs md:text-sm font-[Bricolage_Grotesque] text-[#FAF4E8] placeholder-[#736652] pr-10"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-[#8F816B] hover:text-amber-400 transition",
            "aria-label": "Cari",
            children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) })
          }
        )
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3 border-b border-[#221C14] pb-4 mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleCategory(""),
              className: `px-3 py-1 rounded text-xs font-[Bricolage_Grotesque] font-semibold uppercase tracking-wider transition ${selectedCategory === "" ? "bg-[#D4AF37] text-[#0C0A08]" : "bg-[#14110D] text-[#A89C86] hover:text-[#FAF4E8] border border-[#272118]"}`,
              children: [
                "Semua (",
                posts.length,
                ")"
              ]
            }
          ),
          availableCategories.map((category) => {
            const count = posts.filter((p) => p.category === category).length;
            const isSelected = selectedCategory.toLowerCase() === category.toLowerCase();
            return /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => handleCategory(category),
                className: `px-3 py-1 rounded text-xs font-[Bricolage_Grotesque] font-semibold uppercase tracking-wider whitespace-nowrap transition ${isSelected ? "bg-[#D4AF37] text-[#0C0A08]" : "bg-[#14110D] text-[#A89C86] hover:text-[#FAF4E8] border border-[#272118]"}`,
                children: [
                  category,
                  " (",
                  count,
                  ")"
                ]
              },
              category
            );
          })
        ] }),
        (searchQuery || selectedCategory) && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleClearFilters,
            className: "text-xs text-amber-400 hover:underline font-[Bricolage_Grotesque]",
            children: "Reset Filter"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-[#8F816B] font-[Bricolage_Grotesque] mb-6", children: [
        "Menampilkan ",
        /* @__PURE__ */ jsx("span", { className: "text-[#FAF4E8] font-semibold", children: filteredPosts.length }),
        " artikel",
        selectedCategory && /* @__PURE__ */ jsxs(Fragment, { children: [
          " ",
          "pada kategori ",
          /* @__PURE__ */ jsxs("span", { className: "text-amber-400", children: [
            '"',
            selectedCategory,
            '"'
          ] })
        ] }),
        searchQuery && /* @__PURE__ */ jsxs(Fragment, { children: [
          " ",
          "dengan kata kunci ",
          /* @__PURE__ */ jsxs("span", { className: "text-amber-400", children: [
            '"',
            searchQuery,
            '"'
          ] })
        ] })
      ] }),
      filteredPosts.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredPosts.map((post) => /* @__PURE__ */ jsxs(
        "article",
        {
          className: "border border-[#272118] bg-[#120F0C] rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-500/35 transition group",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "aspect-[16/10] bg-[#16120D] relative overflow-hidden flex items-center justify-center", children: [
                post.cover_image ? /* @__PURE__ */ jsx(
                  LazyImage,
                  {
                    src: post.cover_image,
                    alt: post.title,
                    className: "w-full h-full object-cover group-hover:scale-103 transition duration-300"
                  }
                ) : /* @__PURE__ */ jsx("div", { className: "text-amber-500/20 text-xl font-[Texturina]", children: "Artikel" }),
                /* @__PURE__ */ jsx("span", { className: "absolute top-2.5 left-2.5 editorial-tag text-[9px] py-0.5 px-2", children: post.category })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[11px] text-[#8F816B] font-[Bricolage_Grotesque] mb-2", children: [
                  /* @__PURE__ */ jsx("span", { children: post.date }),
                  /* @__PURE__ */ jsx("span", { children: "•" }),
                  /* @__PURE__ */ jsx("span", { children: getReadTime$2(post.body || post.description) })
                ] }),
                /* @__PURE__ */ jsx(Link, { to: `/post/${post.id}`, children: /* @__PURE__ */ jsx("h3", { className: "text-base md:text-lg font-bold font-[Texturina] text-[#FAF4E8] group-hover:text-amber-300 transition leading-snug line-clamp-2 mb-2", children: post.title }) }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[#A89C86] font-[Merriweather] leading-relaxed line-clamp-2 mb-4", children: post.description || post.excerpt })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-5 pb-4 pt-3 border-t border-[#1C1711] flex items-center justify-between text-xs font-[Bricolage_Grotesque]", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[#8F816B] truncate max-w-[140px]", children: [
                "Oleh ",
                post.author
              ] }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: `/post/${post.id}`,
                  className: "text-amber-400 group-hover:text-amber-300 font-medium flex items-center gap-1 flex-shrink-0",
                  children: [
                    "Baca ",
                    /* @__PURE__ */ jsx("span", { children: "→" })
                  ]
                }
              )
            ] })
          ]
        },
        post.id
      )) }) : /* @__PURE__ */ jsxs("div", { className: "text-center py-16 border border-[#272118] bg-[#120F0C] rounded-lg p-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[#FAF4E8] mb-2 font-[Bricolage_Grotesque]", children: "Tidak ada artikel yang cocok" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#8F816B] font-[Merriweather] mb-4", children: "Coba gunakan kata kunci lain atau pilih kategori berbeda." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleClearFilters,
            className: "btn-secondary btn-sm text-xs font-[Bricolage_Grotesque]",
            children: "Reset Filter"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Browse,
  loader: loader$2,
  meta: meta$4
}, Symbol.toStringTag, { value: "Module" }));
function CoverImageSlider({ images, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchMovedRef = useRef(false);
  const imageItems = useMemo(
    () => (images || []).map(
      (img) => typeof img === "string" ? { url: img } : img
    ),
    [images]
  );
  const currentItem = imageItems[currentIndex] || imageItems[0];
  const translateXPercent = -currentIndex * 100;
  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => prev === 0 ? imageItems.length - 1 : prev - 1);
  }, [imageItems.length]);
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => prev === imageItems.length - 1 ? 0 : prev + 1);
  }, [imageItems.length]);
  if (!imageItems || imageItems.length === 0) return null;
  if (imageItems.length === 1) {
    return /* @__PURE__ */ jsxs("figure", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg border border-[#272118] bg-[#120F0C]", children: /* @__PURE__ */ jsx(
        LazyImage,
        {
          src: currentItem.url,
          alt: title,
          className: "w-full h-auto max-h-[560px] object-cover"
        }
      ) }),
      currentItem.caption && /* @__PURE__ */ jsx("figcaption", { className: "mt-2.5 px-1 text-center text-xs md:text-sm text-[#A89C86] font-[Bricolage_Grotesque] italic", children: currentItem.caption })
    ] });
  }
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMovedRef.current = false;
  };
  const handleTouchMove = (e) => {
    const dx = Math.abs((e.touches[0].clientX || 0) - (touchStartX.current || 0));
    const dy = Math.abs((e.touches[0].clientY || 0) - (touchStartY.current || 0));
    if (dx > dy && dx > 8) {
      touchMovedRef.current = true;
    }
  };
  const handleTouchEnd = (e) => {
    if (!touchMovedRef.current || touchStartX.current === null) return;
    const clientX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - clientX;
    const isSwipeLeft = distance > 40;
    const isSwipeRight = distance < -40;
    if (isSwipeLeft) {
      nextSlide();
    } else if (isSwipeRight) {
      prevSlide();
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchMovedRef.current = false;
  };
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };
  return /* @__PURE__ */ jsxs(
    "figure",
    {
      className: "mb-8 relative group",
      tabIndex: 0,
      role: "region",
      "aria-label": "Galeri gambar artikel",
      onKeyDown: handleKeyDown,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "overflow-hidden relative rounded-lg border border-[#272118] bg-[#120F0C] aspect-[16/9] md:aspect-[21/9]",
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "flex h-full transition-transform duration-300 ease-out will-change-transform",
                  style: { transform: `translateX(${translateXPercent}%)` },
                  children: imageItems.map((img, idx) => /* @__PURE__ */ jsx("div", { className: "w-full h-full flex-shrink-0 relative", children: /* @__PURE__ */ jsx(
                    LazyImage,
                    {
                      src: img.url,
                      alt: `${title} - Gambar ${idx + 1}`,
                      className: "w-full h-full object-cover"
                    }
                  ) }, idx))
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "absolute top-3 right-3 bg-black/75 text-amber-300 text-[11px] font-mono px-2 py-0.5 rounded border border-white/10 z-10", children: [
                currentIndex + 1,
                " / ",
                imageItems.length
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: prevSlide,
                  className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-amber-300 flex items-center justify-center transition border border-white/10 z-10",
                  "aria-label": "Gambar Sebelumnya",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: nextSlide,
                  className: "absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-amber-300 flex items-center justify-center transition border border-white/10 z-10",
                  "aria-label": "Gambar Selanjutnya",
                  children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/60 px-2.5 py-1 rounded-full border border-white/10", children: imageItems.map((_, idx) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setCurrentIndex(idx),
                  className: `h-1.5 rounded-full transition-all ${currentIndex === idx ? "w-4 bg-amber-400" : "w-1.5 bg-white/40 hover:bg-white/70"}`,
                  "aria-label": `Ke gambar ${idx + 1}`
                },
                idx
              )) })
            ]
          }
        ),
        currentItem.caption && /* @__PURE__ */ jsx("figcaption", { className: "mt-2.5 px-1 text-center text-xs md:text-sm text-[#A89C86] font-[Bricolage_Grotesque] italic", children: currentItem.caption }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-thin", children: imageItems.map((img, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setCurrentIndex(idx),
            className: `relative rounded overflow-hidden h-12 w-20 flex-shrink-0 border transition ${currentIndex === idx ? "border-amber-400 opacity-100 ring-1 ring-amber-400/50" : "border-[#272118] opacity-50 hover:opacity-90"}`,
            children: /* @__PURE__ */ jsx(LazyImage, { src: img.url, alt: "", className: "w-full h-full object-cover" })
          },
          idx
        )) })
      ]
    }
  );
}
function paginateMarkdown(content, paragraphsPerPage = 6) {
  if (!content) return [""];
  if (/<!--\s*pagebreak\s*-->/i.test(content)) {
    const manualPages = content.split(/<!--\s*pagebreak\s*-->/i).filter((p) => p.trim().length > 0);
    if (manualPages.length > 0) return manualPages;
  }
  const blocks = content.split(/\r?\n\s*\r?\n/);
  if (blocks.length <= paragraphsPerPage) {
    return [content];
  }
  const pages = [];
  for (let i = 0; i < blocks.length; i += paragraphsPerPage) {
    pages.push(blocks.slice(i, i + paragraphsPerPage).join("\n\n"));
  }
  return pages;
}
function getReadTime$1(text) {
  const words = text ? text.trim().split(/\s+/).length : 100;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} menit baca`;
}
const loader$1 = async ({ params }) => {
  const posts = await fetchPostsFromGithub();
  const allPosts = posts.length > 0 ? posts : fallbackPosts;
  let post = allPosts.find((p) => p.id === params.id);
  if (!post) {
    post = fallbackPosts.find((p) => p.id === params.id);
  }
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }
  const otherPosts = allPosts.filter((p) => p.id !== params.id);
  const sameCategory = otherPosts.filter((p) => p.category === post.category);
  const diffCategory = otherPosts.filter((p) => p.category !== post.category);
  const relatedPosts = [...sameCategory, ...diffCategory].slice(0, 4);
  return json({ post, relatedPosts });
};
const meta$3 = ({ data }) => {
  var _a;
  if (!data) {
    return [{ title: "Post — Impervious Generation" }];
  }
  const { post } = data;
  return [
    { title: `${post.title} — Impervious Generation` },
    { name: "description", content: post.description || post.excerpt },
    { name: "keywords", content: ((_a = post.tags) == null ? void 0 : _a.join(", ")) || post.category },
    { name: "author", content: post.author },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.description || post.excerpt },
    { property: "og:type", content: "article" },
    { property: "og:image", content: post.cover_image || "" },
    { property: "article:author", content: post.author },
    { property: "article:published_time", content: post.date },
    { property: "article:section", content: post.category },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.title },
    { name: "twitter:description", content: post.description || post.excerpt },
    { name: "twitter:image", content: post.cover_image || "" }
  ];
};
const MarkdownComponents = {
  h1: ({ children }) => /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold text-[#FAF4E8] mt-8 mb-4 font-[Texturina] leading-tight", children }),
  h2: ({ children }) => /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-2xl font-bold text-[#FAF4E8] mt-8 mb-3 font-[Texturina] leading-tight", children }),
  h3: ({ children }) => /* @__PURE__ */ jsx("h3", { className: "text-lg md:text-xl font-bold text-[#FAF4E8] mt-6 mb-2 font-[Texturina] leading-tight", children }),
  p: ({ children }) => /* @__PURE__ */ jsx("p", { className: "text-base md:text-[18px] text-[#D8CEBA] leading-[1.8] mb-6 font-[Merriweather]", children }),
  a: (props) => {
    var _a, _b;
    return /* @__PURE__ */ jsx(
      "a",
      {
        href: props.href || "#",
        className: "text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-300 transition",
        target: ((_a = props.href) == null ? void 0 : _a.startsWith("http")) ? "_blank" : void 0,
        rel: ((_b = props.href) == null ? void 0 : _b.startsWith("http")) ? "noopener noreferrer" : void 0,
        children: props.children
      }
    );
  },
  strong: ({ children }) => /* @__PURE__ */ jsx("strong", { className: "font-bold text-[#FAF4E8]", children }),
  em: ({ children }) => /* @__PURE__ */ jsx("em", { className: "italic text-[#E3DAC8]", children }),
  ul: ({ children }) => /* @__PURE__ */ jsx("ul", { className: "list-disc list-outside pl-6 space-y-2 mb-6 text-[#D8CEBA] font-[Merriweather] text-base md:text-[17px]", children }),
  ol: ({ children }) => /* @__PURE__ */ jsx("ol", { className: "list-decimal list-outside pl-6 space-y-2 mb-6 text-[#D8CEBA] font-[Merriweather] text-base md:text-[17px]", children }),
  li: ({ children }) => /* @__PURE__ */ jsx("li", { className: "leading-relaxed", children }),
  blockquote: ({ children }) => /* @__PURE__ */ jsx("blockquote", { className: "border-l-2 border-amber-400 pl-5 my-6 italic text-[#FAF4E8] font-[Merriweather] bg-[#14110D] py-3 pr-4 rounded-r", children }),
  code: (props) => /* @__PURE__ */ jsx("code", { className: "bg-[#18140F] text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs border border-[#2B2319]", children: props.children }),
  pre: ({ children }) => /* @__PURE__ */ jsx("pre", { className: "bg-[#120F0C] p-4 rounded-lg overflow-x-auto my-6 border border-[#272118] text-xs font-mono", children: /* @__PURE__ */ jsx("code", { className: "text-[#E2DAC8]", children }) }),
  img: (props) => /* @__PURE__ */ jsxs("figure", { className: "my-8", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-lg overflow-hidden border border-[#272118] bg-[#120F0C]", children: /* @__PURE__ */ jsx(
      LazyImage,
      {
        src: props.src || "",
        alt: props.alt || "",
        className: "w-full h-auto object-cover max-h-[600px]"
      }
    ) }),
    props.alt && props.alt.trim() !== "" && /* @__PURE__ */ jsx("figcaption", { className: "text-center text-xs md:text-sm text-[#A89C86] mt-2.5 font-[Bricolage_Grotesque] italic", children: props.alt })
  ] })
};
function PostDetail() {
  const { post, relatedPosts } = useLoaderData();
  const contentPages = useMemo(() => paginateMarkdown(post.body, 6), [post.body]);
  const [currentPage, setCurrentPage] = useState(1);
  const articleTopRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = window.scrollY / totalHeight * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handlePageChange = (page) => {
    if (page < 1 || page > contentPages.length) return;
    setCurrentPage(page);
    if (articleTopRef.current) {
      articleTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const coverImages = post.cover_images && post.cover_images.length > 0 ? post.cover_images : post.cover_image ? [post.cover_image] : [];
  const shareTitle = encodeURIComponent(post.title);
  const [currentUrl, setCurrentUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);
  const handleCopyLink = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2e3);
      } catch (e) {
      }
    }
  };
  const readTimeStr = useMemo(() => getReadTime$1(post.body || post.description), [post.body, post.description]);
  return /* @__PURE__ */ jsxs("main", { className: "min-h-screen bg-[#0C0A08] text-[#FAF4E8]", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed top-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-300 z-[60] transition-all duration-100 ease-out",
        style: { width: `${scrollProgress}%` }
      }
    ),
    /* @__PURE__ */ jsxs("article", { className: "mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 md:py-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-[Bricolage_Grotesque] text-[#8F816B] mb-4", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-amber-400 transition", children: "Beranda" }),
        /* @__PURE__ */ jsx("span", { children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: `/jelajahi?category=${encodeURIComponent(post.category)}`, className: "text-amber-400 hover:underline", children: post.category })
      ] }),
      /* @__PURE__ */ jsxs("header", { ref: articleTopRef, className: "mb-8 scroll-mt-20", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl lg:text-[42px] font-bold text-[#FAF4E8] font-[Texturina] leading-tight mb-4", children: post.title }),
        post.description && /* @__PURE__ */ jsx("p", { className: "text-base md:text-lg text-[#BFB39B] font-[Merriweather] leading-relaxed mb-6", children: post.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#221C14] text-xs font-[Bricolage_Grotesque]", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-[#1C1711] border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold", children: post.author ? post.author.charAt(0).toUpperCase() : "A" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#FAF4E8]", children: post.author }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[#8F816B]", children: [
                /* @__PURE__ */ jsx("span", { children: post.date }),
                /* @__PURE__ */ jsx("span", { children: "•" }),
                /* @__PURE__ */ jsx("span", { children: readTimeStr })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5", children: currentUrl && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `https://wa.me/?text=${shareTitle}%20${encodeURIComponent(currentUrl)}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "p-2 rounded bg-[#14110D] text-[#A89C86] hover:text-amber-300 border border-[#272118] transition",
                title: "Bagikan ke WhatsApp",
                children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M17.6 6.32c-1.63-1.62-3.8-2.52-6.11-2.52-4.76 0-8.63 3.87-8.63 8.63 0 1.52.39 3.01 1.14 4.33L2 22l4.6-1.2c1.27.73 2.71 1.12 4.17 1.12 4.76 0 8.63-3.87 8.63-8.63 0-2.31-.9-4.48-2.54-6.12M11.49 19.73c-1.28 0-2.54-.32-3.66-.94l-.26-.16-2.71.71.72-2.66-.17-.28c-.7-1.12-1.07-2.41-1.07-3.73 0-3.96 3.22-7.18 7.18-7.18 1.92 0 3.72.75 5.08 2.1 1.36 1.35 2.11 3.15 2.11 5.08 0 3.96-3.22 7.18-7.18 7.18m3.91-5.38c-.21-.11-1.27-.62-1.47-.69-.21-.08-.36-.11-.51.11-.16.21-.61.77-.75.92-.13.15-.27.17-.48.05-1.16-.58-1.92-.98-2.68-2.16-.2-.32.21-.3.58-.99.07-.14.04-.27-.02-.38-.06-.11-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.38-.13 0-.28 0-.42 0-.14 0-.37.05-.56.27-.2.21-.74.72-.74 1.76 0 1.04.76 2.04.86 2.18.11.14 1.55 2.36 3.74 3.31 1.02.45 1.81.72 2.43.93.52.18 1.01.15 1.39-.09.33-.22.68-.6.85-1.14.17-.54.17-1.01.12-1.11-.06-.11-.2-.16-.42-.27z" }) })
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${shareTitle}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "p-2 rounded bg-[#14110D] text-[#A89C86] hover:text-amber-300 border border-[#272118] transition",
                title: "Bagikan ke X / Twitter",
                children: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }) })
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleCopyLink,
                className: "p-2 rounded bg-[#14110D] text-[#A89C86] hover:text-amber-300 border border-[#272118] transition flex items-center gap-1 text-[11px]",
                title: "Salin Tautan Artikel",
                children: [
                  /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" }) }),
                  /* @__PURE__ */ jsx("span", { children: copied ? "Tersalin!" : "Salin" })
                ]
              }
            )
          ] }) })
        ] })
      ] }),
      coverImages.length > 0 && /* @__PURE__ */ jsx(CoverImageSlider, { images: coverImages, title: post.title }),
      /* @__PURE__ */ jsx("section", { className: "mb-10", children: /* @__PURE__ */ jsx("div", { className: "prose-editorial", children: /* @__PURE__ */ jsx(ReactMarkdown, { components: MarkdownComponents, rehypePlugins: [rehypeRaw], children: contentPages[currentPage - 1] || "" }) }) }),
      contentPages.length > 1 && /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-4 my-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-[Bricolage_Grotesque]", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-[#8F816B]", children: [
          "Halaman ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-amber-400", children: currentPage }),
          " dari",
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-amber-400", children: contentPages.length })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handlePageChange(currentPage - 1),
              disabled: currentPage === 1,
              className: "btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed",
              children: "← Sebelumnya"
            }
          ),
          contentPages.map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = currentPage === pageNum;
            return /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handlePageChange(pageNum),
                className: `w-7 h-7 rounded text-xs font-semibold transition ${isActive ? "bg-[#D4AF37] text-[#0C0A08]" : "bg-[#16120D] text-[#A89C86] hover:text-white border border-[#272118]"}`,
                children: pageNum
              },
              pageNum
            );
          }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handlePageChange(currentPage + 1),
              disabled: currentPage === contentPages.length,
              className: "btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed",
              children: "Selanjutnya →"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t border-[#221C14] pt-6 mb-12", children: [
        post.tags && post.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-6", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs text-[#8F816B] font-[Bricolage_Grotesque]", children: "Topik:" }),
          post.tags.map((tag) => /* @__PURE__ */ jsxs(
            "span",
            {
              className: "bg-[#14110D] text-[#C8BA9E] px-2.5 py-1 text-xs rounded border border-[#272118] font-[Bricolage_Grotesque]",
              children: [
                "#",
                tag
              ]
            },
            tag
          ))
        ] }),
        (post.photographer || post.editor) && /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded p-4 text-xs font-[Bricolage_Grotesque] text-[#8F816B] space-y-1", children: [
          post.photographer && /* @__PURE__ */ jsxs("p", { children: [
            "Fotografer: ",
            /* @__PURE__ */ jsx("span", { className: "text-[#FAF4E8] font-medium", children: post.photographer })
          ] }),
          post.editor && /* @__PURE__ */ jsxs("p", { children: [
            "Penyunting / Editor: ",
            /* @__PURE__ */ jsx("span", { className: "text-[#FAF4E8] font-medium", children: post.editor })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-6 mb-12 flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-[#1A150F] border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg flex-shrink-0", children: post.author ? post.author.charAt(0).toUpperCase() : "A" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider text-amber-400 font-[Bricolage_Grotesque]", children: "Penulis" }),
          /* @__PURE__ */ jsx("h4", { className: "text-base font-bold font-[Texturina] text-[#FAF4E8] mt-0.5", children: post.author }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-[#8F816B] font-[Merriweather] mt-1 leading-relaxed", children: "Kontributor dan anggota Impervious Generation yang berkomitmen menyuarakan narasi kemajuan dan integritas." })
        ] })
      ] }),
      relatedPosts && relatedPosts.length > 0 && /* @__PURE__ */ jsxs("section", { className: "border-t border-[#221C14] pt-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs uppercase font-bold tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-6", children: "Artikel Rekomendasi" }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: relatedPosts.map((relPost) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/post/${relPost.id}`,
            className: "border border-[#272118] bg-[#120F0C] rounded-lg p-4 hover:border-amber-500/35 transition group flex flex-col justify-between",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-amber-400 uppercase tracking-wider font-semibold font-[Bricolage_Grotesque]", children: relPost.category }),
                /* @__PURE__ */ jsx("h4", { className: "text-sm md:text-base font-bold font-[Texturina] text-[#FAF4E8] group-hover:text-amber-300 transition leading-snug mt-1 mb-2 line-clamp-2", children: relPost.title }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[#8F816B] font-[Merriweather] line-clamp-2", children: relPost.description || relPost.excerpt })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-3 border-t border-[#1C1711] flex items-center justify-between text-[11px] font-[Bricolage_Grotesque] text-[#7A6D5A]", children: [
                /* @__PURE__ */ jsx("span", { children: relPost.date }),
                /* @__PURE__ */ jsx("span", { className: "text-amber-400 group-hover:text-amber-300", children: "Baca →" })
              ] })
            ]
          },
          relPost.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] }, post.id);
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: PostDetail,
  loader: loader$1,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const meta$2 = () => [
  { title: "Tentang — Impervious Generation" },
  { name: "description", content: "Profil, visi, filosofi lambang, dan identitas resmi Impervious Generation." }
];
function Tentang() {
  const [activeShard, setActiveShard] = useState(null);
  const shards = [
    {
      id: "crown",
      title: "Mahkota",
      badge: "Keagungan",
      image: "https://imperviousgeneration.my.id/assets/images/part_logo/lafadz_allah.webp",
      desc: "Simbol keagungan dan kemuliaan dalam perjuangan. Menggambarkan visi tinggi untuk mencapai kejayaan umat."
    },
    {
      id: "circle",
      title: "Satuan Lingkaran",
      badge: "Persatuan",
      image: "https://imperviousgeneration.my.id/assets/images/part_logo/mahkota.webp",
      desc: "Melambangkan kebersamaan dan kesatuan dalam perjuangan. Setiap elemen saling melengkapi demi tujuan yang sama."
    },
    {
      id: "book",
      title: "Ilmu Pengetahuan",
      badge: "Intelektual",
      image: "https://imperviousgeneration.my.id/assets/images/part_logo/lempengan.webp",
      desc: "Al-Qur'an, Hadist, dan pena. Fondasi ilmu pengetahuan yang menjadi dasar setiap langkah dan keputusan."
    },
    {
      id: "shield",
      title: "Perlindungan & Integritas",
      badge: "Prinsip",
      image: "https://imperviousgeneration.my.id/assets/images/part_logo/muhammad.webp",
      desc: "Integritas dan prinsip yang kokoh. Menjaga identitas dan nilai luhur Gontori dalam menghadapi dinamika zaman."
    }
  ];
  return /* @__PURE__ */ jsxs("main", { className: "min-h-screen bg-[#0C0A08] text-[#FAF4E8] pb-16 md:pb-0", children: [
    /* @__PURE__ */ jsx("section", { className: "border-b border-[#221C14] bg-[#0E0C09] py-12 md:py-16 text-center", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-28 md:w-36 mx-auto mb-6", children: /* @__PURE__ */ jsx(
        LazyImage,
        {
          src: "/lambang.webp",
          alt: "Lambang Impervious Generation",
          className: "w-full h-auto"
        }
      ) }),
      /* @__PURE__ */ jsx("span", { className: "text-xs uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]", children: "Profil & Landasan Angkatan" }),
      /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-5xl font-bold font-[Zhoro] text-[#FAF4E8] mt-2 mb-3", children: "Impervious Generation" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg md:text-xl font-[Zhoro] text-amber-400 mb-2", children: "Golden Age Catalyst" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#8F816B] font-[Bricolage_Grotesque] tracking-widest uppercase", children: "Unshaken · Unbroken" })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-6 md:p-8", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque] block mb-2", children: "Landasan Filosofis" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-2xl font-bold font-[Zhoro] text-[#FAF4E8] mb-4", children: "Landasan Angkatan" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base leading-relaxed font-[Merriweather] text-[#D8CEBA]", children: "Generasi tonggak 100 Tahun Kedua Gontor yang tangguh dalam mengupayakan perbaikan umat dan menegakkan kebenaran, teguh dalam mempertahankan prinsip Islam, identitas, dan nilai Gontori, kokoh dalam integritas, selaras antara seruan dan perbuatan, serta dinamis meningkatkan kualitas umat demi mewujudkan pusat peradaban dunia." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-6 md:p-8", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque] block mb-2", children: "Landasan Wahyu" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-2xl font-bold font-[Zhoro] text-[#FAF4E8] mb-4", children: "QS. Huud: 88" }),
        /* @__PURE__ */ jsx("div", { className: "rounded overflow-hidden my-4 bg-[#16120D] border border-[#272118]", children: /* @__PURE__ */ jsx(
          LazyImage,
          {
            src: "/ayat.webp",
            alt: "Landasan Ayat QS Huud 88",
            className: "w-full h-auto p-4 md:p-6"
          }
        ) }),
        /* @__PURE__ */ jsx("blockquote", { className: "border-l-2 border-amber-400 pl-4 my-4 italic text-sm md:text-base font-[Merriweather] text-[#F7E4A9]", children: '"...Dan aku tidak berkehendak menyalahi kamu (dengan mengerjakan) apa yang aku larang. Aku tidak bermaksud kecuali (mendatangkan) perbaikan selama aku masih berkesanggupan. Dan tidak ada taufik bagiku melainkan dengan (pertolongan) Allah. Hanya kepada Allah aku bertawakkal dan hanya kepada-Nya-lah aku kembali.” (QS Huud: 88)' })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-[#221C14] pb-3 mb-8 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]", children: "Simbolisme" }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold font-[Zhoro] text-[#FAF4E8] mt-1", children: "Identitas Visual" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: shards.map((shard) => {
        const isSelected = activeShard === shard.id;
        return /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => setActiveShard(isSelected ? null : shard.id),
            className: `border rounded-lg p-5 cursor-pointer transition ${isSelected ? "border-amber-400 bg-[#16130F]" : "border-[#272118] bg-[#120F0C] hover:border-amber-500/30"}`,
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded bg-[#16120D] border border-[#272118] p-2 flex-shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(
                LazyImage,
                {
                  src: shard.image,
                  alt: shard.title,
                  className: "w-full h-full object-contain"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm md:text-base font-bold font-[Bricolage_Grotesque] text-[#FAF4E8]", children: shard.title }),
                  /* @__PURE__ */ jsx("span", { className: "editorial-tag text-[9px] py-0 px-1.5", children: shard.badge })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-[#8F816B] font-[Merriweather] leading-relaxed", children: shard.desc })
              ] })
            ] })
          },
          shard.id
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10", children: /* @__PURE__ */ jsx("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-6 md:p-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-6 items-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-40 md:w-52 flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "rounded bg-[#16120D] border border-[#272118] p-4", children: /* @__PURE__ */ jsx(
        LazyImage,
        {
          src: "https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fmaskot.webp&w=640&q=75",
          alt: "Maskot Zu'aym",
          className: "w-full h-auto object-contain"
        }
      ) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]", children: "Maskot Resmi" }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold font-[Bricolage_Grotesque] text-[#FAF4E8] mt-0.5 mb-2", children: "Zu'aym" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs md:text-sm text-[#A89C86] font-[Merriweather] leading-relaxed", children: [
          "Berakar dari kata ",
          /* @__PURE__ */ jsx("em", { children: "za'āmah" }),
          " (kepemimpinan), mencerminkan sosok yang siap memikul amanah dan menentukan arah perjuangan—dekat dengan yang dipimpinnya, teguh dalam prinsip, berintegritas, serta konsisten membuktikan seruan melalui tindakan nyata."
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-[#221C14] pb-3 mb-6 text-center", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]", children: "Kepengurusan" }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl md:text-2xl font-bold font-[Bricolage_Grotesque] text-[#FAF4E8] mt-1", children: "Ketua Angkatan" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-5 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border border-amber-500/25 bg-[#16120D]", children: /* @__PURE__ */ jsx(
            LazyImage,
            {
              src: "https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fketua%2Ffachrillah.webp&w=3840&q=75",
              alt: "Muhammad Fachrillah",
              className: "w-full h-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold font-[Bricolage_Grotesque] text-[#FAF4E8]", children: "Muhammad Fachrillah" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-400 font-medium font-[Bricolage_Grotesque] mt-0.5", children: "Ketua 1" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#7A6D5A] font-[Merriweather] mt-1", children: "Prime Catalyst" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-5 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border border-amber-500/25 bg-[#16120D]", children: /* @__PURE__ */ jsx(
            LazyImage,
            {
              src: "https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fketua%2Fyusuf.webp&w=3840&q=75",
              alt: "Yusuf Praba Andhika Prayoga",
              className: "w-full h-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold font-[Bricolage_Grotesque] text-[#FAF4E8]", children: "Yusuf Praba Andhika Prayoga" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-400 font-medium font-[Bricolage_Grotesque] mt-0.5", children: "Ketua 2" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#7A6D5A] font-[Merriweather] mt-1", children: "Vice Catalyst" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-5 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border border-amber-500/25 bg-[#16120D]", children: /* @__PURE__ */ jsx(
            LazyImage,
            {
              src: "https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fketua%2Ffawwaz.webp&w=3840&q=75",
              alt: "Fawwaz Muhammad Royyan",
              className: "w-full h-full object-cover"
            }
          ) }),
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-bold font-[Bricolage_Grotesque] text-[#FAF4E8]", children: "Fawwaz Muhammad Royyan" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-400 font-medium font-[Bricolage_Grotesque] mt-0.5", children: "Ketua 3" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#7A6D5A] font-[Merriweather] mt-1", children: "Support Catalyst" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10", children: /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-6 md:p-8 text-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl md:text-2xl font-bold font-[Texturina] text-[#FAF4E8] mb-2", children: "Mulai Membaca Jurnal" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#8F816B] font-[Merriweather] mb-5 max-w-md mx-auto", children: "Jelajahi tulisan, analisis, dan dokumentasi warta Impervious Generation." }),
      /* @__PURE__ */ jsx(Link, { to: "/jelajahi", className: "btn-primary btn-sm inline-flex font-[Bricolage_Grotesque]", children: "Buka Katalog Artikel →" })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Tentang,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const loader = async () => {
  const posts = await fetchPostsFromGithub();
  return json(
    { posts: posts.length > 0 ? posts : fallbackPosts },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
        "Vary": "Accept-Encoding"
      }
    }
  );
};
const meta$1 = () => [
  { title: "Impervious Generation — Jurnal & Warta Resmi" },
  {
    name: "description",
    content: "Pusat artikel, warta, pemikiran, dan inspirasi resmi Impervious Generation."
  },
  { name: "keywords", content: "blog, artikel, warta, gontor, impervious generation" },
  { name: "author", content: "Impervious Generation" },
  { property: "og:title", content: "Impervious Generation — Jurnal & Warta Resmi" },
  {
    property: "og:description",
    content: "Pusat artikel, warta, pemikiran, dan inspirasi resmi Impervious Generation."
  },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "id_ID" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Impervious Generation — Jurnal & Warta Resmi" },
  {
    name: "twitter:description",
    content: "Pusat artikel, warta, pemikiran, dan inspirasi resmi Impervious Generation."
  }
];
function getReadTime(text) {
  const words = text ? text.trim().split(/\s+/).length : 100;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} mnt baca`;
}
function Index() {
  const { posts } = useLoaderData();
  const displayPosts = posts && posts.length > 0 ? posts : fallbackPosts;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const allCategories = useMemo(
    () => Array.from(new Set(displayPosts.map((p) => p.category))).sort(),
    [displayPosts]
  );
  const filteredPosts = useMemo(() => {
    return displayPosts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === "" || post.title.toLowerCase().includes(q) || post.description.toLowerCase().includes(q) || post.tags && post.tags.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [displayPosts, searchQuery, selectedCategory]);
  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);
  return /* @__PURE__ */ jsxs("main", { className: "min-h-screen bg-[#0C0A08] text-[#FAF4E8]", children: [
    /* @__PURE__ */ jsx("section", { className: "relative overflow-hidden py-14 md:py-20 lg:py-24 border-b border-[#221C14] bg-gradient-to-b from-[#110D09] to-[#0C0A08]", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block mb-6", children: /* @__PURE__ */ jsx("div", { className: "w-64 md:w-96 mx-auto flex items-center justify-center", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/master_text_logo_horizontal.webp",
          alt: "Impervious Generation",
          className: "w-full h-auto object-contain",
          loading: "eager"
        }
      ) }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base max-w-2xl mx-auto font-[Bricolage_Grotesque] leading-relaxed text-[#BFB39B] mb-8", children: "Generasi tonggak 100 Tahun Kedua Gontor yang tangguh dalam mengupayakan perbaikan umat dan menegakkan kebenaran, teguh dalam mempertahankan prinsip Islam, identitas, dan nilai Gontori, kokoh dalam integritas, selaras antara seruan dan perbuatan, serta dinamis meningkatkan kualitas umat demi mewujudkan pusat peradaban dunia." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 justify-center", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/jelajahi",
            className: "btn-primary btn-md font-[Bricolage_Grotesque]",
            children: [
              "Jelajahi Artikel",
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7l5 5m0 0l-5 5m5-5H6" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "#latest",
            className: "btn-secondary btn-md font-[Bricolage_Grotesque]",
            children: [
              "Lihat Terbaru",
              /* @__PURE__ */ jsx("svg", { className: "w-4 h-4 ml-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { id: "latest", className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 scroll-mt-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 border-b border-[#221C14] pb-4 mb-8 overflow-x-auto scrollbar-none", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setSelectedCategory(null),
              className: `px-3 py-1.5 rounded text-xs font-[Bricolage_Grotesque] font-semibold uppercase tracking-wider transition ${selectedCategory === null ? "bg-[#D4AF37] text-[#0C0A08]" : "bg-[#14110D] text-[#A89C86] hover:text-[#FAF4E8] border border-[#272118]"}`,
              children: [
                "Semua (",
                displayPosts.length,
                ")"
              ]
            }
          ),
          allCategories.map((cat) => {
            const count = displayPosts.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setSelectedCategory(cat),
                className: `px-3 py-1.5 rounded text-xs font-[Bricolage_Grotesque] font-semibold uppercase tracking-wider whitespace-nowrap transition ${isSelected ? "bg-[#D4AF37] text-[#0C0A08]" : "bg-[#14110D] text-[#A89C86] hover:text-[#FAF4E8] border border-[#272118]"}`,
                children: [
                  cat,
                  " (",
                  count,
                  ")"
                ]
              },
              cat
            );
          })
        ] }),
        selectedCategory && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedCategory(null),
            className: "text-xs text-amber-400 hover:underline font-[Bricolage_Grotesque] whitespace-nowrap",
            children: "Reset Filter"
          }
        )
      ] }),
      featuredPost && /* @__PURE__ */ jsx("article", { className: "border border-[#272118] bg-[#120F0C] rounded-lg overflow-hidden mb-12 hover:border-amber-500/30 transition group", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 bg-[#16120D] relative overflow-hidden aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[260px] lg:min-h-[400px]", children: [
          featuredPost.cover_image ? /* @__PURE__ */ jsx(
            LazyImage,
            {
              src: featuredPost.cover_image,
              alt: featuredPost.title,
              className: "w-full h-full object-cover group-hover:scale-102 transition duration-500"
            }
          ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center bg-[#15120E] text-amber-500/30", children: /* @__PURE__ */ jsx("span", { className: "text-6xl font-[Texturina]", children: "IG" }) }),
          /* @__PURE__ */ jsxs("div", { className: "absolute top-4 left-4 flex gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "bg-[#D4AF37] text-[#0C0A08] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-[Bricolage_Grotesque]", children: "Berita Utama" }),
            /* @__PURE__ */ jsx("span", { className: "bg-black/80 text-amber-200 text-[10px] font-medium px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider font-[Bricolage_Grotesque]", children: featuredPost.category })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 p-6 md:p-8 flex flex-col justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-[#8F816B] font-[Bricolage_Grotesque] mb-3", children: [
              /* @__PURE__ */ jsx("span", { children: featuredPost.date }),
              /* @__PURE__ */ jsx("span", { children: "•" }),
              /* @__PURE__ */ jsx("span", { children: getReadTime(featuredPost.body || featuredPost.description) })
            ] }),
            /* @__PURE__ */ jsx(Link, { to: `/post/${featuredPost.id}`, children: /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold font-[Texturina] text-[#FAF4E8] group-hover:text-amber-300 transition leading-tight mb-4", children: featuredPost.title }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm md:text-base font-[Merriweather] text-[#BFB39B] leading-relaxed line-clamp-4 mb-6", children: featuredPost.description || featuredPost.excerpt })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-[#221C14] flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-[#8F816B] font-[Bricolage_Grotesque]", children: [
              "Penulis: ",
              /* @__PURE__ */ jsx("span", { className: "text-[#FAF4E8] font-medium", children: featuredPost.author })
            ] }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/post/${featuredPost.id}`,
                className: "text-xs font-semibold text-amber-400 group-hover:text-amber-300 flex items-center gap-1 font-[Bricolage_Grotesque]",
                children: [
                  "Baca Lengkap ",
                  /* @__PURE__ */ jsx("span", { children: "→" })
                ]
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10", children: [
        /* @__PURE__ */ jsxs("section", { className: "lg:col-span-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[#221C14] pb-3 mb-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm uppercase tracking-widest font-bold text-amber-400 font-[Bricolage_Grotesque]", children: "Artikel Lainnya" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#8F816B] font-[Bricolage_Grotesque]", children: [
              filteredPosts.length,
              " Tulisan"
            ] })
          ] }),
          otherPosts.length === 0 && /* @__PURE__ */ jsx("div", { className: "p-8 text-center border border-[#272118] bg-[#120F0C] rounded-lg", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-[#A89C86] font-[Bricolage_Grotesque]", children: "Tidak ada artikel lain yang sesuai dengan filter pencarian." }) }),
          /* @__PURE__ */ jsx("div", { className: "space-y-6", children: otherPosts.map((post) => /* @__PURE__ */ jsx(
            "article",
            {
              className: "border border-[#272118] bg-[#120F0C] rounded-lg p-5 md:p-6 hover:border-amber-500/35 transition group",
              children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-12 gap-5 items-start", children: [
                /* @__PURE__ */ jsxs("div", { className: "sm:col-span-4 aspect-[16/10] bg-[#18140F] rounded overflow-hidden relative", children: [
                  post.cover_image ? /* @__PURE__ */ jsx(
                    LazyImage,
                    {
                      src: post.cover_image,
                      alt: post.title,
                      className: "w-full h-full object-cover group-hover:scale-103 transition duration-300"
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center text-amber-500/20 text-xl font-[Texturina]", children: "Artikel" }),
                  /* @__PURE__ */ jsx("span", { className: "absolute top-2 left-2 editorial-tag text-[9px] py-0.5 px-1.5", children: post.category })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "sm:col-span-8 flex flex-col justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[11px] text-[#8F816B] font-[Bricolage_Grotesque] mb-2", children: [
                      /* @__PURE__ */ jsx("span", { children: post.date }),
                      /* @__PURE__ */ jsx("span", { children: "•" }),
                      /* @__PURE__ */ jsx("span", { children: getReadTime(post.body || post.description) })
                    ] }),
                    /* @__PURE__ */ jsx(Link, { to: `/post/${post.id}`, children: /* @__PURE__ */ jsx("h4", { className: "text-lg md:text-xl font-bold font-[Texturina] text-[#FAF4E8] group-hover:text-amber-300 transition leading-snug mb-2", children: post.title }) }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#A89C86] font-[Merriweather] leading-relaxed line-clamp-2 mb-4", children: post.description || post.excerpt })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-[#1F1912] text-xs font-[Bricolage_Grotesque]", children: [
                    /* @__PURE__ */ jsxs("span", { className: "text-[#8F816B]", children: [
                      "Oleh ",
                      post.author
                    ] }),
                    /* @__PURE__ */ jsxs(
                      Link,
                      {
                        to: `/post/${post.id}`,
                        className: "text-amber-400 group-hover:text-amber-300 font-medium flex items-center gap-1",
                        children: [
                          "Baca artikel ",
                          /* @__PURE__ */ jsx("span", { children: "→" })
                        ]
                      }
                    )
                  ] })
                ] })
              ] })
            },
            post.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs("aside", { className: "lg:col-span-4 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-5", children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: "search-input",
                className: "block text-xs uppercase font-bold tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-3",
                children: "Cari Artikel"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "search-input",
                  type: "text",
                  placeholder: "Ketik topik atau judul...",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: "w-full editorial-input px-3.5 py-2 text-xs font-[Bricolage_Grotesque] text-[#FAF4E8] placeholder-[#736652]"
                }
              ),
              searchQuery && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSearchQuery(""),
                  className: "absolute right-2.5 top-2.5 text-xs text-[#736652] hover:text-white",
                  children: "✕"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-5", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs uppercase font-bold tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-4 pb-2 border-b border-[#221C14]", children: "Terbaru & Pilihan" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: displayPosts.slice(0, 4).map((post, idx) => /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/post/${post.id}`,
                className: "group flex items-start gap-3.5 pb-3 border-b border-[#1C1711] last:border-b-0 last:pb-0",
                children: [
                  /* @__PURE__ */ jsx("span", { className: "text-lg font-bold font-mono text-[#544837] group-hover:text-amber-400 transition", children: String(idx + 1).padStart(2, "0") }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-amber-400 uppercase tracking-wider font-semibold font-[Bricolage_Grotesque]", children: post.category }),
                    /* @__PURE__ */ jsx("h5", { className: "text-xs md:text-sm font-semibold font-[Texturina] text-[#FAF4E8] group-hover:text-amber-300 transition leading-snug mt-0.5 line-clamp-2", children: post.title }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#7A6D5A] font-[Bricolage_Grotesque] mt-1 block", children: post.date })
                  ] })
                ]
              },
              post.id
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-5", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-xs uppercase font-bold tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-3", children: "Tentang Blog" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-[#A89C86] font-[Merriweather] leading-relaxed mb-4", children: "Blog ini adalah ruang berbagi untuk cerita, pengetahuan, dan pengalaman. Dibuat dengan penuh dedikasi untuk komunitas." }),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: "/jelajahi",
                className: "btn-secondary btn-sm w-full text-xs font-[Bricolage_Grotesque]",
                children: "Jelajahi semua →"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const cmsConfig = {
  load_config_file: false,
  backend: {
    name: "github",
    repo: "neropx1/test-cms-decap",
    branch: "main",
    base_url: "https://api.netlify.com",
    auth_endpoint: "auth"
  },
  media_folder: "cloudinary",
  public_folder: "/uploads",
  media_library: {
    name: "cloudinary",
    config: {
      cloud_name: "ymxgxfvy",
      api_key: "461626797611519"
    }
  },
  collections: [
    {
      name: "posts",
      label: "Berita & Artikel",
      folder: "content/posts",
      create: true,
      slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
      preview_path: "/post/{{slug}}",
      fields: [
        {
          label: "Judul",
          name: "title",
          widget: "string",
          required: true
        },
        {
          label: "Slug",
          name: "slug",
          widget: "string",
          required: false
        },
        {
          label: "Gambar Sampul Utama",
          name: "cover_image",
          widget: "image",
          required: false,
          media_library: {
            config: {
              multiple: false
            }
          }
        },
        {
          label: "Deskripsi Sampul Utama",
          name: "cover_image_caption",
          widget: "string",
          required: false
        },
        {
          label: "Galeri / Gambar Sampul Tambahan (Slider)",
          name: "cover_images",
          widget: "list",
          summary: "{{fields.caption}} ({{fields.image}})",
          fields: [
            {
              label: "Gambar",
              name: "image",
              widget: "image",
              required: true
            },
            {
              label: "Deskripsi / Keterangan Foto",
              name: "caption",
              widget: "string",
              required: false
            }
          ],
          required: false
        },
        {
          label: "Deskripsi Singkat",
          name: "description",
          widget: "text",
          required: true
        },
        {
          label: "Kategori",
          name: "category",
          widget: "select",
          options: ["Berita", "Artikel", "Santri", "Maklumat", "Pengumuman"],
          required: true
        },
        {
          label: "Penulis",
          name: "author",
          widget: "string",
          required: true
        },
        {
          label: "Editor",
          name: "editor",
          widget: "string",
          required: false
        },
        {
          label: "Fotografer",
          name: "photographer",
          widget: "string",
          required: false
        },
        {
          label: "Email Penulis",
          name: "author_email",
          widget: "string",
          required: false
        },
        {
          label: "Tanggal Publikasi",
          name: "date",
          widget: "datetime",
          format: "YYYY-MM-DD HH:mm:ss",
          required: true
        },
        {
          label: "Tag",
          name: "tags",
          widget: "list",
          field: {
            label: "Tag",
            name: "tag",
            widget: "string"
          },
          required: false
        },
        {
          label: "Konten",
          name: "body",
          widget: "markdown",
          required: true
        },
        {
          label: "SEO - Meta Title",
          name: "meta_title",
          widget: "string",
          required: false
        },
        {
          label: "SEO - Meta Description",
          name: "meta_description",
          widget: "text",
          required: false
        }
      ]
    }
  ]
};
function Admin() {
  const initDoneRef = useRef(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkAuth = async () => {
      try {
        const session = await getSession();
        if (!session) {
          navigate("/admin-login");
          return;
        }
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/admin-login");
      }
    };
    checkAuth();
  }, [navigate]);
  useEffect(() => {
    if (typeof window === "undefined" || !isAuthenticated) return;
    if (initDoneRef.current) return;
    let isMounted = true;
    const initCms = async () => {
      const root = document.getElementById("nc-root");
      if (!root) {
        console.error("nc-root tidak ditemukan");
        return;
      }
      try {
        window.CMS_MANUAL_INIT = true;
        const { init } = await import("@sveltia/cms");
        init({
          config: cmsConfig
        });
        if (isMounted) {
          initDoneRef.current = true;
          window.__sveltiaCmsInitialized = true;
          console.log("Sveltia CMS initialized");
        }
      } catch (error) {
        if (isMounted) {
          console.error("Sveltia CMS init gagal:", error);
        }
      }
    };
    initCms();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-900", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 mx-auto mb-4 animate-pulse flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" }) }) }),
      /* @__PURE__ */ jsx("p", { className: "text-amber-400 font-[Bricolage_Grotesque]", children: "Loading..." })
    ] }) });
  }
  if (!isAuthenticated) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsx("div", { id: "nc-root" }) });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Admin
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => [
  { title: "Halaman Tidak Ditemukan — Impervious Generation" }
];
function NotFound() {
  return /* @__PURE__ */ jsxs("main", { className: "min-h-screen bg-[#0C0A08] text-[#FAF4E8] pb-16 md:pb-0 flex flex-col justify-between", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center", children: /* @__PURE__ */ jsxs("div", { className: "border border-[#272118] bg-[#120F0C] rounded-lg p-8 md:p-12", children: [
      /* @__PURE__ */ jsx(
        LazyImage,
        {
          src: "/404.webp",
          alt: "404",
          className: "mx-auto w-40 md:w-56 mb-6 opacity-90"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-xs uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]", children: "Galat 404" }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold font-[Texturina] text-[#FAF4E8] mt-1 mb-3", children: "Halaman Tidak Ditemukan" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-[#A89C86] font-[Merriweather] leading-relaxed mb-6 max-w-md mx-auto", children: "Halaman atau artikel yang Anda tuju mungkin telah dipindahkan, berganti tautan, atau sudah tidak tersedia." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 justify-center", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "btn-primary btn-sm font-[Bricolage_Grotesque]", children: "Kembali ke Beranda" }),
        /* @__PURE__ */ jsx(Link, { to: "/jelajahi", className: "btn-secondary btn-sm font-[Bricolage_Grotesque]", children: "Jelajahi Artikel Lain" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NotFound,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-D21V8Bfh.js", "imports": ["/assets/markdown-zZh6NEYC.js", "/assets/icons-DOBZ3nLM.js", "/assets/components-CVAN3sMo.js", "/assets/index-avcQFBd5.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-v1yhhOK2.js", "imports": ["/assets/markdown-zZh6NEYC.js", "/assets/icons-DOBZ3nLM.js", "/assets/components-CVAN3sMo.js", "/assets/index-avcQFBd5.js"], "css": [] }, "routes/admin-login": { "id": "routes/admin-login", "parentId": "root", "path": "admin-login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin-login-CCPaHhAl.js", "imports": ["/assets/markdown-zZh6NEYC.js", "/assets/icons-DOBZ3nLM.js", "/assets/supabase.client-DT8cuobx.js", "/assets/index-avcQFBd5.js", "/assets/supabase-DthfXWp1.js"], "css": [] }, "routes/admin-panel": { "id": "routes/admin-panel", "parentId": "root", "path": "admin-panel", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin-panel-CH3e3mUJ.js", "imports": ["/assets/markdown-zZh6NEYC.js", "/assets/icons-DOBZ3nLM.js", "/assets/supabase-DthfXWp1.js", "/assets/components-CVAN3sMo.js", "/assets/index-avcQFBd5.js"], "css": [] }, "routes/jelajahi": { "id": "routes/jelajahi", "parentId": "root", "path": "jelajahi", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/jelajahi---KL27vT.js", "imports": ["/assets/markdown-zZh6NEYC.js", "/assets/icons-DOBZ3nLM.js", "/assets/LazyImage-FKaLWvjm.js", "/assets/components-CVAN3sMo.js", "/assets/index-avcQFBd5.js"], "css": [] }, "routes/post.$id": { "id": "routes/post.$id", "parentId": "root", "path": "post/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/post._id-CwAkhgGK.js", "imports": ["/assets/markdown-zZh6NEYC.js", "/assets/LazyImage-FKaLWvjm.js", "/assets/icons-DOBZ3nLM.js", "/assets/components-CVAN3sMo.js", "/assets/index-avcQFBd5.js"], "css": [] }, "routes/tentang": { "id": "routes/tentang", "parentId": "root", "path": "tentang", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/tentang-D7-1EA45.js", "imports": ["/assets/markdown-zZh6NEYC.js", "/assets/LazyImage-FKaLWvjm.js", "/assets/icons-DOBZ3nLM.js", "/assets/components-CVAN3sMo.js", "/assets/index-avcQFBd5.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-ffhhA_bB.js", "imports": ["/assets/markdown-zZh6NEYC.js", "/assets/icons-DOBZ3nLM.js", "/assets/LazyImage-FKaLWvjm.js", "/assets/components-CVAN3sMo.js", "/assets/index-avcQFBd5.js"], "css": [] }, "routes/admin": { "id": "routes/admin", "parentId": "root", "path": "admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/admin-DefQrV3X.js", "imports": ["/assets/cms-DKlkcqTP.js", "/assets/markdown-zZh6NEYC.js", "/assets/icons-DOBZ3nLM.js", "/assets/supabase.client-DT8cuobx.js", "/assets/index-avcQFBd5.js", "/assets/supabase-DthfXWp1.js"], "css": [] }, "routes/$": { "id": "routes/$", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_-CHvaBfZ1.js", "imports": ["/assets/markdown-zZh6NEYC.js", "/assets/LazyImage-FKaLWvjm.js", "/assets/components-CVAN3sMo.js", "/assets/icons-DOBZ3nLM.js", "/assets/index-avcQFBd5.js"], "css": [] } }, "url": "/assets/manifest-431c9b18.js", "version": "431c9b18" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/admin-login": {
    id: "routes/admin-login",
    parentId: "root",
    path: "admin-login",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/admin-panel": {
    id: "routes/admin-panel",
    parentId: "root",
    path: "admin-panel",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/jelajahi": {
    id: "routes/jelajahi",
    parentId: "root",
    path: "jelajahi",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/post.$id": {
    id: "routes/post.$id",
    parentId: "root",
    path: "post/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/tentang": {
    id: "routes/tentang",
    parentId: "root",
    path: "tentang",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route6
  },
  "routes/admin": {
    id: "routes/admin",
    parentId: "root",
    path: "admin",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/$": {
    id: "routes/$",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  }
};
const build = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  assets: serverManifest,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
}, Symbol.toStringTag, { value: "Module" }));
export {
  assetsBuildDirectory as a,
  build as b,
  basename as c,
  entry as e,
  future as f,
  isSpaMode as i,
  mode as m,
  publicPath as p,
  routes as r,
  serverManifest as s
};

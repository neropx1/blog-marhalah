import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { signInWithEmail, signUpWithEmail } from "../utils/supabase.client";

const ADMIN_INVITE_CODES = (import.meta.env.VITE_INVITE_CODES || "marhalah-admin-2025").split(",").map((c: string) => c.trim());

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Tentukan role berdasarkan invite code
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

  return (
    <main className="min-h-screen gradient-wave flex items-center justify-center px-6">
      <div className="w-full max-w-md relative z-10">
        <div className="liquid-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-amber-200 font-[Bricolage_Grotesque]">Impervious Generation</h1>
            <p className="text-amber-100/60 text-sm mt-2 font-[Bricolage_Grotesque]">Admin CMS</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full glass-input text-amber-100 placeholder-amber-200/40 px-4 py-3 rounded-lg font-[Merriweather]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full glass-input text-amber-100 placeholder-amber-200/40 px-4 py-3 rounded-lg font-[Merriweather]"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-amber-300 mb-2">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Masukkan invite code"
                  required={isSignUp}
                  className="w-full glass-input text-amber-100 placeholder-amber-200/40 px-4 py-3 rounded-lg font-[Merriweather]"
                />
              </div>
            )}

            {error && (
              <div
                className={`p-3 rounded text-sm liquid-card ${
                  error.startsWith("✅")
                    ? "text-emerald-400 border-emerald-500/30"
                    : "text-red-400 border-red-500/30"
                }`}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full liquid-btn btn-lg"
            >
              {loading
                ? "Loading..."
                : isSignUp
                  ? "Daftar"
                  : "Login"}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-amber-100/60 text-sm font-[Bricolage_Grotesque]">
              {isSignUp ? "Sudah punya akun?" : "Buat akun baru?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="ml-2 text-amber-400 hover:text-amber-300 font-semibold transition liquid-btn btn-sm"
              >
                {isSignUp ? "Login" : "Daftar"}
              </button>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center liquid-card p-4">
          <p className="text-amber-100/70 text-sm font-[Bricolage_Grotesque]">Gunakan invite code untuk mendaftar akun baru.</p>
          <p className="mt-2 text-amber-200/40 text-xs">© 2026 Marhalah Blog</p>
        </div>
      </div>
    </main>
  );
}

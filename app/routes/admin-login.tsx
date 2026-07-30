import { useState } from "react";
import { useNavigate } from "@remix-run/react";
import { signInWithEmail, signUpWithEmail } from "~/utils/supabase.client";

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
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-lg p-8 backdrop-blur">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded bg-gradient-to-br from-amber-400 to-amber-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white font-zhoro">Impervious Generation</h1>
            <p className="text-slate-400 text-sm mt-2 font-[Merriweather]">Admin CMS</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-amber-400 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:border-amber-400 focus:outline-none transition font-[Merriweather]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:border-amber-400 focus:outline-none transition font-[Merriweather]"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-amber-400 mb-2">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Masukkan invite code"
                  required={isSignUp}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:border-amber-400 focus:outline-none transition font-[Merriweather]"
                />
              </div>
            )}

            {error && (
              <div
                className={`p-3 rounded text-sm ${
                  error.startsWith("✅")
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-600 text-white font-semibold py-3 rounded-lg transition duration-200"
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
            <p className="text-slate-400 text-sm font-[Merriweather]">
              {isSignUp ? "Sudah punya akun?" : "Buat akun baru?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="ml-2 text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                {isSignUp ? "Login" : "Daftar"}
              </button>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-slate-400 text-sm font-[Merriweather]">
          <p>Gunakan invite code untuk mendaftar akun baru.</p>
          <p className="mt-2 text-slate-500">© 2026 Marhalah Blog</p>
        </div>
      </div>
    </main>
  );
}

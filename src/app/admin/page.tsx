"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Printer,
  Lock,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Layers,
  BarChart3,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error("Geçersiz şifre");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-100" />

      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-16">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Printer className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">
                Print<span className="text-indigo-400">Flow</span>
              </span>
              <span className="text-xs bg-white/10 text-indigo-300 px-2 py-0.5 rounded-full ml-2 font-medium">
                3D
              </span>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Siparişlerinizi
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              tek yerden yönetin
            </span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-12">
            Tüm 3D baskı siparişlerini takip edin, durum güncelleyin ve
            müşterilerinizle iletişimde kalın.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: BarChart3,
                title: "Anlık İstatistikler",
                desc: "Sipariş durumlarını ve üretim sürecini takip edin",
              },
              {
                icon: Layers,
                title: "Sipariş Yönetimi",
                desc: "Dosyaları indirin, fiyat belirleyin, durum güncelleyin",
              },
              {
                icon: ShieldCheck,
                title: "Güvenli Erişim",
                desc: "Şifre korumalı yönetim paneli",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
                  <item.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {item.title}
                  </p>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center relative p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/30">
              <Printer className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Print<span className="text-indigo-400">Flow</span> 3D
            </h1>
          </div>

          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/20">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">
                Hoş Geldiniz
              </h1>
              <p className="text-slate-400 text-sm">
                Yönetim paneline erişmek için şifrenizi girin
              </p>
            </div>

            <form onSubmit={handleLogin}>
              {error && (
                <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl px-4 py-3 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2.5">
                  Şifre
                </label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl opacity-0 group-focus-within:opacity-20 blur transition-all duration-300" />
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-sm"
                      placeholder="Yönetici şifresini girin"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 disabled:from-indigo-600/50 disabled:to-indigo-600/50 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 text-sm"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Giriş yapılıyor...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    Giriş Yap
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/[0.06]">
              <p className="text-center text-xs text-slate-600">
                Bu alan sadece yetkili yöneticiler içindir.
                <br />
                Erişim sorunları için sistem yöneticisiyle iletişime geçin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

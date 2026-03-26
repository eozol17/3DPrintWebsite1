import Link from "next/link";
import {
  Upload,
  Printer,
  Package,
  Zap,
  Shield,
  Clock,
  ShoppingBag,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigasyon */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Print<span className="text-indigo-600">Flow</span> 3D
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Mağaza
              </Link>
              <Link
                href="/track"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Sipariş Takip
              </Link>
              <Link
                href="/order"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-indigo-500/25"
              >
                <Upload className="w-4 h-4" />
                Sipariş Ver
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Bölümü */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700">
              Profesyonel 3D Baskı
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6">
            Fikirlerinizi
            <br />
            <span className="gradient-text">3D olarak hayata geçirin</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            3D modellerinizi yükleyin, malzemenizi seçin, gerisini bize
            bırakın. Profesyonel kalitede baskılar kapınıza kadar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5"
            >
              <Upload className="w-5 h-5" />
              Siparişe Başla
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-4 rounded-full text-lg border border-slate-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              Mağazayı Keşfet
            </Link>
          </div>
        </div>
      </section>

      {/* Nasıl Çalışır */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Nasıl çalışır?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              3D modelinizi bastırmak için üç basit adım
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                step: "01",
                title: "Dosyanızı Yükleyin",
                description:
                  "STL, OBJ, 3MF veya STEP dosyanızı yükleyin. Tüm popüler 3D dosya formatlarını destekliyoruz.",
              },
              {
                icon: Printer,
                step: "02",
                title: "Biz Basalım",
                description:
                  "Malzeme, renk ve özelliklerinizi seçin. Ekibimiz dosyanızı inceleyip hassasiyetle basar.",
              },
              {
                icon: Package,
                step: "03",
                title: "Teslim Alalım",
                description:
                  "Siparişinizi anlık takip edin. Baskınızı özenle paketleyip kapınıza kadar gönderelim.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative group bg-white rounded-2xl p-8 border border-slate-100 card-hover"
              >
                <div className="text-6xl font-black text-slate-100 absolute top-4 right-6 group-hover:text-indigo-50 transition-colors">
                  {item.step}
                </div>
                <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-100 transition-colors">
                  <item.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Özellikler */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Neden PrintFlow?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Hızlı Teslimat",
                description:
                  "Çoğu sipariş 2-5 iş günü içinde tamamlanır",
              },
              {
                icon: Shield,
                title: "Kalite Garantisi",
                description:
                  "Profesyonel yazıcılar ve premium malzemeler",
              },
              {
                icon: Clock,
                title: "Anlık Takip",
                description: "Siparişinizi baştan sona anlık takip edin",
              },
              {
                icon: Package,
                title: "Çoklu Malzeme",
                description: "PLA, ABS, PETG, TPU, Naylon, Reçine ve dahası",
              },
              {
                icon: Upload,
                title: "Kolay Yükleme",
                description:
                  "Dosyalarınızı sürükleyip bırakın — STL, OBJ, 3MF, STEP desteği",
              },
              {
                icon: Printer,
                title: "Uzman İnceleme",
                description:
                  "Ekibimiz başlamadan önce her dosyayı basılabilirlik için kontrol eder",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-slate-100 card-hover"
              >
                <feature.icon className="w-6 h-6 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-slate-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Basmaya hazır mısınız?
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                3D modelinizi şimdi yükleyin ve teklif alın. Kayıt olmanıza
                gerek yok.
              </p>
              <Link
                href="/order"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-4 rounded-full text-lg hover:bg-indigo-50 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                <Upload className="w-5 h-5" />
                Sipariş Verin
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-md flex items-center justify-center">
              <Printer className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">
              PrintFlow 3D
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Mağaza</Link>
            <Link href="/track" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Sipariş Takip</Link>
            <Link href="/track-order" className="text-sm text-slate-500 hover:text-slate-700 transition-colors">Mağaza Takip</Link>
          </div>
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} PrintFlow 3D. Tüm hakları
            saklıdır.
          </p>
          <Link
            href="/admin"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Yönetim
          </Link>
        </div>
      </footer>
    </div>
  );
}

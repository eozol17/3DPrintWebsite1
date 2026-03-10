"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import {
  Printer,
  CheckCircle2,
  Package,
  ArrowRight,
  Search,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Siparişiniz Alındı!</h1>
        <p className="text-slate-600 mb-6">
          Teşekkür ederiz. Siparişiniz başarıyla oluşturuldu.
          Ödeme bilgileri e-posta adresinize gönderilecektir.
        </p>

        {orderNumber && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
            <p className="text-sm text-slate-500 mb-1">Sipariş Numaranız</p>
            <p className="text-2xl font-mono font-bold text-slate-900">{orderNumber}</p>
            <p className="text-xs text-slate-400 mt-1">Bu numarayı not alın</p>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
          <h3 className="text-sm font-semibold text-amber-800 mb-1">Sonraki Adımlar</h3>
          <ol className="text-sm text-amber-700 space-y-1 list-decimal list-inside">
            <li>Ödeme bilgileri e-postanıza gönderilecek</li>
            <li>Havale/EFT ile ödemeyi tamamlayın</li>
            <li>Ödeme onaylandıktan sonra sipariş hazırlanır</li>
            <li>Kargo bilgileri SMS/e-posta ile bildirilir</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {orderNumber && (
            <Link
              href={`/track-order?order=${orderNumber}`}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              <Search className="w-4 h-4" />
              Siparişi Takip Et
            </Link>
          )}
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl text-sm font-medium transition-colors"
          >
            <Package className="w-4 h-4" />
            Alışverişe Devam Et
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Print<span className="text-indigo-600">Flow</span> 3D
              </span>
            </Link>
          </div>
        </div>
      </nav>
      <div className="pt-16">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </>
  );
}

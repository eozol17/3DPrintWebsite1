"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
} from "lucide-react";
import { PURCHASE_STATUSES, type PurchaseStatus, formatDate } from "@/lib/utils";

interface PurchaseItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { name: string; slug: string };
}

interface Purchase {
  id: string;
  orderNumber: string;
  customerName: string;
  status: PurchaseStatus;
  totalPrice: number;
  address: string;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_STEPS: PurchaseStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") || "");
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const order = searchParams.get("order");
    if (order) {
      setOrderNumber(order);
      handleSearch(order);
    }
  }, []);

  const handleSearch = async (num?: string) => {
    const query = num || orderNumber;
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setPurchase(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/purchases/${query.trim().toUpperCase()}`);
      if (res.status === 404) { setError("Sipariş bulunamadı."); return; }
      const data = await res.json();
      setPurchase(data.purchase);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const currentStepIndex = purchase
    ? purchase.status === "cancelled"
      ? -1
      : STATUS_STEPS.indexOf(purchase.status as PurchaseStatus)
    : -1;

  return (
    <div className="pt-24 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Sipariş Takibi</h1>
        <p className="text-slate-600">Sipariş numaranızı girerek takip edebilirsiniz</p>
      </div>

      <form onSubmit={onSubmit} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="MKT-XXXXXX"
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
        >
          {loading ? "..." : "Sorgula"}
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {searched && !loading && !error && !purchase && (
        <div className="text-center py-12 text-slate-400">
          <Package className="w-12 h-12 mx-auto mb-3" />
          <p>Sipariş bulunamadı</p>
        </div>
      )}

      {purchase && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-slate-900 text-lg">
                {purchase.orderNumber}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  PURCHASE_STATUSES[purchase.status]?.color || "bg-gray-100 text-gray-800"
                }`}
              >
                {PURCHASE_STATUSES[purchase.status]?.label || purchase.status}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Sipariş tarihi: {formatDate(purchase.createdAt)}
            </p>
          </div>

          {purchase.status !== "cancelled" ? (
            <div className="p-6 border-b border-slate-100">
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100" />
                <div className="space-y-6">
                  {STATUS_STEPS.map((step, i) => {
                    const isDone = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;
                    const icons: Record<string, React.ElementType> = {
                      pending: Clock,
                      confirmed: CheckCircle2,
                      preparing: Package,
                      shipped: Truck,
                      delivered: CheckCircle2,
                    };
                    const Icon = icons[step] || CheckCircle2;
                    return (
                      <div key={step} className="flex items-center gap-4 relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                            isDone
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          } ${isCurrent ? "ring-4 ring-indigo-100" : ""}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${isDone ? "text-slate-900" : "text-slate-400"}`}>
                            {PURCHASE_STATUSES[step]?.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Bu sipariş iptal edildi.</p>
              </div>
            </div>
          )}

          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Sipariş Detayları</h3>
            <div className="space-y-2">
              {purchase.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.product.name} × {item.quantity}</span>
                  <span className="text-slate-900 font-medium">
                    ₺{(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100 mt-2">
                <span>Toplam</span>
                <span>₺{purchase.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-slate-900 mb-2 text-sm">Teslimat Adresi</h3>
            <p className="text-sm text-slate-600 whitespace-pre-line">{purchase.address}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Print<span className="text-indigo-600">Flow</span> 3D
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/shop" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Mağaza</Link>
              <Link href="/track" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">3D Baskı Takip</Link>
            </div>
          </div>
        </div>
      </nav>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
        <TrackOrderContent />
      </Suspense>
    </div>
  );
}

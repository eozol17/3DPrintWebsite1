"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Printer,
  ArrowLeft,
  Loader2,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  FileText,
  Truck,
  Eye,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import {
  ORDER_STATUSES,
  type OrderStatus,
  formatDate,
  MATERIALS,
  COLORS,
} from "@/lib/utils";

interface TrackedOrder {
  orderNumber: string;
  customerName: string;
  fileOriginalName: string;
  material: string;
  color: string;
  quantity: number;
  status: OrderStatus;
  estimatedPrice: number | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_TIMELINE: { key: OrderStatus; icon: React.ElementType }[] = [
  { key: "pending", icon: Clock },
  { key: "reviewing", icon: Eye },
  { key: "quoted", icon: FileText },
  { key: "approved", icon: CheckCircle2 },
  { key: "printing", icon: Printer },
  { key: "completed", icon: Package },
  { key: "shipped", icon: Truck },
];

function TrackContent() {
  const searchParams = useSearchParams();
  const [orderNum, setOrderNum] = useState(searchParams.get("order") || "");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const trackOrder = async (num?: string) => {
    const searchNum = num || orderNum;
    if (!searchNum.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch(
        `/api/track?orderNumber=${encodeURIComponent(searchNum.trim().toUpperCase())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data.order);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sipariş takip edilemedi"
      );
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      setOrderNum(orderParam);
      trackOrder(orderParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusIndex = (status: OrderStatus) => {
    if (status === "cancelled") return -1;
    return STATUS_TIMELINE.findIndex((s) => s.key === status);
  };

  const getMaterialLabel = (value: string) =>
    MATERIALS.find((m) => m.value === value)?.label || value;
  const getColorLabel = (value: string) =>
    COLORS.find((c) => c.value === value)?.label || value;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Sipariş Takip
        </h1>
        <p className="text-slate-600">
          Sipariş numaranızı girerek mevcut durumu görüntüleyin
        </p>
      </div>

      {/* Arama Formu */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            trackOrder();
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={orderNum}
            onChange={(e) => setOrderNum(e.target.value.toUpperCase())}
            placeholder="Sipariş numarası girin (ör. 3DP-ABC123)"
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-lg"
          />
          <button
            type="submit"
            disabled={loading || !orderNum.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Sipariş Detayları */}
      {order && (
        <div className="space-y-6">
          {/* Durum Kartı */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-slate-500">Sipariş</p>
                <p className="text-xl font-bold font-mono text-slate-900">
                  {order.orderNumber}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                  ORDER_STATUSES[order.status]?.color ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {ORDER_STATUSES[order.status]?.label || order.status}
              </span>
            </div>

            {/* Zaman Çizelgesi */}
            {order.status !== "cancelled" ? (
              <div className="relative">
                <div className="flex justify-between">
                  {STATUS_TIMELINE.map((item, idx) => {
                    const currentIdx = getStatusIndex(order.status);
                    const isActive = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                      <div
                        key={item.key}
                        className="flex flex-col items-center relative z-10"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                              : isActive
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium hidden sm:block ${
                            isActive ? "text-indigo-600" : "text-slate-400"
                          }`}
                        >
                          {ORDER_STATUSES[item.key]?.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-200 -z-0">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{
                      width: `${
                        (getStatusIndex(order.status) /
                          (STATUS_TIMELINE.length - 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-red-50 rounded-xl p-4">
                <XCircle className="w-6 h-6 text-red-500" />
                <p className="text-red-700 font-medium">
                  Bu sipariş iptal edilmiştir
                </p>
              </div>
            )}
          </div>

          {/* Sipariş Bilgileri */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Sipariş Detayları
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-500">Dosya</p>
                <p className="font-medium text-slate-900">
                  {order.fileOriginalName}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Malzeme</p>
                <p className="font-medium text-slate-900">
                  {getMaterialLabel(order.material)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Renk</p>
                <p className="font-medium text-slate-900">
                  {getColorLabel(order.color)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Adet</p>
                <p className="font-medium text-slate-900">{order.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Oluşturulma Tarihi</p>
                <p className="font-medium text-slate-900">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Son Güncelleme</p>
                <p className="font-medium text-slate-900">
                  {formatDate(order.updatedAt)}
                </p>
              </div>
            </div>

            {order.estimatedPrice && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">Tahmini Fiyat</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {order.estimatedPrice.toFixed(2)} ₺
                </p>
              </div>
            )}

            {order.adminNotes && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <p className="text-sm text-slate-500">
                    PrintFlow&apos;dan Mesaj
                  </p>
                </div>
                <p className="text-slate-700 bg-slate-50 rounded-lg p-3">
                  {order.adminNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {searched && !order && !loading && !error && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            Bu numarayla sipariş bulunamadı
          </p>
        </div>
      )}
    </main>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Geri</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Printer className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">
              Print<span className="text-indigo-600">Flow</span>
            </span>
          </div>
        </div>
      </header>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        }
      >
        <TrackContent />
      </Suspense>
    </div>
  );
}

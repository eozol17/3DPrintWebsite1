"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";
import { PURCHASE_STATUSES, type PurchaseStatus, formatDate } from "@/lib/utils";

interface PurchaseItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { id: string; name: string; slug: string };
}

interface Purchase {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  address: string;
  totalPrice: number;
  status: PurchaseStatus;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminPurchaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editStatus, setEditStatus] = useState<PurchaseStatus>("pending");

  useEffect(() => { fetchPurchase(); }, [id]);

  const fetchPurchase = async () => {
    try {
      const res = await fetch(`/api/admin/purchases/${id}`);
      if (res.status === 401) { router.push("/admin"); return; }
      if (!res.ok) { router.push("/admin/purchases"); return; }
      const data = await res.json();
      setPurchase(data.purchase);
      setEditStatus(data.purchase.status);
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/purchases/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setPurchase(data.purchase);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!purchase) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Printer className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">PrintFlow</span>
          <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded-full ml-auto">Yönetim</span>
        </div>

        <nav className="space-y-1 flex-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors">
            <LayoutDashboard className="w-5 h-5" />Gösterge Paneli
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors">
            <ClipboardList className="w-5 h-5" />Özel Siparişler
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors">
            <ShoppingBag className="w-5 h-5" />Ürünler
          </Link>
          <Link href="/admin/purchases" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white font-medium text-sm">
            <ShoppingCart className="w-5 h-5" />Mağaza Siparişleri
          </Link>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors">
          <LogOut className="w-5 h-5" />Çıkış Yap
        </button>
      </aside>

      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/purchases" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" />Mağaza Siparişlerine Dön
          </Link>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-mono">{purchase.orderNumber}</h1>
              <p className="text-slate-500 text-sm">{formatDate(purchase.createdAt)}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${PURCHASE_STATUSES[purchase.status]?.color || "bg-gray-100 text-gray-800"}`}>
              {PURCHASE_STATUSES[purchase.status]?.label || purchase.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-900 mb-4">Müşteri Bilgileri</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-700">{purchase.customerName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a href={`mailto:${purchase.customerEmail}`} className="text-indigo-600 hover:underline">{purchase.customerEmail}</a>
                  </div>
                  {purchase.customerPhone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{purchase.customerPhone}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span className="text-slate-700 whitespace-pre-line">{purchase.address}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-900 mb-4">Sipariş İçeriği</h2>
                <div className="space-y-3">
                  {purchase.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{item.product.name}</p>
                        <p className="text-xs text-slate-400">{item.quantity} adet × ₺{item.unitPrice.toFixed(2)}</p>
                      </div>
                      <span className="font-semibold text-slate-900 text-sm">
                        ₺{(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-slate-900 pt-2">
                    <span>Toplam</span>
                    <span>₺{purchase.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-bold text-slate-900 mb-4">Durum Güncelle</h2>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as PurchaseStatus)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                >
                  {Object.entries(PURCHASE_STATUSES).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleSave}
                  disabled={saving || editStatus === purchase.status}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

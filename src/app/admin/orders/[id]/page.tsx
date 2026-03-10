"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  ArrowLeft,
  Download,
  Save,
  Loader2,
  Trash2,
  User,
  Mail,
  Phone,
  FileBox,
  Layers,
  Palette,
  Hash,
  Percent,
  StickyNote,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import {
  ORDER_STATUSES,
  type OrderStatus,
  formatDate,
  formatFileSize,
  MATERIALS,
  COLORS,
} from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  fileName: string;
  fileOriginalName: string;
  fileSize: number;
  material: string;
  color: string;
  quantity: number;
  infill: number;
  notes: string | null;
  status: OrderStatus;
  adminNotes: string | null;
  estimatedPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editStatus, setEditStatus] = useState<OrderStatus>("pending");
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      if (!res.ok) throw new Error("Bulunamadı");
      const data = await res.json();
      setOrder(data.order);
      setEditStatus(data.order.status);
      setEditAdminNotes(data.order.adminNotes || "");
      setEditPrice(
        data.order.estimatedPrice ? data.order.estimatedPrice.toString() : ""
      );
    } catch {
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          adminNotes: editAdminNotes || null,
          estimatedPrice: editPrice ? parseFloat(editPrice) : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu siparişi silmek istediğinize emin misiniz?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/orders/${id}`, { method: "DELETE" });
      router.push("/admin/orders");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const getMaterialLabel = (value: string) =>
    MATERIALS.find((m) => m.value === value)?.label || value;
  const getColorLabel = (value: string) =>
    COLORS.find((c) => c.value === value)?.label || value;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Yan Menü */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 text-white p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Printer className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">PrintFlow</span>
          <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded-full ml-auto">
            Yönetim
          </span>
        </div>

        <nav className="space-y-1 flex-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Gösterge Paneli
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white font-medium text-sm"
          >
            <ClipboardList className="w-5 h-5" />
            Özel Siparişler
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Ürünler
          </Link>
          <Link
            href="/admin/purchases"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Mağaza Siparişleri
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Çıkış Yap
        </button>
      </aside>

      {/* Ana İçerik */}
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Başlık */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/orders"
                className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-mono">
                  {order.orderNumber}
                </h1>
                <p className="text-sm text-slate-500">
                  Oluşturulma: {formatDate(order.createdAt)}
                </p>
              </div>
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

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sipariş Detayları */}
            <div className="lg:col-span-2 space-y-6">
              {/* Müşteri Bilgileri */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Müşteri Bilgileri
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-900">
                      {order.customerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a
                      href={`mailto:${order.customerEmail}`}
                      className="text-indigo-600 hover:underline"
                    >
                      {order.customerEmail}
                    </a>
                  </div>
                  {order.customerPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-900">
                        {order.customerPhone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dosya ve Baskı Bilgileri */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Dosya ve Baskı Ayarları
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <FileBox className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Dosya</p>
                      <p className="text-sm font-medium text-slate-900">
                        {order.fileOriginalName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatFileSize(order.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Layers className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Malzeme</p>
                      <p className="text-sm font-medium text-slate-900">
                        {getMaterialLabel(order.material)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Palette className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Renk</p>
                      <p className="text-sm font-medium text-slate-900">
                        {getColorLabel(order.color)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Hash className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Adet</p>
                      <p className="text-sm font-medium text-slate-900">
                        {order.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Percent className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Doluluk</p>
                      <p className="text-sm font-medium text-slate-900">
                        %{order.infill}
                      </p>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-3">
                    <StickyNote className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Müşteri Notları</p>
                      <p className="text-sm text-slate-700 mt-1">
                        {order.notes}
                      </p>
                    </div>
                  </div>
                )}

                <a
                  href={`/api/files/${order.fileName}`}
                  className="mt-4 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Dosyayı İndir
                </a>
              </div>
            </div>

            {/* Yönetim İşlemleri */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Siparişi Güncelle
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Durum
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) =>
                        setEditStatus(e.target.value as OrderStatus)
                      }
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                    >
                      {Object.entries(ORDER_STATUSES).map(([key, val]) => (
                        <option key={key} value={key}>
                          {val.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tahmini Fiyat (₺)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Yönetici Notları
                    </label>
                    <textarea
                      value={editAdminNotes}
                      onChange={(e) => setEditAdminNotes(e.target.value)}
                      rows={4}
                      placeholder="Müşteriye görünür notlar..."
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </button>
                </div>
              </div>

              {/* Tehlikeli Alan */}
              <div className="bg-white rounded-xl border border-red-200 p-6">
                <h2 className="text-sm font-semibold text-red-500 uppercase tracking-wider mb-3">
                  Tehlikeli Alan
                </h2>
                <p className="text-sm text-slate-600 mb-3">
                  Bu siparişi ve ilişkili dosyasını kalıcı olarak silin.
                </p>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 text-sm border border-red-200"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  {deleting ? "Siliniyor..." : "Siparişi Sil"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

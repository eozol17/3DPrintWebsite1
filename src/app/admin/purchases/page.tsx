"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  Search,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PURCHASE_STATUSES, type PurchaseStatus, formatDate } from "@/lib/utils";

interface Purchase {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalPrice: number;
  status: PurchaseStatus;
  createdAt: string;
  items: { product: { name: string } }[];
}

export default function AdminPurchasesPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPurchases = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "15" });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/purchases?${params}`);
      if (res.status === 401) { router.push("/admin"); return; }
      const data = await res.json();
      setPurchases(data.purchases);
      setTotal(data.total);
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, router]);

  useEffect(() => { fetchPurchases(); }, [fetchPurchases]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const totalPages = Math.ceil(total / 15);

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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Mağaza Siparişleri</h1>
            <p className="text-slate-600">Marketplace satın alımlarını yönetin</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 mb-6 p-4">
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchPurchases()}
                  placeholder="Sipariş no, müşteri ara..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tüm Durumlar</option>
                {Object.entries(PURCHASE_STATUSES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : purchases.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Sipariş bulunamadı</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left px-5 py-3 text-slate-500 font-medium">Sipariş</th>
                      <th className="text-left px-5 py-3 text-slate-500 font-medium hidden md:table-cell">Müşteri</th>
                      <th className="text-left px-5 py-3 text-slate-500 font-medium hidden lg:table-cell">Ürünler</th>
                      <th className="text-right px-5 py-3 text-slate-500 font-medium">Toplam</th>
                      <th className="text-center px-5 py-3 text-slate-500 font-medium">Durum</th>
                      <th className="text-right px-5 py-3 text-slate-500 font-medium hidden sm:table-cell">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {purchases.map((p) => (
                      <Link key={p.id} href={`/admin/purchases/${p.id}`} legacyBehavior>
                        <tr className="hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="px-5 py-4">
                            <span className="font-mono font-semibold text-slate-900">{p.orderNumber}</span>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <p className="font-medium text-slate-900">{p.customerName}</p>
                            <p className="text-xs text-slate-400">{p.customerEmail}</p>
                          </td>
                          <td className="px-5 py-4 text-slate-600 text-xs hidden lg:table-cell">
                            {p.items.map((i) => i.product.name).join(", ")}
                          </td>
                          <td className="px-5 py-4 text-right font-semibold text-slate-900">
                            ₺{p.totalPrice.toFixed(2)}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PURCHASE_STATUSES[p.status]?.color || "bg-gray-100 text-gray-800"}`}>
                              {PURCHASE_STATUSES[p.status]?.label || p.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right text-slate-400 text-xs hidden sm:table-cell">
                            {formatDate(p.createdAt)}
                          </td>
                        </tr>
                      </Link>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-slate-500">{total} sipariş</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-slate-600">{page} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

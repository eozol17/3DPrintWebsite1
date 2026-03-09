"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ORDER_STATUSES,
  type OrderStatus,
  formatDate,
  formatFileSize,
  MATERIALS,
} from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  fileOriginalName: string;
  fileSize: number;
  material: string;
  color: string;
  quantity: number;
  status: OrderStatus;
  estimatedPrice: number | null;
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/orders?${params}`);
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setOrders(data.orders);
      setTotal(data.total);
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const getMaterialLabel = (value: string) =>
    MATERIALS.find((m) => m.value === value)?.label || value;

  const totalPages = Math.ceil(total / 15);

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
            Siparişler
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Tüm Siparişler
            </h1>
            <p className="text-slate-600">
              Müşteri siparişlerini yönetin ve takip edin
            </p>
          </div>

          {/* Filtreler */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Sipariş no, isim veya e-posta ile ara..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
              >
                <option value="all">Tüm Durumlar</option>
                {Object.entries(ORDER_STATUSES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sipariş Tablosu */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Sipariş bulunamadı</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                          Sipariş
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                          Müşteri
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                          Dosya
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                          Malzeme
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                          Durum
                        </th>
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                          Tarih
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          onClick={() =>
                            router.push(`/admin/orders/${order.id}`)
                          }
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <td className="px-5 py-4">
                            <span className="font-mono font-semibold text-sm text-indigo-600">
                              {order.orderNumber}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-slate-900">
                              {order.customerName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {order.customerEmail}
                            </p>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <p className="text-sm text-slate-700 truncate max-w-[200px]">
                              {order.fileOriginalName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {formatFileSize(order.fileSize)}
                            </p>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <span className="text-sm text-slate-700">
                              {getMaterialLabel(order.material)}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                                ORDER_STATUSES[order.status]?.color ||
                                "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {ORDER_STATUSES[order.status]?.label ||
                                order.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 hidden sm:table-cell">
                            <span className="text-sm text-slate-500">
                              {formatDate(order.createdAt)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Sayfalama */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-5 py-4 border-t border-slate-200">
                    <p className="text-sm text-slate-500">
                      {total} siparişten {(page - 1) * 15 + 1} -{" "}
                      {Math.min(page * 15, total)} arası gösteriliyor
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-slate-700 px-2">
                        {page} / {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

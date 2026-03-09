"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  ORDER_STATUSES,
  type OrderStatus,
  formatDate,
  MATERIALS,
} from "@/lib/utils";

interface Stats {
  total: number;
  pending: number;
  printing: number;
  completed: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  material: string;
  status: OrderStatus;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setStats(data.stats);
      setRecent(data.recent);
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const getMaterialLabel = (value: string) =>
    MATERIALS.find((m) => m.value === value)?.label || value;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white font-medium text-sm"
          >
            <LayoutDashboard className="w-5 h-5" />
            Gösterge Paneli
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Gösterge Paneli
            </h1>
            <p className="text-slate-600">
              3D baskı siparişlerinizin genel görünümü
            </p>
          </div>

          {/* İstatistikler */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Toplam Sipariş",
                  value: stats.total,
                  icon: Package,
                  color: "bg-indigo-50 text-indigo-600",
                  iconColor: "text-indigo-600",
                },
                {
                  label: "İnceleme Bekleyen",
                  value: stats.pending,
                  icon: Clock,
                  color: "bg-yellow-50 text-yellow-600",
                  iconColor: "text-yellow-600",
                },
                {
                  label: "Üretimde",
                  value: stats.printing,
                  icon: Printer,
                  color: "bg-orange-50 text-orange-600",
                  iconColor: "text-orange-600",
                },
                {
                  label: "Tamamlanan",
                  value: stats.completed,
                  icon: CheckCircle2,
                  color: "bg-green-50 text-green-600",
                  iconColor: "text-green-600",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl border border-slate-200 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Son Siparişler */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Son Siparişler
              </h2>
              <Link
                href="/admin/orders"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                Tümünü Gör
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Henüz sipariş yok</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recent.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-mono font-semibold text-slate-900 text-sm">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-slate-500">
                          {order.customerName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500 hidden sm:block">
                        {getMaterialLabel(order.material)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ORDER_STATUSES[order.status]?.color ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ORDER_STATUSES[order.status]?.label || order.status}
                      </span>
                      <span className="text-xs text-slate-400 hidden lg:block">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

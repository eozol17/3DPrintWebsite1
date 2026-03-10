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
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  category: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({ includeInactive: "true" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/products?${params}`);
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setProducts(data.products);
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz?")) return;
    setDeletingId(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setDeletingId(null);
    fetchProducts();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const getCategoryLabel = (value: string | null) =>
    PRODUCT_CATEGORIES.find((c) => c.value === value)?.label || value || "—";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 font-medium text-sm transition-colors"
          >
            <ClipboardList className="w-5 h-5" />
            Özel Siparişler
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/10 text-white font-medium text-sm"
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

      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Ürünler</h1>
              <p className="text-slate-600">Marketplace ürünlerini yönetin</p>
            </div>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Yeni Ürün
            </Link>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 mb-6 p-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ürün ara..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Ara
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-slate-200">
            {products.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Henüz ürün yok</p>
                <Link
                  href="/admin/products/new"
                  className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  İlk ürünü ekle
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left px-5 py-3 text-slate-500 font-medium">Ürün</th>
                      <th className="text-left px-5 py-3 text-slate-500 font-medium hidden md:table-cell">Kategori</th>
                      <th className="text-right px-5 py-3 text-slate-500 font-medium">Fiyat</th>
                      <th className="text-right px-5 py-3 text-slate-500 font-medium hidden sm:table-cell">Stok</th>
                      <th className="text-center px-5 py-3 text-slate-500 font-medium">Durum</th>
                      <th className="text-right px-5 py-3 text-slate-500 font-medium">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-slate-900">{product.name}</p>
                            <p className="text-xs text-slate-400 font-mono">{product.slug}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-600 hidden md:table-cell">
                          {getCategoryLabel(product.category)}
                        </td>
                        <td className="px-5 py-4 text-right font-semibold text-slate-900">
                          ₺{product.price.toFixed(2)}
                        </td>
                        <td className="px-5 py-4 text-right hidden sm:table-cell">
                          <span className={product.stock === 0 ? "text-red-600 font-medium" : "text-slate-600"}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => handleToggleActive(product.id, product.isActive)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                              product.isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {product.isActive ? "Aktif" : "Pasif"}
                          </button>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={deletingId === product.id}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {deletingId === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Toplam {products.length} ürün
          </div>
        </div>
      </div>
    </div>
  );
}

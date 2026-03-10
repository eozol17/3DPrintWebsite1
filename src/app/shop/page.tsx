"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Printer,
  Search,
  ShoppingCart,
  Package,
  Upload,
  Tag,
} from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string | null;
  images: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (search) params.set("search", search);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const getCategoryLabel = (value: string | null) =>
    PRODUCT_CATEGORIES.find((c) => c.value === value)?.label || value || "Diğer";

  const getImages = (raw: string): string[] => {
    try { return JSON.parse(raw); } catch { return []; }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/50">
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
              <Link href="/shop" className="text-sm font-semibold text-indigo-600">
                Mağaza
              </Link>
              <Link href="/track" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
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

      <div className="pt-16">
        <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 py-14 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              3D Baskı <span className="gradient-text">Mağaza</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              Hazır 3D baskı ürünlerimizi keşfedin. Hızlı teslimat, yüksek kalite.
            </p>

            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ürün ara..."
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
              >
                Ara
              </button>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex gap-2 flex-wrap mb-8">
            <button
              onClick={() => setCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Tümü
            </button>
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.value
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Ürün bulunamadı</h3>
              <p className="text-slate-500 text-sm">Farklı bir arama veya kategori deneyin.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const images = getImages(product.images);
                return (
                  <Link
                    key={product.id}
                    href={`/shop/${product.slug}`}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover"
                  >
                    <div className="aspect-square bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center overflow-hidden">
                      {images.length > 0 ? (
                        <img
                          src={`/api/files/${images[0]}`}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                          <Package className="w-12 h-12" />
                          <span className="text-xs">Görsel yok</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      {product.category && (
                        <div className="flex items-center gap-1 mb-1.5">
                          <Tag className="w-3 h-3 text-indigo-400" />
                          <span className="text-xs text-indigo-600 font-medium">
                            {getCategoryLabel(product.category)}
                          </span>
                        </div>
                      )}
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-lg font-bold text-slate-900">
                          ₺{product.price.toFixed(2)}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            product.stock === 0
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {product.stock === 0 ? "Tükendi" : `${product.stock} adet`}
                        </span>
                      </div>
                      <button className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                        Sepete Ekle
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

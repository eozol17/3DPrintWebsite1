"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Printer,
  ShoppingCart,
  Package,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Upload,
  Loader2,
} from "lucide-react";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    stock: number;
    images: string;
  };
}

interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    const sessionId = localStorage.getItem("cart_session");
    if (!sessionId) { setLoading(false); return; }

    try {
      const res = await fetch(`/api/cart/${sessionId}`);
      const data = await res.json();
      setCart(data.cart);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    const sessionId = localStorage.getItem("cart_session");
    if (!sessionId) return;
    setUpdatingId(itemId);

    const res = await fetch(`/api/cart/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, quantity }),
    });
    const data = await res.json();
    setCart(data.cart);
    setUpdatingId(null);
  };

  const clearCart = async () => {
    const sessionId = localStorage.getItem("cart_session");
    if (!sessionId) return;
    await fetch(`/api/cart/${sessionId}`, { method: "DELETE" });
    localStorage.removeItem("cart_session");
    setCart(null);
  };

  const getImages = (raw: string): string[] => {
    try { return JSON.parse(raw); } catch { return []; }
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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
              <Link href="/track" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Sipariş Takip</Link>
              <Link
                href="/order"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all"
              >
                <Upload className="w-4 h-4" />
                Sipariş Ver
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-indigo-600" />
          Sepetim
          {items.length > 0 && (
            <span className="text-sm font-normal text-slate-500">({items.length} ürün)</span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Sepetiniz boş</h3>
            <p className="text-slate-500 text-sm mb-6">Mağazamızdaki ürünleri keşfedin.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors"
            >
              Alışverişe Başla
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const images = getImages(item.product.images);
                return (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4">
                    <Link href={`/shop/${item.product.slug}`} className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                        {images.length > 0 ? (
                          <img src={`/api/files/${images[0]}`} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-slate-300" />
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/shop/${item.product.slug}`}>
                        <h3 className="font-semibold text-slate-900 text-sm hover:text-indigo-600 transition-colors line-clamp-2">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        ₺{item.product.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updatingId === item.id}
                          className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-slate-600" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-slate-900">
                          {updatingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin inline" />
                          ) : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updatingId === item.id || item.quantity >= item.product.stock}
                          className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-slate-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => updateQuantity(item.id, 0)}
                        disabled={updatingId === item.id}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Kaldır
                      </button>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={clearCart}
                className="text-sm text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Sepeti Temizle
              </button>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
                <h3 className="font-bold text-slate-900 mb-4">Sipariş Özeti</h3>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-slate-600 truncate mr-2">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="text-slate-900 font-medium flex-shrink-0">
                        ₺{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-4 mb-6">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Toplam</span>
                    <span>₺{subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Kargo ücreti sonraki adımda hesaplanır</p>
                </div>
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                  Siparişi Tamamla
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop"
                  className="flex items-center justify-center gap-2 w-full mt-3 border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

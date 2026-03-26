"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  ShoppingCart,
  Package,
  Tag,
  CheckCircle,
  AlertCircle,
  Minus,
  Plus,
  Upload,
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
  isActive: boolean;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) { router.push("/shop"); return; }
      const data = await res.json();
      setProduct(data.product);
    } finally {
      setLoading(false);
    }
  };

  const getImages = (raw: string): string[] => {
    try { return JSON.parse(raw); } catch { return []; }
  };

  const getCategoryLabel = (value: string | null) =>
    PRODUCT_CATEGORIES.find((c) => c.value === value)?.label || value || "Diğer";

  const handleAddToCart = async () => {
    if (!product) return;
    setCartLoading(true);

    let sessionId = localStorage.getItem("cart_session");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem("cart_session", sessionId);
    }

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, productId: product.id, quantity }),
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  const images = getImages(product.images);
  const inStock = product.stock > 0;

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
              <Link href="/shop" className="text-sm font-semibold text-indigo-600">Mağaza</Link>
              <Link href="/track" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Sipariş Takip</Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Sepet
              </Link>
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

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-8 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Mağazaya Dön
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-gradient-to-br from-slate-50 to-indigo-50 rounded-2xl overflow-hidden border border-slate-200 mb-4 flex items-center justify-center">
              {images.length > 0 ? (
                <img
                  src={`/api/images/${images[selectedImage]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <Package className="w-20 h-20" />
                  <span className="text-sm">Görsel yok</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-indigo-500" : "border-slate-200"
                    }`}
                  >
                    <img src={`/api/images/${img}`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {product.category && (
              <div className="flex items-center gap-1.5 mb-3">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-sm text-indigo-600 font-medium">
                  {getCategoryLabel(product.category)}
                </span>
              </div>
            )}

            <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>

            {product.description && (
              <p className="text-slate-600 leading-relaxed mb-6">{product.description}</p>
            )}

            <div className="text-4xl font-bold text-slate-900 mb-2">
              ₺{product.price.toFixed(2)}
            </div>

            <div className="flex items-center gap-2 mb-8">
              {inStock ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Stokta var — {product.stock} adet
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 font-medium">Stokta yok</span>
                </>
              )}
            </div>

            {inStock && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Adet</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="text-lg font-semibold text-slate-900 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {addedToCart ? (
                <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 py-3 rounded-xl text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Sepete eklendi!
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || cartLoading}
                  className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                  {cartLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                  {inStock ? "Sepete Ekle" : "Stokta Yok"}
                </button>
              )}

              <Link
                href="/cart"
                className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                Sepeti Görüntüle
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <p className="text-xs text-slate-500 text-center">
                Özel 3D baskı siparişi vermek için{" "}
                <Link href="/order" className="text-indigo-600 hover:underline font-medium">
                  buraya tıklayın
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  ArrowLeft,
  Loader2,
  Trash2,
  ShoppingCart,
  ImagePlus,
  X,
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
  isActive: boolean;
  images: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "0",
    category: "",
    isActive: true,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.status === 401) { router.push("/admin"); return; }
      if (res.status === 404) { router.push("/admin/products"); return; }
      const data = await res.json();
      const p: Product = data.product;
      setOriginalSlug(p.slug);
      setForm({
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        price: p.price.toString(),
        stock: p.stock.toString(),
        category: p.category || "",
        isActive: p.isActive,
      });
      try { setImages(JSON.parse(p.images) || []); } catch { setImages([]); }
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slug === originalSlug || prev.slug === slugify(prev.name)
        ? slugify(name)
        : prev.slug,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/products/images", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Resim yüklenemedi"); return; }
      setImages((prev) => [...prev, data.filename]);
    } catch {
      setError("Resim yükleme hatası");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          category: form.category || null,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Bir hata oluştu"); return; }

      setSuccess(true);
      setOriginalSlug(data.product.slug);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz?")) return;
    setDeleting(true);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    router.push("/admin/products");
  };

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
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link
              href="/admin/products"
              className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Ürünlere Dön
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Ürünü Düzenle</h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">Ürün başarıyla güncellendi.</div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Ürün Adı <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleNameChange}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Slug (URL)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Açıklama</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Fiyat (₺)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  required min="0" step="0.01"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Stok</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                  min="0"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Kategori seçin</option>
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Ürün Görselleri
              </label>
              <div className="flex flex-wrap gap-3 mb-3">
                {images.map((filename, i) => (
                  <div key={filename} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                    <img src={`/api/images/${filename}`} alt={`Görsel ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((f) => f !== filename))}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                  {uploadingImage ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                  ) : (
                    <>
                      <ImagePlus className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-400">Ekle</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              </div>
              <p className="text-xs text-slate-400">JPG, PNG veya WebP. Maks 10MB.</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Aktif (mağazada görünür)</label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
              </button>
              <Link
                href="/admin/products"
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-sm transition-colors"
              >
                İptal
              </Link>
            </div>
          </form>

          <div className="mt-6 bg-white rounded-xl border border-red-200 p-6">
            <h3 className="text-sm font-semibold text-red-700 mb-1">Tehlikeli Bölge</h3>
            <p className="text-sm text-slate-500 mb-4">Bu ürün kalıcı olarak silinecek. Bu işlem geri alınamaz.</p>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? "Siliniyor..." : "Ürünü Sil"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

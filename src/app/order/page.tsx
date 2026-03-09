"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import {
  Upload,
  Printer,
  CheckCircle2,
  FileBox,
  ArrowLeft,
  Loader2,
  X,
} from "lucide-react";
import { formatFileSize, MATERIALS, COLORS } from "@/lib/utils";

interface UploadedFile {
  fileName: string;
  fileOriginalName: string;
  filePath: string;
  fileSize: number;
}

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    material: "pla",
    color: "white",
    quantity: 1,
    infill: 20,
    notes: "",
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUploadedFile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "application/sla": [".stl"],
      "application/octet-stream": [".obj", ".3mf", ".step", ".stp", ".gcode"],
      "model/stl": [".stl"],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...uploadedFile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrderNumber(data.order.orderNumber);
      setStep(3);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sipariş oluşturulamadı"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      {/* Başlık */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Geri</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Printer className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">
              Print<span className="text-indigo-600">Flow</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* İlerleme Adımları */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[
            { num: 1, label: "Dosya Yükle" },
            { num: 2, label: "Sipariş Detayları" },
            { num: 3, label: "Onay" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step >= s.num
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {step > s.num ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    s.num
                  )}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    step >= s.num ? "text-indigo-600" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`w-12 h-0.5 ${
                    step > s.num ? "bg-indigo-600" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
            <X className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Adım 1: Yükleme */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              3D modelinizi yükleyin
            </h1>
            <p className="text-slate-600 mb-8">
              Desteklenen formatlar: STL, OBJ, 3MF, STEP, GCODE (maks. 100MB)
            </p>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-indigo-400 bg-indigo-50"
                  : uploadedFile
                  ? "border-green-300 bg-green-50"
                  : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50"
              }`}
            >
              <input {...getInputProps()} />

              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                  <p className="text-slate-600 font-medium">
                    Dosyanız yükleniyor...
                  </p>
                </div>
              ) : uploadedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <FileBox className="w-12 h-12 text-green-500" />
                  <div>
                    <p className="font-semibold text-slate-900">
                      {uploadedFile.fileOriginalName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatFileSize(uploadedFile.fileSize)}
                    </p>
                  </div>
                  <p className="text-sm text-slate-400">
                    Değiştirmek için tıklayın veya sürükleyin
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-12 h-12 text-slate-400" />
                  <div>
                    <p className="font-semibold text-slate-700">
                      {isDragActive
                        ? "Dosyanızı buraya bırakın"
                        : "3D dosyanızı sürükleyip bırakın"}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      veya tıklayarak seçin
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!uploadedFile}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Sipariş Detaylarına Geç
            </button>
          </div>
        )}

        {/* Adım 2: Sipariş Detayları */}
        {step === 2 && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
          >
            <h1 className="text-2xl font-bold text-slate-900 mb-6">
              Sipariş Detayları
            </h1>

            {/* İletişim Bilgileri */}
            <div className="space-y-4 mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                İletişim Bilgileri
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Ahmet Yılmaz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    E-posta Adresi *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.customerEmail}
                    onChange={(e) =>
                      setForm({ ...form, customerEmail: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="ahmet@ornek.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Telefon (isteğe bağlı)
                </label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) =>
                    setForm({ ...form, customerPhone: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="+90 555 123 4567"
                />
              </div>
            </div>

            {/* Baskı Ayarları */}
            <div className="space-y-4 mb-8">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Baskı Ayarları
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Malzeme *
                  </label>
                  <select
                    value={form.material}
                    onChange={(e) =>
                      setForm({ ...form, material: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                  >
                    {MATERIALS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Renk *
                  </label>
                  <select
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                  >
                    {COLORS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Adet
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Doluluk Oranı
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={form.infill}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          infill: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 accent-indigo-600"
                    />
                    <span className="text-sm font-semibold text-indigo-600 w-12 text-right">
                      %{form.infill}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ek Notlar
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                  placeholder="Özel gereksinimler, toleranslar, yüzey tercihleri..."
                />
              </div>
            </div>

            {/* Dosya Özeti */}
            {uploadedFile && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6 flex items-center gap-3">
                <FileBox className="w-8 h-8 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {uploadedFile.fileOriginalName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatFileSize(uploadedFile.fileSize)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all"
              >
                Geri
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sipariş Veriliyor...
                  </>
                ) : (
                  "Siparişi Onayla"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Adım 3: Onay */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Siparişiniz Başarıyla Oluşturuldu!
            </h1>
            <p className="text-slate-600 mb-6">
              Siparişiniz alındı. Dosyanızı inceleyip en kısa sürede size
              dönüş yapacağız.
            </p>

            <div className="bg-indigo-50 rounded-xl p-6 mb-8 inline-block">
              <p className="text-sm text-indigo-600 font-medium mb-1">
                Sipariş Numaranız
              </p>
              <p className="text-3xl font-bold text-indigo-700 font-mono">
                {orderNumber}
              </p>
              <p className="text-xs text-indigo-500 mt-2">
                Siparişinizi takip etmek için bu numarayı saklayın
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={`/track?order=${orderNumber}`}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-all"
              >
                Siparişi Takip Et
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 font-medium px-6 py-3 rounded-xl hover:bg-slate-50 transition-all"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

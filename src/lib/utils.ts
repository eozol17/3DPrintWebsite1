import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "3DP-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const ORDER_STATUSES = {
  pending: { label: "Beklemede", color: "bg-yellow-100 text-yellow-800" },
  reviewing: { label: "İnceleniyor", color: "bg-blue-100 text-blue-800" },
  quoted: { label: "Fiyat Verildi", color: "bg-purple-100 text-purple-800" },
  approved: { label: "Onaylandı", color: "bg-indigo-100 text-indigo-800" },
  printing: { label: "Basılıyor", color: "bg-orange-100 text-orange-800" },
  completed: { label: "Tamamlandı", color: "bg-green-100 text-green-800" },
  shipped: { label: "Kargoya Verildi", color: "bg-teal-100 text-teal-800" },
  cancelled: { label: "İptal Edildi", color: "bg-red-100 text-red-800" },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;

export const MATERIALS = [
  { value: "pla", label: "PLA" },
  { value: "abs", label: "ABS" },
  { value: "petg", label: "PETG" },
  { value: "tpu", label: "TPU (Esnek)" },
  { value: "nylon", label: "Naylon" },
  { value: "resin", label: "Reçine (SLA)" },
  { value: "other", label: "Diğer" },
];

export const COLORS = [
  { value: "white", label: "Beyaz" },
  { value: "black", label: "Siyah" },
  { value: "red", label: "Kırmızı" },
  { value: "blue", label: "Mavi" },
  { value: "green", label: "Yeşil" },
  { value: "yellow", label: "Sarı" },
  { value: "orange", label: "Turuncu" },
  { value: "gray", label: "Gri" },
  { value: "transparent", label: "Şeffaf" },
  { value: "custom", label: "Özel (notlarda belirtin)" },
];

export function generatePurchaseNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "MKT-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const PURCHASE_STATUSES = {
  pending: { label: "Beklemede", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Onaylandı", color: "bg-blue-100 text-blue-800" },
  preparing: { label: "Hazırlanıyor", color: "bg-orange-100 text-orange-800" },
  shipped: { label: "Kargoya Verildi", color: "bg-teal-100 text-teal-800" },
  delivered: { label: "Teslim Edildi", color: "bg-green-100 text-green-800" },
  cancelled: { label: "İptal Edildi", color: "bg-red-100 text-red-800" },
} as const;

export type PurchaseStatus = keyof typeof PURCHASE_STATUSES;

export const PRODUCT_CATEGORIES = [
  { value: "figurine", label: "Figür" },
  { value: "jewelry", label: "Takı & Aksesuar" },
  { value: "home", label: "Ev Dekorasyonu" },
  { value: "gadget", label: "Aksesuar & Aparat" },
  { value: "art", label: "Sanat & Tasarım" },
  { value: "other", label: "Diğer" },
];

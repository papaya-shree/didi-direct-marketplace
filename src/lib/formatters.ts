import type { TFunction } from "i18next";
import type { Status } from "./data";

export function formatProductStatus(status: Status, t: TFunction): string {
  switch (status) {
    case "Pending_Review":
      return t("status.Pending_Review");
    case "Live":
      return t("status.Live");
    case "Sold":
      return t("status.Sold");
    default:
      return status;
  }
}

export function formatSettlementStatus(status: "Settled" | "Pending", t: TFunction): string {
  switch (status) {
    case "Settled":
      return t("status.Settled");
    case "Pending":
      return t("status.Pending");
    default:
      return status;
  }
}

export function formatNumber(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return value.toLocaleString();
  }
}

export function formatTime(date: Date | string, locale: string): string {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(d);
  } catch {
    return String(date);
  }
}

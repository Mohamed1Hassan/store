import type { Metadata } from "next";
import { SITE_NAME } from "@/data/site";
import OrderTrackClient from "./OrderTrackClient";

export const metadata: Metadata = {
  title: `متابعة حالة الطلب | ${SITE_NAME}`,
  description: "تابع حالة طلبك أو حجز المعاينة الخاص بك لدى مفروشات وستائر السلطان برقم التتبع.",
};

export default function OrderTrackPage() {
  return <OrderTrackClient />;
}

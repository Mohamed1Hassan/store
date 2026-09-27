import { z } from "zod";

export const productSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "المعرف التعريفي (slug) مطلوب.")
    .max(80, "المعرف طويل جداً.")
    .regex(/^[a-z0-9-]+$/, "المعرف يجب أن يتكون من أحرف إنجليزية صغيرة وأرقام وشرطات فقط."),
  name: z.string().trim().min(3, "اسم المنتج مطلوب (3 أحرف على الأقل).").max(150),
  category: z.string().trim().min(2, "القسم مطلوب.").max(80),
  tag: z.string().trim().max(80).default("فاخر"),
  price: z.string().trim().min(1, "السعر المكتوب مطلوب."),
  priceValue: z.number().positive("قيمة السعر يجب أن تكون رقماً موجباً."),
  originalPrice: z.string().trim().max(50).optional(),
  savingLabel: z.string().trim().max(50).optional(),
  description: z.string().trim().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل."),
  features: z.array(z.string().trim()).min(1, "أدخل ميزة واحدة على الأقل."),
  image: z.string().url("رابط الصورة غير صالح.").optional().or(z.literal("")),
  available: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export type ProductInput = z.infer<typeof productSchema>;

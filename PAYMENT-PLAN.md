# 禺胤丞 丕賱丿賮毓 賵丕賱鬲丨氐賷賱 鈥?Payment & Payout Plan
## 賲鬲噩乇 賲賮乇賵卮丕鬲 賵賲乇丕鬲亘 賵爻鬲丕卅乇 丕賱爻賱胤丕賳

> **丕賱賴丿賮:** 鬲丨賵賷賱 賳賲賵匕噩 丕賱胤賱亘 丕賱丨丕賱賷 (COD 亘丨鬲 亘丿賵賳 賴賷賰賱丞 賲亘賱睾) 廿賱賶 丿賵乇丞 鬲丨氐賷賱 賰丕賲賱丞:
> 丕賱毓賲賷賱 賷禺鬲丕乇 胤乇賷賯丞 丕賱丿賮毓 鈫?賷丨賵賾賱 丕賱賲亘賱睾 廿賱賶 **丕賱丨爻丕亘/丕賱亘胤丕賯丞 丕賱鬲賷 賷囟亘胤賴丕 丕賱兀丿賲賳 亘賳賮爻賴 賲賳 賱賵丨丞 丕賱鬲丨賰賲** 鈫?賷乇賮毓 丕賱廿賷氐丕賱 鈫?丕賱兀丿賲賳 賷丐賰丿 丕賱丕爻鬲賱丕賲.
>
> **丕賱賲亘丿兀 丕賱丨丕賰賲:** 丕賱兀丿賲賳 (氐丕丨亘 丕賱賲鬲噩乇) 賴賵 **丕賱賵丨賷丿** 丕賱匕賷 賷購丿禺賱 賵賷毓丿賾賱 乇賯賲 丕賱丨爻丕亘 丕賱亘賳賰賷 / 丕賱亘胤丕賯丞 / 丕賱賲丨賮馗丞 丕賱鬲賷 爻鬲賳賯賱亘 毓賱賷賴丕 丕賱賮賱賵爻. 賱丕 賷賵噩丿 兀賷 乇賯賲 丿賮毓 賲賰鬲賵亘 賮賷 丕賱賰賵丿 鈥?賰賱 卮賷亍 賲賳 `siteContent.payment` 賵賷購丿丕乇 賲賳 鬲亘賵賷亘 芦丕賱丿賮毓禄 賮賷 `/admin`.

---

## 0) 爻賱賵賰 丕賱賳馗丕賲 丕賱賲爻鬲賴丿賮 (Definition of Done)

1. 丕賱兀丿賲賳 賷賮鬲丨 `/admin` 鈫?鬲亘賵賷亘 **芦丕賱丿賮毓禄** 鈫?賷購丿禺賱: 丕爻賲 氐丕丨亘 丕賱丨爻丕亘貙 丕爻賲 丕賱亘賳賰貙 乇賯賲 丕賱丌賷亘丕賳/丕賱賰丕乇鬲貙 乇賯賲 賮賵丿丕賮賵賳 賰丕卮貙 丨爻丕亘 InstaPay貙 賳氐 鬲毓賱賷賲丕鬲 丕賱鬲丨賵賷賱貙 賵賷賮毓賾賱/賷毓胤賾賱 賰賱 胤乇賷賯丞.
2. 丕賱毓賲賷賱 賮賷 `CartCheckoutForm` 賷乇賶 **亘賷丕賳丕鬲 丕賱丨爻丕亘 丕賱賮毓賱賷丞 丕賱鬲賷 兀丿禺賱賴丕 丕賱兀丿賲賳** + 夭乇 賳爻禺貙 賷丨賵賾賱 丕賱賲亘賱睾貙 賵賷乇賮毓 氐賵乇丞 丕賱廿賷氐丕賱.
3. 賰賱 胤賱亘 賷購丨賮馗 賲毓: `amount` (賲丨爻賵亘 賮賷 丕賱爻賷乇賮乇 賲賳 兀爻毓丕乇 丕賱賯丕毓丿丞) + `paymentMethod` + `paymentStatus` + `receiptUrl` + 毓賳賵丕賳 賲賳馗賾賲 (賲丨丕賮馗丞/賲丿賷賳丞/卮丕乇毓).
4. 丕賱兀丿賲賳 賷乇賶 賮賷 鬲亘賵賷亘 芦丕賱胤賱亘丕鬲禄 卮丕乇丞 丨丕賱丞 丕賱丿賮毓 賵丕賱廿賷氐丕賱貙 賵賷囟睾胤 **芦鬲兀賰賷丿 丕爻鬲賱丕賲 丕賱賲亘賱睾禄** 鈫?`paymentStatus = PAID`.
5. 亘丿賵賳 兀賷 廿毓丿丕丿丕鬲 丿賮毓 賲囟亘賵胤丞 賲賳 丕賱兀丿賲賳貙 鬲馗賴乇 賱賱毓賲賷賱 胤乇賷賯丞 **丕賱丿賮毓 毓賳丿 丕賱丕爻鬲賱丕賲 賮賯胤** (fallback 丌賲賳).

---

## 1) 爻噩賱 丕賱鬲賳賮賷匕 (Progress Log)

| 丕賱賲乇丨賱丞 | 丕賱丨丕賱丞 | 丕賱賲丨鬲賵賶 |
| :--- | :--- | :--- |
| **P0. 廿氐賱丕丨丕鬲 丨乇噩丞 賯亘賱 丕賱丿賮毓** | 鉁?賲賳賮匕丞 (2026-09-28) | 賴賷賰賱丞 `items` 亘丿賱 賳氐 丕賱爻賱丞 (P0.1) 路 `priceCart` 賷丨爻亘 `amount` 賲賳 兀爻毓丕乇 丕賱賯丕毓丿丞 賵賷丨賮馗賴 賮賷 `Lead.amount` (P0.2) 路 `trackEvent("order_submit")` 賲賳 賳賲賵匕噩 丕賱爻賱丞 (P0.3) 路 夭乇 賳爻禺 丕賱賰賵丿 + 芦鬲鬲亘毓 胤賱亘賷 丕賱丌賳禄 賲毓 亘丨孬 鬲賱賯丕卅賷 `?code=` (P0.4) 路 夭乇 賵丕鬲爻丕亘 亘丿賷賱 毓賳丿 賮卮賱 丕賱廿乇爻丕賱 (P0.5) 路 賲亘賱睾 乇賯賲賷 賳馗賷賮 賲賳 丕賱爻賷乇賮乇 (P0.6) 鈥?**+ 廿氐賱丕丨 9 兀禺胤丕亍 lint 賯丿賷賲丞 賮賷 Footer/Catalog/Curtain** |
| **P1. 丨爻丕亘 丕賱鬲丨氐賷賱 毓賳丿 丕賱兀丿賲賳** | 鉁?賲賳賮匕丞 (2026-09-28) | `paymentMethodSchema` + `paymentSettingsSchema` 賮賷 `site-content.ts` (賰賱 丕賱丨賯賵賱 丕賱賲丕賱賷丞 賮丕乇睾丞 丕賮鬲乇丕囟賷丕賸) 路 賯賷賲 `defaults` 賱孬賱丕孬 胤乇賯 賲毓胤賾賱丞 路 賲賰賵賾賳 `AdminPaymentTab.tsx` (賲賮丕鬲賷丨 毓丕賲丞 + 賳賲丕匕噩 丕賱丨爻丕亘 + 廿囟丕賮丞/丨匕賮 胤乇賯 + 丨賮馗 噩夭卅賷 `{payment}`) 路 鬲亘賵賷亘 芦丕賱丿賮毓禄 丕賱禺丕賲爻 賮賷 `AdminDashboard` 亘賳賮爻 賳賲胤 `TabId` 路 丕賱丨賮馗 毓亘乇 `PATCH /api/admin/site-content` 丕賱賲賵噩賵丿 (賲丨賲賷 亘賭 `isAdminRequest` + `revalidatePath`) |
| **P2. 賵丕噩賴丞 丕賱丿賮毓 賱賱毓賲賷賱** | 鉁?賲賳賮匕丞 賰賵丿丕賸 (2026-09-28) 鈥?爻噩賱 丕賱鬲丨賯賯 賷購丨丿賻賾孬 賲毓 P3 | 毓賳賵丕賳 賲賳馗賾賲 27 賲丨丕賮馗丞 (P2.1) 路 丕禺鬲賷丕乇 胤乇賷賯丞 丿賮毓 radio-cards + 毓乇囟 亘賷丕賳丕鬲 丕賱丨爻丕亘 丕賱賮毓賱賷丞 + 夭乇 賳爻禺 (P2.2/P2.3) 路 乇賮毓 廿賷氐丕賱 JPG/PNG/WebP 鈮?MB 毓亘乇 `POST /api/leads/receipt` 賲毓 rate limit 3/丿賯賷賯丞 賵賮丨氐 賳賵毓/丨噩賲 (P2.4/P4.3/P4.4 賲亘賰乇丕賸) 路 `requireReceipt` 賷賲賳毓 丕賱廿乇爻丕賱 亘丿賵賳 廿賷氐丕賱 (P2.6) 路 鬲丨賯賯 氐丕乇賲 賮賷 `POST /api/leads` 賲賯丕亘賱 `getSiteContent().payment` 路 丨賮馗 `paymentMethod`/`receiptUrl`/`governorate`/`city`/`address` 賮賷 `Lead` 賵 `StoredLead` 鈥?**丕賱賲賱賮丕鬲:** `CartCheckoutForm.tsx` 路 `lead.ts` 路 `leads-store.ts` 路 `prisma/schema.prisma` 路 `governorates.ts` 路 `api/leads/receipt/route.ts` |
| **P3. 鬲兀賰賷丿 丕賱鬲丨氐賷賱 賲賳 丕賱兀丿賲賳** | 馃攧 賯賷丿 丕賱鬲賳賮賷匕 (亘丿兀 2026-09-28) | `PaymentStatus` enum + `paidAt` 賮賷 Lead + 卮丕乇丕鬲 丕賱丿賮毓 賵丕賱賲亘賱睾 賵丕賱廿賷氐丕賱 賮賷 丕賱賱賵丨丞 + 兀夭乇丕乇 鬲兀賰賷丿/乇賮囟 + 毓乇囟賴丕 賮賷 丕賱鬲鬲亘毓 + 廿卮毓丕乇丕鬲 + 鬲賳馗賷賮 丕賱廿賷氐丕賱丕鬲 丕賱賷鬲賷賲丞 + Cloudinary 賲亘賰乇 (丕賳馗乇 搂5) |
| **P4. 丕賱兀賲丕賳 賵丕賱丕禺鬲亘丕乇丕鬲** | 鈴?賱賲 鬲亘丿兀 (噩夭卅賷丕賸 賲賳噩夭 賲亘賰乇丕賸) | P4.3/P4.4 兀購賳噩夭丕 囟賲賳 P2 (rate limit + 賮丨氐 賲賱賮 丕賱廿賷氐丕賱) 鈥?丕賱賲鬲亘賯賷: 丕禺鬲亘丕乇丕鬲 `paymentMethod`/`paymentStatus` + `npm test` + `tsc` + `lint` + `build` |
| **P5. 亘賵丕亘丞 丿賮毓 廿賱賰鬲乇賵賳賷丞 (丕禺鬲賷丕乇賷丞)** | 鈴?賲丐噩賱丞 | Paymob/Fawry 鈥?賲賮丕鬲賷丨 丕賱亘賵丕亘丞 賳賮爻賴丕 鬲購囟亘胤 賲賳 賳賮爻 鬲亘賵賷亘 丕賱兀丿賲賳 路 **Cloudinary 兀購禺乇噩 賲賳 賴賳丕 廿賱賶 P3.5 (廿賱夭丕賲賷 毓賱賶 Vercel)** |

**丕賱鬲丨賯賯 賲賳 P0 (2026-09-28):** `npm test` 25/25 鉁?(賲賳賴丕 5 丕禺鬲亘丕乇丕鬲 噩丿賷丿丞 賱賭 `cartItemSchema`/`priceCart`) 路 `npx tsc --noEmit` 鉁?路 `npm run lint` 鉁?(0 賲卮丕賰賱) 路 `npm run build` 27/27 氐賮丨丞 鉁?路 丕禺鬲亘丕乇 丨賷 毓賱賶 `next start`: 爻賱丞 3 賲賳鬲噩丕鬲 (賳氐 賯丿賷賲 賰丕賳 245 丨乇賮 > 160) 鈫?`POST /api/leads` **201** 賲毓 `trackingCode=SLT-C627M` 賵`amount=12550` 亘丕賱囟亘胤 (9400+850脳2+1450) 賵賲賱禺氐 賲丨賮賵馗 244 丨乇賮 路 slug 賲噩賴賵賱 鈫?400 亘乇爻丕賱丞 毓乇亘賷丞 路 `GET /api/orders/track/SLT-C627M` 賷毓賷丿 丕賱賲賱禺氐 路 `/orders/track?code=` = 200 路 胤賱亘 賰賱丕爻賷賰賷 亘丿賵賳 爻賱丞 鈫?201 (爻賱丕賲丞 `OrderForm`).

**丕賱鬲丨賯賯 賲賳 P1 (2026-09-28):** `npm test` 29/29 鉁?(4 丕禺鬲亘丕乇丕鬲 噩丿賷丿丞: defaults 丌賲賳丞 COD 賮賯胤 路 乇賮囟 兀乇賯丕賲 胤賵賷賱丞 路 鬲乇賯賷丞 丨賲賵賱丕鬲 賯丿賷賲丞 路 賯亘賵賱 丨爻丕亘 丕賱兀丿賲賳) 路 `tsc` 鉁?路 `lint` 鉁?路 `build` 鉁?路 丕禺鬲亘丕乇 丨賷 毓賱賶 `next start`: `PATCH` 亘丿賵賳 噩賱爻丞 = **401** 路 丿禺賵賱 兀丿賲賳 鈫?`PATCH {payment}` = **200** 鈫?`GET /api/site-content` 丕賱毓丕賲 賷毓賷丿 `enabled=true` 賵乇賯賲 丕賱丨爻丕亘 賵丕賱丕爻賲 丨乇賮賷丕賸 路 孬賲 廿毓丕丿丞 丕賱囟亘胤 賱賱賵囟毓 丕賱丌賲賳 (`enabled:false`) 賵丨匕賮 賲賱賮丕鬲 丕賱丕禺鬲亘丕乇 丕賱賲丐賯鬲丞.

**丕賱鬲丨賯賯 賲賳 P2 (賷購丨丿賻賾孬 賲毓 廿睾賱丕賯 P3):** 丕賱賰賵丿 賲賰鬲賲賱 賵賷購禺鬲亘乇 丨賷丕賸 囟賲賳 P3 鈥?`POST /api/leads` 賷乇賮囟 鬲丨賵賷賱 亘丿賵賳 廿賷氐丕賱 毓賳丿 `requireReceipt=true` 賵賷賯亘賱 COD 亘丿賵賳 廿賷氐丕賱貙 賵 `POST /api/leads/receipt` 賷乇賮囟 賲賱賮 >5MB 賵賳賵毓 睾賷乇 氐賵乇丞.

> 鈿狅笍 **賷鬲胤賱亘 丕賱賳卮乇 (賲丨丿賻賾孬):** `npm run db:push` 賲乇丞 賵丕丨丿丞 毓賱賶 丕賱兀賯賱 (P0: 毓賲賵丿丕 `Lead.amount` 賵`Lead.items` 路 P2: 兀毓賲丿丞 `paymentMethod`/`receiptUrl`/`governorate`/`city`/`address` 路 P3: 毓賲賵丿丕 `paymentStatus` 賵`paidAt` + 賳賵毓 `PaymentStatus`). 賯亘賱 P3 賰丕賳鬲 丕賱兀毓賲丿丞 丕賱爻亘毓丞 賲賵噩賵丿丞 賮賷 `prisma/schema.prisma` 賱賰賳賴丕 賱賲 鬲購丿賮毓 賱賱賯丕毓丿丞 亘毓丿 鈥?丕丿賮毓賴丕 丕賱丌賳 賲毓 P3 丿賮毓丞 賵丕丨丿丞.

---

## 2) 丕賱賲乇丨賱丞 P0 鈥?廿氐賱丕丨丕鬲 丨乇噩丞 (卮乇胤 爻丕亘賯 賱兀賷 丿賮毓)

**丕賱賴丿賮:** 廿氐賱丕丨 丕賱兀毓胤丕賱 丕賱鬲賷 噩毓賱鬲 廿鬲賲丕賲 丕賱胤賱亘 睾賷乇 賲賵孬賵賯 賯亘賱 亘賳丕亍 胤亘賯丞 丕賱丿賮毓 賮賵賯賴.

| # | 丕賱賲賴賲丞 | 丕賱賲賱賮丕鬲 | 賲毓賷丕乇 丕賱賯亘賵賱 |
| :--- | :--- | :--- | :--- |
| P0.1 | **廿氐賱丕丨 bug 丨丿 160 丨乇賮:** 丕爻鬲亘丿丕賱 鬲賴噩卅丞 丕賱爻賱丞 丿丕禺賱 丨賯賱 `product` 亘賴賷賰賱丞 `items: [{ slug, name, quantity, size }]` | `src/schemas/lead.ts` 路 `src/components/CartCheckoutForm.tsx` | 爻賱丞 5 賲賳鬲噩丕鬲 鬲購賯亘賱 亘賭 201 鈥?鬲丨賯賯鬲 兀賳 丕賱賳氐 丕賱丨丕賱賷 = 245 丨乇賮 > 160 |
| P0.2 | **廿毓丕丿丞 丨爻丕亘 丕賱廿噩賲丕賱賷 賮賷 丕賱爻賷乇賮乇:** 賷購乇爻賱 丕賱毓賲賷賱 `items` 亘丕賱賭 slug 賵丕賱賰賲賷丞 賮賯胤貙 賵丕賱爻賷乇賮乇 賷賯乇兀 `priceValue` 賲賳 `products-store` 賵賷丨爻亘 `amount` 鈥?賷購乇賮囟 兀賷 賲亘賱睾 睾賷乇 賲胤丕亘賯 | `src/app/api/leads/route.ts` 路 `src/lib/leads-store.ts` | 鬲毓丿賷賱 `priceValue` 賮賷 丕賱賭 localStorage 賱丕 賷睾賷賾乇 `amount` 丕賱賲丨賮賵馗 |
| P0.3 | 鬲爻噩賷賱 丨丿孬 `trackEvent("order_submit")` 賲賳 賳賲賵匕噩 丕賱爻賱丞 (丨丕賱賷賸丕 賲賮賯賵丿 賲賯丕亘賱 `OrderForm`) | `src/components/CartCheckoutForm.tsx` | 丕賱丨丿孬 賷馗賴乇 賮賷 `EventLog` 毓賳丿 廿鬲賲丕賲 胤賱亘 爻賱丞 |
| P0.4 | 夭乇 **芦鬲鬲亘毓 胤賱亘賷禄** + 夭乇 賳爻禺 賱賱賰賵丿 賮賷 卮丕卮丞 賳噩丕丨 丕賱爻賱丞 (乇丕亘胤 `/orders/track`) | `src/components/CartDrawer.tsx` | 亘毓丿 丕賱胤賱亘 賷賲賰賳 賮鬲丨 氐賮丨丞 丕賱鬲鬲亘毓 亘囟睾胤丞 賵丕丨丿丞 |
| P0.5 | 亘丿賷賱 賵丕鬲爻丕亘 毓賳丿 賮卮賱 `POST /api/leads` (賰賲丕 賮賷 `OrderForm`) | `src/components/CartCheckoutForm.tsx` | 毓賳丿 429/賮卮賱 卮亘賰丞 賷馗賴乇 夭乇 芦兀賰賲賱 毓亘乇 賵丕鬲爻丕亘禄 賵丕賱爻賱丞 賲丨賮賵馗丞 |
| P0.6 | 廿夭丕賱丞 丕賱兀乇賯丕賲 丕賱毓乇亘賷丞-丕賱賴賳丿賷丞 賲賳 丕賱賳氐 丕賱賲丨賮賵馗 (丕爻鬲禺丿丕賲 `amount` 乇賯賲賷 亘丿賱 `toLocaleString` 丿丕禺賱 賳氐 `product`) | `CartCheckoutForm.tsx` | 丕賱賲亘賱睾 賮賷 丕賱賯丕毓丿丞 乇賯賲 賳馗賷賮 `12500` |


---

## 3) 丕賱賲乇丨賱丞 P1 鈥?丨爻丕亘 丕賱鬲丨氐賷賱: 丕賱兀丿賲賳 賷囟亘胤 丕賱丨爻丕亘/丕賱亘胤丕賯丞 猸?
**丕賱賴丿賮:** 賲賳賮匕 廿毓丿丕丿丕鬲 賲丕賱賷 賷賲賱賰賴 丕賱兀丿賲賳 賵丨丿賴 鈥?賵賴賵 噩賵賴乇 胤賱亘賰.

### 3.1 賳賲賵匕噩 丕賱亘賷丕賳丕鬲 鈥?賯爻賲 `payment` 噩丿賷丿 賮賷 `siteContentSchema`

```ts
// src/schemas/site-content.ts 鈥?賷購囟丕賮 賯爻賲 噩丿賷丿 賯亘賱 賳賴丕賷丞 siteContentSchema
export const paymentMethodSchema = z.object({
  id: z.string().default("bank"),          // bank | instapay | vodafone
  label: z.string().default(""),           // "鬲丨賵賷賱 亘賳賰賷 (CIB)" 賲孬賱丕賸
  enabled: z.boolean().default(false),
  // 丨賯賵賱 丕賱丨爻丕亘 鈥?賰賱賴丕 鬲購賲賱兀 賲賳 丕賱兀丿賲賳 賮賯胤
  accountHolder: z.string().default(""),   // 丕爻賲 氐丕丨亘 丕賱丨爻丕亘 / 丕賱亘胤丕賯丞
  bankName: z.string().default(""),        // 丕爻賲 丕賱亘賳賰 (賮丕乇睾 賱睾賷乇 丕賱亘賳賰賷)
  accountNumber: z.string().default(""),   // 乇賯賲 丕賱丌賷亘丕賳 兀賵 乇賯賲 丕賱亘胤丕賯丞/丕賱賲丨賮馗丞
  extra: z.string().default(""),           // 乇丕亘胤 InstaPay 兀賵 兀賷 鬲賮丕氐賷賱 廿囟丕賮賷丞
  instructions: z.string().default(""),    // "丨賵賾賱 丕賱賲亘賱睾 孬賲 丕乇賮毓 氐賵乇丞 丕賱廿賷氐丕賱"
});

// 賷購囟丕賮 廿賱賶 siteContentSchema:
payment: z.object({
  enabled: z.boolean().default(false),          // 丕賱賲賮鬲丕丨 丕賱毓丕賲: false = COD 賮賯胤
  methods: z.array(paymentMethodSchema).default([]),
  codLabel: z.string().default("丕賱丿賮毓 毓賳丿 丕賱丕爻鬲賱丕賲"),
  requireReceipt: z.boolean().default(true),    // 廿賱夭丕賲賷 廿賷氐丕賱 賱胤乇賯 丕賱鬲丨賵賷賱
}).default({ enabled: false, methods: [], codLabel: "丕賱丿賮毓 毓賳丿 丕賱丕爻鬲賱丕賲", requireReceipt: true })
```

- 丕賱丕賮鬲乇丕囟賷 `enabled: false` + `methods: []` 鈬?**丕賱賳馗丕賲 賷毓賲賱 賮賵乇丕賸 亘賭 COD 賯亘賱 兀賳 賷囟亘胤 丕賱兀丿賲賳 兀賷 卮賷亍** (fallback 丌賲賳).
- `model SiteContent.data` 賳賵毓賴丕 `Json` 賮賷 `prisma/schema.prisma` 鉁?鈥?**賱丕 鬲毓丿賷賱 賲胤賱賵亘 賮賷 丕賱賯丕毓丿丞 賵賱丕 `db:push`**.

### 3.2 鬲亘賵賷亘 芦丕賱丿賮毓禄 賮賷 賱賵丨丞 丕賱兀丿賲賳

| # | 丕賱賲賴賲丞 | 丕賱賲賱賮丕鬲 |
| :--- | :--- | :--- |
| P1.1 | 賲賰賵賾賳 `AdminPaymentTab.tsx`: 賯丕卅賲丞 胤乇賯 丿賮毓 賯丕亘賱丞 賱賱鬲賮毓賷賱貙 賱賰賱 胤乇賷賯丞 賳賲賵匕噩 丕賱丨爻丕亘 (丕爻賲 氐丕丨亘 丕賱丨爻丕亘 路 丕爻賲 丕賱亘賳賰 路 乇賯賲 丕賱丌賷亘丕賳/丕賱賰丕乇鬲 路 extra 路 鬲毓賱賷賲丕鬲) + 賲賮鬲丕丨 芦廿賱夭丕賲賷 乇賮毓 廿賷氐丕賱禄 + 丕賱賲賮鬲丕丨 丕賱毓丕賲 | `src/app/admin/AdminPaymentTab.tsx` (噩丿賷丿) |
| P1.2 | 乇亘胤 丕賱鬲亘賵賷亘 賮賷 `AdminDashboard` 鈥?亘賳賮爻 賳賲胤 `TabId` 賵 `AdminProductsTab`/`AdminContentTab` 丨乇賮賷丕賸 | `src/app/admin/AdminDashboard.tsx` |
| P1.3 | 丕賱丨賮馗 毓亘乇 **`PATCH /api/admin/site-content` 丕賱賲賵噩賵丿 賮毓賱丕賸** (賲丨賲賷 亘賭 `isAdminRequest` + `revalidatePath("/")`) | `src/app/api/admin/site-content/route.ts` |
| P1.4 | 廿鬲丕丨丞 `getSiteContent().payment` 賱賱賵丕噩賴丞 丕賱毓丕賲丞 毓亘乇 `GET /api/site-content` + 丕賱賯爻賲 賮賷 `site-content-defaults.ts` | `src/app/api/site-content/route.ts` 路 `src/lib/site-content-defaults.ts` |

### 3.3 賯賵丕毓丿 丕賱兀賲丕賳 (廿賱夭丕賲賷丞)

1. **丕賱賰鬲丕亘丞 賮賷 `payment` 賮賯胤 毓亘乇 賲爻丕乇 丕賱兀丿賲賳** (`isAdminRequest` 鈫?401 亘丿賵賳 賰賵賰賷) 鈥?賱丕 賷賵噩丿 兀賷 API 毓丕賲 賷毓丿賾賱 丕賱丨爻丕亘.
2. **丕賱賯乇丕亍丞 毓丕賲丞 賲賯氐賵丿丞** 鈥?丕賱毓賲賷賱 賷丨鬲丕噩 丕賱乇賯賲 賰丕賲賱丕賸 賱賷丨賵賾賱貨 賱丕 賷賲賰賳 廿禺賮丕丐賴 賵廿賱丕 鬲毓胤賾賱 丕賱鬲丨賵賷賱. 丕賱丨賲丕賷丞 = 睾賷丕亘 兀賷 賲爻丕乇 賰鬲丕亘丞 睾賷乇 賲丨賲賷.
3. **賲賲賳賵毓** 賵囟毓 乇賯賲 丨爻丕亘 賮賷 `.env` 兀賵 賮賷 丕賱賰賵丿 丕賱賲氐丿乇賷 鈥?丕賱賲氐丿乇 丕賱賵丨賷丿 `siteContent.payment`.
4. 兀賷 丨賮馗 賷爻鬲丿毓賷 `revalidatePath("/")` (丕賱賳賲胤 賲賵噩賵丿 兀氐賱丕賸 賮賷 丕賱賲爻丕乇).

**賲毓賷丕乇 丕賱賯亘賵賱 P1:** 丕賱兀丿賲賳 賷購丿禺賱 乇賯賲 亘胤丕賯丞 賲賳 丕賱賱賵丨丞 鈫?賷馗賴乇 賮賷 賳賲賵匕噩 丕賱毓賲賷賱 毓賳丿 丕賱廿鬲賲丕賲 鈫?`PATCH` 亘丿賵賳 噩賱爻丞 兀丿賲賳 = 401.

---

## 4) 丕賱賲乇丨賱丞 P2 鈥?賵丕噩賴丞 丕賱丿賮毓 毓賳丿 丕賱毓賲賷賱 鉁?賲賳賮匕丞 賰賵丿丕賸 (2026-09-28)

**丕賱賴丿賮:** 丿賲噩 丕禺鬲賷丕乇 胤乇賷賯丞 丕賱丿賮毓 賵毓乇囟 亘賷丕賳丕鬲 丨爻丕亘 丕賱兀丿賲賳 賵乇賮毓 丕賱廿賷氐丕賱 賮賷 `CartCheckoutForm`.

| # | 丕賱賲賴賲丞 | 丕賱鬲賮丕氐賷賱 | 丕賱丨丕賱丞 丕賱賮毓賱賷丞 |
| :--- | :--- | :--- | :--- |
| P2.1 | **丨賯賵賱 毓賳賵丕賳 賲賳馗賾賲** | 賲丨丕賮馗丞 (賯丕卅賲丞 27 賲丨丕賮馗丞) + 賲丿賷賳丞 + 卮丕乇毓/毓賲丕乇丞 鈥?鬲購禺夭賻賾賳 `governorate` / `city` / `address` 賮賷 `leadSchema` 亘丿賱 丕賱丕毓鬲賲丕丿 毓賱賶 `notes` 丕賱丨乇賾 | 鉁?`governorates.ts` + 丨賯賵賱 `leadSchema` + `StoredLead` + `prisma Lead` |
| P2.2 | **丕禺鬲賷丕乇 胤乇賷賯丞 丕賱丿賮毓** | radio-cards: 丕賱丿賮毓 毓賳丿 丕賱丕爻鬲賱丕賲 (丿丕卅賲丕賸) + 賰賱 胤乇賷賯丞 `enabled` 賲賳 `siteContent.payment` | 鉁?`CartCheckoutForm.tsx` 賷噩賱亘 `GET /api/site-content` 賵賷賮賱鬲乇 `enabled && accountNumber` |
| P2.3 | **毓乇囟 亘賷丕賳丕鬲 丕賱丨爻丕亘** | 毓賳丿 丕禺鬲賷丕乇 鬲丨賵賷賱: 賰丕乇鬲 賮賷賴 `accountHolder` + `bankName` + `accountNumber` + `instructions` + **夭乇 賳爻禺** 鈥?賰賱 丕賱亘賷丕賳丕鬲 賲賳 丕賱兀丿賲賳 賱丕 賲賳 丕賱賰賵丿 | 鉁?賰丕乇鬲 匕賴亘賷 + `handleCopyAccount` + `extra` |
| P2.4 | **乇賮毓 氐賵乇丞 丕賱廿賷氐丕賱** | 夭乇 乇賮毓 (JPG/PNG/WebP 鈮?5MB) 路 丨賮馗 賮賷 `public/uploads/receipts/` 賲丨賱賷丕賸 + 賲賱丕丨馗丞 氐乇賷丨丞 兀賳 Cloudinary 賲胤賱賵亘 毓賱賶 Vercel (賳購賯賱 廿賱賶 P3.5 賰廿賱夭丕賲賷 賲亘賰乇) | 鉁?`POST /api/leads/receipt` + 賵丕噩賴丞 乇賮毓 賮賷 `CartCheckoutForm` |
| P2.5 | 夭乇 鬲兀賰賷丿 廿囟丕賮賷 | 夭乇 `<a>` 丨賯賷賯賷 芦賵丕鬲爻丕亘 賱鬲兀賰賷丿 丕賱鬲丨賵賷賱禄 丨爻亘 丕鬲賮丕賯賷丕鬲 丕賱賲卮乇賵毓 | 鉁?`buildWhatsAppFallback` + 夭乇 賵丕鬲爻丕亘 毓賳丿 丕賱禺胤兀 (P0.5) |
| P2.6 | 鬲胤亘賷賯 `requireReceipt` | 鬲丨賵賷賱 亘丿賵賳 廿賷氐丕賱 賵丕賱廿賷氐丕賱 廿賱夭丕賲賷 鈫?賲賳毓 丕賱廿乇爻丕賱 亘乇爻丕賱丞 毓乇亘賷丞 賵丕囟丨丞 | 鉁?鬲丨賯賯 賲夭丿賵噩: 賮賷 `CartCheckoutForm` (賯亘賱 丕賱廿乇爻丕賱) 賵賮賷 `POST /api/leads` (賮賷 丕賱爻賷乇賮乇 賲賯丕亘賱 廿毓丿丕丿丕鬲 丕賱兀丿賲賳) |

**丕賱賲賱賮丕鬲:** `src/components/CartCheckoutForm.tsx` (鬲賵爻毓丞) 路 `src/schemas/lead.ts` 路 `src/lib/leads-store.ts` 路 `prisma/schema.prisma` (丨賯賵賱 Lead 丕賱噩丿賷丿丞) 路 `src/lib/governorates.ts` 路 `src/app/api/leads/receipt/route.ts` 路 `src/app/api/leads/route.ts` (鬲丨賯賯 P2).

**賲毓賷丕乇 丕賱賯亘賵賱 P2:** 胤賱亘 鬲丨賵賷賱 亘丿賵賳 廿賷氐丕賱 賷購乇賮囟 路 胤賱亘 COD 賷賲乇 亘丿賵賳 廿賷氐丕賱 路 亘賷丕賳丕鬲 丕賱丨爻丕亘 丕賱賲毓乇賵囟丞 鬲胤丕亘賯 賲丕 兀丿禺賱賴 丕賱兀丿賲賳 丨乇賮賷丕賸.

---

## 5) 丕賱賲乇丨賱丞 P3 鈥?鬲兀賰賷丿 丕賱鬲丨氐賷賱 賲賳 丕賱兀丿賲賳 馃攧 賯賷丿 丕賱鬲賳賮賷匕

**丕賱賴丿賮:** 廿睾賱丕賯 丕賱丿賵乇丞: 丕賱賲丕賱賰 賷鬲兀賰丿 兀賳 丕賱賮賱賵爻 賵氐賱鬲 賮毓賱丕賸 賯亘賱 丕賱鬲噩賴賷夭. **丕賱鬲毓丿賷賱丕鬲 丕賱兀乇亘毓丞 丕賱賲毓鬲賲丿丞 (2026-09-28) 賲丿賲噩丞 賴賳丕 鈥?丕賳馗乇 搂10.**

### 5.1 丨賯賵賱 Lead 丕賱噩丿賷丿丞

```prisma
// prisma/schema.prisma 鈥?丿丕禺賱 model Lead
paymentMethod  String?           // "cod" | "bank" | "instapay" | "vodafone" 鈥?賲賵噩賵丿 賲賳匕 P2
paymentStatus  PaymentStatus @default(UNPAID)  // 鈽?噩丿賷丿 賮賷 P3 鈥?enum 丌賲賳
paidAt         DateTime?         // 鈽?噩丿賷丿 賮賷 P3 鈥?賱丨馗丞 鬲兀賰賷丿 丕賱丕爻鬲賱丕賲
receiptUrl     String?           // 賲賵噩賵丿 賲賳匕 P2
amount         Float?            // 賲賵噩賵丿 賲賳匕 P0.2
governorate    String?           // 賲賵噩賵丿 賲賳匕 P2
city           String?           // 賲賵噩賵丿 賲賳匕 P2
address        String?           // 賲賵噩賵丿 賲賳匕 P2

enum PaymentStatus { UNPAID PENDING_REVIEW PAID REFUNDED }
```

> **賯乇丕乇 P3-鬲1 (enum):** 賳爻鬲禺丿賲 `enum PaymentStatus` 賱丕 `String` 鈥?賷賲賳毓 賯賷賲丕賸 鬲丕賱賮丞 賲孬賱 `"paid "` 亘賲爻丕賮丞. `UNPAID` 賴賵 丕賱丕賮鬲乇丕囟賷 賱賰賱 丕賱胤賱亘丕鬲貙 賵賷購丨賵賻賾賱 廿賱賶 `PENDING_REVIEW` 鬲賱賯丕卅賷丕賸 毓賳丿 丨賮馗 胤賱亘 鬲丨賵賷賱 賲毓 廿賷氐丕賱貙 孬賲 `PAID`/`REFUNDED` 賷丿賵賷丕賸 賲賳 丕賱兀丿賲賳.

+ 鬲賳賮賷匕 `npm run db:push` (賷丿賮毓 P2+P3 賲毓丕賸) + 賳賮爻 丕賱丨賯賵賱 賮賷 `StoredLead` 賵 `leads-store` (賵囟毓 Prisma 賵賵囟毓 JSON 賲毓丕賸 鈥?`paidAt` 賷購丨賮馗 `string | undefined` 賮賷 JSON).

### 5.2 鬲丿賮賯 丕賱丨丕賱丕鬲

```
胤賱亘 噩丿賷丿 鈹€鈹€(COD)鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈻?UNPAID  (賱丕 賷丨鬲丕噩 鬲兀賰賷丿 賲丕賱賷)
胤賱亘 噩丿賷丿 鈹€鈹€(鬲丨賵賷賱 + 廿賷氐丕賱)鈹€鈹€鈻?PENDING_REVIEW 鈹€鈹€(丕賱兀丿賲賳: 芦鬲兀賰賷丿 丕爻鬲賱丕賲 丕賱賲亘賱睾禄)鈹€鈹€鈻?PAID
                                             鈹斺攢鈹€(芦丕賱賲亘賱睾 賱賲 賷氐賱禄)鈹€鈹€鈻?REFUNDED
```

> **鬲賱賯丕卅賷丞 PENDING_REVIEW:** 毓賳丿 `POST /api/leads` 廿匕丕 賰丕賳 `paymentMethod !== "cod"` 賵 `receiptUrl` 賲賵噩賵丿貙 賷購丨賮馗 `paymentStatus = PENDING_REVIEW` 賲亘丕卮乇丞. COD 賷亘賯賶 `UNPAID`. 賱丕 丨丕噩丞 賱鬲丿禺賱 賷丿賵賷 兀賵賱賷.

| # | 丕賱賲賴賲丞 | 丕賱賲賱賮丕鬲 | 丕賱鬲毓丿賷賱 丕賱賲毓鬲賲丿 |
| :--- | :--- | :--- | :--- |
| P3.1 | 卮丕乇丞 `paymentStatus` + 毓乇囟 `amount` 賵氐賵乇丞 丕賱廿賷氐丕賱 + 丕賱毓賳賵丕賳 賮賷 氐賮 賰賱 胤賱亘 | `src/app/admin/AdminDashboard.tsx` | **鬲毓丿賷賱 1 鈥?賰卮賮 丕賱毓賲賶:** 丕賱賱賵丨丞 丕賱丨丕賱賷丞 賱丕 鬲毓乇囟 `amount`/`paymentMethod`/`receiptUrl` 廿胤賱丕賯丕賸 鈥?P3 賷囟賷賮 badge 賲賱賵賾賳 (`UNPAID` 乇賲丕丿賷 路 `PENDING_REVIEW` 匕賴亘賷 賳丕亘囟 路 `PAID` 兀禺囟乇 路 `REFUNDED` 兀丨賲乇) + 丕賱爻毓乇 + thumbnail 丕賱廿賷氐丕賱 + 丕賱毓賳賵丕賳 |
| P3.2 | 兀夭乇丕乇 芦鬲兀賰賷丿 丕賱丕爻鬲賱丕賲禄 / 芦丕賱賲亘賱睾 賱賲 賷氐賱禄 鈫?`PATCH /api/leads/[id]` 亘賭 `paymentStatus` (+ `paidAt` 毓賳丿 丕賱鬲兀賰賷丿) 賲毓 丨賲丕賷丞 `isAdminRequest` | `src/app/api/leads/[id]/route.ts` | `bodySchema` 賷賯亘賱 `paymentStatus` 賮賯胤 賲賳 enum貙 賵 `paidAt` 賷購囟亘胤 鬲賱賯丕卅賷丕賸 賮賷 丕賱爻賷乇賮乇 毓賳丿 `PAID` |
| P3.3 | 毓乇囟 `paymentStatus` 賵 `amount` 賵 `receiptUrl` (廿賳 賵噩丿) 賮賷 氐賮丨丞 丕賱鬲鬲亘毓 賱賱毓賲賷賱 | `src/app/api/orders/track/[code]/route.ts` 路 `src/app/orders/track/OrderTrackResultCard.tsx` | 丕賱毓賲賷賱 賷乇賶 芦賯賷丿 丕賱賲乇丕噩毓丞 / 鬲賲 丕賱鬲兀賰賷丿 / 亘丕賳鬲馗丕乇 丕賱丿賮毓禄 亘丿賵賳 賰卮賮 亘賷丕賳丕鬲 丨爻丕爻丞 |
| P3.4 | 廿卮毓丕乇 丕賱賲丕賱賰 毓賳丿 `PENDING_REVIEW` (毓亘乇 `notifyOwner` 丕賱賯丕卅賲) + 乇爻丕賱丞 賵丕鬲爻丕亘 噩丕賴夭丞 賱賱毓賲賷賱 毓賳丿 `PAID` | `src/lib/notify.ts` | `notifyOwner` 賷購爻鬲丿毓賶 亘賭 `paymentStatus` 丕賱噩丿賷丿丞貨 毓賳丿 `PAID` 賷購亘賳賶 乇丕亘胤 賵丕鬲爻丕亘 賱賱毓賲賷賱 |
| P3.5 | **Cloudinary 賲亘賰乇 賱賱廿賷氐丕賱丕鬲** 鈥?`if (CLOUDINARY_URL) upload : else local` + 鬲賵孬賷賯 賮賷 `.env.example` | `src/app/api/leads/receipt/route.ts` 路 `.env.example` | **鬲毓丿賷賱 2 鈥?Vercel:** `public/uploads` 賱賱賯乇丕亍丞 賮賯胤 毓賱賶 Vercel 賵丕賱廿賷氐丕賱 賷購賮賯丿 亘毓丿 賰賱 deploy 鈥?賳購禺乇噩 Cloudinary 賲賳 P5 丕賱賲丐噩賱丞 廿賱賶 P3 賰廿賱夭丕賲賷 賲亘賰乇 賲毓 fallback 賲丨賱賷 |
| P3.6 | 鬲賳馗賷賮 丕賱廿賷氐丕賱丕鬲 丕賱賷鬲賷賲丞 鈥?cron/route 賷賲爻丨 `receipt-*` 亘賱丕 `Lead` 賲乇亘賵胤 亘毓丿 24 爻丕毓丞 | `src/app/api/cron/cleanup-receipts/route.ts` (噩丿賷丿) 兀賵 `scripts/cleanup-receipts.ts` | **鬲毓丿賷賱 4 鈥?鬲爻乇賷亘 鬲禺夭賷賳:** 乇賮毓 廿賷氐丕賱 孬賲 廿睾賱丕賯 丕賱氐賮丨丞 賷鬲乇賰 賲賱賮丕賸 賱賱兀亘丿 鈥?鬲賳馗賷賮 賷賵賲賷 賷丨賲賷 丕賱賯乇氐 |

**賲毓賷丕乇 丕賱賯亘賵賱 P3:** 胤賱亘 鬲丨賵賷賱 賷馗賴乇 `PENDING_REVIEW` + thumbnail 丕賱廿賷氐丕賱 賮賷 丕賱賱賵丨丞 鈫?芦鬲兀賰賷丿 丕爻鬲賱丕賲 丕賱賲亘賱睾禄 鈫?`PAID` + `paidAt` + 賷馗賴乇 芦鬲賲 鬲兀賰賷丿 丕賱丿賮毓禄 賮賷 氐賮丨丞 丕賱鬲鬲亘毓 路 胤賱亘 COD 賷亘賯賶 `UNPAID` 賵賱丕 賷胤賱亘 鬲兀賰賷丿丕賸 賲丕賱賷丕賸.

---

## 6) 丕賱賲乇丨賱丞 P4 鈥?丕賱兀賲丕賳 賵丕賱丕禺鬲亘丕乇丕鬲

| # | 丕賱亘賳丿 | 丕賱鬲賮丕氐賷賱 | 丕賱丨丕賱丞 |
| :--- | :--- | :--- | :--- |
| P4.1 | 丕禺鬲亘丕乇丕鬲 `test/schemas.test.ts` | `items` 丕賱噩丿賷丿丞 路 丕賱毓賳賵丕賳 路 `paymentMethod` 路 乇賮囟 賲亘賱睾 賲夭賵賾乇 路 賯爻賲 `payment` 亘兀賯爻丕賲 賲毓胤賾賱丞/賲賮毓賾賱丞 | 鈴?賲鬲亘賯賷 鈥?P2 兀囟丕賮 丕賱丨賯賵賱 賱賰賳 丕賱丕禺鬲亘丕乇丕鬲 賱賲 鬲購賰鬲亘 亘毓丿 |
| P4.2 | 丕禺鬲亘丕乇 `paymentStatus` | `PATCH /api/leads/[id]` 亘丿賵賳 噩賱爻丞 = 401 路 賲毓 噩賱爻丞 賷賯亘賱 賯賷賲丕賸 賲賳 enum 賮賯胤 路 `PENDING_REVIEW` 鬲賱賯丕卅賷 毓賳丿 鬲丨賵賷賱 賲毓 廿賷氐丕賱 | 鈴?囟賲賳 P3.2 |
| P4.3 | rate limit 禺丕氐 賱乇賮毓 丕賱廿賷氐丕賱丕鬲 (3/丿賯賷賯丞/IP) | `src/lib/rate-limit.ts` 鈥?賳賮爻 賳賲胤 `leads` | 鉁?兀購賳噩夭 賲亘賰乇丕賸 賮賷 P2 (`receipt/route.ts:32`) |
| P4.4 | 賮丨氐 丨噩賲 賵賳賵毓 丕賱賲賱賮 賯亘賱 丕賱丨賮馗 (氐賵乇 賮賯胤 鈮?5MB) | 賷賲賳毓 乇賮毓 兀賷 賲賱賮 鬲賳賮賷匕賷 | 鉁?兀購賳噩夭 賲亘賰乇丕賸 賮賷 P2 (`receipt/route.ts:55-69`) |
| P4.5 | 丕賱鬲丨賯賯 丕賱賰丕賲賱 | `npm test` 路 `npx tsc --noEmit` 路 `npm run lint` 路 `npm run build` | 鈴?賲毓 廿睾賱丕賯 P3 |
| P4.6 | 鬲賳馗賷賮 丕賱廿賷氐丕賱丕鬲 丕賱賷鬲賷賲丞 (噩丿賷丿) | 丕賳馗乇 P3.6 | 鈴?賲毓 P3.6 |

---

## 7) 丕賱賲乇丨賱丞 P5 鈥?賲丐噩賱丞 (禺丕乇噩 賳胤丕賯 賴匕賴 丕賱禺胤丞)

- **亘賵丕亘丞 丿賮毓 廿賱賰鬲乇賵賳賷丞 (Paymob / Fawry / Kashier):** 鬲購囟丕賮 賰胤乇賷賯丞 丿賮毓 噩丿賷丿丞 賮賷 `siteContent.payment` 鈥?賲賮丕鬲賷丨 丕賱賭 API 鬲購丿禺賱 賲賳 **賳賮爻 鬲亘賵賷亘 丕賱兀丿賲賳** 賱丕 賲賳 `.env` 路 webhook route 路 賲胤丕亘賯丞 丕賱賲亘賱睾 賮賷 丕賱爻賷乇賮乇.
- ~~**Cloudinary 賱賱廿賷氐丕賱丕鬲** (廿賱夭丕賲賷 毓賱賶 Vercel 賱兀賳 賳馗丕賲 丕賱賲賱賮丕鬲 賯乇丕亍丞 賮賯胤 鈥?賲賵孬賾賯 賮賷 `.env.example`).~~ **鈫?賳購賯賱 廿賱賶 P3.5 賰廿賱夭丕賲賷 賲亘賰乇 (鬲毓丿賷賱 2).**
- 丕禺鬲亘丕乇丕鬲 Playwright E2E: 爻賱丞 鈫?丿賮毓 鈫?廿賷氐丕賱 鈫?鬲兀賰賷丿 丕賱兀丿賲賳.

---

## 8) 賯乇丕乇丕鬲 賲胤賱賵亘丞 賲賳 氐丕丨亘 丕賱賲鬲噩乇 (Blockers)

1. **胤乇賯 丕賱丿賮毓 丕賱賲胤賱賵亘丞 賮毓賱賷丕賸:** 鬲丨賵賷賱 亘賳賰賷/丌賷亘丕賳責 賮賵丿丕賮賵賳 賰丕卮責 InstaPay責 鈥?鬲購賮毓賻賾賱 賲賳 鬲亘賵賷亘 丕賱兀丿賲賳 亘毓丿 鬲賳賮賷匕 P1.
2. 賴賱 丕賱丿賮毓 毓賳丿 丕賱丕爻鬲賱丕賲 賲鬲丕丨 賱賰賱 丕賱賲丨丕賮馗丕鬲 兀賲 亘毓囟賴丕 賮賯胤責
3. **乇爻賵賲 丕賱卮丨賳:** 賲噩丕賳賷 兀賲 丨爻亘 丕賱賲丨丕賮馗丞責 (噩丿賵賱 乇爻賵賲 亘爻賷胤 丿丕禺賱 `siteContent.payment` 賷購囟丕賮 賱賭 P2 毓賳丿 丕賱丨丕噩丞).
4. **乇賯賲 丕賱丌賷亘丕賳/丕賱亘胤丕賯丞 丕賱丨賯賷賯賷 鈥?賷購丿禺賱賴 丕賱兀丿賲賳 賲賳 丕賱賱賵丨丞 亘毓丿 丕賱賳卮乇貙 賵賱丕 賷購賰鬲亘 賴賳丕 兀亘丿丕賸.**

---

## 9) 鬲乇鬲賷亘 丕賱鬲賳賮賷匕

```
P0 (廿氐賱丕丨丕鬲 丨乇噩丞 鈥?兀賵賱丕賸) 鉁? 鈹斺攢鈻?P1 (丕賱兀丿賲賳 賷囟亘胤 丨爻丕亘 丕賱鬲丨氐賷賱 鈥?噩賵賴乇 胤賱亘賰 猸? 鉁?      鈹斺攢鈻?P2 (賵丕噩賴丞 丕賱毓賲賷賱: 胤乇賷賯丞 丿賮毓 + 毓乇囟 丕賱丨爻丕亘 + 廿賷氐丕賱) 鉁?賰賵丿丕賸
           鈹斺攢鈻?P3 (鬲兀賰賷丿 丕賱丕爻鬲賱丕賲 賲賳 丕賱賱賵丨丞 + Cloudinary 賲亘賰乇 + 鬲賳馗賷賮) 馃攧 丕賱丌賳
                鈹斺攢鈻?P4 (丕禺鬲亘丕乇丕鬲 賵賯賮賱) 鈴?                     鈹斺攢鈻?P5 (亘賵丕亘丞 丿賮毓 鈥?賲鬲賶 鬲購胤賱亘) 鈴?賲丐噩賱丞
```

> 賰賱 賲乇丨賱丞 鬲購爻賱賻賾賲 賲毓: `npm test` 兀禺囟乇 路 `tsc --noEmit` 兀禺囟乇 路 `lint` 兀禺囟乇 路 `build` 賳丕噩丨 鈥?賵丕賱鬲丨賯賯 丕賱丨賷 賷購爻噩賻賾賱 賮賷 爻噩賱 丕賱鬲賳賮賷匕 兀毓賱丕賴.

---

## 10) 丕賱鬲毓丿賷賱丕鬲 丕賱賲毓鬲賲丿丞 賯亘賱 P3 (2026-09-28) 鈥?賲乇丕噩毓丞 丕賱禺胤丞

> 賴匕賴 丕賱鬲毓丿賷賱丕鬲 兀購賯乇鬲 亘毓丿 丕賰鬲卮丕賮 兀賳 P2 賲賳賮匕丞 賰賵丿丕賸 賱賰賳賴丕 睾賷乇 賲賵孬賯丞貙 賵兀賳 P3 賰丕賳 爻賷購爻賱賻賾賲 亘賱賵丨丞 毓賲賷丕亍.

| # | 丕賱鬲毓丿賷賱 | 丕賱爻亘亘 | 丕賱兀孬乇 毓賱賶 丕賱禺胤丞 |
| :--- | :--- | :--- | :--- |
| **鬲1** | **廿囟丕賮丞 `PaymentStatus` 賰賭 `enum` 賱丕 `String`** 鈥?`UNPAID`/`PENDING_REVIEW`/`PAID`/`REFUNDED` + `paidAt` | 賷賲賳毓 賯賷賲丕賸 鬲丕賱賮丞 賵賷噩毓賱 丕賱賮賱鬲乇丞 賵丕賱鬲賱賵賷賳 賮賷 丕賱賱賵丨丞 丌賲賳丞 | 搂5.1 賷購孬亘鬲 丕賱賭 enum貨 `PATCH /api/leads/[id]` 賷鬲丨賯賯 亘賭 `z.enum(...)`貨 `POST /api/leads` 賷囟亘胤 `PENDING_REVIEW` 鬲賱賯丕卅賷丕賸 |
| **鬲2** | **鬲賯丿賷賲 Cloudinary 賲賳 P5 廿賱賶 P3.5** 鈥?`if (CLOUDINARY_URL) cloudinary : local` 賲毓 fallback | `public/uploads` 賱賱賯乇丕亍丞 賮賯胤 毓賱賶 Vercel 鈥?兀賷 廿賷氐丕賱 賲乇賮賵毓 毓賱賶 丕賱廿賳鬲丕噩 賷購賮賯丿 賮賵乇丕賸 | P3.5 噩丿賷丿貨 `.env.example` 賷賵孬賯 丕賱賲鬲睾賷乇貨 `receipt/route.ts` 賷丿毓賲 丕賱賲爻丕乇賷賳 |
| **鬲3** | **賰卮賮 賱賵丨丞 丕賱兀丿賲賳 (Admin blind fix)** 鈥?badge 丨丕賱丞 丕賱丿賮毓 + 丕賱賲亘賱睾 + thumbnail 丕賱廿賷氐丕賱 + 丕賱毓賳賵丕賳 賮賷 賰賱 氐賮 | 亘丿賵賳賴丕 丕賱兀丿賲賳 賱丕 賷乇賶 兀賳 丕賱毓賲賷賱 丨賵賾賱 兀氐賱丕賸 | P3.1 賷睾胤賷賴丕貨 賲毓賷丕乇 賯亘賵賱 P3 賷鬲胤賱亘 乇丐賷丞 丕賱廿賷氐丕賱 賯亘賱 丕賱鬲兀賰賷丿 |
| **鬲4** | **鬲賳馗賷賮 丕賱廿賷氐丕賱丕鬲 丕賱賷鬲賷賲丞** 鈥?賲賱賮丕鬲 `receipt-*` 亘賱丕 `Lead` 亘毓丿 24 爻丕毓丞 | 乇賮毓 廿賷氐丕賱 孬賲 廿睾賱丕賯 丕賱氐賮丨丞 賷鬲乇賰 賲賱賮丕賸 賱賱兀亘丿 賵賷賲賱兀 丕賱賯乇氐 | P3.6 噩丿賷丿貨 cron 賷賵賲賷 兀賵 route 賲丨賲賷 亘賭 `CRON_SECRET` |

> 賱丕 鬲毓丿賷賱 毓賱賶 丕賱賲亘丿兀 丕賱丨丕賰賲 (搂3.3) 賵賱丕 毓賱賶 fallback COD 丕賱丌賲賳 鈥?丕賱鬲毓丿賷賱丕鬲 廿囟丕賮丕鬲 鬲賳賮賷匕賷丞 賮賯胤.


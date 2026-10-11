# ⚡ Zaiqa Royal Bistro - Executive Admin Operations Portal

A completely separate, standalone Admin Command Center for **Zaiqa Royal Bistro & Grill**.

Built independently in `c:\Users\HP\admin portal` without modifying or bundling into the customer-facing frontend.

---

## 🌟 Key Features

### 1. 📦 Live Order Management & Status Changer
- **Real-time Supabase Sync:** Automatically pulls orders from the `orders` table.
- **Supabase Realtime WebSockets:** Automatically plays an audio chime and displays a toast whenever a customer places an order on the website.
- **One-Click Status Changer:** 
  - Change status from `Pending` ➔ `Preparing` ➔ `Delivered`.
  - Dropdown or quick action buttons with immediate Supabase `PATCH` update and optimistic rollback.
- **Customer Quick-Connect:** One-click WhatsApp message generator with pre-filled status details + direct phone call button.
- **Printable Kitchen Order Ticket (KOT):** Formatted receipt ready for thermal printing or kitchen staff.

### 2. 🍽️ Menu Items Catalog & Add New Items
- **Add New Dishes:** Item name, category, price in PKR, image with quick visual presets, preparation time, description, and tags (Bestseller, Spicy, In Stock).
- **Edit & Delete:** Update prices, descriptions, or remove dishes.
- **Stock Availability Switch:** Toggle dishes `In Stock` / `Out of Stock` with one click.
- **Cloud Database Ready:** Includes `supabase_menu_items_setup.sql` to sync menu items across all cloud devices.

### 3. 📊 Executive Analytics & KPI Cards
- Live Gross Revenue calculation in PKR
- Order Status distribution pipeline (Pending vs Preparing vs Delivered)
- Average Order Value (AOV)

---

## 🚀 How to Run

1. Open PowerShell or Command Prompt in this folder:
   ```bash
   npm run dev
   ```
2. Open your browser at:
   ```
   http://localhost:5174
   ```

---

## 🗄️ Supabase Connection Details
- **Project URL:** `https://kpdcqcdrtoagkqiamyux.supabase.co`
- **Orders Table:** `public.orders` (Fully live and connected)
- **Menu Items Table:** Run `supabase_menu_items_setup.sql` in your [Supabase SQL Editor](https://supabase.com/dashboard/project/kpdcqcdrtoagkqiamyux/sql) to enable multi-device cloud storage for custom menu items.


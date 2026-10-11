import { createClient } from '@supabase/supabase-js'

export const DEFAULT_SUPABASE_URL = 'https://kpdcqcdrtoagkqiamyux.supabase.co'
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZGNxY2RydG9hZ2txaWFteXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1OTk2NDQsImV4cCI6MjEwNzE3NTY0NH0.zZR_LKTO7GOL7A6gcMTcT-GMfq_jqk0CiApiT_Wlvm4'

export function getSupabaseConfig() {
  const url = localStorage.getItem('zaiqa_admin_sb_url') || DEFAULT_SUPABASE_URL
  const key = localStorage.getItem('zaiqa_admin_sb_key') || DEFAULT_SUPABASE_ANON_KEY
  return { url, key }
}

export function createSupabaseInstance() {
  const { url, key } = getSupabaseConfig()
  return createClient(url, key)
}

export let supabase = createSupabaseInstance()

export function refreshSupabaseClient() {
  supabase = createSupabaseInstance()
  return supabase
}

// Initial fallback menu dishes if Supabase table is not yet created
export const INITIAL_MENU_ITEMS = [
  {
    id: 1,
    name: "Mutton Shinwari Karahi",
    category: "Karahi & Handi",
    price: 1850,
    prep_time: "25 mins",
    is_bestseller: true,
    is_spicy: true,
    is_available: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    description: "Tender, juicy mutton braised in fresh tomatoes, organic green chilies, and pure animal tallow cooked on a roaring charcoal wok."
  },
  {
    id: 2,
    name: "Dum Pukht Royal Biryani",
    category: "Rice Specialties",
    price: 850,
    prep_time: "20 mins",
    is_bestseller: true,
    is_spicy: false,
    is_available: true,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    description: "Fragrant long-grain aged basmati rice layered with succulent saffron chicken, caramelized onions, and slow-cooked sealed in dough."
  },
  {
    id: 3,
    name: "Chicken Makhani Handi",
    category: "Karahi & Handi",
    price: 1350,
    prep_time: "22 mins",
    is_bestseller: true,
    is_spicy: false,
    is_available: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
    description: "Boneless chicken cubes simmered in velvety butter cream tomato gravy, spiced with freshly roasted fenugreek leaves."
  },
  {
    id: 4,
    name: "Smoky Charcoal Reshmi Kebab",
    category: "BBQ & Grills",
    price: 950,
    prep_time: "18 mins",
    is_bestseller: false,
    is_spicy: false,
    is_available: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80",
    description: "Melt-in-mouth chicken skewers marinated overnight in cashew cream, white pepper, royal cumin, and served with mint raita."
  },
  {
    id: 5,
    name: "Seekh Kebab Malai Roll",
    category: "BBQ & Grills",
    price: 480,
    prep_time: "12 mins",
    is_bestseller: true,
    is_spicy: true,
    is_available: true,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    description: "Flame-grilled spicy beef seekh kebab rolled in crispy layered puri paratha with zesty onion salad and garlic aioli."
  },
  {
    id: 6,
    name: "Truffle Beef Smashed Burger",
    category: "Fast Food",
    price: 920,
    prep_time: "15 mins",
    is_bestseller: true,
    is_spicy: false,
    is_available: true,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    description: "Double smashed prime Angus beef patties, molten cheddar cheese, caramelized balsamic shallots, and house truffle aioli in a brioche bun."
  },
  {
    id: 7,
    name: "Peri Peri Charcoal Wings",
    category: "Fast Food",
    price: 680,
    prep_time: "15 mins",
    is_bestseller: false,
    is_spicy: true,
    is_available: true,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    description: "Charcoal-smoked jumbo chicken wings tossed in fiery African bird's eye chili glaze, served with creamy ranch dip."
  },
  {
    id: 8,
    name: "Molten Lava Chocolate Cake",
    category: "Desserts",
    price: 550,
    prep_time: "12 mins",
    is_bestseller: true,
    is_spicy: false,
    is_available: true,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    description: "Warm Belgian dark chocolate cake with a gooey flowing molten center, served with a scoop of Madagascar vanilla gelato."
  }
]

// ================= ORDERS API =================

export async function fetchOrders() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching orders:', error)
      return { success: false, error: error.message, data: [] }
    }
    
    // Clean start: Filter out cleared/archived test orders
    const activeOrders = (data || []).filter(order => !order.notes?.includes('__ARCHIVED__'))
    return { success: true, data: activeOrders }
  } catch (err) {
    console.error('Fetch orders exception:', err)
    return { success: false, error: err.message, data: [] }
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select()

    if (error) {
      console.error('Error updating order status:', error)
      return { success: false, error: error.message }
    }
    return { success: true, data: data?.[0] }
  } catch (err) {
    console.error('Update order status exception:', err)
    return { success: false, error: err.message }
  }
}

export async function deleteOrder(orderId) {
  try {
    // 1. Attempt direct delete
    await supabase
      .from('orders')
      .delete()
      .eq('id', orderId)

    // 2. Mark archived in Supabase so it remains permanently deleted across all devices
    await supabase
      .from('orders')
      .update({ notes: '__ARCHIVED__' })
      .eq('id', orderId)

    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export async function clearAllOrders() {
  try {
    // 1. Attempt bulk delete
    await supabase.from('orders').delete().neq('id', 0)

    // 2. Mark all currently active orders as archived in Supabase
    const { data } = await supabase.from('orders').select('id, notes')
    if (data && data.length > 0) {
      const activeIds = data
        .filter(o => !o.notes?.includes('__ARCHIVED__'))
        .map(o => o.id)

      if (activeIds.length > 0) {
        await supabase
          .from('orders')
          .update({ notes: '__ARCHIVED__' })
          .in('id', activeIds)
      }
    }
    return { success: true }
  } catch (err) {
    console.error('Clear all orders error:', err)
    return { success: false, error: err.message }
  }
}

// ================= MENU ITEMS API =================

const LOCAL_STORAGE_ITEMS_KEY = 'zaiqa_admin_local_menu_items'

export function getLocalMenuItems() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_ITEMS_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error(e)
  }
  localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(INITIAL_MENU_ITEMS))
  return INITIAL_MENU_ITEMS
}

export function saveLocalMenuItems(items) {
  localStorage.setItem(LOCAL_STORAGE_ITEMS_KEY, JSON.stringify(items))
}

export async function fetchMenuItems() {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      // Table does not exist in Supabase yet (PGRST205 or similar)
      const local = getLocalMenuItems()
      return { success: true, fromSupabase: false, data: local, notice: error.message }
    }
    return { success: true, fromSupabase: true, data: data || [] }
  } catch (err) {
    const local = getLocalMenuItems()
    return { success: true, fromSupabase: false, data: local, notice: err.message }
  }
}

export async function addMenuItem(item) {
  const payload = {
    name: item.name.trim(),
    category: item.category || 'Specialties',
    price: Number(item.price),
    description: item.description || '',
    image: item.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    prep_time: item.prep_time || '20 mins',
    is_bestseller: Boolean(item.is_bestseller),
    is_spicy: Boolean(item.is_spicy),
    is_available: item.is_available !== undefined ? Boolean(item.is_available) : true,
    rating: Number(item.rating || 5.0)
  }

  // Attempt Supabase insert
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([payload])
      .select()

    if (!error && data && data.length > 0) {
      return { success: true, fromSupabase: true, data: data[0] }
    }
  } catch (e) {
    console.warn('Supabase insert failed, saving to local store:', e)
  }

  // Fallback to local storage
  const localList = getLocalMenuItems()
  const newLocalItem = {
    ...payload,
    id: Date.now(),
    created_at: new Date().toISOString()
  }
  const updated = [newLocalItem, ...localList]
  saveLocalMenuItems(updated)
  return { success: true, fromSupabase: false, data: newLocalItem }
}

export async function updateMenuItem(id, updates) {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update(updates)
      .eq('id', id)
      .select()

    if (!error && data && data.length > 0) {
      return { success: true, fromSupabase: true, data: data[0] }
    }
  } catch (e) {
    console.warn('Supabase update failed, fallback to local:', e)
  }

  // Fallback local update
  const localList = getLocalMenuItems()
  const updated = localList.map(item => (item.id === id ? { ...item, ...updates } : item))
  saveLocalMenuItems(updated)
  const found = updated.find(i => i.id === id)
  return { success: true, fromSupabase: false, data: found }
}

export async function deleteMenuItem(id) {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (!error) {
      return { success: true, fromSupabase: true }
    }
  } catch (e) {
    console.warn('Supabase delete failed, fallback to local:', e)
  }

  const localList = getLocalMenuItems()
  const filtered = localList.filter(item => item.id !== id)
  saveLocalMenuItems(filtered)
  return { success: true, fromSupabase: false }
}


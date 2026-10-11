import React, { useState, useEffect, useCallback, useRef } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import StatsCards from './components/StatsCards'
import OrdersView from './components/OrdersView'
import ItemsCatalogView from './components/ItemsCatalogView'
import AnalyticsView from './components/AnalyticsView'
import OrderDetailsModal from './components/OrderDetailsModal'
import ReceiptModal from './components/ReceiptModal'
import ItemModal from './components/ItemModal'
import SettingsModal from './components/SettingsModal'
import Login from './components/Login'
import Toast from './components/Toast'

import { 
  fetchOrders, 
  updateOrderStatus, 
  deleteOrder, 
  clearAllOrders,
  fetchMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem,
  supabase 
} from './lib/supabase'
import { playOrderNotificationSound } from './lib/sound'

export default function App() {
  // Auth session state
  const [session, setSession] = useState(() => {
    try {
      const stored = localStorage.getItem('zaiqa_admin_session') || sessionStorage.getItem('zaiqa_admin_session')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [activeTab, setActiveTab] = useState('orders')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [orders, setOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [itemsFromSupabase, setItemsFromSupabase] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isUpdatingId, setIsUpdatingId] = useState(null)
  
  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('zaiqa_sound_pref') !== 'false'
  })

  // Modals state
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null)
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState(null)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  // Toast feedback
  const [toast, setToast] = useState(null)

  // Track previous orders to detect new incoming ones
  const prevOrdersCountRef = useRef(0)

  const showToast = (message, type = 'success', title = '') => {
    setToast({ message, type, title })
  }

  // Handle Logout
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out of the Admin Portal?')) {
      localStorage.removeItem('zaiqa_admin_session')
      sessionStorage.removeItem('zaiqa_admin_session')
      setSession(null)
      showToast('Logged out of Admin Portal.', 'info', 'Session Ended')
    }
  }

  // Persist sound preference
  useEffect(() => {
    localStorage.setItem('zaiqa_sound_pref', soundEnabled ? 'true' : 'false')
  }, [soundEnabled])

  // Load all data
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true)

    try {
      // 1. Fetch Orders from Supabase
      const ordersRes = await fetchOrders()
      if (ordersRes.success) {
        setOrders(ordersRes.data)
        
        // If new order arrived
        if (ordersRes.data.length > prevOrdersCountRef.current && prevOrdersCountRef.current > 0) {
          if (soundEnabled) playOrderNotificationSound()
          const newest = ordersRes.data[0]
          showToast(`New incoming order from ${newest.customer_name || 'Customer'}!`, 'info', 'New Order 🔔')
        }
        prevOrdersCountRef.current = ordersRes.data.length
      } else {
        if (!isSilent) showToast(ordersRes.error, 'error', 'Supabase Sync')
      }

      // 2. Fetch Menu Items
      const itemsRes = await fetchMenuItems()
      if (itemsRes.success) {
        setMenuItems(itemsRes.data)
        setItemsFromSupabase(itemsRes.fromSupabase)
      }
    } catch (err) {
      console.error(err)
    } finally {
      if (!isSilent) setIsRefreshing(false)
    }
  }, [soundEnabled])

  // Initial load & Polling safety interval
  useEffect(() => {
    if (!session) return

    loadData()

    // Safety polling every 20 seconds
    const interval = setInterval(() => {
      loadData(true)
    }, 20000)

    return () => clearInterval(interval)
  }, [session, loadData])

  // Realtime Supabase Subscription
  useEffect(() => {
    if (!session) return

    try {
      const channel = supabase
        .channel('admin-orders-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders' },
          (payload) => {
            console.log('Realtime orders change received:', payload)
            if (payload.eventType === 'INSERT') {
              if (!payload.new.notes?.includes('__ARCHIVED__')) {
                setOrders(prev => [payload.new, ...prev.filter(o => o.id !== payload.new.id)])
                if (soundEnabled) playOrderNotificationSound()
                showToast(`New order #${payload.new.id} received!`, 'info', 'New Order Live ⚡')
              }
            } else if (payload.eventType === 'UPDATE') {
              if (payload.new.notes?.includes('__ARCHIVED__')) {
                setOrders(prev => prev.filter(o => o.id !== payload.new.id))
              } else {
                setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o))
              }
            } else if (payload.eventType === 'DELETE') {
              setOrders(prev => prev.filter(o => o.id !== payload.old.id))
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    } catch (err) {
      console.warn('Realtime subscription warning:', err)
    }
  }, [session, soundEnabled])

  // Handle Order Status Update
  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsUpdatingId(orderId)

    // Optimistic UI update
    const prevOrders = [...orders]
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    
    // Also update modal if open
    if (selectedOrderForModal && selectedOrderForModal.id === orderId) {
      setSelectedOrderForModal(prev => ({ ...prev, status: newStatus }))
    }

    try {
      const result = await updateOrderStatus(orderId, newStatus)
      if (result.success) {
        showToast(`Order #${orderId} marked as "${newStatus}"!`, 'success', 'Status Updated')
      } else {
        setOrders(prevOrders)
        showToast(result.error || 'Failed to update status on Supabase', 'error', 'Update Failed')
      }
    } catch (err) {
      setOrders(prevOrders)
      showToast(err.message, 'error', 'Update Failed')
    } finally {
      setIsUpdatingId(null)
    }
  }

  // Handle Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete Order #${orderId}?`)) return

    const prevOrders = [...orders]
    setOrders(prev => prev.filter(o => o.id !== orderId))

    try {
      const res = await deleteOrder(orderId)
      if (res.success) {
        showToast(`Order #${orderId} deleted successfully.`, 'info')
      } else {
        setOrders(prevOrders)
        showToast(res.error, 'error')
      }
    } catch (e) {
      setOrders(prevOrders)
      showToast(e.message, 'error')
    }
  }

  // Handle Clear / Reset All Orders (Fresh Start)
  const handleClearAllOrders = async () => {
    if (!window.confirm('Reset Admin Portal? This will clear all existing orders so you can start taking orders fresh from scratch.')) {
      return
    }

    const prevOrders = [...orders]
    setOrders([])

    try {
      const res = await clearAllOrders()
      if (res.success) {
        showToast('All orders cleared! Admin Portal & Analytics reset to 0.', 'success', 'Fresh Start Ready 🚀')
      } else {
        setOrders(prevOrders)
        showToast(res.error || 'Failed to clear orders', 'error')
      }
    } catch (e) {
      setOrders(prevOrders)
      showToast(e.message, 'error')
    }
  }

  // Handle Save (Add or Edit) Menu Item
  const handleSaveItem = async (itemData) => {
    if (editingItem) {
      const res = await updateMenuItem(editingItem.id, itemData)
      if (res.success) {
        setMenuItems(prev => prev.map(i => i.id === editingItem.id ? res.data : i))
        showToast(`"${itemData.name}" updated successfully!`, 'success', 'Dish Updated')
      } else {
        showToast('Failed to update dish', 'error')
      }
    } else {
      const res = await addMenuItem(itemData)
      if (res.success) {
        setMenuItems(prev => [res.data, ...prev])
        showToast(`"${itemData.name}" added to menu!`, 'success', 'New Dish Added 🎉')
      } else {
        showToast('Failed to add dish', 'error')
      }
    }
    setEditingItem(null)
  }

  // Handle Delete Menu Item
  const handleDeleteItem = async (itemId) => {
    const item = menuItems.find(i => i.id === itemId)
    if (!window.confirm(`Delete dish "${item?.name || 'this item'}" from the menu?`)) return

    const prevItems = [...menuItems]
    setMenuItems(prev => prev.filter(i => i.id !== itemId))

    try {
      const res = await deleteMenuItem(itemId)
      if (res.success) {
        showToast('Dish removed from menu.', 'info')
      } else {
        setMenuItems(prevItems)
        showToast('Failed to delete dish', 'error')
      }
    } catch (e) {
      setMenuItems(prevItems)
      showToast(e.message, 'error')
    }
  }

  // Handle Toggle Availability
  const handleToggleAvailability = async (itemId, isAvailable) => {
    setMenuItems(prev => prev.map(i => i.id === itemId ? { ...i, is_available: isAvailable } : i))
    
    const res = await updateMenuItem(itemId, { is_available: isAvailable })
    if (res.success) {
      showToast(isAvailable ? 'Dish marked In Stock' : 'Dish marked Out of Stock', 'info')
    }
  }

  // If user is not logged in, render the Login screen
  if (!session) {
    return (
      <>
        <Login 
          onLoginSuccess={(newSession) => {
            setSession(newSession)
            showToast('Welcome to Zaiqa Lounge Admin Portal!', 'success', 'Logged In')
          }} 
        />
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#070B14] text-white font-sans antialiased selection:bg-orange-500 selection:text-white">
      
      {/* Left Sidebar matching screenshot */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ordersCount={orders.length}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#070B14]">
        
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onRefresh={() => loadData(false)}
          isRefreshing={isRefreshing}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          userEmail={session.email || 'admin@zaiqa.com'}
          onToggleSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Dynamic Views Container */}
        <div className="p-4 sm:p-8 space-y-6 flex-1">
          
          {/* TAB 1: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <>
              {/* 4 Stat Summary Cards matching screenshot */}
              <StatsCards orders={orders} />

              {/* Orders Table & Filters */}
              <OrdersView
                orders={orders}
                onUpdateStatus={handleUpdateStatus}
                onDeleteOrder={handleDeleteOrder}
                onClearAllOrders={handleClearAllOrders}
                onViewOrder={(order) => setSelectedOrderForModal(order)}
                onPrintOrder={(order) => setSelectedOrderForReceipt(order)}
                isUpdatingId={isUpdatingId}
              />
            </>
          )}

          {/* TAB 2: MENU ITEMS CATALOG */}
          {activeTab === 'items' && (
            <ItemsCatalogView
              menuItems={menuItems}
              onAddNew={() => {
                setEditingItem(null)
                setIsItemModalOpen(true)
              }}
              onEdit={(dish) => {
                setEditingItem(dish)
                setIsItemModalOpen(true)
              }}
              onDelete={handleDeleteItem}
              onToggleAvailability={handleToggleAvailability}
              fromSupabase={itemsFromSupabase}
              onOpenSqlModal={() => {}}
            />
          )}

          {/* TAB 3: ANALYTICS */}
          {activeTab === 'analytics' && (
            <AnalyticsView orders={orders} menuItems={menuItems} />
          )}

        </div>

      </main>

      {/* Modals */}
      <OrderDetailsModal
        order={selectedOrderForModal}
        isOpen={Boolean(selectedOrderForModal)}
        onClose={() => setSelectedOrderForModal(null)}
        onUpdateStatus={handleUpdateStatus}
        onPrint={(order) => {
          setSelectedOrderForModal(null)
          setSelectedOrderForReceipt(order)
        }}
        isUpdating={Boolean(isUpdatingId)}
      />

      <ReceiptModal
        order={selectedOrderForReceipt}
        isOpen={Boolean(selectedOrderForReceipt)}
        onClose={() => setSelectedOrderForReceipt(null)}
      />

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onConfigSaved={() => loadData(false)}
      />

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  )
}

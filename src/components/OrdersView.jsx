import React, { useState } from 'react'
import { 
  Search, 
  Phone, 
  MessageCircle, 
  Eye, 
  Printer, 
  Trash2, 
  ChevronDown,
  MapPin,
  Clock
} from 'lucide-react'

export default function OrdersView({ 
  orders = [], 
  onUpdateStatus, 
  onDeleteOrder, 
  onClearAllOrders,
  onViewOrder,
  onPrintOrder,
  isUpdatingId 
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Filter logic
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'All' && order.status !== statusFilter) {
      return false
    }

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase()
      const name = (order.customer_name || '').toLowerCase()
      const phone = (order.phone || '').toLowerCase()
      const id = String(order.id || '').toLowerCase()
      const address = (order.address || '').toLowerCase()
      const dishes = (order.dishes || '').toLowerCase()

      return (
        name.includes(q) ||
        phone.includes(q) ||
        id.includes(q) ||
        address.includes(q) ||
        dishes.includes(q)
      )
    }

    return true
  }).sort((a, b) => {
    const timeA = new Date(a.created_at || a.id).getTime() || 0
    const timeB = new Date(b.created_at || b.id).getTime() || 0
    return timeB - timeA // newest first
  })

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now'
    try {
      const d = new Date(dateStr)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  // WhatsApp link generator
  const getWhatsAppLink = (phone, order) => {
    if (!phone) return '#'
    let clean = phone.replace(/\D/g, '')
    if (clean.startsWith('0')) {
      clean = '92' + clean.slice(1)
    }
    const message = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customer_name || 'Customer'}! 🍽️\nThis is Zaiqa Lounge regarding your Order #${order.id}.\nCurrent Status: *${order.status}*\nTotal: Rs. ${order.total_amount}\nThank you!`
    )
    return `https://wa.me/${clean}?text=${message}`
  }

  const statuses = ['All', 'Pending', 'Preparing', 'Delivered']

  return (
    <div className="space-y-6">
      
      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === status
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'bg-[#0B0F19] text-gray-400 hover:text-white border border-gray-800 hover:bg-gray-800/60'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Action Controls & Search Input */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onClearAllOrders && orders.length > 0 && (
            <button
              onClick={onClearAllOrders}
              title="Clear all existing orders to start fresh from scratch"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Orders</span>
            </button>
          )}

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customer, phone..."
              className="w-full px-4 py-2 bg-[#0B0F19] border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-[#0B0F19] border border-gray-800/80 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Responsive Table Scroll Wrapper */}
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header */}
            <thead>
              <tr className="border-b border-gray-800/80 bg-[#070B14]/60 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="py-4 px-5 whitespace-nowrap">ORDER ID & TIME</th>
                <th className="py-4 px-5 whitespace-nowrap">CUSTOMER DETAILS</th>
                <th className="py-4 px-5 whitespace-nowrap">DISHES & QUANTITY</th>
                <th className="py-4 px-5 whitespace-nowrap">TOTAL (PKR)</th>
                <th className="py-4 px-5 whitespace-nowrap text-right">STATUS (CLICK TO CHANGE)</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      {/* Box Icon matching screenshot */}
                      <div className="w-16 h-16 mb-4 flex items-center justify-center text-4xl select-none">
                        📦
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        No orders found
                      </h3>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed text-center">
                        {searchTerm || statusFilter !== 'All'
                          ? 'No orders match your filter criteria.'
                          : 'Orders placed by customers will immediately appear here.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isUpdating = isUpdatingId === order.id
                  const isPending = order.status === 'Pending'
                  const isPreparing = order.status === 'Preparing'
                  const isDelivered = order.status === 'Delivered'

                  return (
                    <tr 
                      key={order.id} 
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      {/* Order ID & Time */}
                      <td className="py-4 px-5 align-top whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                            #{order.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-1.5 font-medium">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{formatDate(order.created_at)}</span>
                        </p>
                      </td>

                      {/* Customer Details */}
                      <td className="py-4 px-5 align-top">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">
                            {order.customer_name || 'Guest Customer'}
                          </span>
                          
                          {/* Contact Shortcuts */}
                          {order.phone && (
                            <div className="flex items-center gap-1 ml-1">
                              <a
                                href={`tel:${order.phone}`}
                                title={`Call ${order.phone}`}
                                className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                              >
                                <Phone className="w-3 h-3" />
                              </a>
                              <a
                                href={getWhatsAppLink(order.phone, order)}
                                target="_blank"
                                rel="noreferrer"
                                title="Message on WhatsApp"
                                className="p-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-colors"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-gray-300 font-mono mt-0.5">
                          {order.phone}
                        </p>

                        {order.address && (
                          <p className="text-[11px] text-gray-400 flex items-start gap-1 mt-1 max-w-xs truncate">
                            <MapPin className="w-3 h-3 text-orange-400 shrink-0 mt-0.5" />
                            <span>{order.address}</span>
                          </p>
                        )}
                      </td>

                      {/* Dishes & Quantity */}
                      <td className="py-4 px-5 align-top">
                        <div className="text-xs text-gray-200 bg-[#070B14]/80 p-2 rounded-xl border border-gray-800/80 max-w-sm whitespace-pre-wrap leading-relaxed font-mono">
                          {order.dishes || 'Standard Order Items'}
                        </div>
                        {order.notes && (
                          <p className="text-[11px] text-amber-400/90 italic mt-1">
                            Note: {order.notes}
                          </p>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-5 align-top whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          Rs. {Number(order.total_amount || 0).toLocaleString()}
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Cash on Delivery
                        </span>
                      </td>

                      {/* Status & Actions */}
                      <td className="py-4 px-5 align-top whitespace-nowrap text-right">
                        <div className="flex flex-col items-end gap-2">
                          {/* Status Dropdown */}
                          <div className="relative inline-block">
                            <select
                              value={order.status}
                              disabled={isUpdating}
                              onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer appearance-none pr-7 focus:outline-none transition-all ${
                                isPending
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : isPreparing
                                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                  : isDelivered
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : 'bg-gray-800 text-gray-200 border-gray-700'
                              }`}
                            >
                              <option value="Pending" className="bg-[#0B0F19] text-amber-400">⏳ Pending</option>
                              <option value="Preparing" className="bg-[#0B0F19] text-blue-400">👨‍🍳 Preparing</option>
                              <option value="Delivered" className="bg-[#0B0F19] text-emerald-400">✅ Delivered</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onViewOrder(order)}
                              title="View Details"
                              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onPrintOrder(order)}
                              title="Print Kitchen Slip"
                              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteOrder(order.id)}
                              title="Delete Order"
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

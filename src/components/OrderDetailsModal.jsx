import React from 'react'
import { 
  X, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  AlertCircle, 
  MessageCircle, 
  Printer, 
  FileText,
  User
} from 'lucide-react'

export default function OrderDetailsModal({ 
  order, 
  isOpen, 
  onClose, 
  onUpdateStatus, 
  onPrint,
  isUpdating 
}) {
  if (!isOpen || !order) return null

  const isPending = order.status === 'Pending'
  const isPreparing = order.status === 'Preparing'
  const isDelivered = order.status === 'Delivered'

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now'
    try {
      const d = new Date(dateStr)
      return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
    } catch {
      return dateStr
    }
  }

  // Parse items list if available
  const parsedItems = Array.isArray(order.items) ? order.items : []

  // WhatsApp quick text
  const getWhatsAppLink = (phone, order) => {
    if (!phone) return '#'
    let clean = phone.replace(/\D/g, '')
    if (clean.startsWith('0')) {
      clean = '92' + clean.slice(1)
    }
    const message = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customer_name}! 🍽️\nThis is Zaiqa Royal Bistro regarding your Order #${order.id}.\nCurrent Status: *${order.status}*\nTotal: Rs. ${order.total_amount}\nThank you!`
    )
    return `https://wa.me/${clean}?text=${message}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              Order #{order.id}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              isPending
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : isPreparing
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : isDelivered
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(order)}
              title="Print Receipt"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Status Control Bar */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Update Live Supabase Status:</span>
              <span className="text-sm font-bold text-white">Current: {order.status}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['Pending', 'Preparing', 'Delivered'].map((status) => (
                <button
                  key={status}
                  disabled={isUpdating || order.status === status}
                  onClick={() => onUpdateStatus(order.id, status)}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    order.status === status
                      ? status === 'Pending'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : status === 'Preparing'
                        ? 'bg-sky-500 text-slate-950 shadow-md'
                        : 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Customer & Delivery Card */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Customer Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Customer Name</p>
                <p className="text-sm font-bold text-white">{order.customer_name || 'Guest Customer'}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Phone Number</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-mono font-bold text-amber-300">{order.phone}</span>
                  {order.phone && (
                    <>
                      <a
                        href={`tel:${order.phone}`}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={getWhatsAppLink(order.phone, order)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400"
                        title="WhatsApp Customer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-slate-400">Delivery Address</p>
                <p className="text-sm text-slate-200 flex items-start gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{order.address || 'Takeaway / In-store'}</span>
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Order Placed At</p>
                <p className="text-xs font-mono text-slate-300 mt-0.5">{formatDate(order.created_at)}</p>
              </div>

              {order.notes && (
                <div>
                  <p className="text-xs text-slate-400">Internal Reference / Notes</p>
                  <p className="text-xs font-mono text-slate-400 mt-0.5 truncate">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Dishes Items Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Items Breakdown</span>
            </h4>

            {parsedItems.length > 0 ? (
              <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800">
                {parsedItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-white">{item.name}</h5>
                      <span className="text-xs text-slate-400">
                        Qty: {item.quantity} × Rs. {item.price}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      Rs. {(item.quantity * item.price).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 font-mono text-sm text-slate-200">
                {order.dishes}
              </div>
            )}

            {/* Total Summary */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Grand Total</span>
                <span className="text-xs text-emerald-400 font-medium">Cash on Delivery / Paid</span>
              </div>
              <span className="text-2xl font-extrabold text-amber-400 font-heading">
                Rs. {Number(order.total_amount || 0).toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => onPrint(order)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Kitchen Order Ticket (KOT)</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
}


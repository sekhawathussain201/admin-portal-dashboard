import React from 'react'
import { X, Printer } from 'lucide-react'

export default function ReceiptModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null

  const handlePrint = () => {
    window.print()
  }

  const parsedItems = Array.isArray(order.items) ? order.items : []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-sm bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-8 print:shadow-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Screen Header (hidden when printed) */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-100 border-b border-slate-200 print:hidden">
          <span className="text-xs font-bold text-slate-700">Kitchen Slip Preview</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-500 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Ticket Receipt */}
        <div className="p-6 font-mono text-xs text-black space-y-3 bg-white">
          <div className="text-center border-b border-dashed border-slate-400 pb-3 space-y-1">
            <h2 className="text-base font-black tracking-wider uppercase">Zaiqa Royal Bistro</h2>
            <p className="text-[10px] text-slate-600">Authentic Charcoal & Mughlai Cuisine</p>
            <p className="text-[10px] text-slate-600">Gulshan-e-Johar, Karachi | 0301-3864320</p>
          </div>

          <div className="border-b border-dashed border-slate-400 pb-2 space-y-1 text-[11px]">
            <div className="flex justify-between font-bold">
              <span>ORDER #{order.id}</span>
              <span>{order.status.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-500">Date: </span>
              <span>{new Date(order.created_at || Date.now()).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500">Customer: </span>
              <span className="font-bold">{order.customer_name}</span>
            </div>
            <div>
              <span className="text-slate-500">Phone: </span>
              <span className="font-bold">{order.phone}</span>
            </div>
            <div>
              <span className="text-slate-500">Address: </span>
              <span>{order.address}</span>
            </div>
          </div>

          {/* Dishes */}
          <div className="border-b border-dashed border-slate-400 pb-3 space-y-2">
            <div className="flex justify-between font-bold uppercase text-[10px] text-slate-500 border-b border-slate-200 pb-1">
              <span>Item & Qty</span>
              <span>Amount</span>
            </div>

            {parsedItems.length > 0 ? (
              parsedItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-[11px]">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-bold">Rs. {item.quantity * item.price}</span>
                </div>
              ))
            ) : (
              <div className="text-[11px] whitespace-pre-line">
                {order.dishes}
              </div>
            )}
          </div>

          {/* Total */}
          <div className="border-b border-dashed border-slate-400 pb-2 space-y-1">
            <div className="flex justify-between text-sm font-extrabold">
              <span>TOTAL PAYABLE:</span>
              <span>Rs. {Number(order.total_amount).toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Payment Mode: Cash on Delivery (COD)
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-500 space-y-0.5">
            <p>Thank you for choosing Zaiqa Royal Bistro!</p>
            <p>Taste the Authentic Charcoal Royalty</p>
          </div>
        </div>

      </div>
    </div>
  )
}


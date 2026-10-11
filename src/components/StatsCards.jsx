import React from 'react'

export default function StatsCards({ orders = [] }) {
  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.status === 'Pending').length
  const preparingOrders = orders.filter(o => o.status === 'Preparing').length
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mb-6">
      
      {/* Total Orders Card */}
      <div className="bg-[#0B0F19] border border-gray-800 rounded-2xl p-5 sm:p-6 transition-all shadow-lg">
        <p className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
          TOTAL ORDERS
        </p>
        <p className="text-3xl sm:text-4xl font-extrabold text-white">
          {totalOrders}
        </p>
      </div>

      {/* Pending Orders Card */}
      <div className="bg-[#0B0F19] border border-amber-500/40 rounded-2xl p-5 sm:p-6 transition-all shadow-lg">
        <p className="text-[11px] sm:text-xs font-bold text-amber-500 uppercase tracking-wider mb-2 sm:mb-3">
          PENDING ORDERS
        </p>
        <p className="text-3xl sm:text-4xl font-extrabold text-amber-400">
          {pendingOrders}
        </p>
      </div>

      {/* Preparing Orders Card */}
      <div className="bg-[#0B0F19] border border-blue-500/40 rounded-2xl p-5 sm:p-6 transition-all shadow-lg">
        <p className="text-[11px] sm:text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 sm:mb-3">
          PREPARING
        </p>
        <p className="text-3xl sm:text-4xl font-extrabold text-blue-400">
          {preparingOrders}
        </p>
      </div>

      {/* Delivered Orders Card */}
      <div className="bg-[#0B0F19] border border-emerald-500/40 rounded-2xl p-5 sm:p-6 transition-all shadow-lg">
        <p className="text-[11px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 sm:mb-3">
          DELIVERED
        </p>
        <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">
          {deliveredOrders}
        </p>
      </div>

    </div>
  )
}

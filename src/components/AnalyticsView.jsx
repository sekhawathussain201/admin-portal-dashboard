import React from 'react'
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Award, 
  ChefHat, 
  Clock, 
  CheckCircle2 
} from 'lucide-react'

export default function AnalyticsView({ orders = [], menuItems = [] }) {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  
  const pendingCount = orders.filter(o => o.status === 'Pending').length
  const preparingCount = orders.filter(o => o.status === 'Preparing').length
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length

  // Category counts
  const categoryCounts = menuItems.reduce((acc, item) => {
    const cat = item.category || 'Specialties'
    acc[cat] = (acc[cat] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      
      {/* Top Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Gross Revenue</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-amber-300 mt-2">
            Rs. {totalRevenue.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Live Customer Orders
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Orders Placed</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-white mt-2">
            {totalOrders}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across all customer sessions
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Average Order Value (AOV)</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-purple-300 mt-2">
            Rs. {avgOrderValue.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Per customer checkout
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Delivery Fulfilled</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-heading font-extrabold text-emerald-300 mt-2">
            {deliveredCount}
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block">
            {totalOrders > 0 ? `${Math.round((deliveredCount / totalOrders) * 100)}% completion rate` : '0%'}
          </span>
        </div>

      </div>

      {/* Two Column Layout: Order Pipeline & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Order Status Pipeline */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white font-heading">
            Live Order Pipeline Distribution
          </h3>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Pending ({pendingCount})
                </span>
                <span className="text-slate-400">
                  {totalOrders > 0 ? Math.round((pendingCount / totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${totalOrders > 0 ? (pendingCount / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-sky-400 flex items-center gap-1.5">
                  <ChefHat className="w-3.5 h-3.5" /> Preparing in Kitchen ({preparingCount})
                </span>
                <span className="text-slate-400">
                  {totalOrders > 0 ? Math.round((preparingCount / totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sky-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${totalOrders > 0 ? (preparingCount / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Delivered to Customers ({deliveredCount})
                </span>
                <span className="text-slate-400">
                  {totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${totalOrders > 0 ? (deliveredCount / totalOrders) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Menu Dishes per Category */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white font-heading">
            Menu Dishes by Category ({menuItems.length} Total)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(categoryCounts).map(([cat, count]) => (
              <div key={cat} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium truncate">{cat}</span>
                <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 font-mono">
                  {count} dishes
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}


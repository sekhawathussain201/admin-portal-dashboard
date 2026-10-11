import React from 'react'
import { 
  UtensilsCrossed, 
  FileText, 
  Utensils, 
  BarChart3, 
  LogOut, 
  X 
} from 'lucide-react'

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  ordersCount = 0, 
  isOpen, 
  onClose, 
  onLogout 
}) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Aside */}
      <aside 
        className={`fixed md:sticky top-0 bottom-0 left-0 w-64 bg-[#0B0F19] border-r border-gray-800/80 z-50 flex flex-col h-screen shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-gray-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block">
                Zaiqa Lounge
              </span>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Orders Tab */}
          <button
            onClick={() => {
              setActiveTab('orders')
              if (onClose) onClose()
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 font-bold'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-gray-400'}`} />
              <span>Orders</span>
            </div>
            <span 
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'orders' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              {ordersCount}
            </span>
          </button>

          {/* Menu Items Tab */}
          <button
            onClick={() => {
              setActiveTab('items')
              if (onClose) onClose()
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'items'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 font-bold'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            <Utensils className={`w-4 h-4 ${activeTab === 'items' ? 'text-white' : 'text-gray-400'}`} />
            <span>Menu Items</span>
          </button>

          {/* Analytics Tab */}
          <button
            onClick={() => {
              setActiveTab('analytics')
              if (onClose) onClose()
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 font-bold'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            <BarChart3 className={`w-4 h-4 ${activeTab === 'analytics' ? 'text-white' : 'text-gray-400'}`} />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Sidebar Footer with Logout Button */}
        <div className="p-4 border-t border-gray-800/80 bg-[#070B14]/60">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-gray-800 hover:border-red-500/30 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}


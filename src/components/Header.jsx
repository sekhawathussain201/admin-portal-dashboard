import React from 'react'
import { RefreshCw, Volume2, VolumeX, Menu, LogOut, UtensilsCrossed } from 'lucide-react'

export default function Header({
  activeTab,
  onRefresh,
  isRefreshing,
  soundEnabled,
  setSoundEnabled,
  userEmail = 'admin@zaiqa.com',
  onToggleSidebar,
  onLogout
}) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'orders':
        return 'Orders Management'
      case 'items':
        return 'Menu Items Catalog'
      case 'analytics':
        return 'Performance & Analytics'
      default:
        return 'Orders Management'
    }
  }

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3.5 bg-[#0B0F19] border-b border-gray-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white cursor-pointer"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="text-sm font-extrabold text-white">
            Zaiqa Lounge
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-gray-800 text-gray-300 hover:text-white cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:text-red-300 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Desktop Header */}
      <header className="px-4 sm:px-8 py-5 border-b border-gray-800/80 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {getTabTitle()}
          </h2>
          <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Restaurant Command Center</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Order sound notifications enabled" : "Sound muted"}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-gray-800 text-orange-400 border-orange-500/30 hover:bg-gray-700'
                : 'bg-gray-900 text-gray-500 border-gray-800 hover:text-gray-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs border border-gray-700 shadow-sm active:scale-95 transition-all cursor-pointer"
            title="Sync orders live"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-orange-400' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* User Email Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="font-medium text-gray-300">{userEmail}</span>
          </div>
        </div>
      </header>
    </>
  )
}


import React from 'react'
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Grid, 
  BarChart3, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Database, 
  Settings,
  Wifi,
  Sparkles
} from 'lucide-react'

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  ordersCount, 
  pendingCount, 
  itemsCount,
  onRefresh, 
  isRefreshing, 
  soundEnabled, 
  setSoundEnabled,
  onOpenSqlModal,
  onOpenSettingsModal,
  isSupabaseConnected
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
              <UtensilsCrossed className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-wide bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                  ZAIQA BISTRO
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Supabase Realtime Order & Menu Control Center
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders</span>
              {pendingCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-extrabold ${
                  activeTab === 'orders' 
                    ? 'bg-slate-950 text-amber-400' 
                    : 'bg-amber-500 text-slate-950 animate-pulse'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('items')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'items'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Menu Items</span>
              <span className="text-[11px] opacity-75">
                ({itemsCount})
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </button>
          </nav>

          {/* Quick Actions & Live Indicator */}
          <div className="flex items-center gap-2">
            
            {/* Supabase status badge */}
            <div 
              onClick={onOpenSqlModal}
              title="Supabase Status (Click for SQL setup)"
              className="cursor-pointer hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold">Supabase Live</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Sound notifications enabled" : "Sound muted"}
              className={`p-2 rounded-lg border transition-all ${
                soundEnabled 
                  ? 'bg-slate-800/80 text-amber-400 border-amber-500/30 hover:bg-slate-700' 
                  : 'bg-slate-800/40 text-slate-400 border-slate-700/60 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Data from Supabase"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            {/* Database / SQL Modal Button */}
            <button
              onClick={onOpenSqlModal}
              title="Supabase Database Setup & Schema"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold transition-all"
            >
              <Database className="w-3.5 h-3.5" />
              <span>DB Setup</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettingsModal}
              title="Supabase API Settings"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  )
}


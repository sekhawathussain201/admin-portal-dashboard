import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Flame, 
  Star, 
  Clock, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Database,
  Layers,
  Sparkles,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react'

export default function ItemsCatalogView({ 
  menuItems, 
  onAddNew, 
  onEdit, 
  onDelete, 
  onToggleAvailability,
  fromSupabase,
  onOpenSqlModal
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Categories list
  const categories = ['All', ...new Set(menuItems.map(i => i.category || 'Specialties'))]

  // Filter items
  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false
    }
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase()
      const name = (item.name || '').toLowerCase()
      const desc = (item.description || '').toLowerCase()
      const cat = (item.category || '').toLowerCase()
      return name.includes(q) || desc.includes(q) || cat.includes(q)
    }
    return true
  })

  return (
    <div className="space-y-5">
      
      {/* Top Banner: Supabase Sync Notice if needed */}
      {!fromSupabase ? (
        <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300">
                Menu Items Storage: Active
              </h4>
              <p className="text-xs text-slate-400">
                Items are safely saved and immediately manageable. To enable cloud Supabase sync across multiple devices, run the 10-second SQL script in your Supabase SQL editor.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenSqlModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View 1-Click SQL Setup</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Supabase Cloud Sync: Connected to table <code>public.menu_items</code></span>
          </div>
          <span className="text-[11px] text-emerald-500/80 font-mono">
            {menuItems.length} cloud records
          </span>
        </div>
      )}

      {/* Action Header & Search Bar */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-4 rounded-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Left: Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu dishes by name, category or spices..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Add New Item Primary CTA */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Showing <strong className="text-white">{filteredItems.length}</strong> of {menuItems.length} dishes
          </span>
          <button
            onClick={onAddNew}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Item</span>
          </button>
        </div>

      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
            {cat === 'All' ? ` (${menuItems.length})` : ''}
          </button>
        ))}
      </div>

      {/* Menu Dishes Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-300">No dishes match your filter</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            Try choosing a different category or click "Add New Item" to create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredItems.map((dish) => {
            const isAvailable = dish.is_available !== false

            return (
              <div 
                key={dish.id}
                className={`bg-slate-900/80 border rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-700 hover:shadow-xl flex flex-col justify-between ${
                  isAvailable ? 'border-slate-800' : 'border-slate-800/60 opacity-75'
                }`}
              >
                
                {/* Top Image & Badges */}
                <div>
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden group">
                    <img 
                      src={dish.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'} 
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    {/* Category badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-950/80 backdrop-blur text-amber-400 border border-amber-500/20">
                        {dish.category}
                      </span>
                    </div>

                    {/* Stock Status Pill */}
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => onToggleAvailability(dish.id, !isAvailable)}
                        title="Click to toggle availability"
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide backdrop-blur transition-all flex items-center gap-1 border ${
                          isAvailable
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        <span>{isAvailable ? 'In Stock' : 'Out of Stock'}</span>
                      </button>
                    </div>

                    {/* Highlights (Bestseller / Spicy) */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
                      {dish.is_bestseller && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-0.5 shadow-md">
                          <Star className="w-3 h-3 fill-slate-950" />
                          <span>Bestseller</span>
                        </span>
                      )}
                      {dish.is_spicy && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white flex items-center gap-0.5 shadow-md">
                          <Flame className="w-3 h-3 fill-white" />
                          <span>Spicy</span>
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-white font-heading line-clamp-1">
                        {dish.name}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {dish.description || 'Delicately cooked with traditional herbs, aromatic spices and premium meat.'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 font-mono">
                      {dish.prep_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {dish.prep_time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer: Price & Actions */}
                <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-base font-extrabold text-amber-400 font-heading">
                    Rs. {Number(dish.price).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(dish)}
                      title="Edit Dish"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(dish.id)}
                      title="Delete Dish"
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}


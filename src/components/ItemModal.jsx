import React, { useState, useEffect } from 'react'
import { X, Sparkles, Image, DollarSign, Clock, Tag, Flame, Star, Check } from 'lucide-react'

// Curated high quality food image presets
const IMAGE_PRESETS = [
  { name: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80' },
  { name: 'Karahi / Wok', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { name: 'Handi / Curry', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80' },
  { name: 'BBQ / Kebabs', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80' },
  { name: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { name: 'Crispy Wings', url: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Pasta / Alfredo', url: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80' },
  { name: 'Molten Lava Cake', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Dessert / Kheer', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' },
  { name: 'Beverage / Drink', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80' },
]

const CATEGORIES = [
  'Karahi & Handi',
  'Rice Specialties',
  'BBQ & Grills',
  'Fast Food',
  'Continental',
  'Starters & Sea',
  'Desserts',
  'Beverages',
  'Specialties'
]

export default function ItemModal({ isOpen, onClose, onSave, editingItem }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Karahi & Handi',
    price: '',
    prep_time: '20 mins',
    description: '',
    image: '',
    is_bestseller: false,
    is_spicy: false,
    is_available: true
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        category: editingItem.category || 'Karahi & Handi',
        price: editingItem.price || '',
        prep_time: editingItem.prep_time || '20 mins',
        description: editingItem.description || '',
        image: editingItem.image || '',
        is_bestseller: Boolean(editingItem.is_bestseller),
        is_spicy: Boolean(editingItem.is_spicy),
        is_available: editingItem.is_available !== undefined ? Boolean(editingItem.is_available) : true
      })
    } else {
      setFormData({
        name: '',
        category: 'Karahi & Handi',
        price: '',
        prep_time: '20 mins',
        description: '',
        image: IMAGE_PRESETS[0].url,
        is_bestseller: false,
        is_spicy: false,
        is_available: true
      })
    }
    setErrors({})
  }, [editingItem, isOpen])

  if (!isOpen) return null

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Dish / Item name is required'
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Valid price is required'
    if (!formData.category.trim()) errs.category = 'Category is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await onSave({
        ...formData,
        price: Number(formData.price),
        image: formData.image || IMAGE_PRESETS[0].url
      })
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                {editingItem ? 'Edit Menu Dish' : 'Add New Menu Item'}
              </h3>
              <p className="text-xs text-slate-400">
                {editingItem 
                  ? 'Update details for this item' 
                  : 'Add a new culinary item to your restaurant menu'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Dish Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Dish / Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Royal Chicken Malai Boti"
              className={`w-full px-3.5 py-2.5 bg-slate-950 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                errors.name ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
              }`}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>

          {/* Category & Price Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                ))}
              </select>
            </div>

            {/* Price (PKR) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Price in PKR (Rs.) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400">
                  Rs.
                </span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 1250"
                  className={`w-full pl-11 pr-3.5 py-2.5 bg-slate-950 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    errors.price ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                  }`}
                />
              </div>
              {errors.price && <p className="text-xs text-rose-400 mt-1">{errors.price}</p>}
            </div>

          </div>

          {/* Prep Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Preparation Time
            </label>
            <input
              type="text"
              value={formData.prep_time}
              onChange={(e) => setFormData({ ...formData, prep_time: e.target.value })}
              placeholder="e.g. 15-20 mins"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Image URL & Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Item Image URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
            
            {/* Quick Presets Picker */}
            <div className="mt-2">
              <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                Or click to choose a quick appetizing food photo:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {IMAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: preset.url })}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                      formData.image === preset.url
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview */}
            {formData.image && (
              <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300 backdrop-blur">
                  Live Preview
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Description & Ingredients
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the flavors, meat cuts, cooking technique, spices..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          {/* Badges / Toggles */}
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Bestseller */}
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:bg-slate-950 transition-colors">
              <input
                type="checkbox"
                checked={formData.is_bestseller}
                onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                Bestseller
              </span>
            </label>

            {/* Spicy */}
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:bg-slate-950 transition-colors">
              <input
                type="checkbox"
                checked={formData.is_spicy}
                onChange={(e) => setFormData({ ...formData, is_spicy: e.target.checked })}
                className="w-4 h-4 rounded text-rose-500 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Spicy Hot
              </span>
            </label>

            {/* Available In Stock */}
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:bg-slate-950 transition-colors">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-slate-800 border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                In Stock
              </span>
            </label>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Saving item...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{editingItem ? 'Save Changes' : 'Add Item to Menu'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}


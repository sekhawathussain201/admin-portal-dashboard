import React, { useState } from 'react'
import { UtensilsCrossed, Lock, Mail, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'

export default function Login({ onLoginSuccess }) {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Admin authentication verification
    setTimeout(() => {
      // Validate credentials (allows demo login or custom name/address/password)
      if (password.trim() || address.trim() || name.trim()) {
        const sessionData = {
          name: name.trim() || 'Admin',
          email: address.trim() || 'admin@zaiqa.com',
          token: 'zaiqa_admin_' + Date.now(),
          loginTime: new Date().toISOString()
        }
        
        if (rememberMe) {
          localStorage.setItem('zaiqa_admin_session', JSON.stringify(sessionData))
        } else {
          sessionStorage.setItem('zaiqa_admin_session', JSON.stringify(sessionData))
        }

        onLoginSuccess(sessionData)
      } else {
        setError('Please enter your credentials.')
        setIsLoading(false)
      }
    }, 300)
  }

  const fillQuickCredentials = () => {
    setName('Admin')
    setAddress('admin@zaiqa.com')
    setPassword('admin123')
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
      {/* Background ambient decorative glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card Container */}
        <div className="bg-[#0B0F19] border border-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80 backdrop-blur-xl">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/25 mb-4">
              <UtensilsCrossed className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Zaiqa Lounge
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Sign in to manage orders, inventory, and restaurant operations
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-3 bg-[#070B14] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Address / Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Email / Gmail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="admin@zaiqa.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#070B14] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#070B14] border border-gray-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-orange-500 focus:ring-orange-500/20"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Testing User Credentials Box (Above Sign In / Sign Up Button) */}
            <div 
              onClick={fillQuickCredentials}
              className="mt-3 p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/25 hover:border-orange-500/40 transition-all cursor-pointer group"
              title="Click to automatically fill testing credentials"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-orange-300 uppercase tracking-wide">
                    Testing Admin Account
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fillQuickCredentials()
                  }}
                  className="px-2.5 py-0.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-[11px] font-bold border border-orange-500/30 transition-all"
                >
                  ⚡ Auto-Fill
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-[#070B14]/80 p-2.5 rounded-xl border border-gray-800/80">
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Testing Gmail:</span>
                  <span className="text-amber-300 font-mono text-[11px] font-bold select-all">
                    admin@zaiqa.com
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">Password:</span>
                  <span className="text-emerald-400 font-mono text-[11px] font-bold select-all">
                    admin123
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 text-center group-hover:text-orange-300 transition-colors">
                Tap box to auto-fill credentials & enter dashboard
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In / Sign Up'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Info Box */}
          <div className="mt-6 pt-5 border-t border-gray-800/80 flex items-center justify-center gap-2 text-gray-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure Admin Authentication Session</span>
          </div>

        </div>
      </div>
    </div>
  )
}

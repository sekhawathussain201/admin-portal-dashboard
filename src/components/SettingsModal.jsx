import React, { useState } from 'react'
import { X, Settings, Check, AlertCircle, RefreshCw } from 'lucide-react'
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY, getSupabaseConfig, refreshSupabaseClient } from '../lib/supabase'

export default function SettingsModal({ isOpen, onClose, onConfigSaved }) {
  const current = getSupabaseConfig()
  const [url, setUrl] = useState(current.url)
  const [key, setKey] = useState(current.key)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)

  if (!isOpen) return null

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch(`${url}/rest/v1/orders?select=id&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      })
      if (res.ok) {
        setTestResult({ ok: true, message: 'Connection Successful! Orders table found.' })
      } else {
        const data = await res.json()
        setTestResult({ ok: false, message: `Failed: ${data.message || res.statusText}` })
      }
    } catch (e) {
      setTestResult({ ok: false, message: `Error: ${e.message}` })
    } finally {
      setTesting(false)
    }
  }

  const handleSave = () => {
    localStorage.setItem('zaiqa_admin_sb_url', url.trim())
    localStorage.setItem('zaiqa_admin_sb_key', key.trim())
    refreshSupabaseClient()
    if (onConfigSaved) onConfigSaved()
    onClose()
  }

  const handleReset = () => {
    setUrl(DEFAULT_SUPABASE_URL)
    setKey(DEFAULT_SUPABASE_ANON_KEY)
    localStorage.removeItem('zaiqa_admin_sb_url')
    localStorage.removeItem('zaiqa_admin_sb_key')
    refreshSupabaseClient()
    setTestResult(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Supabase API Settings
              </h3>
              <p className="text-xs text-slate-400">Configure cloud database credentials</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Supabase Anon Public API Key
            </label>
            <textarea
              rows="3"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px] focus:border-amber-500 focus:outline-none resize-none"
            />
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl border flex items-center gap-2 ${
              testResult.ok ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}>
              {testResult.ok ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>Test Connection</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="text-slate-400 hover:text-rose-400 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
          >
            Save Credentials
          </button>
        </div>

      </div>
    </div>
  )
}


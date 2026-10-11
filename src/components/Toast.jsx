import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  const isSuccess = toast.type === 'success'
  const isError = toast.type === 'error'

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in max-w-sm">
      <div className={`p-4 rounded-xl border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
        isSuccess
          ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-300'
          : isError
          ? 'bg-slate-900/95 border-rose-500/40 text-rose-300'
          : 'bg-slate-900/95 border-amber-500/40 text-amber-300'
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        ) : isError ? (
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        ) : (
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        )}

        <div className="flex-1">
          <h5 className="text-xs font-bold uppercase tracking-wider text-white">
            {toast.title || (isSuccess ? 'Success' : isError ? 'Attention' : 'Notice')}
          </h5>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}


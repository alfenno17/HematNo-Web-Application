// components/IncomeModal.jsx
import React, { useState } from 'react'
import { X } from 'lucide-react'
import { KANTONG } from '../hooks/useStore.js'
import { formatRupiah } from '../utils/format.js'

export default function IncomeModal({ onClose, onSubmit }) {
  const [amount, setAmount] = useState('')
  const [desc,   setDesc]   = useState('')

  const parsed = parseFloat(amount.replace(/\D/g, '')) || 0

  function handleSubmit(e) {
    e.preventDefault()
    if (!parsed || parsed <= 0) return
    onSubmit(parsed, desc || 'Pemasukan')
    onClose()
  }

  function handleAmountChange(e) {
    const digits = e.target.value.replace(/\D/g, '')
    setAmount(digits)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="row-between" style={{ marginBottom: 20 }}>
          <h2 className="modal-title" style={{ marginBottom: 0 }}>Tambah Pemasukan</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Nominal Pemasukan</label>
            <input
              className="form-input large"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={parsed ? parsed.toLocaleString('id-ID') : ''}
              onChange={handleAmountChange}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi (opsional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="Contoh: Gaji PKL bulan ini"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              maxLength={80}
            />
          </div>

          {/* Auto-split preview */}
          {parsed > 0 && (
            <div className="form-group">
              <label className="form-label">Pembagian Otomatis</label>
              <div className="split-preview">
                {KANTONG.map(k => (
                  <div key={k.id} className="split-row">
                    <div className="split-dot" style={{ background: k.color }} />
                    <span className="split-name">{k.label}</span>
                    <span className="split-pct">{k.pct}%</span>
                    <span className="split-val">{formatRupiah(parsed * k.pct / 100)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={!parsed}
          >
            Simpan Pemasukan
          </button>
        </form>
      </div>
    </div>
  )
}

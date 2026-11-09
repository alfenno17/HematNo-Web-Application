// components/IncomeModal.jsx
import React, { useState } from 'react'
import { X, SlidersHorizontal } from 'lucide-react'
import { getKantongList, DEFAULT_ALLOCATIONS } from '../hooks/useStore.js'
import { formatRupiah } from '../utils/format.js'

export default function IncomeModal({ allocations = DEFAULT_ALLOCATIONS, onClose, onSubmit, onOpenAllocationSettings }) {
  const [amount, setAmount] = useState('')
  const [desc,   setDesc]   = useState('')

  const parsed = parseFloat(amount.replace(/\D/g, '')) || 0
  const kantongList = getKantongList(allocations)

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
            aria-label="Tutup"
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

          {/* Auto-split preview based on active custom allocations */}
          {parsed > 0 && (
            <div className="form-group">
              <div className="row-between" style={{ marginBottom: 6 }}>
                <label className="form-label" style={{ margin: 0 }}>Pembagian Otomatis (Alokasi Kustom)</label>
                {onOpenAllocationSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      onOpenAllocationSettings()
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-1)',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <SlidersHorizontal size={11} /> Ubah %
                  </button>
                )}
              </div>
              <div className="split-preview">
                {kantongList.map(k => (
                  <div key={k.id} className="split-row">
                    <div className="split-dot" style={{ background: k.color }} />
                    <span className="split-name">{k.label}</span>
                    <span className="split-pct">{k.pct}%</span>
                    <span className="split-val">{formatRupiah((parsed * k.pct) / 100)}</span>
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

// components/ExpenseModal.jsx
import React, { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { KANTONG, computeBalances } from '../hooks/useStore.js'
import { formatRupiah } from '../utils/format.js'

export default function ExpenseModal({ transactions, onClose, onSubmit }) {
  const [amount,  setAmount]  = useState('')
  const [desc,    setDesc]    = useState('')
  const [kantong, setKantong] = useState(KANTONG[0].id)

  const balances = computeBalances(transactions)
  const parsed   = parseFloat(amount.replace(/\D/g, '')) || 0
  const selected = KANTONG.find(k => k.id === kantong)
  const remaining = balances[kantong]
  const willBeMinus = parsed > 0 && (remaining - parsed < 0)

  function handleSubmit(e) {
    e.preventDefault()
    if (!parsed || parsed <= 0) return
    onSubmit(parsed, desc || 'Pengeluaran', kantong)
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
          <h2 className="modal-title" style={{ marginBottom: 0 }}>Tambah Pengeluaran</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Kantong selector */}
          <div className="form-group">
            <label className="form-label">Dari Kantong</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {KANTONG.map(k => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKantong(k.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: kantong === k.id
                      ? `2px solid ${k.color}`
                      : '1.5px solid var(--border)',
                    background: kantong === k.id ? `${k.color}12` : 'var(--surface)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    transition: 'all .15s',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: k.color, letterSpacing: '.04em', textTransform: 'uppercase' }}>
                    {k.label}
                  </span>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: balances[k.id] < 0 ? 'var(--minus)' : 'var(--text-1)'
                  }}>
                    {formatRupiah(balances[k.id], true)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="form-group">
            <label className="form-label">Nominal Pengeluaran</label>
            <input
              className="form-input large"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={parsed ? parsed.toLocaleString('id-ID') : ''}
              onChange={handleAmountChange}
              autoFocus
            />
            {/* Remaining info */}
            {parsed > 0 && (
              <div style={{ marginTop: 6 }}>
                {willBeMinus ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 12px',
                      background: 'var(--minus-bg)',
                      border: '1px solid #fecaca',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12,
                      color: 'var(--minus)',
                      fontWeight: 500,
                    }}
                  >
                    <AlertTriangle size={14} />
                    Saldo {selected?.label} akan menjadi{' '}
                    <strong>{formatRupiah(remaining - parsed)}</strong> (minus)
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                    Sisa setelah transaksi:{' '}
                    <strong style={{ color: 'var(--text-1)' }}>{formatRupiah(remaining - parsed)}</strong>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Deskripsi (opsional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="Contoh: Makan siang"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              maxLength={80}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={!parsed}
            style={willBeMinus ? { background: '#dc2626' } : {}}
          >
            {willBeMinus ? 'Catat (Saldo Minus)' : 'Simpan Pengeluaran'}
          </button>
        </form>
      </div>
    </div>
  )
}

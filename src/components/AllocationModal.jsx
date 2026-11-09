// components/AllocationModal.jsx
import React, { useState } from 'react'
import { X, Check, AlertTriangle, AlertCircle, RotateCcw, PieChart } from 'lucide-react'
import { KANTONG_META, DEFAULT_ALLOCATIONS } from '../hooks/useStore.js'

const PRESETS = [
  { label: '50-30-10-10 (Klasik)', values: { pokok: 50, hiburan: 30, tabungan: 10, darurat: 10 } },
  { label: '60-20-10-10 (Fokus Pokok)', values: { pokok: 60, hiburan: 20, tabungan: 10, darurat: 10 } },
  { label: '40-20-20-20 (Fokus Tabung)', values: { pokok: 40, hiburan: 20, tabungan: 20, darurat: 20 } },
  { label: '70-10-10-10 (Hemat Ketat)', values: { pokok: 70, hiburan: 10, tabungan: 10, darurat: 10 } },
]

export default function AllocationModal({ currentAllocations, onClose, onSave }) {
  const [allocs, setAllocs] = useState({
    pokok: currentAllocations?.pokok ?? DEFAULT_ALLOCATIONS.pokok,
    hiburan: currentAllocations?.hiburan ?? DEFAULT_ALLOCATIONS.hiburan,
    tabungan: currentAllocations?.tabungan ?? DEFAULT_ALLOCATIONS.tabungan,
    darurat: currentAllocations?.darurat ?? DEFAULT_ALLOCATIONS.darurat,
  })

  const total = Object.values(allocs).reduce((sum, val) => sum + (Number(val) || 0), 0)
  const isExact100 = total === 100

  function handleChange(id, rawValue) {
    const val = rawValue === '' ? 0 : Math.max(0, Math.min(100, parseInt(rawValue, 10) || 0))
    setAllocs(prev => ({ ...prev, [id]: val }))
  }

  function handleStep(id, delta) {
    setAllocs(prev => {
      const current = prev[id] || 0
      const next = Math.max(0, Math.min(100, current + delta))
      return { ...prev, [id]: next }
    })
  }

  function applyPreset(presetValues) {
    setAllocs({ ...presetValues })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!isExact100) return
    onSave(allocs)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />

        <div className="row-between" style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PieChart size={20} color="var(--text-1)" />
            <h2 className="modal-title" style={{ margin: 0 }}>Pengaturan Alokasi</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-muted" style={{ marginBottom: 16 }}>
          Tentukan pembagian persen untuk setiap pemasukan baru. Total persentase harus pas <strong>100%</strong>.
        </p>

        {/* Multi-segment visual bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ height: 10, background: 'var(--surface-2)', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
            {KANTONG_META.map(k => {
              const val = allocs[k.id] || 0
              if (val <= 0) return null
              // If total is 0, avoid NaN
              const widthPct = total > 0 ? (val / Math.max(total, 100)) * 100 : 0
              return (
                <div
                  key={k.id}
                  style={{
                    width: `${widthPct}%`,
                    background: k.color,
                    transition: 'width 0.2s ease',
                  }}
                  title={`${k.label}: ${val}%`}
                />
              )
            })}
          </div>
        </div>

        {/* Quick Presets */}
        <div style={{ marginBottom: 18 }}>
          <div className="text-xs font-semibold text-muted" style={{ marginBottom: 6 }}>Preset Cepat:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p.values)}
                className="btn btn-secondary"
                style={{ height: 30, padding: '0 10px', fontSize: 11, borderRadius: 'var(--radius-sm)' }}
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => applyPreset(DEFAULT_ALLOCATIONS)}
              className="btn btn-secondary"
              style={{ height: 30, padding: '0 8px', fontSize: 11, borderRadius: 'var(--radius-sm)' }}
              title="Reset ke default"
            >
              <RotateCcw size={12} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Inputs for 4 pockets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {KANTONG_META.map(k => (
              <div
                key={k.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: k.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{k.label}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {/* Minus button */}
                  <button
                    type="button"
                    onClick={() => handleStep(k.id, -5)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 6,
                      border: '1px solid var(--border-2)',
                      background: 'var(--surface)',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-1)',
                    }}
                  >
                    -
                  </button>

                  {/* Input percentage */}
                  <div style={{ position: 'relative', width: 62 }}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={allocs[k.id]}
                      onChange={e => handleChange(k.id, e.target.value)}
                      style={{
                        width: '100%',
                        height: 32,
                        textAlign: 'right',
                        paddingRight: 20,
                        paddingLeft: 6,
                        fontWeight: 700,
                        fontSize: 14,
                        border: '1.5px solid var(--border-2)',
                        borderRadius: 6,
                        background: 'var(--surface)',
                        color: 'var(--text-1)',
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: 'var(--text-3)',
                        pointerEvents: 'none',
                      }}
                    >
                      %
                    </span>
                  </div>

                  {/* Plus button */}
                  <button
                    type="button"
                    onClick={() => handleStep(k.id, +5)}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 6,
                      border: '1px solid var(--border-2)',
                      background: 'var(--surface)',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-1)',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Validation Notice */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isExact100 ? '#f0fdf4' : total > 100 ? '#fef2f2' : '#fffbeb',
              border: `1px solid ${isExact100 ? '#bbf7d0' : total > 100 ? '#fecaca' : '#fde68a'}`,
              color: isExact100 ? '#15803d' : total > 100 ? '#b91c1c' : '#b45309',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600 }}>
              {isExact100 ? (
                <>
                  <Check size={16} />
                  <span>Total Persentase: 100% (Sempurna)</span>
                </>
              ) : total > 100 ? (
                <>
                  <AlertTriangle size={16} />
                  <span>Kelebihan {total - 100}% (Total: {total}%)</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span>Kurang {100 - total}% (Total: {total}%)</span>
                </>
              )}
            </div>
            <span style={{ fontSize: 12, fontWeight: 700 }}>
              {total}% / 100%
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={!isExact100}
            style={{
              opacity: isExact100 ? 1 : 0.45,
              cursor: isExact100 ? 'pointer' : 'not-allowed',
            }}
          >
            Simpan Alokasi Kustom
          </button>
        </form>
      </div>
    </div>
  )
}

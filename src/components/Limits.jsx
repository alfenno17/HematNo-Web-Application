// components/Limits.jsx
import React, { useState } from 'react'
import { ShieldAlert, Edit2, Check, X } from 'lucide-react'
import { spentInRange } from '../hooks/useStore.js'
import { formatRupiah, startOfDay, startOfWeek, startOfMonth, endOfDay } from '../utils/format.js'

const PERIODS = [
  { key: 'daily',   label: 'Harian',   getRange: () => ({ from: startOfDay(), to: endOfDay() }) },
  { key: 'weekly',  label: 'Mingguan', getRange: () => ({ from: startOfWeek(), to: new Date() }) },
  { key: 'monthly', label: 'Bulanan',  getRange: () => ({ from: startOfMonth(), to: new Date() }) },
]

function LimitEditor({ period, label, limit, onSave, transactions }) {
  const [editing, setEditing]   = useState(false)
  const [draftAmt, setDraftAmt] = useState('')
  const [enabled, setEnabled]   = useState(limit.enabled)

  const { from, to } = period.getRange()
  const spent = spentInRange(transactions, from, to)
  const pct   = limit.enabled && limit.amount > 0
    ? Math.min((spent / limit.amount) * 100, 100)
    : 0

  const statusClass = pct >= 100 ? 'danger' : pct >= 80 ? 'warn' : 'safe'

  function saveEdit() {
    const val = parseFloat(draftAmt.replace(/\D/g, '')) || 0
    const newEnabled = val > 0 ? true : enabled
    setEnabled(newEnabled)
    onSave(val, newEnabled)
    setEditing(false)
  }

  function handleDraftChange(e) {
    const digits = e.target.value.replace(/\D/g, '')
    setDraftAmt(digits)
  }

  function handleToggle() {
    const nextState = !limit.enabled
    if (nextState && (!limit.amount || limit.amount <= 0)) {
      setDraftAmt('')
      setEditing(true)
      return
    }
    setEnabled(nextState)
    onSave(limit.amount, nextState)
  }

  return (
    <div className="limit-row">
      <div className="limit-header">
        <div>
          <div className="limit-label">Limit {label}</div>
          {limit.enabled && limit.amount > 0 ? (
            <div className="limit-amounts">
              <span>{formatRupiah(spent)}</span> / {formatRupiah(limit.amount)}
            </div>
          ) : (
            <div className="text-xs text-muted mt-4">Limit belum diaktifkan</div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Toggle */}
          <button
            onClick={handleToggle}
            aria-label={`Toggle limit ${label}`}
            style={{
              width: 40, height: 22,
              borderRadius: 11,
              border: 'none',
              background: limit.enabled ? 'var(--accent)' : 'var(--border-2)',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background .2s',
              flexShrink: 0,
            }}
          >
            <span style={{
              position: 'absolute',
              top: 2,
              left: limit.enabled ? 20 : 2,
              width: 18, height: 18,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left .2s',
            }} />
          </button>
          {/* Edit */}
          <button
            onClick={() => { setEditing(true); setDraftAmt(limit.amount ? String(limit.amount) : '') }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', padding: 4 }}
            aria-label={`Edit limit ${label}`}
          >
            <Edit2 size={15} />
          </button>
        </div>
      </div>

      {/* Edit inline */}
      {editing && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <input
            className="form-input"
            style={{ flex: 1, height: 38 }}
            type="text"
            inputMode="numeric"
            placeholder="Nominal limit (Rp)"
            autoFocus
            value={draftAmt ? parseInt(draftAmt).toLocaleString('id-ID') : ''}
            onChange={handleDraftChange}
          />
          <button onClick={saveEdit} className="btn btn-primary" style={{ height: 38, padding: '0 12px' }}>
            <Check size={15} />
          </button>
          <button onClick={() => setEditing(false)} className="btn btn-secondary" style={{ height: 38, padding: '0 12px' }}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Progress bar */}
      {limit.enabled && limit.amount > 0 && (
        <div style={{ marginTop: 6 }}>
          <div className="progress-track">
            <div
              className={`progress-fill ${statusClass}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {pct >= 100 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, fontSize: 11, color: 'var(--minus)', fontWeight: 600 }}>
              <ShieldAlert size={12} /> Limit {label.toLowerCase()} terlampaui!
            </div>
          )}
          {pct >= 80 && pct < 100 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, fontSize: 11, color: '#d97706', fontWeight: 600 }}>
              <ShieldAlert size={12} /> Mendekati limit ({Math.round(pct)}%)
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Limits({ limits, transactions, onSetLimit }) {
  return (
    <>
      <div>
        <p className="section-title">Spending Limits</p>
        <div className="card">
          {PERIODS.map(p => (
            <LimitEditor
              key={p.key}
              period={p}
              label={p.label}
              limit={limits[p.key]}
              transactions={transactions}
              onSave={(amount, enabled) => onSetLimit(p.key, amount, enabled)}
            />
          ))}
        </div>
      </div>

      {/* Spending breakdown */}
      <SpendingBreakdown transactions={transactions} />
    </>
  )
}

function SpendingBreakdown({ transactions }) {
  const now = new Date()
  const ranges = [
    { label: 'Hari Ini',   spent: spentInRange(transactions, startOfDay(now), endOfDay(now)) },
    { label: 'Minggu Ini', spent: spentInRange(transactions, startOfWeek(now), now) },
    { label: 'Bulan Ini',  spent: spentInRange(transactions, startOfMonth(now), now) },
  ]

  return (
    <div>
      <p className="section-title">Ringkasan Pengeluaran Aktual</p>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {ranges.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < ranges.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{r.label}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{formatRupiah(r.spent)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

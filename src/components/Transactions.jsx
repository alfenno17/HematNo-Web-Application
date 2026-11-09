// components/Transactions.jsx
import React, { useState } from 'react'
import { Trash2, TrendingUp, TrendingDown, Search } from 'lucide-react'
import { KANTONG_META } from '../hooks/useStore.js'
import { formatRupiah, formatDate, formatTime } from '../utils/format.js'

export default function Transactions({ transactions, onDelete }) {
  const [filter, setFilter]   = useState('all')   // 'all' | 'income' | 'expense'
  const [search, setSearch]   = useState('')
  const [confirm, setConfirm] = useState(null)

  const filtered = transactions.filter(tx => {
    if (filter !== 'all' && tx.type !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return tx.desc.toLowerCase().includes(q)
    }
    return true
  })

  function handleDelete(id) {
    if (confirm === id) {
      onDelete(id)
      setConfirm(null)
    } else {
      setConfirm(id)
      setTimeout(() => setConfirm(null), 3000)
    }
  }

  return (
    <>
      {/* Filter + search */}
      <div className="segment">
        {[['all','Semua'],['income','Pemasukan'],['expense','Pengeluaran']].map(([v,l]) => (
          <button
            key={v}
            className={`seg-btn ${filter === v ? 'active' : ''}`}
            onClick={() => setFilter(v)}
          >{l}</button>
        ))}
      </div>

      <div style={{ position: 'relative' }}>
        <Search
          size={15}
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}
        />
        <input
          className="form-input"
          style={{ paddingLeft: 36 }}
          placeholder="Cari transaksi…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Stats summary row */}
      <StatsSummary transactions={transactions} />

      {/* List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <TrendingDown size={32} />
          <p>Tidak ada transaksi ditemukan.</p>
        </div>
      ) : (
        <div className="tx-list">
          {filtered.map(tx => {
            const kantong = KANTONG_META.find(k => k.id === tx.kantong)
            const isIncome = tx.type === 'income'
            return (
              <div key={tx.id} className="tx-item">
                <div
                  className="tx-icon"
                  style={{
                    background: isIncome ? '#f0fdf4' : '#fef2f2',
                    color:      isIncome ? '#16a34a' : '#dc2626',
                  }}
                >
                  {isIncome ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                </div>
                <div className="tx-info">
                  <div className="tx-desc">{tx.desc}</div>
                  <div className="tx-meta">
                    <span>{formatDate(tx.date)}</span>
                    <span>{formatTime(tx.date)}</span>
                    {kantong && (
                      <>
                        <span>·</span>
                        <span style={{ color: kantong.color, fontWeight: 600 }}>{kantong.label}</span>
                      </>
                    )}
                    {isIncome && tx.allocations && (
                      <>
                        <span>·</span>
                        <span>Alokasi ({tx.allocations.pokok}/{tx.allocations.hiburan}/{tx.allocations.tabungan}/{tx.allocations.darurat}%)</span>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <div className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
                  </div>
                  <button
                    className="tx-delete"
                    onClick={() => handleDelete(tx.id)}
                    title={confirm === tx.id ? 'Ketuk lagi untuk hapus' : 'Hapus'}
                    style={confirm === tx.id ? { background: '#fef2f2', color: 'var(--minus)' } : {}}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

function StatsSummary({ transactions }) {
  const totalIn  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalOut = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <div className="card card-sm" style={{ borderLeft: '3px solid #16a34a' }}>
        <div className="text-xs text-muted">Total Pemasukan</div>
        <div className="font-bold" style={{ fontSize: 15, color: '#16a34a', marginTop: 2 }}>
          +{formatRupiah(totalIn)}
        </div>
      </div>
      <div className="card card-sm" style={{ borderLeft: '3px solid var(--text-3)' }}>
        <div className="text-xs text-muted">Total Pengeluaran</div>
        <div className="font-bold" style={{ fontSize: 15, marginTop: 2 }}>
          -{formatRupiah(totalOut)}
        </div>
      </div>
    </div>
  )
}

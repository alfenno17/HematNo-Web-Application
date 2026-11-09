// components/Dashboard.jsx
import React from 'react'
import {
  TrendingUp, TrendingDown, AlertTriangle, Wallet, ArrowRight, ShieldCheck, SlidersHorizontal,
} from 'lucide-react'
import { getKantongList, computeBalances, totalBalance, spentInRange, KANTONG_META, DEFAULT_ALLOCATIONS } from '../hooks/useStore.js'
import { formatRupiah, formatDate, startOfDay, startOfWeek, startOfMonth, endOfDay } from '../utils/format.js'

function KantongCard({ k, balance }) {
  const isNegative = balance < 0
  return (
    <div className={`kantong-card ${isNegative ? 'minus' : ''}`}>
      <div className="kantong-header">
        <div className="kantong-dot" style={{ background: k.color }} />
        <span className="kantong-name">{k.label}</span>
        <span className="kantong-pct">{k.pct}%</span>
      </div>
      <div className={`kantong-amount ${isNegative ? 'minus' : ''}`}>
        {formatRupiah(balance)}
      </div>
      {isNegative ? (
        <span className="minus-badge">SALDO MINUS</span>
      ) : (
        <div className="kantong-bar-track">
          <div
            className="kantong-bar-fill"
            style={{ width: `${Math.max(k.pct, 5)}%`, background: k.color, opacity: 0.35 }}
          />
        </div>
      )}
    </div>
  )
}

export default function Dashboard({
  transactions,
  limits,
  allocations = DEFAULT_ALLOCATIONS,
  onAddIncome,
  onAddExpense,
  onNavigateTab,
  onOpenAllocationSettings,
}) {
  const kantongList = getKantongList(allocations)
  const balances = computeBalances(transactions, allocations)
  const total    = totalBalance(balances)
  const recent   = transactions.slice(0, 5)
  const today    = new Date()

  // Calculate limits progress for Dashboard summary
  const limitItems = [
    { key: 'daily',   label: 'Harian',   range: { from: startOfDay(today), to: endOfDay(today) } },
    { key: 'weekly',  label: 'Mingguan', range: { from: startOfWeek(today), to: today } },
    { key: 'monthly', label: 'Bulanan',  range: { from: startOfMonth(today), to: today } },
  ].map(item => {
    const config = limits?.[item.key] || { amount: 0, enabled: false }
    const spent  = spentInRange(transactions, item.range.from, item.range.to)
    const pct    = config.enabled && config.amount > 0
      ? Math.min((spent / config.amount) * 100, 100)
      : 0
    return { ...item, ...config, spent, pct }
  })

  const hasAnyActiveLimit = limitItems.some(l => l.enabled && l.amount > 0)

  return (
    <>
      {/* Total Balance */}
      <div className="balance-card">
        <span className="balance-label">Total Saldo Terkumpul</span>
        <span className={`balance-amount ${total < 0 ? 'minus' : ''}`}>
          {formatRupiah(total)}
        </span>
        <span className="balance-date">
          {today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onAddIncome}>
          <TrendingUp size={16} color="#16a34a" />
          + Pemasukan
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onAddExpense}>
          <TrendingDown size={16} color="#dc2626" />
          - Pengeluaran
        </button>
      </div>

      {/* 4 Kantong with Custom Allocation Action */}
      <div>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <p className="section-title" style={{ margin: 0 }}>4 Kantong Saldo</p>
          </div>
          {onOpenAllocationSettings && (
            <button
              onClick={onOpenAllocationSettings}
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-1)',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 8px',
              }}
              title="Atur persentase alokasi kustom"
            >
              <SlidersHorizontal size={12} />
              <span>Atur Alokasi ({allocations.pokok}%·{allocations.hiburan}%·{allocations.tabungan}%·{allocations.darurat}%)</span>
            </button>
          )}
        </div>
        <div className="kantong-grid">
          {kantongList.map(k => (
            <KantongCard key={k.id} k={k} balance={balances[k.id]} />
          ))}
        </div>
      </div>

      {/* Progress Limit Widget */}
      <div>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <p className="section-title" style={{ margin: 0 }}>Progress Spending Limit</p>
          <button
            onClick={() => onNavigateTab('limits')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-1)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Kelola <ArrowRight size={13} />
          </button>
        </div>

        <div className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {hasAnyActiveLimit ? (
            limitItems
              .filter(l => l.enabled && l.amount > 0)
              .map(l => {
                const statusClass = l.pct >= 100 ? 'danger' : l.pct >= 80 ? 'warn' : 'safe'
                return (
                  <div key={l.key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div className="row-between" style={{ fontSize: 13 }}>
                      <span className="font-semibold">{l.label}</span>
                      <span className="text-xs text-muted">
                        <strong style={{ color: l.pct >= 100 ? 'var(--minus)' : 'var(--text-1)' }}>
                          {formatRupiah(l.spent)}
                        </strong>{' '}
                        / {formatRupiah(l.amount)}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className={`progress-fill ${statusClass}`} style={{ width: `${l.pct}%` }} />
                    </div>
                    {l.pct >= 100 && (
                      <span style={{ fontSize: 11, color: 'var(--minus)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AlertTriangle size={12} /> Limit {l.label.toLowerCase()} terlampaui!
                      </span>
                    )}
                  </div>
                )
              })
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck size={20} color="var(--text-3)" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Limit Belum Diatur</div>
                  <div className="text-xs text-muted">Atur batasan harian, mingguan, & bulanan</div>
                </div>
              </div>
              <button
                className="btn btn-secondary"
                style={{ height: 32, padding: '0 10px', fontSize: 12 }}
                onClick={() => onNavigateTab('limits')}
              >
                Atur
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="row-between" style={{ marginBottom: 8 }}>
          <p className="section-title" style={{ margin: 0 }}>Riwayat Transaksi Terbaru</p>
          {recent.length > 0 && (
            <button
              onClick={() => onNavigateTab('transactions')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-1)',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Lihat Semua <ArrowRight size={13} />
            </button>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="card empty-state">
            <Wallet size={32} />
            <p>Belum ada transaksi. Masukkan pemasukan pertamamu!</p>
          </div>
        ) : (
          <div className="tx-list">
            {recent.map(tx => (
              <TxRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function TxRow({ tx }) {
  const isIncome = tx.type === 'income'
  const kantong  = KANTONG_META.find(k => k.id === tx.kantong)
  return (
    <div className="tx-item">
      <div
        className="tx-icon"
        style={{
          background: isIncome ? '#f0fdf4' : '#fef2f2',
          color:      isIncome ? '#16a34a' : '#dc2626',
        }}
      >
        {isIncome
          ? <TrendingUp size={16} />
          : <TrendingDown size={16} />
        }
      </div>
      <div className="tx-info">
        <div className="tx-desc">{tx.desc}</div>
        <div className="tx-meta">
          <span>{formatDate(tx.date)}</span>
          {kantong && (
            <>
              <span>·</span>
              <span style={{ color: kantong.color, fontWeight: 600 }}>{kantong.label}</span>
            </>
          )}
          {isIncome && tx.allocations && (
            <>
              <span>·</span>
              <span>Alokasi ({tx.allocations.pokok}/{tx.allocations.hiburan}/{tx.allocations.tabungan}/{tx.allocations.darurat})</span>
            </>
          )}
        </div>
      </div>
      <div className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
        {isIncome ? '+' : '-'}{formatRupiah(tx.amount)}
      </div>
    </div>
  )
}

// App.jsx
import React, { useState } from 'react'
import {
  LayoutDashboard, ArrowLeftRight, ShieldCheck,
  TrendingUp, TrendingDown, SlidersHorizontal,
} from 'lucide-react'
import { useStore } from './hooks/useStore.js'
import { useToast } from './hooks/useToast.js'
import Dashboard        from './components/Dashboard.jsx'
import Transactions     from './components/Transactions.jsx'
import Limits           from './components/Limits.jsx'
import IncomeModal      from './components/IncomeModal.jsx'
import ExpenseModal     from './components/ExpenseModal.jsx'
import AllocationModal  from './components/AllocationModal.jsx'
import Toast            from './components/Toast.jsx'

const TABS = [
  { id: 'dashboard',    label: 'Beranda',   Icon: LayoutDashboard },
  { id: 'transactions', label: 'Riwayat',   Icon: ArrowLeftRight },
  { id: 'limits',       label: 'Limit',     Icon: ShieldCheck },
]

export default function App() {
  const [tab, setTab]           = useState('dashboard')
  const [modal, setModal]       = useState(null)   // 'income' | 'expense' | 'allocation' | null
  const { toasts, push }        = useToast()

  const {
    transactions,
    limits,
    allocations,
    addIncome,
    addExpense,
    deleteTransaction,
    setLimit,
    setAllocations,
  } = useStore()

  function handleAddIncome(amount, desc) {
    addIncome(amount, desc)
    push(`+Rp${amount.toLocaleString('id-ID')} dibagi ke 4 kantong`, 'success')
  }

  function handleAddExpense(amount, desc, kantong) {
    addExpense(amount, desc, kantong)
    push(`-Rp${amount.toLocaleString('id-ID')} dicatat dari ${kantong}`, 'default')
  }

  function handleDelete(id) {
    deleteTransaction(id)
    push('Transaksi dihapus', 'default')
  }

  function handleSaveAllocations(newAllocs) {
    setAllocations(newAllocs)
    push(`Alokasi kustom (${newAllocs.pokok}% / ${newAllocs.hiburan}% / ${newAllocs.tabungan}% / ${newAllocs.darurat}%) tersimpan!`, 'success')
  }

  const tabTitle = {
    dashboard:    'HematNo',
    transactions: 'Riwayat Transaksi',
    limits:       'Spending Limit',
  }

  return (
    <div className="app-shell">
      {/* Top Bar */}
      <header className="topbar">
        <div>
          <div className="topbar-title">{tabTitle[tab]}</div>
          {tab === 'dashboard' && (
            <div className="topbar-sub">Keuangan PKL yang rapi</div>
          )}
        </div>
        {tab === 'dashboard' && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              className="btn btn-secondary"
              style={{ height: 36, padding: '0 10px', fontSize: 13 }}
              onClick={() => setModal('income')}
              title="Tambah Pemasukan"
            >
              <TrendingUp size={14} color="#16a34a" /> Masuk
            </button>
            <button
              className="btn btn-secondary"
              style={{ height: 36, padding: '0 10px', fontSize: 13 }}
              onClick={() => setModal('expense')}
              title="Tambah Pengeluaran"
            >
              <TrendingDown size={14} color="#dc2626" /> Keluar
            </button>
            <button
              className="btn btn-secondary"
              style={{ height: 36, width: 36, padding: 0 }}
              onClick={() => setModal('allocation')}
              title="Pengaturan Alokasi Kantong"
              aria-label="Pengaturan Alokasi Kantong"
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="main-content">
        {tab === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            limits={limits}
            allocations={allocations}
            onAddIncome={() => setModal('income')}
            onAddExpense={() => setModal('expense')}
            onNavigateTab={setTab}
            onOpenAllocationSettings={() => setModal('allocation')}
          />
        )}
        {tab === 'transactions' && (
          <Transactions
            transactions={transactions}
            onDelete={handleDelete}
          />
        )}
        {tab === 'limits' && (
          <Limits
            limits={limits}
            transactions={transactions}
            onSetLimit={setLimit}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-btn ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon size={20} strokeWidth={tab === id ? 2.2 : 1.8} />
            {label}
          </button>
        ))}
      </nav>

      {/* Modals */}
      {modal === 'income' && (
        <IncomeModal
          allocations={allocations}
          onClose={() => setModal(null)}
          onSubmit={handleAddIncome}
          onOpenAllocationSettings={() => setModal('allocation')}
        />
      )}
      {modal === 'expense' && (
        <ExpenseModal
          transactions={transactions}
          allocations={allocations}
          onClose={() => setModal(null)}
          onSubmit={handleAddExpense}
        />
      )}
      {modal === 'allocation' && (
        <AllocationModal
          currentAllocations={allocations}
          onClose={() => setModal(null)}
          onSave={handleSaveAllocations}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} />
    </div>
  )
}

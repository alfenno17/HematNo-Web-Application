// App.jsx
import React, { useState } from 'react'
import {
  LayoutDashboard, ArrowLeftRight, ShieldCheck, Info,
  TrendingUp, TrendingDown,
} from 'lucide-react'
import { useStore } from './hooks/useStore.js'
import { useToast } from './hooks/useToast.js'
import Dashboard     from './components/Dashboard.jsx'
import Transactions  from './components/Transactions.jsx'
import Limits        from './components/Limits.jsx'
import IncomeModal   from './components/IncomeModal.jsx'
import ExpenseModal  from './components/ExpenseModal.jsx'
import Toast         from './components/Toast.jsx'

const TABS = [
  { id: 'dashboard',    label: 'Beranda',   Icon: LayoutDashboard },
  { id: 'transactions', label: 'Riwayat',   Icon: ArrowLeftRight },
  { id: 'limits',       label: 'Limit',     Icon: ShieldCheck },
]

export default function App() {
  const [tab, setTab]           = useState('dashboard')
  const [modal, setModal]       = useState(null)   // 'income' | 'expense' | null
  const { toasts, push }        = useToast()

  const {
    transactions,
    limits,
    addIncome,
    addExpense,
    deleteTransaction,
    setLimit,
  } = useStore()

  function handleAddIncome(amount, desc) {
    addIncome(amount, desc)
    push(`+Rp${amount.toLocaleString('id-ID')} ditambahkan ke kantong`, 'success')
  }

  function handleAddExpense(amount, desc, kantong) {
    addExpense(amount, desc, kantong)
    push(`-Rp${amount.toLocaleString('id-ID')} dari ${kantong}`, 'default')
  }

  function handleDelete(id) {
    deleteTransaction(id)
    push('Transaksi dihapus', 'default')
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
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-secondary"
              style={{ height: 36, padding: '0 12px', fontSize: 13 }}
              onClick={() => setModal('income')}
            >
              <TrendingUp size={14} /> Masuk
            </button>
            <button
              className="btn btn-secondary"
              style={{ height: 36, padding: '0 12px', fontSize: 13 }}
              onClick={() => setModal('expense')}
            >
              <TrendingDown size={14} /> Keluar
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
            onAddIncome={() => setModal('income')}
            onAddExpense={() => setModal('expense')}
            onNavigateTab={setTab}
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
          onClose={() => setModal(null)}
          onSubmit={handleAddIncome}
        />
      )}
      {modal === 'expense' && (
        <ExpenseModal
          transactions={transactions}
          onClose={() => setModal(null)}
          onSubmit={handleAddExpense}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} />
    </div>
  )
}

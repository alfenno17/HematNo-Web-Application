// useStore.js – Central state with LocalStorage persistence

import { useState, useEffect, useCallback } from 'react'

// ── constants ─────────────────────────────────────────────
export const KANTONG = [
  { id: 'pokok',    label: 'Kebutuhan Pokok', pct: 50, color: '#2563eb' },
  { id: 'hiburan',  label: 'Hiburan',         pct: 30, color: '#d97706' },
  { id: 'tabungan', label: 'Tabungan',         pct: 10, color: '#16a34a' },
  { id: 'darurat',  label: 'Dana Darurat',     pct: 10, color: '#dc2626' },
]

const DEFAULT_STATE = {
  transactions: [],   // { id, type:'income'|'expense', amount, desc, kantong, date }
  limits: {
    daily:   { amount: 0, enabled: false },
    weekly:  { amount: 0, enabled: false },
    monthly: { amount: 0, enabled: false },
  },
}

function load() {
  try {
    const raw = localStorage.getItem('hematno_v1')
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return DEFAULT_STATE
}

function save(state) {
  try {
    localStorage.setItem('hematno_v1', JSON.stringify(state))
  } catch (_) {}
}

// ── derived selectors ─────────────────────────────────────
export function computeBalances(transactions) {
  const balances = { pokok: 0, hiburan: 0, tabungan: 0, darurat: 0 }
  for (const tx of transactions) {
    if (tx.type === 'income') {
      for (const k of KANTONG) {
        balances[k.id] += (tx.amount * k.pct) / 100
      }
    } else {
      balances[tx.kantong] -= tx.amount
    }
  }
  return balances
}

export function totalBalance(balances) {
  return Object.values(balances).reduce((a, b) => a + b, 0)
}

// spending in a date range
export function spentInRange(transactions, from, to) {
  return transactions
    .filter(tx => {
      if (tx.type !== 'expense') return false
      const d = new Date(tx.date)
      return d >= from && d <= to
    })
    .reduce((sum, tx) => sum + tx.amount, 0)
}

// ── hook ─────────────────────────────────────────────────
export function useStore() {
  const [state, setState] = useState(() => load())

  useEffect(() => {
    save(state)
  }, [state])

  const addIncome = useCallback((amount, desc) => {
    const tx = {
      id:     crypto.randomUUID(),
      type:   'income',
      amount: Number(amount),
      desc:   desc || 'Pemasukan',
      kantong: null,
      date:   new Date().toISOString(),
    }
    setState(s => ({ ...s, transactions: [tx, ...s.transactions] }))
  }, [])

  const addExpense = useCallback((amount, desc, kantong) => {
    const tx = {
      id:     crypto.randomUUID(),
      type:   'expense',
      amount: Number(amount),
      desc:   desc || 'Pengeluaran',
      kantong,
      date:   new Date().toISOString(),
    }
    setState(s => ({ ...s, transactions: [tx, ...s.transactions] }))
  }, [])

  const deleteTransaction = useCallback((id) => {
    setState(s => ({ ...s, transactions: s.transactions.filter(tx => tx.id !== id) }))
  }, [])

  const setLimit = useCallback((period, amount, enabled) => {
    setState(s => ({
      ...s,
      limits: {
        ...s.limits,
        [period]: { amount: Number(amount), enabled },
      },
    }))
  }, [])

  return {
    transactions: state.transactions,
    limits:       state.limits,
    addIncome,
    addExpense,
    deleteTransaction,
    setLimit,
  }
}

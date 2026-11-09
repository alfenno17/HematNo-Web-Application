// useStore.js – Central state with LocalStorage persistence

import { useState, useEffect, useCallback } from 'react'

// ── metadata & default constants ──────────────────────────
export const KANTONG_META = [
  { id: 'pokok',    label: 'Kebutuhan Pokok', color: '#2563eb' },
  { id: 'hiburan',  label: 'Hiburan',         color: '#d97706' },
  { id: 'tabungan', label: 'Tabungan',         color: '#16a34a' },
  { id: 'darurat',  label: 'Dana Darurat',     color: '#dc2626' },
]

export const DEFAULT_ALLOCATIONS = {
  pokok: 50,
  hiburan: 30,
  tabungan: 10,
  darurat: 10,
}

// Helper to get array of pockets with their active percentage
export function getKantongList(allocations = DEFAULT_ALLOCATIONS) {
  return KANTONG_META.map(k => ({
    ...k,
    pct: allocations?.[k.id] ?? DEFAULT_ALLOCATIONS[k.id],
  }))
}

// Keep export for backward compatibility
export const KANTONG = getKantongList(DEFAULT_ALLOCATIONS)

const DEFAULT_STATE = {
  transactions: [],   // { id, type:'income'|'expense', amount, desc, kantong, date, split, allocations }
  limits: {
    daily:   { amount: 0, enabled: false },
    weekly:  { amount: 0, enabled: false },
    monthly: { amount: 0, enabled: false },
  },
  allocations: { ...DEFAULT_ALLOCATIONS },
}

function load() {
  try {
    const raw = localStorage.getItem('hematno_v1')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...DEFAULT_STATE,
        ...parsed,
        allocations: {
          ...DEFAULT_ALLOCATIONS,
          ...(parsed.allocations || {}),
        },
      }
    }
  } catch (_) {}
  return DEFAULT_STATE
}

function save(state) {
  try {
    localStorage.setItem('hematno_v1', JSON.stringify(state))
  } catch (_) {}
}

// ── derived selectors ─────────────────────────────────────
export function computeBalances(transactions, allocations = DEFAULT_ALLOCATIONS) {
  const balances = { pokok: 0, hiburan: 0, tabungan: 0, darurat: 0 }
  for (const tx of transactions) {
    if (tx.type === 'income') {
      if (tx.split) {
        // Use historical split if preserved
        for (const k of KANTONG_META) {
          balances[k.id] += tx.split[k.id] || 0
        }
      } else {
        // Fallback to tx.allocations or current allocations
        const alloc = tx.allocations || allocations || DEFAULT_ALLOCATIONS
        for (const k of KANTONG_META) {
          const pct = alloc[k.id] ?? DEFAULT_ALLOCATIONS[k.id]
          balances[k.id] += (tx.amount * pct) / 100
        }
      }
    } else {
      if (balances[tx.kantong] !== undefined) {
        balances[tx.kantong] -= tx.amount
      }
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
    setState(s => {
      const currentAlloc = s.allocations || DEFAULT_ALLOCATIONS
      const numAmount = Number(amount)
      const split = {
        pokok: (numAmount * (currentAlloc.pokok ?? 50)) / 100,
        hiburan: (numAmount * (currentAlloc.hiburan ?? 30)) / 100,
        tabungan: (numAmount * (currentAlloc.tabungan ?? 10)) / 100,
        darurat: (numAmount * (currentAlloc.darurat ?? 10)) / 100,
      }
      const tx = {
        id:          crypto.randomUUID(),
        type:        'income',
        amount:      numAmount,
        desc:        desc || 'Pemasukan',
        allocations: { ...currentAlloc },
        split,
        kantong:     null,
        date:        new Date().toISOString(),
      }
      return { ...s, transactions: [tx, ...s.transactions] }
    })
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

  const setAllocations = useCallback((newAllocations) => {
    setState(s => ({
      ...s,
      allocations: {
        pokok: Number(newAllocations.pokok) || 0,
        hiburan: Number(newAllocations.hiburan) || 0,
        tabungan: Number(newAllocations.tabungan) || 0,
        darurat: Number(newAllocations.darurat) || 0,
      },
    }))
  }, [])

  return {
    transactions:   state.transactions,
    limits:         state.limits,
    allocations:    state.allocations || DEFAULT_ALLOCATIONS,
    addIncome,
    addExpense,
    deleteTransaction,
    setLimit,
    setAllocations,
  }
}

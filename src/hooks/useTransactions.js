import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'budget-tracker-transactions';

//reading/getting the infos
function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read transactions from storage', err);
    return [];
  }
}

//every time transactions changes it automatically save the updated list back into localStorage
export function useTransactions() {
  const [transactions, setTransactions] = useState(readFromStorage);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((data) => {
    const newTransaction = {
      id: crypto.randomUUID(),
      ...data,
      amount: Number(data.amount),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) => prev.map((t) => t.id === id ? { ...t, ...updates, amount: Number(updates.amount ?? t.amount) } : t));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTransactionById = useCallback(
    (id) => transactions.find((t) => t.id === id),
    [transactions]
  );

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
  };
}
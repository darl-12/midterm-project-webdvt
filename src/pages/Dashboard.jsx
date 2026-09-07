import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import TransactionItem from '../components/TransactionItem';
import { formatCurrency } from '../utils/formatCurrency';
import { ALL_CATEGORIES } from '../utils/categories';

export default function Dashboard() {
  const { transactions } = useTransactions();
  const navigate = useNavigate();

//filters for type and category
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredTransactions = useMemo(() => {
  return transactions
    .filter((t) => {
      const matchesType = typeFilter === 'All' || t.type === typeFilter.toLowerCase();
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      return matchesType && matchesCategory;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, typeFilter, categoryFilter]);

  //calculation for the inome, expense, and balance
  const { income, expenses, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      <div className="card balance-card">
        <div className="balance-label">Current Balance</div>
        <div className="balance-amount">{formatCurrency(balance)}</div>
        <div className="balance-stats">
          <div>
            <div className="stat-label">Income</div>
            <div className="stat-value">{formatCurrency(income)}</div>
          </div>
          <div>
            <div className="stat-label">Expenses</div>
            <div className="stat-value">{formatCurrency(expenses)}</div>
          </div>
        </div>
      </div>

      <h2 className="section-title">Transactions</h2>
      <div className="card transactions-panel">
        <div className="filters-row">
          <div className="filter-group">
            <label>Type</label>
            <select
              className="select-input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option>All</option>
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              className="select-input"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>All</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="spacer" />

          <button className="btn btn-primary" onClick={() => navigate('/new-transaction')}>
            + Add Transaction
          </button>
        </div>

        <div className="transaction-list">
          {filteredTransactions.length === 0 && (
            <div className="empty-state">No transactions match these filters yet.</div>
          )}
          {filteredTransactions.map((t) => (
            <TransactionItem key={t.id} transaction={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

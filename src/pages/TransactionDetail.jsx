import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, formatDate } from '../utils/formatCurrency';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTransactionById, deleteTransaction } = useTransactions();

  const transaction = getTransactionById(id);
  const [confirmingDelete, setConfirmingDelete] = useState(false);


  function goBack() {
    navigate(-1);
  }

  //missing/deleted transaction
  if (!transaction) {
    return (
      <div className="page">
        <div className="card modal-card" style={{ textAlign: 'center' }}>
          <p>This transaction doesn't exist (it may have been deleted).</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isIncome = transaction.type === 'income';

  function handleDelete() {
    deleteTransaction(transaction.id);
    navigate('/');
  }

  return (
    <div className="page">
      <div className="card modal-card">
        <div className="modal-header">
          <span className="modal-back" onClick={goBack}>
            ‹
          </span>
          <h2 className="modal-title">Transaction Detail</h2>
        </div>

        <div className="modal-name">{transaction.name}</div>
        <div className={`modal-amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
          {isIncome ? '+ ' : '- '}
          {formatCurrency(transaction.amount)}
        </div>

        <div className="modal-meta">
          <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
            {isIncome ? 'Income' : 'Expense'}
          </span>
          <span className="transaction-category">{transaction.category}</span>
          <span className="transaction-date">{formatDate(transaction.date)}</span>
        </div>

        <div className="modal-note-field">
          <label style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>Note</label>
          <input
            className="text-input"
            value={transaction.note || 'No note added.'}
            readOnly
          />
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/edit-transaction/${transaction.id}`)}
          >
            <i className="bi bi-pencil-square" /> Edit
          </button>
          <button
            className="btn btn-danger-outline"
            onClick={() => setConfirmingDelete(true)}
          >
            <i className="bi bi-trash3" /> Delete
          </button>
        </div>

        {confirmingDelete && (
          <div className="confirm-box">
            Delete this transaction? This can't be undone.
            <div className="confirm-actions">
              <button className="btn btn-danger-outline" onClick={handleDelete}>
                Yes, delete
              </button>
              <button className="btn btn-outline" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
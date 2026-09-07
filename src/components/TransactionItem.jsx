import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/formatCurrency';

function TransactionItem({ transaction }) {
  const navigate = useNavigate();
  const isIncome = transaction.type === 'income';

  return (
    <div
      className="transaction-item"
        onClick={() => navigate(`/transaction-detail/${transaction.id}`)}
      role="button"
      tabIndex={0}
    >
    
    {/*the income/expense(type), transaction name, and category */}
      <div className="transaction-left">
        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
          {isIncome ? 'Income' : 'Expense'}
        </span>
        <span className="transaction-name">{transaction.name}</span>
        <span className="transaction-category">{transaction.category}</span>
      </div>

    {/*the date and amount */}
      <div className="transaction-right">
        <span className="transaction-date">{formatDate(transaction.date)}</span>
        <span className={`transaction-amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
          {isIncome ? '+ ' : '- '}
          {formatCurrency(transaction.amount)}
        </span>
      </div>
    </div>
  );
}

export default memo(TransactionItem);
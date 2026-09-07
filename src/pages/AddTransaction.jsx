import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import TransactionForm from '../components/TransactionForm';

export default function AddTransaction() {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  function handleSubmit(values) {
    addTransaction(values);
    navigate('/');
  }

  return (
    <div className="page">
      <TransactionForm
        title="New Transaction"
        submitLabel="Add Transaction"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}
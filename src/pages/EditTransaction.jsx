import { useNavigate, useParams } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import TransactionForm from '../components/TransactionForm';

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTransactionById, updateTransaction } = useTransactions();

  const transaction = getTransactionById(id);

    function handleSubmit(values) {
    updateTransaction(id, values);
    navigate(-1);
    }

    function handleCancel() {
      navigate(-1);
    }

//missing/deleted transaction
  if (!transaction) {
    return (
      <div className="page">
        <div className="card form-card" style={{ textAlign: 'center' }}>
          <p>This transaction doesn't exist (it may have been deleted).</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <TransactionForm
        title="Edit Transaction"
        submitLabel="Save Changes"
        initialValues={transaction}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
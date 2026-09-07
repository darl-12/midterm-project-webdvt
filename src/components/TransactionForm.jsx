//transaction form for add and edit transaction

import { useState } from 'react';
import { categoriesForType } from '../utils/categories';

const EMPTY_FORM = {
  type: 'income',
  name: '',
  amount: '',
  date: '',
  category: '',
  note: '',
};

export default function TransactionForm({
  initialValues,
  submitLabel = 'Add Transaction',
  title = 'New Transaction',
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});

  const categories = categoriesForType(values.type);

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleTypeChange(type) {
    setValues((prev) => ({ ...prev, type, category: '' }));
  }

  function validate() {
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Transaction name is required.';
    if (!values.amount || Number(values.amount) <= 0)
      nextErrors.amount = 'Enter an amount greater than 0.';
    if (!values.date) nextErrors.date = 'Date is required.';
    if (!values.category) nextErrors.category = 'Please choose a category.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...values, amount: Number(values.amount) });
}

  return (
    <div className="card form-card">
      <span className="back-link" onClick={onCancel}>
        <span className="back-arrow">‹</span> Back
      </span>
      <h2 className="form-title">{title}</h2>

      <div className="type-switch">
        <div
          className={`type-option ${values.type === 'income' ? 'active-income' : ''}`}
          onClick={() => handleTypeChange('income')}
        >
          Income
        </div>
        <div
          className={`type-option ${values.type === 'expense' ? 'active-expense' : ''}`}
          onClick={() => handleTypeChange('expense')}
        >
          Expense
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-field">
            <label>
              Transaction Name <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Groceries"
              className={`text-input ${errors.name ? 'input-error' : ''}`}
              value={values.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>
        </div>

        <div className="form-row two-col">
          <div className="form-field">
            <label>
              Amount <span className="required">*</span>
            </label>
            <div className="amount-input-wrap">
              <span className="amount-prefix">₱</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className={`text-input amount-input ${errors.amount ? 'input-error' : ''}`}
                value={values.amount}
                onChange={(e) => updateField('amount', e.target.value)}
              />
            </div>
            {errors.amount && <div className="error-text">{errors.amount}</div>}
          </div>

          <div className="form-field">
            <label>
              Date <span className="required">*</span>
            </label>
              <input
                type="date"
                className={`text-input date-input ${errors.date ? 'input-error' : ''}`}
                value={values.date}
                onChange={(e) => updateField('date', e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
            />
            {errors.date && <div className="error-text">{errors.date}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>
              Category <span className="required">*</span>
            </label>
            <select
              className={`select-input ${errors.category ? 'input-error' : ''}`}
              style={{ width: '100%' }}
              value={values.category}
              onChange={(e) => updateField('category', e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && <div className="error-text">{errors.category}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Note (optional)</label>
            <textarea
              className="textarea-input"
              placeholder="Add a note..."
              value={values.note}
              onChange={(e) => updateField('note', e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
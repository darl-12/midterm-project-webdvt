import { useMemo, useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import CategoryBreakdown from '../components/CategoryBreakdown';
import { formatCurrency } from '../utils/formatCurrency';

//converts date to string
function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

//reusable filter for expense and income breakdown (today, weekly, and monthly)
function filterByRange(list, range) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return list.filter((t) => {
    const d = parseLocalDate(t.date);
    if (range === 'today') return d.getTime() === today.getTime();
    if (range === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6);
      return d >= weekAgo && d <= today;
    }

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return d >= startOfMonth && d <= today;
  });
}

//group transactions by their category
function groupByCategory(list) {
  const byCategory = {};
  list.forEach((t) => {
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });
  return Object.entries(byCategory)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

//reusable buttons (today, weekly, and monthly)
function RangeTabs({ value, onChange, options }) {
  return (
    <div className="range-tabs">
      {options.map((opt) => (
        <span
          key={opt.value}
          className={`range-tab ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </span>
      ))}
    </div>
  );
}

const RANGE_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
];

const CHART_RANGE_OPTIONS = [
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
];


export default function Summary() {
  const { transactions } = useTransactions();
  const [incomeRange, setIncomeRange] = useState('week');
  const [expenseRange, setExpenseRange] = useState('week');
  const [chartRange, setChartRange] = useState('week');

  const { income, expenses, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

//donut chart
  const incomeCategoryData = useMemo(() => {
    const incomeOnly = transactions.filter((t) => t.type === 'income');
    return groupByCategory(filterByRange(incomeOnly, incomeRange));
  }, [transactions, incomeRange]);

//donut chart
  const expenseCategoryData = useMemo(() => {
    const expenseOnly = transactions.filter((t) => t.type === 'expense');
    return groupByCategory(filterByRange(expenseOnly, expenseRange));
  }, [transactions, expenseRange]);

//weely bar graph
  const weeklyData = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    return days.map((d) => {
      const iso = d.toISOString().slice(0, 10);
      const dayTransactions = transactions.filter((t) => t.date === iso);
      const dayIncome = dayTransactions
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0);
      const dayExpense = dayTransactions
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
      return {
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        income: dayIncome,
        expense: dayExpense,
      };
    });
  }, [transactions]);

  //monthly bar cahrt
    const monthlyData = useMemo(() => {
    const year = new Date().getFullYear();

    const months = [];
    for (let m = 0; m <= 11; m++) {
      months.push(new Date(year, m, 1));
    }

    return months.map((d) => {
      const monthTransactions = transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      });
      const monthIncome = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0);
      const monthExpense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
      return {
        label: d.toLocaleDateString('en-US', { month: 'short' }),
        income: monthIncome,
        expense: monthExpense,
      };
    });
  }, [transactions]);

  const chartData = chartRange === 'week' ? weeklyData : monthlyData;
  const maxChartValue = Math.max(1, ...chartData.flatMap((d) => [d.income, d.expense])); //finds the largest number for the bar graph

//the horizontal label in the bar graph
  const CHART_TICK_FRACTIONS = [1, 0.75, 0.5, 0.25, 0];
  const chartYAxisTicks = CHART_TICK_FRACTIONS.map((fraction) =>
    formatCurrency(maxChartValue * fraction).replace(/\.00$/, '')
  );

  return (
    <div className="page">
      <h1 className="page-title">Summary</h1>

      <div className="summary-top-stats">
        <div className="summary-stat">
          <div className="summary-stat-value">{formatCurrency(balance)}</div>
          <div className="summary-stat-label">Current Balance</div>
        </div>
        <div className="summary-stat">
          <div className="summary-stat-value">{formatCurrency(income)}</div>
          <div className="summary-stat-label">Total Income</div>
        </div>
        <div className="summary-stat">
          <div className="summary-stat-value">{formatCurrency(expenses)}</div>
          <div className="summary-stat-label">Total Expense</div>
        </div>
      </div>


      <div className="card summary-card">
        <div className="summary-card-head">
          <h3 className="section-title" style={{ margin: 0 }}>
            Income Breakdown
          </h3>
          <RangeTabs value={incomeRange} onChange={setIncomeRange} options={RANGE_OPTIONS} />
        </div>
        <CategoryBreakdown data={incomeCategoryData} emptyLabel="No income recorded for this period." />
      </div>

      <div className="card summary-card">
        <div className="summary-card-head">
          <h3 className="section-title" style={{ margin: 0 }}>
            Expense Breakdown
          </h3>
          <RangeTabs value={expenseRange} onChange={setExpenseRange} options={RANGE_OPTIONS} />
        </div>
        <CategoryBreakdown data={expenseCategoryData} emptyLabel="No expenses recorded for this period." />
      </div>

      <div className="card summary-card">
        <div className="summary-card-head">
          <h3 className="section-title" style={{ margin: 0 }}>
            Transactions
          </h3>
          <RangeTabs value={chartRange} onChange={setChartRange} options={CHART_RANGE_OPTIONS} />
        </div>

          <div className="chart-container">
          <div className="chart-y-axis">
            {CHART_TICK_FRACTIONS.map((fraction, i) => (
              <span
                key={fraction}
                className="chart-y-tick"
                style={{ bottom: `${fraction * 100}%` }}
              >
                {chartYAxisTicks[i]}
              </span>
            ))}
          </div>
            <div className="chart-plot">
            <div className="chart-wrap">
              <div className="chart-grid">
                {CHART_TICK_FRACTIONS.map((fraction) => (
                  <div
                    key={fraction}
                    className="chart-gridline"
                    style={{ bottom: `${fraction * 100}%` }}
                  />
                ))}
              </div>
              {chartData.map((d) => (
                <div className="chart-bars" key={d.label}>
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(d.expense / maxChartValue) * 100}%`,
                      background: '#676767',
                    }}
                    title={`Expense: ${formatCurrency(d.expense)}`}
                  />
                  <div
                    className="chart-bar"
                    style={{
                      height: `${(d.income / maxChartValue) * 100}%`,
                      background: 'var(--success)',
                    }}
                    title={`Income: ${formatCurrency(d.income)}`}
                  />
                </div>
              ))}
            </div>
            <div className="chart-x-axis-row">
              {chartData.map((d) => (
                <span className="chart-x-label" key={d.label}>
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="chart-legend">
          <span>
            <span className="legend-dot" style={{ background: '#676767' }} />
            Expense
          </span>
          <span>
            <span className="legend-dot" style={{ background: 'var(--success)' }} />
            Income
          </span>
        </div>
      </div>
    </div>
  );
}
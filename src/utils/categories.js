export const INCOME_CATEGORIES = [
  'Salary', 
  'Allowance', 
  'Other Income'
];

export const EXPENSE_CATEGORIES = [
  'Food',
  'Grocery',
  'Utilities',
  'Transportation',
  'Shopping',
  'Other Expense',
];

export function categoriesForType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export const ALL_CATEGORIES = Array.from(new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]));

export const CHART_COLORS = [
  '#809bce',
  '#a2d2ff',
  '#ffc8dd',
  '#cdb4db',
  '#ccd5ae',
  '#957fef',
  '#fbf8cc',
  '#b9fbc0',
];

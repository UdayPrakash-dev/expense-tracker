import API from './client';

export const getExpenses = async () => {
  const response = await API.get('/expenses/getExpenses');
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await API.get(`/expenses/${id}`);
  return response.data;
};

export const getExpensesByMonth = async (month, year) => {
  const url = year ? `/expenses/month/${month}?year=${year}` : `/expenses/month/${month}`;
  const response = await API.get(url);
  return response.data;
};

export const getTotalExpenses = async () => {
  const response = await API.get('/expenses/total');
  return response.data;
};

export const addExpense = async (expenseData) => {
  const payload = {
    Category: String(expenseData.Category || '').trim(),
    Amount: Number(expenseData.Amount),
    Merchant: String(expenseData.Merchant || '').trim(),
    Date: expenseData.Date,
  };
  const response = await API.post('/expenses', payload);
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const payload = {};
  if (expenseData.Category !== undefined) payload.Category = String(expenseData.Category).trim();
  if (expenseData.Amount !== undefined) payload.Amount = Number(expenseData.Amount);
  if (expenseData.Merchant !== undefined) payload.Merchant = String(expenseData.Merchant).trim();
  if (expenseData.Date !== undefined) payload.Date = expenseData.Date;
  const response = await API.put(`/expenses/${id}`, payload);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};

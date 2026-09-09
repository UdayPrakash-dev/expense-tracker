import axios from 'axios';

const API = axios.create({
  baseURL: '/api/expenses'
});

export const getExpenses = async () => {
  const response = await API.get('/getExpenses');
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await API.get(`/${id}`);
  return response.data;
};

export const getExpensesByMonth = async (month) => {
  const response = await API.get(`/month/${month}`);
  return response.data;
};

export const getTotalExpenses = async () => {
  const response = await API.get('/total');
  return response.data;
};

export const addExpense = async (expenseData) => {
  // Ensure Amount is a number
  const data = { ...expenseData, Amount: Number(expenseData.Amount) };
  const response = await API.post('/', data);
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const data = { ...expenseData, Amount: Number(expenseData.Amount) };
  const response = await API.put(`/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  // Pass both in URL and body to accommodate backend controller requirements
  const response = await API.delete(`/${id}`, {
    data: { expenseId: id }
  });
  return response.data;
};

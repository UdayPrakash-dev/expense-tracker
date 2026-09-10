import API from './client';

export const signupUser = async ({ name, email, pass }) => {
  const response = await API.post('/auth/signup', { name, email, pass });
  return response.data;
};

export const loginUser = async ({ email, pass }) => {
  const response = await API.post('/auth/login', { email, pass });
  return response.data;
};

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createUser = async (userData) => {
  const response = await api.post('/users/create', userData);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await api.post('/messages/send', messageData);
  return response.data;
};

export const getConversation = async (user1Id, user2Id) => {
  const response = await api.get(`/messages/conversation/${user1Id}/${user2Id}`);
  return response.data;
};

export const getUserMessages = async (userId) => {
  const response = await api.get(`/messages/user/${userId}`);
  return response.data;
};
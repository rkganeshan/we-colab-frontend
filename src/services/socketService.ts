import { io, Socket } from 'socket.io-client';
import axios, { AxiosError } from 'axios';
import config from '../config';

let socket: Socket;

export const connectSocket = (roomId: string) => {
  socket = io(config.API_BASE_URL);
  socket.emit('join-room', roomId);
  return socket;
};

export const getSocket = () => socket;

export const saveSession = async (roomId: string, drawData: any) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await axios.post(`${config.API_BASE_URL}/api/whiteboard/save`, { roomId, drawData }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error saving session:', error);
    return { success: false, error: (error as AxiosError).message };
  }
};

export const loadSession = async (roomId: string, mode?: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${config.API_BASE_URL}/api/whiteboard/session/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { mode },
    });
    return response.data;
  } catch (error) {
    console.error('Error loading session:', error);
    return { success: false, error: (error as AxiosError).message };
  }
};


export const joinSession = async (userId: number, sessionId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${config.API_BASE_URL}/api/whiteboard/join`, { userId, sessionId },{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error joining session:', error);
  }
};

export const loadUserSessions = async (userId: number) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${config.API_BASE_URL}/api/whiteboard/sessions/${userId}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error loading user sessions:', error);
  }
};
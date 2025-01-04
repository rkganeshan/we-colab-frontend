import { AxiosError } from 'axios';
import { io, Socket } from 'socket.io-client';
import axiosInstance from './axiosInstance';
import config from '../config';

let socket: Socket;

export const connectSocket = (roomId: string) => {
  socket = io(config.API_BASE_URL);
  socket.emit('join-room', roomId);
  return socket;
};

export const getSocket = () => socket;

export const saveSession = async (roomId: string, drawData: any) => {
  try {
    const response = await axiosInstance.post('/api/whiteboard/save', { roomId, drawData }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
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
    const response = await axiosInstance.get(`/api/whiteboard/session/${roomId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
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
    const response = await axiosInstance.post('/api/whiteboard/join', { userId, sessionId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error joining session:', error);
  }
};

export const loadUserSessions = async (userId: number) => {
  try {
    const response = await axiosInstance.get(`/api/whiteboard/sessions/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error loading user sessions:', error);
  }
};
export interface User {
  _id: string;
  phone: string;
  name: string;
  role: 'parent' | 'tutor' | 'admin';
  province?: string;
  city?: string;
  district?: string;
  subjects?: string[];
  classes?: string[];
  photo?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Message {
  _id?: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isAlert: boolean;
}

export interface Conversation {
  _id: string;
  participants: string[];
  messages: Message[];
  lastActivity: Date;
}

export interface SearchFilters {
  province: string;
  city: string;
  class: string;
  subject: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
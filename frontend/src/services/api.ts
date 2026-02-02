import axios from 'axios';
import {
    LoginCredentials,
    SignupCredentials,
    AuthResponse,
    User,
    SignupResponse,
    LoginResponse,
    OTPVerifyRequest
} from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
        try {
            const authData = JSON.parse(token);
            if (authData.state?.token) {
                config.headers.Authorization = `Bearer ${authData.state.token}`;
            }
        } catch (error) {
            console.error('Failed to parse auth token:', error);
        }
    }
    return config;
});

export const authService = {
    // Signup - returns message, no token (user must login)
    signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
        const { confirmPassword, ...data } = credentials;
        const response = await api.post<SignupResponse>('/api/auth/signup', data);
        return response.data;
    },

    // Login - initiates OTP flow, returns message
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const formData = new URLSearchParams();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);

        const response = await api.post<LoginResponse>('/api/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    },

    // Verify OTP - completes login, returns token
    verifyOTP: async (data: OTPVerifyRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/auth/verify-otp', data);
        return response.data;
    },

    // Resend OTP
    resendOTP: async (email: string): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/api/auth/resend-otp', { email });
        return response.data;
    },

    // Google Sign-In
    googleSignIn: async (credential: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/api/auth/google', { credential });
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<User>('/api/auth/me');
        return response.data;
    },
};

export default api;

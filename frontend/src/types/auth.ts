export interface User {
    id: number;
    email: string;
    created_at: string;
    auth_provider?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials extends LoginCredentials {
    confirmPassword?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// New types for updated auth flow

export interface SignupResponse {
    message: string;
    email: string;
}

export interface LoginResponse {
    message: string;
    email: string;
    requires_otp: boolean;
}

export interface OTPVerifyRequest {
    email: string;
    otp_code: string;
}


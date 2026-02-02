import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, UserPlus, Sparkles, Rocket, Code, Zap, Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { LoginCredentials, SignupCredentials } from '../../types/auth';
import {
    Box, Paper, Typography, TextField, Button, Fade, Slide, Alert, CircularProgress, Divider
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import OTPInput from '../../components/OTPInput';

// Google Client ID from environment or placeholder
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

// Custom dark theme with primary color
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FF4C29',
        },
        background: {
            default: '#0a0a0a',
            paper: '#111111',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#FF4C29',
                            },
                        },
                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#FF4C29',
                                borderWidth: '2px',
                            },
                        },
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 24px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 15px rgba(255, 76, 41, 0.3)',
                    },
                },
            },
        },
    },
});

type AuthStep = 'credentials' | 'otp' | 'success';

export const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [authStep, setAuthStep] = useState<AuthStep>('credentials');
    const [otpEmail, setOtpEmail] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);

    const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors }, reset: resetLogin } = useForm<LoginCredentials>();
    const { register: registerSignup, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors }, watch, reset: resetSignup } = useForm<SignupCredentials>();

    // Countdown timer for resend OTP
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const onLogin = async (data: LoginCredentials) => {
        try {
            setLoading(true);
            setError('');
            const response = await authService.login(data);

            if (response.requires_otp) {
                setOtpEmail(response.email);
                setAuthStep('otp');
                setResendCooldown(60);
                setSuccess('Verification code sent to your email');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onSignup = async (data: SignupCredentials) => {
        try {
            setLoading(true);
            setError('');
            const response = await authService.signup(data);

            // Show success message and redirect to login
            setSuccess(response.message);
            setAuthStep('success');
            resetSignup();

            // Auto-switch to login after 2 seconds
            setTimeout(() => {
                setIsLogin(true);
                setAuthStep('credentials');
                setSuccess('');
            }, 2500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onVerifyOTP = async (otpCode: string) => {
        try {
            setLoading(true);
            setError('');
            const response = await authService.verifyOTP({
                email: otpEmail,
                otp_code: otpCode
            });

            setAuth(response.user, response.access_token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid verification code. Please try again.');
            setLoading(false);
        }
    };

    const onResendOTP = async () => {
        if (resendCooldown > 0) return;

        try {
            setLoading(true);
            setError('');
            await authService.resendOTP(otpEmail);
            setResendCooldown(60);
            setSuccess('Verification code resent to your email');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to resend code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            setError('Google Sign-In failed. Please try again.');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await authService.googleSignIn(credentialResponse.credential);
            setAuth(response.user, response.access_token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Google Sign-In failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onGoogleError = () => {
        setError('Google Sign-In failed. Please try again.');
    };

    const goBackToCredentials = () => {
        setAuthStep('credentials');
        setError('');
        setSuccess('');
        setOtpEmail('');
        resetLogin();
    };

    const password = watch('password');

    const renderOTPStep = () => (
        <Fade in={authStep === 'otp'} timeout={400}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button
                    startIcon={<ArrowLeft size={18} />}
                    onClick={goBackToCredentials}
                    sx={{
                        alignSelf: 'flex-start',
                        mb: 2,
                        color: 'grey.400',
                        '&:hover': { color: 'white', bgcolor: 'transparent' },
                    }}
                >
                    Back
                </Button>

                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'rgba(255, 76, 41, 0.1)',
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                    }}
                >
                    <Mail size={32} style={{ color: '#FF4C29' }} />
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                    Check your email
                </Typography>
                <Typography sx={{ color: 'grey.400', mb: 1, textAlign: 'center' }}>
                    We sent a verification code to
                </Typography>
                <Typography sx={{ color: 'primary.main', fontWeight: 600, mb: 4 }}>
                    {otpEmail}
                </Typography>

                <OTPInput onComplete={onVerifyOTP} disabled={loading} />

                {loading && (
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CircularProgress size={20} color="primary" />
                        <Typography sx={{ color: 'grey.400' }}>Verifying...</Typography>
                    </Box>
                )}

                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ color: 'grey.500', fontSize: '0.9rem' }}>
                        Didn't receive the code?
                    </Typography>
                    <Button
                        onClick={onResendOTP}
                        disabled={resendCooldown > 0 || loading}
                        startIcon={<RefreshCw size={16} />}
                        sx={{
                            color: resendCooldown > 0 ? 'grey.600' : 'primary.main',
                            fontSize: '0.9rem',
                            minWidth: 'auto',
                            '&:hover': { bgcolor: 'transparent' },
                        }}
                    >
                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
                    </Button>
                </Box>
            </Box>
        </Fade>
    );

    const renderSuccessStep = () => (
        <Fade in={authStep === 'success'} timeout={400}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        border: '2px solid rgba(34, 197, 94, 0.3)',
                    }}
                >
                    <Sparkles size={40} style={{ color: '#22c55e' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
                    Account Created!
                </Typography>
                <Typography sx={{ color: 'grey.400', textAlign: 'center' }}>
                    {success}
                </Typography>
                <Typography sx={{ color: 'grey.500', mt: 2, fontSize: '0.9rem' }}>
                    Redirecting to login...
                </Typography>
            </Box>
        </Fade>
    );

    const renderCredentialsStep = () => (
        <>
            {/* Toggle Buttons - Clean Design */}
            <Box
                sx={{
                    display: 'flex',
                    mb: 3,
                    border: '1px solid rgba(255, 76, 41, 0.3)',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}
            >
                <Box
                    onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                    sx={{
                        flex: 1,
                        py: 1.5,
                        px: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        bgcolor: isLogin ? '#FF4C29' : 'transparent',
                        color: isLogin ? '#0a0a0a' : 'grey.400',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: isLogin ? '#0a0a0a' : 'white',
                        },
                    }}
                >
                    <LogIn size={18} />
                    Login
                </Box>
                <Box
                    onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                    sx={{
                        flex: 1,
                        py: 1.5,
                        px: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        bgcolor: !isLogin ? '#FF4C29' : 'transparent',
                        color: !isLogin ? '#0a0a0a' : 'grey.400',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            color: !isLogin ? '#0a0a0a' : 'white',
                        },
                    }}
                >
                    <UserPlus size={18} />
                    Sign Up
                </Box>
            </Box>

            {/* Login Form */}
            {isLogin ? (
                <Fade in={isLogin} timeout={400}>
                    <form onSubmit={handleLoginSubmit(onLogin)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                id="login-email"
                                label="Email"
                                type="email"
                                fullWidth
                                placeholder="you@example.com"
                                {...registerLogin('email', { required: 'Email is required' })}
                                error={!!loginErrors.email}
                                helperText={loginErrors.email?.message}
                                sx={{
                                    '& .MuiInputBase-input': { fontSize: '1rem', py: 1.5 },
                                    '& .MuiInputLabel-root': { fontSize: '1rem' },
                                    '& .MuiFormHelperText-root': { fontSize: '0.8rem' },
                                }}
                            />

                            <TextField
                                id="login-password"
                                label="Password"
                                type="password"
                                fullWidth
                                placeholder="••••••••"
                                {...registerLogin('password', { required: 'Password is required' })}
                                error={!!loginErrors.password}
                                helperText={loginErrors.password?.message}
                                sx={{
                                    '& .MuiInputBase-input': { fontSize: '1rem', py: 1.5 },
                                    '& .MuiInputLabel-root': { fontSize: '1rem' },
                                    '& .MuiFormHelperText-root': { fontSize: '0.8rem' },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    mt: 1,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    bgcolor: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                }}
                            >
                                {loading ? <CircularProgress size={22} color="inherit" /> : 'Login'}
                            </Button>
                        </Box>
                    </form>
                </Fade>
            ) : (
                // Signup Form
                <Fade in={!isLogin} timeout={400}>
                    <form onSubmit={handleSignupSubmit(onSignup)}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                id="signup-email"
                                label="Email"
                                type="email"
                                fullWidth
                                placeholder="you@example.com"
                                {...registerSignup('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                error={!!signupErrors.email}
                                helperText={signupErrors.email?.message}
                                sx={{
                                    '& .MuiInputBase-input': { fontSize: '1rem', py: 1.5 },
                                    '& .MuiInputLabel-root': { fontSize: '1rem' },
                                    '& .MuiFormHelperText-root': { fontSize: '0.8rem' },
                                }}
                            />

                            <TextField
                                id="signup-password"
                                label="Password"
                                type="password"
                                fullWidth
                                placeholder="••••••••"
                                {...registerSignup('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                error={!!signupErrors.password}
                                helperText={signupErrors.password?.message}
                                sx={{
                                    '& .MuiInputBase-input': { fontSize: '1rem', py: 1.5 },
                                    '& .MuiInputLabel-root': { fontSize: '1rem' },
                                    '& .MuiFormHelperText-root': { fontSize: '0.8rem' },
                                }}
                            />

                            <TextField
                                id="signup-confirm-password"
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                placeholder="••••••••"
                                {...registerSignup('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: (value) => value === password || 'Passwords do not match'
                                })}
                                error={!!signupErrors.confirmPassword}
                                helperText={signupErrors.confirmPassword?.message}
                                sx={{
                                    '& .MuiInputBase-input': { fontSize: '1rem', py: 1.5 },
                                    '& .MuiInputLabel-root': { fontSize: '1rem' },
                                    '& .MuiFormHelperText-root': { fontSize: '0.8rem' },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    mt: 1,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    bgcolor: 'primary.main',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                }}
                            >
                                {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign Up'}
                            </Button>
                        </Box>
                    </form>
                </Fade>
            )}

            {/* Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
                <Divider sx={{ flex: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <Typography sx={{ px: 2, color: 'grey.500', fontSize: '0.85rem' }}>
                    or continue with
                </Typography>
                <Divider sx={{ flex: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            </Box>

            {/* Google Sign-In Button */}
            {GOOGLE_CLIENT_ID ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <GoogleLogin
                        onSuccess={onGoogleSuccess}
                        onError={onGoogleError}
                        theme="filled_black"
                        size="large"
                        shape="rectangular"
                        text={isLogin ? 'signin_with' : 'signup_with'}
                        width="100%"
                    />
                </Box>
            ) : (
                <Button
                    fullWidth
                    disabled
                    sx={{
                        py: 1.5,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'grey.500',
                        fontSize: '0.9rem',
                    }}
                >
                    <Box
                        component="img"
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        sx={{ width: 18, height: 18, mr: 1.5 }}
                    />
                    Google Sign-In (Not Configured)
                </Button>
            )}
        </>
    );

    const content = (
        <ThemeProvider theme={darkTheme}>
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    overflow: 'hidden',
                    bgcolor: 'background.default',
                }}
            >
                {/* Left Side - Platform Details with WHITE background */}
                <Slide direction="right" in={true} timeout={800}>
                    <Box
                        sx={{
                            display: { xs: 'none', lg: 'flex' },
                            width: '50%',
                            bgcolor: '#ffffff',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 5,
                        }}
                    >
                        <Box sx={{ maxWidth: 420 }}>
                            <Fade in={true} timeout={1000}>
                                <Box sx={{ mb: 4 }}>
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: 50,
                                            height: 50,
                                            bgcolor: 'rgba(255, 76, 41, 0.1)',
                                            border: '1px solid rgba(255, 76, 41, 0.3)',
                                            borderRadius: 2,
                                            mb: 2.5,
                                        }}
                                    >
                                        <Sparkles style={{ color: '#FF4C29' }} size={26} />
                                    </Box>
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#0a0a0a',
                                            mb: 1.5,
                                            fontSize: '1.75rem',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        Build Your SaaS with சந்தை
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: '#555555',
                                            fontSize: '1rem',
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        SaaS சந்தை by Social Eagle AI makes it easy for anyone to build and launch their own SaaS product.
                                    </Typography>
                                </Box>
                            </Fade>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                {[
                                    { icon: <Rocket style={{ color: '#FF4C29' }} size={20} />, title: 'Ready-to-Use Templates', desc: 'Pre-built templates for common SaaS use cases' },
                                    { icon: <Code style={{ color: '#FF4C29' }} size={20} />, title: 'Full-Stack Foundation', desc: 'React + FastAPI with auth and deployment ready' },
                                    { icon: <Zap style={{ color: '#FF4C29' }} size={20} />, title: 'Step-by-Step Guidance', desc: 'Comprehensive docs to guide you through' },
                                ].map((item, index) => (
                                    <Fade in={true} timeout={1200 + index * 200} key={index}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <Box
                                                sx={{
                                                    flexShrink: 0,
                                                    width: 42,
                                                    height: 42,
                                                    bgcolor: 'rgba(255, 76, 41, 0.1)',
                                                    border: '1px solid rgba(255, 76, 41, 0.25)',
                                                    borderRadius: 1.5,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {item.icon}
                                            </Box>
                                            <Box sx={{ ml: 2 }}>
                                                <Typography sx={{ color: '#0a0a0a', fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                                                    {item.title}
                                                </Typography>
                                                <Typography sx={{ color: '#666666', fontSize: '0.9rem' }}>
                                                    {item.desc}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Fade>
                                ))}
                            </Box>

                            <Fade in={true} timeout={2000}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mt: 4,
                                        p: 2.5,
                                        bgcolor: 'rgba(255, 76, 41, 0.05)',
                                        border: '1px solid rgba(255, 76, 41, 0.15)',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography sx={{ color: '#444444', fontSize: '0.95rem', fontStyle: 'italic' }}>
                                        "From idea to launch in days, not months. This platform transformed how I build products."
                                    </Typography>
                                    <Typography sx={{ color: '#FF4C29', fontWeight: 600, mt: 1, fontSize: '0.85rem' }}>
                                        - SaaS Builder
                                    </Typography>
                                </Paper>
                            </Fade>
                        </Box>
                    </Box>
                </Slide>

                {/* Right Side - Auth Form (Dark) */}
                <Box
                    sx={{
                        width: { xs: '100%', lg: '50%' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        bgcolor: 'background.default',
                    }}
                >
                    <Fade in={true} timeout={600}>
                        <Box sx={{ width: '100%', maxWidth: 380 }}>
                            {authStep === 'credentials' && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            color: 'primary.main',
                                            mb: 0.5,
                                            fontSize: '1.5rem',
                                        }}
                                    >
                                        {isLogin ? 'Welcome Back' : 'Get Started'}
                                    </Typography>
                                    <Typography sx={{ color: 'grey.400', fontSize: '0.95rem' }}>
                                        {isLogin ? 'Login to continue building' : 'Create your account to start building'}
                                    </Typography>
                                </Box>
                            )}

                            {error && (
                                <Fade in={true}>
                                    <Alert
                                        severity="error"
                                        sx={{
                                            mb: 2,
                                            py: 1,
                                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            borderRadius: 2,
                                            '& .MuiAlert-message': { fontSize: '0.9rem' },
                                        }}
                                    >
                                        {error}
                                    </Alert>
                                </Fade>
                            )}

                            {success && authStep !== 'success' && (
                                <Fade in={true}>
                                    <Alert
                                        severity="success"
                                        sx={{
                                            mb: 2,
                                            py: 1,
                                            bgcolor: 'rgba(34, 197, 94, 0.1)',
                                            border: '1px solid rgba(34, 197, 94, 0.3)',
                                            borderRadius: 2,
                                            '& .MuiAlert-message': { fontSize: '0.9rem' },
                                        }}
                                    >
                                        {success}
                                    </Alert>
                                </Fade>
                            )}

                            {authStep === 'credentials' && renderCredentialsStep()}
                            {authStep === 'otp' && renderOTPStep()}
                            {authStep === 'success' && renderSuccessStep()}
                        </Box>
                    </Fade>
                </Box>
            </Box>
        </ThemeProvider>
    );

    // Wrap with GoogleOAuthProvider if client ID is available
    if (GOOGLE_CLIENT_ID) {
        return (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                {content}
            </GoogleOAuthProvider>
        );
    }

    return content;
};

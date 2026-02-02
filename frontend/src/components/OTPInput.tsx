import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Box, TextField } from '@mui/material';

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    disabled?: boolean;
}

export const OTPInput = ({ length = 6, onComplete, disabled = false }: OTPInputProps) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Check if OTP is complete
        const otpString = newOtp.join('');
        if (otpString.length === length && !newOtp.includes('')) {
            onComplete(otpString);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
            } else {
                // Clear current input
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

        if (pastedData) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);

            // Focus the next empty input or last input
            const nextEmptyIndex = newOtp.findIndex(val => val === '');
            if (nextEmptyIndex !== -1) {
                inputRefs.current[nextEmptyIndex]?.focus();
            } else {
                inputRefs.current[length - 1]?.focus();
            }

            // Check if OTP is complete
            const otpString = newOtp.join('');
            if (otpString.length === length && !newOtp.includes('')) {
                onComplete(otpString);
            }
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1.5,
                justifyContent: 'center',
            }}
            onPaste={handlePaste}
        >
            {otp.map((digit, index) => (
                <TextField
                    key={index}
                    inputRef={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value.slice(-1))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={disabled}
                    inputProps={{
                        maxLength: 1,
                        style: {
                            textAlign: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            padding: '12px 0',
                            fontFamily: 'monospace',
                        },
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                    }}
                    sx={{
                        width: 48,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& fieldset': {
                                borderColor: 'rgba(255, 76, 41, 0.3)',
                            },
                            '&:hover fieldset': {
                                borderColor: '#FF4C29',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#FF4C29',
                                borderWidth: 2,
                            },
                        },
                        '& .MuiInputBase-input': {
                            color: '#FF4C29',
                        },
                    }}
                />
            ))}
        </Box>
    );
};

export default OTPInput;

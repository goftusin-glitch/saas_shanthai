import { Check, Rocket } from 'lucide-react';
import { Box, Typography, Paper, Button } from '@mui/material';

export const Subscription = () => {
    const benefits = [
        'SaaS Building Learning Videos',
        'Private SaaS Community',
        'SaaS Guide',
        'List Unlimited Products',
        'Traffic to your products',
        'Private SaaS building template',
    ];

    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                bgcolor: '#ffffff',
                minHeight: 'calc(100vh - 64px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        color: '#1a1a1a',
                        mb: 0.5,
                        fontSize: { xs: '1.5rem', md: '2rem' },
                    }}
                >
                    Build and Launch Complete SaaS in 1 day not months
                </Typography>
                <Typography sx={{ color: '#666666', fontSize: '0.95rem' }}>
                    Get everything you need to launch your SaaS business
                </Typography>
            </Box>

            {/* Single Pricing Card */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, md: 4 },
                    bgcolor: '#f8f9fa',
                    border: '2px solid #FF4C29',
                    borderRadius: 4,
                    maxWidth: 500,
                    width: '100%',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    {/* Icon */}
                    <Box
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255, 76, 41, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Rocket size={26} style={{ color: '#FF4C29' }} />
                    </Box>

                    {/* Plan Name & Price */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
                            Lifetime Access
                        </Typography>
                        <Typography sx={{ color: '#666666', fontSize: '0.85rem' }}>
                            One-time payment, lifetime value
                        </Typography>
                    </Box>

                    {/* Price */}
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#FF4C29', lineHeight: 1 }}>
                            ₹3999
                        </Typography>
                        <Typography sx={{ color: '#666666', fontSize: '0.8rem' }}>
                            /lifetime
                        </Typography>
                    </Box>
                </Box>

                {/* Divider */}
                <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', mb: 2 }} />

                {/* Benefits - Two columns */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 1.5,
                        mb: 3,
                    }}
                >
                    {benefits.map((benefit, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                                sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(255, 76, 41, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <Check size={12} style={{ color: '#FF4C29' }} />
                            </Box>
                            <Typography sx={{ color: '#333333', fontSize: '0.9rem', fontWeight: 500 }}>
                                {benefit}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {/* CTA Button */}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        py: 1.5,
                        fontWeight: 700,
                        fontSize: '1rem',
                        bgcolor: '#FF4C29',
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#E63E1C' },
                    }}
                >
                    Get Lifetime Access
                </Button>

                {/* Trust Badge */}
                <Typography sx={{ color: '#999999', fontSize: '0.8rem', mt: 1.5, textAlign: 'center' }}>
                    🔒 Secure payment • Instant access
                </Typography>
            </Paper>
        </Box>
    );
};

import { Book, Code, Rocket, Database, Shield, Cloud, Search } from 'lucide-react';
import { Box, Typography, Paper, TextField, InputAdornment, Button } from '@mui/material';

export const Docs = () => {
    const sections = [
        {
            title: 'Getting Started',
            icon: Rocket,
            articles: [
                'Introduction to MicroSaaS Platform',
                'Quick Start Guide',
                'Choosing Your First Template',
                'Setting Up Your Development Environment',
            ],
        },
        {
            title: 'Frontend Development',
            icon: Code,
            articles: [
                'React Best Practices',
                'Component Architecture',
                'State Management with Zustand',
                'Styling with Tailwind CSS',
                'Building Responsive UIs',
            ],
        },
        {
            title: 'Backend Development',
            icon: Database,
            articles: [
                'FastAPI Fundamentals',
                'Database Design',
                'API Endpoint Creation',
                'Error Handling',
                'Testing Your API',
            ],
        },
        {
            title: 'Authentication & Security',
            icon: Shield,
            articles: [
                'JWT Authentication',
                'Password Hashing',
                'Protecting Routes',
                'Security Best Practices',
                'OAuth Integration',
            ],
        },
        {
            title: 'Deployment',
            icon: Cloud,
            articles: [
                'Deploy to Vercel',
                'Deploy to Railway',
                'Environment Variables',
                'Database Hosting',
                'Domain Configuration',
            ],
        },
    ];

    return (
        <Box sx={{ p: 4, bgcolor: '#ffffff', minHeight: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
                    Documentation
                </Typography>
                <Typography sx={{ color: '#666666', fontSize: '1rem' }}>
                    Complete guides to help you build and deploy your MicroSaaS
                </Typography>
            </Box>

            {/* Search */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    fullWidth
                    placeholder="Search documentation..."
                    sx={{
                        maxWidth: 600,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#f8f9fa',
                            borderRadius: 2,
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={20} style={{ color: '#999999' }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Documentation Sections */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                        <Paper
                            key={index}
                            elevation={0}
                            sx={{
                                p: 3,
                                bgcolor: '#f8f9fa',
                                border: '1px solid rgba(0, 0, 0, 0.06)',
                                borderRadius: 3,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        bgcolor: 'rgba(255, 76, 41, 0.1)',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mr: 2,
                                    }}
                                >
                                    <Icon size={22} style={{ color: '#FF4C29' }} />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                    {section.title}
                                </Typography>
                            </Box>

                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 2
                            }}>
                                {section.articles.map((article, articleIndex) => (
                                    <Box key={articleIndex}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                justifyContent: 'flex-start',
                                                p: 2,
                                                bgcolor: '#ffffff',
                                                borderColor: 'rgba(0, 0, 0, 0.08)',
                                                color: '#333333',
                                                textTransform: 'none',
                                                fontWeight: 400,
                                                '&:hover': {
                                                    borderColor: 'rgba(255, 76, 41, 0.5)',
                                                    bgcolor: 'rgba(255, 76, 41, 0.02)',
                                                },
                                            }}
                                            startIcon={<Book size={16} style={{ color: '#FF4C29' }} />}
                                        >
                                            {article}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    );
                })}
            </Box>

            {/* Help Section */}
            <Paper
                elevation={0}
                sx={{
                    mt: 4,
                    p: 3,
                    bgcolor: 'rgba(255, 76, 41, 0.05)',
                    border: '1px solid rgba(255, 76, 41, 0.15)',
                    borderRadius: 3,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                    Need More Help?
                </Typography>
                <Typography sx={{ color: '#666666', mb: 3 }}>
                    Can't find what you're looking for? Join our community or contact support.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: '#FF4C29',
                            '&:hover': { bgcolor: '#E63E1C' },
                        }}
                    >
                        Join Discord Community
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            borderColor: 'rgba(255, 76, 41, 0.5)',
                            color: '#FF4C29',
                            '&:hover': {
                                borderColor: '#FF4C29',
                                bgcolor: 'rgba(255, 76, 41, 0.05)',
                            },
                        }}
                    >
                        Contact Support
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

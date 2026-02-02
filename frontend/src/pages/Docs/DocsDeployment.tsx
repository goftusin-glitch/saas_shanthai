import { Box, Typography, Paper } from '@mui/material';
import { Rocket } from 'lucide-react';

export const DocsDeployment = () => {
    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'rgba(255, 76, 41, 0.1)',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Rocket size={28} style={{ color: '#FF4C29' }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    Deployment Setup
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: 4, bgcolor: '#f8f9fa', borderRadius: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Deployment Guide</Typography>
                <Typography sx={{ color: '#666', lineHeight: 1.8 }}>
                    Learn how to deploy your SaaS application to production.
                </Typography>
            </Paper>
        </Box>
    );
};

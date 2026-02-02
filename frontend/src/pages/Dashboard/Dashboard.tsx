import { Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Box, Typography, Paper, Button } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Dashboard = () => {
    const { user } = useAuthStore();

    const stats = [
        { label: 'Active Products', value: '12', icon: Package, description: 'Products you created' },
        { label: 'Community Members', value: '1.2K', icon: Users, description: 'Total members' },
        { label: 'Marketplace Items', value: '48', icon: ShoppingBag, description: 'Total products' },
        { label: 'Growth Rate', value: '+24%', icon: TrendingUp, description: 'This month' },
    ];

    // Sample data for active users line chart
    const activeUsersData = [
        { name: 'Mon', users: 120 },
        { name: 'Tue', users: 180 },
        { name: 'Wed', users: 150 },
        { name: 'Thu', users: 220 },
        { name: 'Fri', users: 280 },
        { name: 'Sat', users: 340 },
        { name: 'Sun', users: 300 },
    ];

    return (
        <Box sx={{ p: 4, bgcolor: '#ffffff', minHeight: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
                    Welcome back, {user?.email?.split('@')[0]}!
                </Typography>
                <Typography sx={{ color: '#666666', fontSize: '1rem' }}>
                    Here's your SaaS சந்தை platform overview
                </Typography>
            </Box>

            {/* Stats Grid */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Box key={index} sx={{ flex: '1 1 calc(25% - 18px)', minWidth: 200 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    bgcolor: '#f8f9fa',
                                    border: '1px solid rgba(0, 0, 0, 0.06)',
                                    borderRadius: 3,
                                    height: '100%',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 76, 41, 0.3)',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            bgcolor: 'rgba(255, 76, 41, 0.1)',
                                            borderRadius: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Icon size={24} style={{ color: '#FF4C29' }} />
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '0.95rem' }}>
                                    {stat.label}
                                </Typography>
                                <Typography sx={{ color: '#999999', fontSize: '0.8rem', mt: 0.5 }}>
                                    {stat.description}
                                </Typography>
                            </Paper>
                        </Box>
                    );
                })}
            </Box>

            {/* Main Content - Chart and Quick Start */}
            <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                {/* Active Users Chart */}
                <Box sx={{ flex: '2 1 600px', minWidth: 0 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            bgcolor: '#f8f9fa',
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            borderRadius: 3,
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                            Active Users This Week
                        </Typography>
                        <Box sx={{ width: '100%', height: 280 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={activeUsersData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#666666"
                                        tick={{ fill: '#666666', fontSize: 12 }}
                                    />
                                    <YAxis
                                        stroke="#666666"
                                        tick={{ fill: '#666666', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: 8,
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#FF4C29"
                                        strokeWidth={3}
                                        dot={{ fill: '#FF4C29', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: '#FF4C29' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Box>

                {/* Quick Actions */}
                <Box sx={{ flex: '1 1 280px', minWidth: 280 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            bgcolor: '#f8f9fa',
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            borderRadius: 3,
                            height: '100%',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                            Quick Start
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    justifyContent: 'flex-start',
                                    p: 2,
                                    textAlign: 'left',
                                    borderColor: 'rgba(255, 76, 41, 0.3)',
                                    bgcolor: '#ffffff',
                                    '&:hover': {
                                        borderColor: '#FF4C29',
                                        bgcolor: 'rgba(255, 76, 41, 0.05)',
                                    },
                                }}
                            >
                                <Box>
                                    <Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                        Browse Templates
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666666' }}>
                                        Explore our collection of SaaS templates
                                    </Typography>
                                </Box>
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    justifyContent: 'flex-start',
                                    p: 2,
                                    textAlign: 'left',
                                    borderColor: 'rgba(255, 76, 41, 0.3)',
                                    bgcolor: '#ffffff',
                                    '&:hover': {
                                        borderColor: '#FF4C29',
                                        bgcolor: 'rgba(255, 76, 41, 0.05)',
                                    },
                                }}
                            >
                                <Box>
                                    <Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                        Read Documentation
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666666' }}>
                                        Learn how to build your SaaS
                                    </Typography>
                                </Box>
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{
                                    justifyContent: 'flex-start',
                                    p: 2,
                                    textAlign: 'left',
                                    borderColor: 'rgba(255, 76, 41, 0.3)',
                                    bgcolor: '#ffffff',
                                    '&:hover': {
                                        borderColor: '#FF4C29',
                                        bgcolor: 'rgba(255, 76, 41, 0.05)',
                                    },
                                }}
                            >
                                <Box>
                                    <Typography sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                        Create New Product
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#666666' }}>
                                        Add a product to the marketplace
                                    </Typography>
                                </Box>
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Box>

            {/* Recent Activity */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    bgcolor: '#f8f9fa',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: 3,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 3 }}>
                    Recent Activity
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {[
                        { text: 'Account created successfully', time: 'Just now', active: true },
                        { text: 'Welcome to SaaS சந்தை Platform', time: 'Today', active: false },
                        { text: 'Profile setup completed', time: 'Today', active: false },
                        { text: 'First template viewed', time: 'Yesterday', active: false },
                    ].map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                flex: '1 1 calc(25% - 12px)',
                                minWidth: 200,
                                display: 'flex',
                                alignItems: 'flex-start',
                                p: 2,
                                bgcolor: '#ffffff',
                                borderRadius: 2,
                                border: '1px solid rgba(0, 0, 0, 0.04)',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    bgcolor: item.active ? '#FF4C29' : '#cccccc',
                                    borderRadius: '50%',
                                    mt: 0.75,
                                    mr: 2,
                                    flexShrink: 0,
                                }}
                            />
                            <Box>
                                <Typography sx={{ color: item.active ? '#1a1a1a' : '#666666', fontSize: '0.9rem' }}>
                                    {item.text}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#999999' }}>
                                    {item.time}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Box>
    );
};

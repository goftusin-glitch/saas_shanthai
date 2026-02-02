import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Tabs,
    Tab,
    Link,
} from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export const Settings = () => {
    const { user, logout } = useAuthStore();
    const [tabValue, setTabValue] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSignOut = () => {
        logout();
    };

    // Generate a mock user ID based on email
    const userId = user?.email
        ? `${user.email.split('@')[0]}-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`
        : 'user-id-not-available';

    return (
        <Box sx={{ p: 4, bgcolor: '#ffffff', minHeight: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    Account Settings
                </Typography>
            </Box>

            {/* Tabs */}
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                    mb: 0,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        color: '#666666',
                        '&.Mui-selected': {
                            color: '#FF4C29',
                        },
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#FF4C29',
                    },
                }}
            >
                <Tab label="Account" />
                <Tab label="Billing & Plans" />
            </Tabs>

            {/* Account Tab Panel */}
            <TabPanel value={tabValue} index={0}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        bgcolor: '#ffffff',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                        maxWidth: 450,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
                        Account Details
                    </Typography>
                    <Typography sx={{ color: '#666666', fontSize: '0.9rem', mb: 4 }}>
                        Update your account details with ease and keep your account secure.
                    </Typography>

                    {/* User ID */}
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ color: '#666666', fontSize: '0.85rem', mb: 0.5 }}>
                            User ID
                        </Typography>
                        <TextField
                            fullWidth
                            value={userId}
                            disabled
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#f8f9fa',
                                },
                                '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: '#333333',
                                },
                            }}
                        />
                    </Box>

                    {/* Email */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography sx={{ color: '#666666', fontSize: '0.85rem' }}>
                                Email
                            </Typography>
                            <Link
                                href="#"
                                underline="hover"
                                sx={{ color: '#666666', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                                Update Email
                            </Link>
                        </Box>
                        <TextField
                            fullWidth
                            value={user?.email || ''}
                            disabled
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#f8f9fa',
                                },
                                '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: '#333333',
                                },
                            }}
                        />
                    </Box>

                    {/* First Name */}
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ color: '#666666', fontSize: '0.85rem', mb: 0.5 }}>
                            First name
                        </Typography>
                        <TextField
                            fullWidth
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#ffffff',
                                },
                            }}
                        />
                    </Box>

                    {/* Last Name */}
                    <Box sx={{ mb: 4 }}>
                        <Typography sx={{ color: '#666666', fontSize: '0.85rem', mb: 0.5 }}>
                            Last name
                        </Typography>
                        <TextField
                            fullWidth
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter last name"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#ffffff',
                                },
                            }}
                        />
                    </Box>

                    {/* Buttons */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            sx={{
                                bgcolor: '#5b4cff',
                                fontWeight: 600,
                                textTransform: 'none',
                                px: 3,
                                '&:hover': { bgcolor: '#4a3cd9' },
                            }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleSignOut}
                            sx={{
                                borderColor: 'rgba(0, 0, 0, 0.2)',
                                color: '#333333',
                                fontWeight: 600,
                                textTransform: 'none',
                                px: 3,
                                '&:hover': {
                                    borderColor: 'rgba(0, 0, 0, 0.4)',
                                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                                },
                            }}
                        >
                            Sign Out
                        </Button>
                    </Box>
                </Paper>
            </TabPanel>

            {/* Billing & Plans Tab Panel */}
            <TabPanel value={tabValue} index={1}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        bgcolor: '#ffffff',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        borderRadius: 2,
                        maxWidth: 450,
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
                        Billing & Plans
                    </Typography>
                    <Typography sx={{ color: '#666666', fontSize: '0.9rem', mb: 3 }}>
                        Manage your subscription and billing information.
                    </Typography>

                    <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, mb: 3 }}>
                        <Typography sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                            Current Plan: Free
                        </Typography>
                        <Typography sx={{ color: '#666666', fontSize: '0.9rem' }}>
                            Upgrade to unlock all features
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            bgcolor: '#FF4C29',
                            fontWeight: 600,
                            textTransform: 'none',
                            py: 1.5,
                            '&:hover': { bgcolor: '#E63E1C' },
                        }}
                    >
                        Upgrade to Lifetime Access
                    </Button>
                </Paper>
            </TabPanel>
        </Box>
    );
};

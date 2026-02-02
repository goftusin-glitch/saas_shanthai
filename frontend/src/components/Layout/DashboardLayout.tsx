import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    BookOpen,
    ShoppingBag,
    CreditCard,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
    Wrench,
    BookOpenCheck,
    Code,
    Database,
    KeyRound,
    Wallet,
    Github,
    Rocket,
    Package
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Collapse } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { dashboardTheme } from '../../theme/theme';

interface NavItem {
    path: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    children?: NavItem[];
}

export const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const [docsOpen, setDocsOpen] = useState(location.pathname.startsWith('/docs'));

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const docsSubItems: NavItem[] = [
        { path: '/docs/setup', label: 'Setup', icon: Wrench },
        { path: '/docs/basics', label: 'Basics', icon: BookOpenCheck },
        { path: '/docs/develop', label: 'Develop', icon: Code },
        { path: '/docs/database', label: 'Database Setup', icon: Database },
        { path: '/docs/google-auth', label: 'Google Authentication', icon: KeyRound },
        { path: '/docs/payment', label: 'Payment Integration', icon: Wallet },
        { path: '/docs/github', label: 'GitHub Setup', icon: Github },
        { path: '/docs/deployment', label: 'Deployment Setup', icon: Rocket },
    ];

    const navItems: NavItem[] = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/templates', label: 'Templates', icon: FileText },
        { path: '/docs', label: 'Docs', icon: BookOpen, children: docsSubItems },
        { path: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
        { path: '/subscription', label: 'Subscription', icon: CreditCard },
        { path: '/my-products', label: 'My Products', icon: Package },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    const handleNavClick = (item: NavItem) => {
        if (item.children) {
            setDocsOpen(!docsOpen);
        } else {
            navigate(item.path);
        }
    };

    const isDocsActive = location.pathname.startsWith('/docs');

    return (
        <ThemeProvider theme={dashboardTheme}>
            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
                {/* Sidebar - Dark, Fixed */}
                <Box
                    component="aside"
                    sx={{
                        width: 260,
                        bgcolor: '#0a0a0a',
                        display: 'flex',
                        flexDirection: 'column',
                        flexShrink: 0,
                        overflow: 'hidden',
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 76, 41, 0.2)' }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: '#FF4C29',
                                letterSpacing: '-0.5px',
                            }}
                        >
                            SaaS சந்தை
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 0.5, display: 'block' }}
                        >
                            by Social Eagle AI
                        </Typography>
                    </Box>

                    {/* Navigation */}
                    <Box sx={{ flex: 1, py: 2, px: 1.5, overflow: 'auto' }}>
                        <List disablePadding>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = item.children
                                    ? isDocsActive
                                    : location.pathname === item.path;
                                const hasChildren = !!item.children;

                                return (
                                    <Box key={item.path}>
                                        <ListItemButton
                                            onClick={() => handleNavClick(item)}
                                            sx={{
                                                mb: 0.5,
                                                borderRadius: 2,
                                                bgcolor: isActive && !hasChildren ? '#FF4C29' : 'transparent',
                                                color: isActive ? (hasChildren ? '#FF4C29' : '#0a0a0a') : 'rgba(255, 255, 255, 0.6)',
                                                '&:hover': {
                                                    bgcolor: isActive && !hasChildren ? '#FF4C29' : 'rgba(255, 76, 41, 0.1)',
                                                    color: isActive && !hasChildren ? '#0a0a0a' : '#ffffff',
                                                },
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 40,
                                                    color: 'inherit',
                                                }}
                                            >
                                                <Icon size={20} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.label}
                                                primaryTypographyProps={{
                                                    fontWeight: isActive ? 600 : 400,
                                                    fontSize: '0.9rem',
                                                }}
                                            />
                                            {hasChildren && (
                                                docsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                                            )}
                                        </ListItemButton>

                                        {/* Sub-items for Docs */}
                                        {hasChildren && (
                                            <Collapse in={docsOpen} timeout="auto" unmountOnExit>
                                                <List disablePadding sx={{ pl: 2 }}>
                                                    {item.children!.map((subItem) => {
                                                        const SubIcon = subItem.icon;
                                                        const isSubActive = location.pathname === subItem.path;

                                                        return (
                                                            <ListItemButton
                                                                key={subItem.path}
                                                                onClick={() => navigate(subItem.path)}
                                                                sx={{
                                                                    mb: 0.3,
                                                                    py: 0.8,
                                                                    borderRadius: 1.5,
                                                                    bgcolor: isSubActive ? 'rgba(255, 76, 41, 0.15)' : 'transparent',
                                                                    color: isSubActive ? '#FF4C29' : 'rgba(255, 255, 255, 0.5)',
                                                                    borderLeft: isSubActive ? '2px solid #FF4C29' : '2px solid transparent',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(255, 76, 41, 0.1)',
                                                                        color: '#ffffff',
                                                                    },
                                                                    transition: 'all 0.2s ease',
                                                                }}
                                                            >
                                                                <ListItemIcon
                                                                    sx={{
                                                                        minWidth: 32,
                                                                        color: 'inherit',
                                                                    }}
                                                                >
                                                                    <SubIcon size={16} />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={subItem.label}
                                                                    primaryTypographyProps={{
                                                                        fontWeight: isSubActive ? 600 : 400,
                                                                        fontSize: '0.8rem',
                                                                    }}
                                                                />
                                                            </ListItemButton>
                                                        );
                                                    })}
                                                </List>
                                            </Collapse>
                                        )}
                                    </Box>
                                );
                            })}
                        </List>
                    </Box>

                    {/* User Section */}
                    <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 76, 41, 0.2)' }}>
                        <Box sx={{ mb: 2, px: 1 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                                Logged in as
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: '#ffffff',
                                    fontWeight: 500,
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {user?.email}
                            </Typography>
                        </Box>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: 2,
                                color: 'rgba(255, 255, 255, 0.6)',
                                '&:hover': {
                                    bgcolor: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                                <LogOut size={20} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Logout"
                                primaryTypographyProps={{ fontSize: '0.9rem' }}
                            />
                        </ListItemButton>
                    </Box>
                </Box>

                {/* Main Content - White Background */}
                <Box
                    id="main-content"
                    component="main"
                    sx={{
                        flex: 1,
                        bgcolor: '#ffffff',
                        overflow: 'auto',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

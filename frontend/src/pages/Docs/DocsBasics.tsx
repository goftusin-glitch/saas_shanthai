import { Box, Typography, Paper, Button } from '@mui/material';
import { ArrowRight, ArrowLeft, Copy, Check, List } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const CodeBlock = ({ code, multiline = false }: { code: string; multiline?: boolean }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box
            onClick={handleCopy}
            sx={{
                bgcolor: '#1a1a1a',
                borderRadius: 1.5,
                p: 2,
                my: 2,
                cursor: 'pointer',
                border: '1px solid #333',
                position: 'relative',
                '&:hover': {
                    bgcolor: '#252525',
                },
            }}
        >
            <code style={{
                color: '#e5e5e5',
                fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                fontSize: '0.85rem',
                whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
                display: 'block',
            }}>
                {code}
            </code>
            <Box
                sx={{
                    position: 'absolute',
                    right: 12,
                    top: multiline ? 12 : '50%',
                    transform: multiline ? 'none' : 'translateY(-50%)',
                    color: '#888',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': { color: '#fff' },
                }}
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
            </Box>
        </Box>
    );
};

export const DocsBasics = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('big-picture');
    const containerRef = useRef<HTMLElement | null>(null);

    const sections = [
        { id: 'big-picture', title: 'The Big Picture' },
        { id: 'frontend', title: 'Frontend' },
        { id: 'backend', title: 'Backend' },
        { id: 'database', title: 'Database' },
        { id: 'api', title: 'API' },
        { id: 'data-flow', title: 'Data Flow' },
        { id: 'payment', title: 'Payment Integration' },
        { id: 'deployment', title: 'Deployment' },
    ];

    // Scroll to top when navigating to this page
    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.scrollTop = 0;
        }
    }, [location.pathname]);

    // Track active section based on scroll position
    useEffect(() => {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;

        containerRef.current = mainContent;

        const handleScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            const scrollPosition = container.scrollTop + 150;
            const containerHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;

            // If at bottom of page, highlight last section
            if (container.scrollTop + containerHeight >= scrollHeight - 50) {
                setActiveSection('deployment');
                return;
            }

            // Find which section is currently in view
            for (let i = sections.length - 1; i >= 0; i--) {
                const element = document.getElementById(sections[i].id);
                if (element) {
                    const elementTop = element.offsetTop;
                    if (scrollPosition >= elementTop) {
                        setActiveSection(sections[i].id);
                        return;
                    }
                }
            }
        };

        mainContent.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => mainContent.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSectionClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            px: 6,
            py: 4,
            gap: 6,
            bgcolor: '#ffffff',
            minHeight: '100%',
        }}>
            {/* Main Content */}
            <Box sx={{ flex: 1, maxWidth: 800, ml: 4 }}>
                {/* Page Title */}
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#000000', mb: 3 }}>
                    Basics
                </Typography>
                <Typography sx={{ color: '#000000', mb: 4, lineHeight: 1.8 }}>
                    Understanding the fundamental building blocks of a web application.
                </Typography>

                {/* The Big Picture */}
                <Box id="big-picture" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        The Big Picture
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        Think of a software app like a restaurant:
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        <strong>Frontend</strong> = the dining area + menu (what customers see and click)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        <strong>Backend</strong> = the kitchen (does the work, makes decisions)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        <strong>Database</strong> = the storage room (keeps data permanently)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        <strong>API</strong> = the waiter (a structured way for frontend to ask backend for things)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        <strong>Payment integration</strong> = cashier/payment gateway (collect money securely)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        <strong>Deployment</strong> = opening the restaurant to the public (putting your app on the internet)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        Now let's go deeper with a simple real example.
                    </Typography>
                </Box>

                {/* Frontend */}
                <Box id="frontend" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        1) Frontend (what users see)
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        What it is
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        Frontend is the UI: buttons, pages, forms, text, images.
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        What it does
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Shows data to user
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Takes user input (clicks, forms)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        - Calls backend APIs to get/save data
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        Example (very simple)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        A page that shows: "Gold Ring - ₹999" with a "Buy Now" button.
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        When user clicks "Buy Now", frontend will call backend: "Create an order for this product."
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        Common frontend tech
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - HTML/CSS/JavaScript (core)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - React / Next.js / Vue (frameworks)
                    </Typography>
                </Box>

                {/* Backend */}
                <Box id="backend" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        2) Backend (the brain)
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        What it is
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        Backend is code that runs on a server and:
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - applies business rules
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - talks to the database
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - talks to payment gateways
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        - returns responses to frontend
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        What it does in our app
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        When frontend asks "Create an order":
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - backend generates an order entry
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - stores it in database
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        - returns order details to frontend
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        Common backend tech
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Python (Flask/FastAPI/Django)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Node.js (Express/Nest)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Java (Spring)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Go, PHP, etc.
                    </Typography>
                </Box>

                {/* Database */}
                <Box id="database" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        3) Database (permanent memory)
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        What it is
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        Database stores data permanently, like: users, orders, payments, products.
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mt: 2, mb: 1 }}>
                        Why not store data in backend memory?
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        If server restarts, memory is gone. Database keeps everything safe.
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        Example (orders table)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        An "orders" table might store: id, product_name, amount, status (pending/paid/failed), created_at
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mt: 2, mb: 1 }}>
                        Common databases
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - PostgreSQL (very popular)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - MySQL
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - MongoDB (NoSQL)
                    </Typography>
                </Box>

                {/* API */}
                <Box id="api" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        4) API (how frontend and backend talk)
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        What it is
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        API is a set of URLs with rules. Frontend calls backend endpoints like:
                    </Typography>
                    <CodeBlock code="POST /api/orders → create an order" />
                    <CodeBlock code="GET /api/orders/123 → get order details" />
                    <CodeBlock code="POST /api/payments/verify → confirm payment" />

                    <Typography sx={{ color: '#000000', fontWeight: 600, mt: 3, mb: 1 }}>
                        One real API call example
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 1 }}>
                        Frontend sends request:
                    </Typography>
                    <CodeBlock code={`URL: POST /api/orders\nBody: { "productId": 1 }`} multiline />

                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 1 }}>
                        Backend responds:
                    </Typography>
                    <CodeBlock code={`{ "orderId": 101, "amount": 999, "status": "pending" }`} />

                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        That's literally API.
                    </Typography>
                </Box>

                {/* Data Flow */}
                <Box id="data-flow" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        5) How data flows (end-to-end)
                    </Typography>

                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        When user clicks "Buy":
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        1. <strong>Frontend:</strong> user clicks Buy
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        2. <strong>Frontend → API call:</strong> request backend to create order
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        3. <strong>Backend:</strong> creates order
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        4. <strong>Backend → Database:</strong> saves order status = pending
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        5. <strong>Backend → Frontend:</strong> returns order details
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        6. <strong>Frontend:</strong> opens payment screen using gateway (Stripe/Razorpay)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        7. <strong>Payment gateway:</strong> processes payment securely
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        8. <strong>Gateway → Backend (webhook):</strong> "Payment success"
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        9. <strong>Backend → Database:</strong> updates order status = paid
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        10. <strong>Frontend:</strong> shows success page
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, fontWeight: 600 }}>
                        This is the full stack story.
                    </Typography>
                </Box>

                {/* Payment Integration */}
                <Box id="payment" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        6) Payment integration (the safe way)
                    </Typography>

                    <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff8f6', border: '1px solid #ffccc7', borderRadius: 1.5, mb: 2 }}>
                        <Typography sx={{ color: '#a8071a', fontSize: '0.9rem' }}>
                            <strong>Important:</strong> Your app should never directly handle card details.
                        </Typography>
                    </Paper>

                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        Payments work like this:
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        1. Frontend redirects or opens gateway checkout (secure UI)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        2. Gateway collects payment
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        3. Gateway notifies your backend via webhook
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 3 }}>
                        4. Backend verifies and updates database
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        A) Checkout session / order creation
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        Backend says to gateway: "Create a payment for ₹999 and give me a payment link."
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        Gateway returns: "Here's the payment link / session id." Frontend opens it.
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        B) Webhook verification
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        Gateway tells your backend: "Payment successful for order 101."
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        Backend verifies signature and marks order paid. This prevents fake "paid" messages.
                    </Typography>
                </Box>

                {/* Deployment */}
                <Box id="deployment" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        7) Deployment (making it live)
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        Local vs Live
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - <strong>Local:</strong> runs on your laptop/VM, only accessible to you
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        - <strong>Deployed:</strong> runs on a server with a public domain like app.yoursite.com
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        Deployment includes
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - A server (VPS/cloud)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Running your backend process
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Running/building frontend
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Database setup
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Domain + HTTPS (SSL)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        - Reverse proxy (nginx)
                    </Typography>

                    <Typography sx={{ color: '#000000', fontWeight: 600, mb: 1 }}>
                        Typical deployment pattern
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - <strong>frontend:</strong> static site (React build) served by nginx
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - <strong>backend:</strong> running on port 5000/8000
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - <strong>nginx routes:</strong> / → frontend, /api → backend
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - <strong>database:</strong> postgres on the server or managed
                    </Typography>
                </Box>

                {/* Navigation Buttons */}
                <Box sx={{
                    mt: 6,
                    pt: 4,
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 20,
                }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowLeft size={18} />}
                        onClick={() => navigate('/docs/setup')}
                        sx={{
                            borderColor: '#FF4C29',
                            color: '#FF4C29',
                            '&:hover': { borderColor: '#E63E1C', bgcolor: 'rgba(255, 76, 41, 0.05)' },
                            px: 3,
                            py: 1.2,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                        }}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        endIcon={<ArrowRight size={18} />}
                        onClick={() => navigate('/docs/develop')}
                        sx={{
                            bgcolor: '#FF4C29',
                            '&:hover': { bgcolor: '#E63E1C' },
                            px: 3,
                            py: 1.2,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.95rem',
                        }}
                    >
                        Next Page
                    </Button>
                </Box>
            </Box>

            {/* Right Sidebar - On this page */}
            <Box sx={{
                width: 200,
                flexShrink: 0,
                display: { xs: 'none', lg: 'block' },
                position: 'sticky',
                top: 100,
                alignSelf: 'flex-start',
                mr: 4,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <List size={14} style={{ color: '#666' }} />
                    <Typography sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                    }}>
                        On this page
                    </Typography>
                </Box>
                <Box component="nav">
                    {sections.map((section) => {
                        const isActive = activeSection === section.id;
                        return (
                            <Typography
                                key={section.id}
                                component="button"
                                onClick={() => handleSectionClick(section.id)}
                                sx={{
                                    display: 'block',
                                    width: '100%',
                                    textAlign: 'left',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: isActive ? '#FF4C29' : '#333',
                                    fontSize: '0.85rem',
                                    fontWeight: isActive ? 600 : 400,
                                    py: 0.5,
                                    borderLeft: isActive ? '2px solid #FF4C29' : '2px solid transparent',
                                    pl: 1.5,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        color: '#FF4C29',
                                    },
                                }}
                            >
                                {section.title}
                            </Typography>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

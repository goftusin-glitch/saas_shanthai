import { Box, Typography, Paper, Button } from '@mui/material';
import { ArrowRight, ExternalLink, Copy, Check, List } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const CodeBlock = ({ code }: { code: string }) => {
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
            }}>
                {code}
            </code>
            <Box
                sx={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
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

const SectionLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Typography
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
            color: '#FF4C29',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
        }}
    >
        {children}
    </Typography>
);

export const DocsSetup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('install-ide');
    const containerRef = useRef<HTMLElement | null>(null);

    const sections = [
        { id: 'install-ide', title: 'Install an IDE' },
        { id: 'install-nodejs', title: 'Install Node.js' },
        { id: 'open-terminal', title: 'Open Terminal' },
        { id: 'install-claude-code', title: 'Install Claude Code' },
        { id: 'create-account', title: 'Create Claude Account' },
        { id: 'run-claude-code', title: 'Run Claude Code' },
        { id: 'complete-setup', title: 'Complete Setup' },
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
                setActiveSection('complete-setup');
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
                    Setup Guide
                </Typography>
                <Typography sx={{ color: '#000000', mb: 4, lineHeight: 1.8 }}>
                    This guide helps you set up <strong>Claude Code</strong> so you can use it inside your IDE
                    (VS Code / Cursor / Antigravity).
                </Typography>

                {/* Step 0: Install IDE */}
                <Box id="install-ide" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        Install an IDE
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        Download and install any of these IDEs. After installation, open the IDE once to complete the initial setup.
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - VS Code
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Cursor
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        - Antigravity
                    </Typography>
                </Box>

                {/* Step 1: Install Node.js */}
                <Box id="install-nodejs" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        Install Node.js
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        Claude Code requires <strong>Node.js</strong>. Install the latest LTS version from the official website:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ExternalLink size={16} style={{ color: '#FF4C29' }} />
                        <SectionLink href="https://nodejs.org/en/download">
                            nodejs.org/en/download
                        </SectionLink>
                    </Box>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 1 }}>
                        To verify the installation, open a terminal and run:
                    </Typography>
                    <CodeBlock code="node -v && npm -v" />
                    <Typography sx={{ color: '#333333', fontSize: '0.9rem' }}>
                        If you see version numbers, Node.js is installed correctly.
                    </Typography>
                </Box>

                {/* Step 2: Open Terminal */}
                <Box id="open-terminal" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        Open Terminal
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        <strong>Windows:</strong> Open CMD or PowerShell
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        <strong>MacBook:</strong> Open Terminal
                    </Typography>
                </Box>

                {/* Step 3: Install Claude Code */}
                <Box id="install-claude-code" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        Install Claude Code
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 1 }}>
                        Run this command to install Claude Code globally:
                    </Typography>
                    <CodeBlock code="npm install -g @anthropic-ai/claude-code" />
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        This installs Claude Code globally, so you can run it from any terminal.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ExternalLink size={16} style={{ color: '#FF4C29' }} />
                        <SectionLink href="https://code.claude.com/docs/en/setup">
                            Official Claude Code Setup Guide
                        </SectionLink>
                    </Box>
                </Box>

                {/* Step 4: Create Account */}
                <Box id="create-account" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        Create Claude Account + Buy Pro Plan
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        1. Open your browser
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        2. Search for Claude (Anthropic)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        3. Create an account
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 2 }}>
                        4. Buy Claude Pro Plan
                    </Typography>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            bgcolor: '#fff8f6',
                            border: '1px solid #ffccc7',
                            borderRadius: 1.5,
                        }}
                    >
                        <Typography sx={{ color: '#a8071a', fontSize: '0.9rem' }}>
                            <strong>Note:</strong> Claude Pro Plan is required to use Claude Code.
                        </Typography>
                    </Paper>
                </Box>

                {/* Step 5: Run Claude Code */}
                <Box id="run-claude-code" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        Run Claude Code inside your IDE
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        1. Open any IDE (VS Code / Cursor / Antigravity)
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        2. Open New Terminal inside the IDE
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8, mb: 1 }}>
                        3. Run the command below:
                    </Typography>
                    <CodeBlock code="claude" />
                </Box>

                {/* Step 6: Complete Setup */}
                <Box id="complete-setup" sx={{ mb: 5, scrollMarginTop: '100px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#000000', mb: 2 }}>
                        Complete Setup
                    </Typography>
                    <Typography sx={{ color: '#000000', lineHeight: 1.8 }}>
                        Follow the on-screen instructions and select the setup options to finish configuration.
                        Once completed, Claude Code is ready to use in your IDE.
                    </Typography>
                </Box>

                {/* Next Page Button */}
                <Box sx={{
                    mt: 6,
                    pt: 4,
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 20,
                }}>
                    <Button
                        variant="contained"
                        endIcon={<ArrowRight size={18} />}
                        onClick={() => navigate('/docs/basics')}
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

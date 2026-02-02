import { useState, useEffect } from 'react';
import {
    Folder, FileText, ChevronRight, ArrowLeft, Code2,
    FolderOpen, FileCode, FileJson, FileCog, File,
    Copy, Check, Maximize2, Minimize2, Download
} from 'lucide-react';
import {
    Box, Typography, Paper, CircularProgress,
    IconButton, Breadcrumbs, Link, Tooltip, Fade, Chip, Button
} from '@mui/material';
import axios from 'axios';

interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'dir';
    size?: number;
    extension?: string;
}

const API_BASE = 'http://localhost:8000';

// Get icon based on file extension
const getFileIcon = (name: string, extension?: string) => {
    const ext = extension || name.split('.').pop()?.toLowerCase() || '';
    const iconStyle = { size: 18 };

    if (['ts', 'tsx', 'js', 'jsx'].includes(ext)) {
        return <FileCode {...iconStyle} style={{ color: '#3178C6' }} />;
    } else if (['py'].includes(ext)) {
        return <FileCode {...iconStyle} style={{ color: '#3776AB' }} />;
    } else if (['json'].includes(ext)) {
        return <FileJson {...iconStyle} style={{ color: '#F5A623' }} />;
    } else if (['yml', 'yaml', 'toml', 'cfg', 'ini'].includes(ext)) {
        return <FileCog {...iconStyle} style={{ color: '#CB171E' }} />;
    } else if (['md', 'txt'].includes(ext)) {
        return <FileText {...iconStyle} style={{ color: '#666' }} />;
    } else if (['css', 'scss', 'html'].includes(ext)) {
        return <FileCode {...iconStyle} style={{ color: '#E34C26' }} />;
    }
    return <File {...iconStyle} style={{ color: '#666' }} />;
};

// Get language display name
const getLanguageName = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const langMap: Record<string, string> = {
        'js': 'JavaScript', 'jsx': 'React JSX', 'ts': 'TypeScript', 'tsx': 'React TSX',
        'py': 'Python', 'css': 'CSS', 'scss': 'SCSS', 'html': 'HTML',
        'json': 'JSON', 'md': 'Markdown', 'yml': 'YAML', 'yaml': 'YAML',
        'sh': 'Shell', 'bat': 'Batch', 'sql': 'SQL', 'toml': 'TOML', 'txt': 'Text'
    };
    return langMap[ext] || ext.toUpperCase() || 'File';
};

// Get language color
const getLanguageColor = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const colorMap: Record<string, string> = {
        'js': '#F7DF1E', 'jsx': '#61DAFB', 'ts': '#3178C6', 'tsx': '#3178C6',
        'py': '#3776AB', 'css': '#264de4', 'scss': '#CC6699', 'html': '#E34C26',
        'json': '#F5A623', 'md': '#083fa1', 'yml': '#CB171E', 'yaml': '#CB171E',
    };
    return colorMap[ext] || '#666666';
};

export const Templates = () => {
    const [currentPath, setCurrentPath] = useState<string>('');
    const [items, setItems] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [fileLoading, setFileLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // Fetch directory contents
    const fetchContents = async (path: string = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE}/templates/files`, {
                params: { path }
            });
            setItems(response.data.items);
        } catch (err) {
            setError('Failed to load files. Make sure the backend server is running.');
        } finally {
            setLoading(false);
        }
    };

    // Fetch file content
    const fetchFileContent = async (item: FileItem) => {
        setFileLoading(true);
        setSelectedFile(item);
        try {
            const response = await axios.get(`${API_BASE}/templates/content`, {
                params: { path: item.path }
            });
            setFileContent(response.data.content);
        } catch (err) {
            setFileContent('Error loading file content');
        } finally {
            setFileLoading(false);
        }
    };

    useEffect(() => {
        fetchContents(currentPath);
    }, [currentPath]);

    // Navigate to folder
    const handleFolderClick = (item: FileItem) => {
        setSelectedFile(null);
        setFileContent('');
        setCurrentPath(item.path);
    };

    // Navigate back
    const handleBack = () => {
        setSelectedFile(null);
        setFileContent('');
        const parts = currentPath.split('/');
        parts.pop();
        setCurrentPath(parts.join('/'));
    };

    // Copy to clipboard
    const handleCopy = async () => {
        await navigator.clipboard.writeText(fileContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Breadcrumb navigation
    const pathParts = currentPath ? currentPath.split('/').filter(Boolean) : [];

    return (
        <Box sx={{
            p: 4,
            bgcolor: '#ffffff',
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'rgba(255, 76, 41, 0.1)',
                            borderRadius: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Code2 size={28} style={{ color: '#FF4C29' }} />
                        </Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                            Template Source Code
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Download size={18} />}
                        href="https://github.com/manojkanur/MicroSaaS-Template-Private/archive/refs/heads/main.zip"
                        target="_blank"
                        sx={{
                            bgcolor: '#FF4C29',
                            '&:hover': { bgcolor: '#E63E1C' },
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                        }}
                    >
                        Download
                    </Button>
                </Box>

                {/* Stats Pills */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    <Chip
                        label="Full Stack Template"
                        sx={{ bgcolor: 'rgba(255, 76, 41, 0.1)', color: '#FF4C29', fontWeight: 500 }}
                    />
                    <Chip
                        label="React + FastAPI"
                        sx={{ bgcolor: 'rgba(255, 76, 41, 0.1)', color: '#FF4C29', fontWeight: 500 }}
                    />
                    <Chip
                        label="TypeScript + Python"
                        sx={{ bgcolor: 'rgba(255, 76, 41, 0.1)', color: '#FF4C29', fontWeight: 500 }}
                    />
                </Box>
            </Box>

            {/* Breadcrumb Navigation */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: '#f8f9fa',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                {currentPath && (
                    <Tooltip title="Go back">
                        <IconButton
                            size="small"
                            onClick={handleBack}
                            sx={{
                                mr: 1,
                                color: '#FF4C29',
                                bgcolor: 'rgba(255, 76, 41, 0.1)',
                                '&:hover': { bgcolor: 'rgba(255, 76, 41, 0.2)' },
                            }}
                        >
                            <ArrowLeft size={18} />
                        </IconButton>
                    </Tooltip>
                )}
                <Breadcrumbs separator={<ChevronRight size={14} style={{ color: '#ccc' }} />}>
                    <Link
                        component="button"
                        underline="hover"
                        onClick={() => { setCurrentPath(''); setSelectedFile(null); setFileContent(''); }}
                        sx={{
                            color: currentPath ? '#FF4C29' : '#1a1a1a',
                            fontWeight: currentPath ? 500 : 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                        }}
                    >
                        <Folder size={16} />
                        SaaS சந்தை Template
                    </Link>
                    {pathParts.map((part, index) => (
                        <Link
                            key={index}
                            component="button"
                            underline="hover"
                            onClick={() => {
                                const newPath = pathParts.slice(0, index + 1).join('/');
                                setCurrentPath(newPath);
                                setSelectedFile(null);
                                setFileContent('');
                            }}
                            sx={{
                                color: index === pathParts.length - 1 ? '#1a1a1a' : '#FF4C29',
                                fontWeight: index === pathParts.length - 1 ? 600 : 500,
                                cursor: 'pointer',
                            }}
                        >
                            {part}
                        </Link>
                    ))}
                </Breadcrumbs>
            </Paper>

            {/* Main Content */}
            <Box sx={{
                display: 'flex',
                gap: 3,
                flex: 1,
                minHeight: 400,
                alignItems: 'stretch',
            }}>
                {/* File List */}
                <Paper
                    elevation={0}
                    sx={{
                        width: expanded ? 0 : (selectedFile ? 320 : '50%'),
                        minWidth: expanded ? 0 : 280,
                        maxWidth: selectedFile ? 400 : '50%',
                        bgcolor: '#fafafa',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        display: expanded ? 'none' : 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)', bgcolor: '#f5f5f5' }}>
                        <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Files ({items.length})
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 6 }}>
                                <CircularProgress sx={{ color: '#FF4C29' }} size={32} />
                            </Box>
                        ) : error ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
                            </Box>
                        ) : (
                            <Box>
                                {items.map((item, index) => (
                                    <Fade in key={item.path} style={{ transitionDelay: `${index * 30}ms` }}>
                                        <Box
                                            onClick={() => item.type === 'dir' ? handleFolderClick(item) : fetchFileContent(item)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                px: 2,
                                                py: 1.5,
                                                cursor: 'pointer',
                                                borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
                                                bgcolor: selectedFile?.path === item.path ? 'rgba(255, 76, 41, 0.08)' : 'transparent',
                                                borderLeft: selectedFile?.path === item.path ? '3px solid #FF4C29' : '3px solid transparent',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    bgcolor: 'rgba(255, 76, 41, 0.05)',
                                                },
                                            }}
                                        >
                                            {item.type === 'dir' ? (
                                                <FolderOpen size={18} style={{ color: '#FF4C29' }} />
                                            ) : (
                                                getFileIcon(item.name, item.extension)
                                            )}
                                            <Typography sx={{
                                                flex: 1,
                                                color: '#1a1a1a',
                                                fontWeight: item.type === 'dir' ? 500 : 400,
                                                fontSize: '0.9rem',
                                            }}>
                                                {item.name}
                                            </Typography>
                                            {item.type === 'dir' && (
                                                <ChevronRight size={16} style={{ color: '#ccc' }} />
                                            )}
                                            {item.type === 'file' && item.size !== undefined && (
                                                <Typography variant="caption" sx={{ color: '#aaa', fontSize: '0.75rem' }}>
                                                    {item.size < 1024 ? `${item.size}B` : `${(item.size / 1024).toFixed(1)}KB`}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Fade>
                                ))}
                                {items.length === 0 && !loading && (
                                    <Box sx={{ p: 4, textAlign: 'center' }}>
                                        <Typography sx={{ color: '#999' }}>
                                            This folder is empty
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                </Paper>

                {/* Code Viewer or Empty State */}
                {selectedFile ? (
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            bgcolor: '#1e1e1e',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: 3,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* File Header */}
                        <Box sx={{
                            px: 3,
                            py: 1.5,
                            bgcolor: '#2d2d2d',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                {getFileIcon(selectedFile.name, selectedFile.extension)}
                                <Typography sx={{ color: '#ffffff', fontWeight: 500, fontSize: '0.95rem' }}>
                                    {selectedFile.name}
                                </Typography>
                                <Chip
                                    label={getLanguageName(selectedFile.name)}
                                    size="small"
                                    sx={{
                                        height: 22,
                                        fontSize: '0.7rem',
                                        bgcolor: `${getLanguageColor(selectedFile.name)}22`,
                                        color: getLanguageColor(selectedFile.name),
                                        fontWeight: 600,
                                    }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Tooltip title={copied ? "Copied!" : "Copy code"}>
                                    <IconButton
                                        size="small"
                                        onClick={handleCopy}
                                        sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}
                                    >
                                        {copied ? <Check size={16} /> : <Copy size={16} />}
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={expanded ? "Collapse" : "Expand"}>
                                    <IconButton
                                        size="small"
                                        onClick={() => setExpanded(!expanded)}
                                        sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}
                                    >
                                        {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        {/* Code Content */}
                        <Box sx={{
                            flex: 1,
                            overflow: 'auto',
                            maxHeight: 'calc(100vh - 420px)',
                        }}>
                            {fileLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 6 }}>
                                    <CircularProgress sx={{ color: '#FF4C29' }} size={28} />
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', minHeight: '100%' }}>
                                    {/* Line Numbers */}
                                    <Box sx={{
                                        py: 2,
                                        pl: 2,
                                        pr: 1.5,
                                        bgcolor: '#1e1e1e',
                                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                                        userSelect: 'none',
                                        position: 'sticky',
                                        left: 0,
                                    }}>
                                        {fileContent.split('\n').map((_, index) => (
                                            <Typography
                                                key={index}
                                                component="div"
                                                sx={{
                                                    fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                                                    fontSize: '0.8rem',
                                                    lineHeight: 1.7,
                                                    color: 'rgba(255, 255, 255, 0.25)',
                                                    textAlign: 'right',
                                                    minWidth: 35,
                                                }}
                                            >
                                                {index + 1}
                                            </Typography>
                                        ))}
                                    </Box>
                                    {/* Code */}
                                    <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                                        <pre style={{ margin: 0 }}>
                                            <code style={{
                                                fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                                                fontSize: '0.8rem',
                                                lineHeight: 1.7,
                                                color: '#d4d4d4',
                                                whiteSpace: 'pre',
                                            }}>
                                                {fileContent}
                                            </code>
                                        </pre>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                ) : (
                    /* Empty state when no file selected */
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            minWidth: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: '#f8f9fa',
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            borderRadius: 3,
                        }}
                    >
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <Box sx={{
                                width: 80,
                                height: 80,
                                bgcolor: 'rgba(255, 76, 41, 0.1)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 3,
                            }}>
                                <FileCode size={36} style={{ color: '#FF4C29' }} />
                            </Box>
                            <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 600, mb: 1 }}>
                                Select a file to view
                            </Typography>
                            <Typography sx={{ color: '#666', maxWidth: 300, mx: 'auto' }}>
                                Click on any file from the list to view its source code
                            </Typography>
                        </Box>
                    </Paper>
                )}
            </Box>
        </Box>
    );
};

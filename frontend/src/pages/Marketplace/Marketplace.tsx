import { Search, Star } from 'lucide-react';
import { Box, Typography, Paper, Button, TextField, InputAdornment, Select, MenuItem, FormControl, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { productService, Product } from '../../services/productService';

export const Marketplace = () => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recommended');

    // API state
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categories = [
        'Operations',
        'Marketing & sales',
        'Build it yourself',
        'Media tools',
        'Finance',
        'Development & IT',
        'Customer experience',
    ];

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAll();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        let result = products;

        // Filter by category (show all if no categories selected)
        if (selectedCategories.length > 0) {
            result = result.filter(product => selectedCategories.includes(product.category));
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(product =>
                product.name.toLowerCase().includes(query) ||
                (product.description?.toLowerCase() || '').includes(query) ||
                product.category.toLowerCase().includes(query)
            );
        }

        // Sort products
        switch (sortBy) {
            case 'price-low':
                result = [...result].sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result = [...result].sort((a, b) => b.price - a.price);
                break;
            case 'reviews':
                result = [...result].sort((a, b) => b.review_count - a.review_count);
                break;
            default:
                // recommended - keep original order
                break;
        }

        return result;
    }, [products, selectedCategories, searchQuery, sortBy]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#ffffff', minHeight: '100%' }}>
            {/* Left Sidebar - Categories (Fixed at Top) */}
            <Box
                sx={{
                    width: 240,
                    flexShrink: 0,
                    p: 3,
                    pt: 4,
                    borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 600,
                        color: '#1a1a1a',
                        fontSize: '0.95rem',
                        mb: 2,
                    }}
                >
                    Shop by category:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {categories.map((category) => (
                        <FormControlLabel
                            key={category}
                            labelPlacement="start"
                            control={
                                <Checkbox
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                    sx={{
                                        color: '#999999',
                                        '&.Mui-checked': {
                                            color: '#FF4C29',
                                        },
                                        padding: '4px',
                                    }}
                                    size="small"
                                />
                            }
                            label={category}
                            sx={{
                                margin: 0,
                                justifyContent: 'space-between',
                                width: '100%',
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '0.95rem',
                                    color: selectedCategories.includes(category) ? '#FF4C29' : '#333333',
                                    fontWeight: selectedCategories.includes(category) ? 600 : 400,
                                },
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, p: 4 }}>
                {/* Header with Search */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 3 }}>
                        Browse software
                    </Typography>

                    {/* Search Bar - Centered */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <TextField
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                width: '100%',
                                maxWidth: 500,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#f8f9fa',
                                    borderRadius: 2,
                                    '& fieldset': {
                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 76, 41, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FF4C29',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search size={20} style={{ color: '#666666' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    {/* Product Count and Sort */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: '#666666', fontSize: '0.9rem' }}>
                            {filteredProducts.length} products
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#666666', fontSize: '0.9rem' }}>
                                Sort by:
                            </Typography>
                            <FormControl size="small">
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    sx={{
                                        minWidth: 150,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(0, 0, 0, 0.1)',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(255, 76, 41, 0.5)',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#FF4C29',
                                        },
                                    }}
                                >
                                    <MenuItem value="recommended">Recommended</MenuItem>
                                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                                    <MenuItem value="reviews">Most Reviews</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>

                {/* Product Grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 3,
                    }}
                >
                    {filteredProducts.map((product) => (
                        <Paper
                            key={product.id}
                            elevation={0}
                            sx={{
                                bgcolor: '#ffffff',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                borderRadius: 2,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                                    transform: 'translateY(-4px)',
                                },
                            }}
                        >
                            {/* Product Image */}
                            <Box sx={{ position: 'relative' }}>
                                <Box
                                    component="img"
                                    src={product.image || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=200&fit=crop'}
                                    alt={product.name}
                                    sx={{
                                        width: '100%',
                                        height: 160,
                                        objectFit: 'cover',
                                    }}
                                />
                                {product.deal_ends && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            right: 8,
                                            bgcolor: '#FF4C29',
                                            color: '#ffffff',
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Deal ends in {product.deal_ends}
                                    </Box>
                                )}
                            </Box>

                            {/* Product Content */}
                            <Box sx={{ p: 2.5 }}>
                                {/* Badge */}
                                {product.badge && (
                                    <Box sx={{ mb: 1 }}>
                                        <Typography
                                            component="span"
                                            sx={{
                                                bgcolor: '#000000',
                                                color: '#ffffff',
                                                px: 1,
                                                py: 0.25,
                                                borderRadius: 0.5,
                                                fontSize: '0.65rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.5px',
                                                mr: 0.5,
                                            }}
                                        >
                                            SaaS சந்தை
                                        </Typography>
                                        {product.badge === 'SELECT' && (
                                            <Typography
                                                component="span"
                                                sx={{
                                                    color: '#666666',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                SELECT
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {/* Title */}
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: '#1a1a1a',
                                        fontSize: '1.1rem',
                                        mb: 0.5,
                                    }}
                                >
                                    {product.name}
                                </Typography>

                                {/* Category Link */}
                                <Typography sx={{ fontSize: '0.85rem', color: '#666666', mb: 1 }}>
                                    in{' '}
                                    <Typography
                                        component="span"
                                        sx={{
                                            color: '#1a1a1a',
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                color: '#FF4C29',
                                            },
                                        }}
                                    >
                                        {product.category_link || product.category}
                                    </Typography>
                                </Typography>

                                {/* Description */}
                                <Typography
                                    sx={{
                                        color: '#666666',
                                        fontSize: '0.9rem',
                                        mb: 2,
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        minHeight: '4em',
                                    }}
                                >
                                    {product.description}
                                </Typography>

                                {/* Rating */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < product.rating ? '#F59E0B' : 'transparent'}
                                                style={{ color: i < product.rating ? '#F59E0B' : '#D1D5DB' }}
                                            />
                                        ))}
                                    </Box>
                                    <Typography
                                        sx={{
                                            color: '#3B82F6',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        {product.review_count} reviews
                                    </Typography>
                                </Box>

                                {/* Price */}
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            color: '#1a1a1a',
                                            fontSize: '1.4rem',
                                        }}
                                    >
                                        ₹{product.price}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: '#666666',
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        /{product.badge || 'Lifetime'}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: '#999999',
                                            fontSize: '0.9rem',
                                            textDecoration: 'line-through',
                                        }}
                                    >
                                        ₹{product.original_price}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                    <Box
                        sx={{
                            textAlign: 'center',
                            py: 8,
                        }}
                    >
                        <Typography sx={{ color: '#666666', fontSize: '1.1rem', mb: 2 }}>
                            No products found
                        </Typography>
                        <Button
                            onClick={() => {
                                setSelectedCategories([]);
                                setSearchQuery('');
                            }}
                            sx={{
                                color: '#FF4C29',
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: 'rgba(255, 76, 41, 0.1)',
                                },
                            }}
                        >
                            Clear filters
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

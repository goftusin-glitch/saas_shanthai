import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, X, Image, Edit2 } from 'lucide-react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { productService, Product, ProductCreate } from '../../services/productService';

const categories = [
    'Operations',
    'Marketing & sales',
    'Build it yourself',
    'Media tools',
    'Finance',
    'Development & IT',
    'Customer experience',
];

const categoryLinks: { [key: string]: string[] } = {
    'Operations': ['Calendar & scheduling', 'Project management', 'HR & recruiting', 'Productivity'],
    'Marketing & sales': ['Email marketing', 'Social media', 'SEO', 'CRM', 'Advertising'],
    'Build it yourself': ['Web builders', 'No-code', 'App builders', 'Landing pages'],
    'Media tools': ['Video editing', 'Image editing', 'Audio', 'Design', 'Animation'],
    'Finance': ['Ecommerce', 'Accounting', 'Invoicing', 'Payments', 'Budgeting'],
    'Development & IT': ['Website analytics', 'API tools', 'DevOps', 'Security', 'Hosting'],
    'Customer experience': ['Customer support', 'Live chat', 'Feedback', 'Surveys', 'Knowledge base'],
};

interface ProductFormData {
    name: string;
    category: string;
    categoryLink: string;
    description: string;
    price: string;
    originalPrice: string;
    image: string;
    badge: string;
}

const initialFormData: ProductFormData = {
    name: '',
    category: '',
    categoryLink: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    badge: '',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const REQUIRED_WIDTH = 800;
const REQUIRED_HEIGHT = 400;

export const MyProducts = () => {
    const [myProducts, setMyProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>(initialFormData);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [editingProductId, setEditingProductId] = useState<number | null>(null);
    const [priceError, setPriceError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch user's products from API
    const fetchMyProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getMy();
            setMyProducts(data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const handleOpenDialog = () => {
        setFormData(initialFormData);
        setImagePreview(null);
        setImageDimensions(null);
        setEditingProductId(null);
        setPriceError(null);
        setIsDialogOpen(true);
    };

    const handleEditProduct = (product: Product) => {
        setFormData({
            name: product.name,
            category: product.category,
            categoryLink: product.category_link || '',
            description: product.description || '',
            price: product.price.toString(),
            originalPrice: product.original_price?.toString() || '',
            image: product.image || '',
            badge: product.badge || '',
        });
        setImagePreview(product.image || null);
        setImageDimensions(null);
        setEditingProductId(product.id);
        setPriceError(null);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setFormData(initialFormData);
        setImagePreview(null);
        setImageDimensions(null);
        setEditingProductId(null);
        setPriceError(null);
    };

    const handleInputChange = (field: keyof ProductFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Reset categoryLink when category changes
        if (field === 'category') {
            setFormData(prev => ({ ...prev, categoryLink: '' }));
        }

        // Validate price vs original price
        if (field === 'price' || field === 'originalPrice') {
            const price = field === 'price' ? parseFloat(value) : parseFloat(formData.price);
            const originalPrice = field === 'originalPrice' ? parseFloat(value) : parseFloat(formData.originalPrice);

            if (originalPrice && price && originalPrice <= price) {
                setPriceError('Original price must be higher than the sale price');
            } else {
                setPriceError(null);
            }
        }
    };

    const handleImageFile = (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            alert('Image size must be less than or equal to 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;

            // Validate image dimensions
            const img = new window.Image();
            img.onload = () => {
                if (img.width !== REQUIRED_WIDTH || img.height !== REQUIRED_HEIGHT) {
                    alert(`Image must be exactly ${REQUIRED_WIDTH} × ${REQUIRED_HEIGHT} pixels. Your image is ${img.width} × ${img.height} pixels.`);
                    return;
                }
                setImagePreview(result);
                setFormData(prev => ({ ...prev, image: result }));
                setImageDimensions({ width: img.width, height: img.height });
            };
            img.src = result;
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageFile(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageFile(file);
        }
    };

    const validateForm = (): boolean => {
        const price = parseFloat(formData.price);
        const originalPrice = parseFloat(formData.originalPrice);

        if (originalPrice && price && originalPrice <= price) {
            setPriceError('Original price must be higher than the sale price');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category || !formData.price) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        const productData: ProductCreate = {
            name: formData.name,
            category: formData.category,
            category_link: formData.categoryLink || formData.category,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            original_price: parseFloat(formData.originalPrice) || parseFloat(formData.price) * 2,
            image: formData.image || undefined,
            badge: formData.badge || undefined,
        };

        try {
            setSaving(true);
            if (editingProductId) {
                await productService.update(editingProductId, productData);
            } else {
                await productService.create(productData);
            }
            await fetchMyProducts();
            handleCloseDialog();
        } catch (err) {
            console.error('Failed to save product:', err);
            alert('Failed to save product. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            await productService.delete(id);
            await fetchMyProducts();
        } catch (err) {
            console.error('Failed to delete product:', err);
            alert('Failed to delete product. Please try again.');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress sx={{ color: '#FF4C29' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, bgcolor: '#ffffff', minHeight: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
                        My Products
                    </Typography>
                    <Typography sx={{ color: '#666666', fontSize: '1rem' }}>
                        Create and manage your products for the marketplace
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Plus size={20} />}
                    onClick={handleOpenDialog}
                    sx={{
                        bgcolor: '#FF4C29',
                        color: '#ffffff',
                        fontWeight: 600,
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                            bgcolor: '#E63E1C',
                        },
                    }}
                >
                    Launch Product
                </Button>
            </Box>

            {/* Products Grid or Empty State */}
            {myProducts.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '50vh',
                    }}
                >
                    <Typography sx={{ color: '#666666', fontSize: '1.2rem' }}>
                        No Products Yet
                    </Typography>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 3,
                    }}
                >
                    {myProducts.map((product) => (
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
                                },
                            }}
                        >
                            {/* Product Image */}
                            <Box
                                component="img"
                                src={product.image || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=200&fit=crop'}
                                alt={product.name}
                                sx={{
                                    width: '100%',
                                    height: 140,
                                    objectFit: 'cover',
                                }}
                            />

                            {/* Product Content */}
                            <Box sx={{ p: 2.5 }}>
                                <Typography
                                    sx={{
                                        fontWeight: 700,
                                        color: '#1a1a1a',
                                        fontSize: '1rem',
                                        mb: 0.5,
                                    }}
                                >
                                    {product.name}
                                </Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: '#666666', mb: 1 }}>
                                    in {product.category_link || product.category}
                                </Typography>
                                <Typography
                                    sx={{
                                        color: '#666666',
                                        fontSize: '0.85rem',
                                        mb: 2,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {product.description}
                                </Typography>

                                {/* Price and Actions */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                        <Typography sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '1.2rem' }}>
                                            ₹{product.price}
                                        </Typography>
                                        <Typography sx={{ color: '#999999', fontSize: '0.85rem', textDecoration: 'line-through' }}>
                                            ₹{product.original_price}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleEditProduct(product)}
                                            sx={{
                                                color: '#999999',
                                                '&:hover': { color: '#FF4C29', bgcolor: 'rgba(255, 76, 41, 0.1)' },
                                            }}
                                        >
                                            <Edit2 size={18} />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(product.id)}
                                            sx={{
                                                color: '#999999',
                                                '&:hover': { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)' },
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}

            {/* Create/Edit Product Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        bgcolor: '#ffffff',
                    },
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                        {editingProductId ? 'Edit Product' : 'Launch New Product'}
                    </Typography>
                    <IconButton onClick={handleCloseDialog} size="small">
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Product Name */}
                        <TextField
                            label="Product Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            fullWidth
                            required
                            placeholder="e.g., FlexiFunnels"
                        />

                        {/* Cover Image Upload with Drag & Drop */}
                        <Box>
                            <Typography sx={{ fontSize: '0.875rem', color: '#666666', mb: 1 }}>
                                Cover Image
                            </Typography>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <Box
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                sx={{
                                    border: isDragging ? '2px dashed #FF4C29' : '2px dashed rgba(0, 0, 0, 0.2)',
                                    borderRadius: 2,
                                    p: 3,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    bgcolor: isDragging ? 'rgba(255, 76, 41, 0.05)' : '#f8f9fa',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: '#FF4C29',
                                        bgcolor: 'rgba(255, 76, 41, 0.05)',
                                    },
                                }}
                            >
                                {imagePreview ? (
                                    <Box>
                                        <Box
                                            component="img"
                                            src={imagePreview}
                                            alt="Preview"
                                            sx={{
                                                maxWidth: '100%',
                                                maxHeight: 150,
                                                borderRadius: 1,
                                                mb: 1,
                                            }}
                                        />
                                        {imageDimensions && (
                                            <Typography sx={{ fontSize: '0.8rem', color: '#666666' }}>
                                                {imageDimensions.width} × {imageDimensions.height} px
                                            </Typography>
                                        )}
                                        <Typography sx={{ fontSize: '0.75rem', color: '#999999', mt: 1 }}>
                                            Click to change image
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <Image size={32} style={{ color: '#999999', marginBottom: 8 }} />
                                        <Typography sx={{ fontSize: '0.9rem', color: '#666666', mb: 0.5 }}>
                                            Drag & drop an image here, or click to upload
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.8rem', color: '#FF4C29', fontWeight: 600, mb: 0.5 }}>
                                            Required size: {REQUIRED_WIDTH} × {REQUIRED_HEIGHT} px (Width × Height)
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: '#999999' }}>
                                            Max file size: 5MB
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Category */}
                        <FormControl fullWidth required>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={formData.category}
                                label="Category"
                                onChange={(e) => handleInputChange('category', e.target.value)}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Category Link (Subcategory) */}
                        {formData.category && (
                            <FormControl fullWidth>
                                <InputLabel>Subcategory</InputLabel>
                                <Select
                                    value={formData.categoryLink}
                                    label="Subcategory"
                                    onChange={(e) => handleInputChange('categoryLink', e.target.value)}
                                >
                                    {categoryLinks[formData.category]?.map((link) => (
                                        <MenuItem key={link} value={link}>
                                            {link}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {/* Short Description */}
                        <TextField
                            label="Short Description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Describe your product in a few sentences..."
                        />

                        {/* Price Fields */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Price (₹)"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                type="number"
                                required
                                sx={{
                                    flex: 1,
                                    '& input[type=number]': {
                                        MozAppearance: 'textfield',
                                    },
                                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                        WebkitAppearance: 'none',
                                        margin: 0,
                                    },
                                }}
                                placeholder="49"
                            />
                            <TextField
                                label="Original Price (₹)"
                                value={formData.originalPrice}
                                onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                                type="number"
                                sx={{
                                    flex: 1,
                                    '& input[type=number]': {
                                        MozAppearance: 'textfield',
                                    },
                                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                        WebkitAppearance: 'none',
                                        margin: 0,
                                    },
                                }}
                                placeholder="199"
                                error={!!priceError}
                                helperText={priceError || "For strikethrough"}
                            />
                        </Box>

                        {/* Badge */}
                        <FormControl fullWidth>
                            <InputLabel>Badge</InputLabel>
                            <Select
                                value={formData.badge}
                                label="Badge"
                                onChange={(e) => handleInputChange('badge', e.target.value)}
                            >
                                <MenuItem value="">None</MenuItem>
                                <MenuItem value="Yearly">Yearly</MenuItem>
                                <MenuItem value="Monthly">Monthly</MenuItem>
                                <MenuItem value="Lifetime">Lifetime</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button
                        onClick={handleCloseDialog}
                        sx={{ color: '#666666', fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!formData.name || !formData.category || !formData.price || !!priceError || saving}
                        sx={{
                            bgcolor: '#FF4C29',
                            color: '#ffffff',
                            fontWeight: 600,
                            px: 4,
                            '&:hover': {
                                bgcolor: '#E63E1C',
                            },
                            '&:disabled': {
                                bgcolor: '#cccccc',
                            },
                        }}
                    >
                        {saving ? 'Saving...' : (editingProductId ? 'Update Product' : 'Launch Product')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

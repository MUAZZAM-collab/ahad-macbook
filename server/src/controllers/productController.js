const DataStore = require('../services/dataStore');

// @desc    Fetch all products with advanced filtering & sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      modelFamily,
      chip,
      screenSize,
      ram,
      storage,
      condition,
      minPrice,
      maxPrice,
      search,
      sort,
      limit,
    } = req.query;

    const query = {};
    if (modelFamily) query.modelFamily = modelFamily;
    if (chip) {
      query.chip = chip.includes(',') ? chip.split(',') : chip;
    }
    if (screenSize) query.screenSize = screenSize;
    if (ram) query.ram = ram;
    if (storage) query.storage = storage;
    if (condition) query.condition = condition;
    if (minPrice !== undefined) query.minPrice = minPrice;
    if (maxPrice !== undefined) query.maxPrice = maxPrice;
    if (search) query.search = search;

    // Sorting map
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const products = await DataStore.products.find(query, {
      sort: sortOption,
      limit: limit ? Number(limit) : undefined,
    });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('[Get Products Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await DataStore.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'MacBook product not found',
      });
    }
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      modelFamily,
      chip,
      screenSize,
      ram,
      storage,
      color,
      condition,
      price,
      originalPrice,
      stock,
      images,
      description,
      specs,
      featured,
    } = req.body;

    if (!name || !modelFamily || !chip || !screenSize || !ram || !storage || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory product specifications and pricing',
      });
    }

    const newProduct = await DataStore.products.create({
      name,
      modelFamily,
      chip,
      screenSize,
      ram,
      storage,
      color: color || 'Space Gray',
      condition: condition || 'Refurbished',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      stock: stock !== undefined ? Number(stock) : 5,
      images: images && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      ],
      description: description || `Certified Apple ${name} with high performance hardware.`,
      specs: specs || {
        processorDetails: `Apple ${chip} processor`,
        display: `${screenSize} Liquid Retina display`,
        batteryHealth: '100% / Normal',
        ports: ['Thunderbolt 4 / USB-C', 'MagSafe 3', 'Audio Jack'],
        weight: '3.4 lbs',
        cycleCount: 1,
        warranty: '1-Year Ahad Warranty',
      },
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'MacBook product successfully listed',
    });
  } catch (error) {
    console.error('[Create Product Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await DataStore.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'MacBook product not found',
      });
    }

    const updated = await DataStore.products.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      data: updated,
      message: 'Product successfully updated',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await DataStore.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'MacBook product not found',
      });
    }

    await DataStore.products.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product listing removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

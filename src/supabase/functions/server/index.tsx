import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client for storage
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize storage bucket on startup
(async () => {
  const bucketName = 'make-4c9f49ef-product-images';
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
  if (!bucketExists) {
    await supabase.storage.createBucket(bucketName, { public: false });
    console.log(`Created bucket: ${bucketName}`);
  }
})();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-4c9f49ef/health", (c) => {
  return c.json({ status: "ok" });
});

// Register a new spaza shop
app.post("/make-server-4c9f49ef/shops", async (c) => {
  try {
    const shopData = await c.req.json();
    
    // Validate required fields
    if (!shopData.shopName || !shopData.ownerUsername || !shopData.location) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Generate unique shop ID
    const shopId = `SHOP${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const shop = {
      ...shopData,
      shopId,
      createdAt: new Date().toISOString(),
    };

    // Save shop to KV store
    await kv.set(`shop:${shopId}`, shop);
    
    // Add shop to owner's shops list
    const ownerShopsKey = `owner:${shopData.ownerUsername}:shops`;
    const ownerShops = await kv.get(ownerShopsKey) || [];
    ownerShops.push(shopId);
    await kv.set(ownerShopsKey, ownerShops);

    // Add shop to global shop list
    const allShops = await kv.get('shops:all') || [];
    allShops.push(shopId);
    await kv.set('shops:all', allShops);

    return c.json({ success: true, shop });
  } catch (error) {
    console.error('Error registering shop:', error);
    return c.json({ error: `Failed to register shop: ${error.message}` }, 500);
  }
});

// Get all shops
app.get("/make-server-4c9f49ef/shops", async (c) => {
  try {
    const shopIds = await kv.get('shops:all') || [];
    const shops = [];

    for (const shopId of shopIds) {
      const shop = await kv.get(`shop:${shopId}`);
      if (shop) {
        shops.push(shop);
      }
    }

    return c.json({ shops });
  } catch (error) {
    console.error('Error fetching shops:', error);
    return c.json({ error: `Failed to fetch shops: ${error.message}` }, 500);
  }
});

// Get shops by owner
app.get("/make-server-4c9f49ef/shops/owner/:username", async (c) => {
  try {
    const username = c.req.param('username');
    const shopIds = await kv.get(`owner:${username}:shops`) || [];
    const shops = [];

    for (const shopId of shopIds) {
      const shop = await kv.get(`shop:${shopId}`);
      if (shop) {
        shops.push(shop);
      }
    }

    return c.json({ shops });
  } catch (error) {
    console.error('Error fetching owner shops:', error);
    return c.json({ error: `Failed to fetch owner shops: ${error.message}` }, 500);
  }
});

// Add a new product to a shop
app.post("/make-server-4c9f49ef/products", async (c) => {
  try {
    const productData = await c.req.json();
    
    // Validate required fields
    if (!productData.name || !productData.shopId || !productData.ownerUsername) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Verify shop ownership
    const shop = await kv.get(`shop:${productData.shopId}`);
    if (!shop || shop.ownerUsername !== productData.ownerUsername) {
      return c.json({ error: 'Unauthorized: You can only add products to your own shop' }, 403);
    }

    // Generate unique product ID
    const productId = `PROD${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const product = {
      ...productData,
      productId,
      createdAt: new Date().toISOString(),
    };

    // Save product to KV store
    await kv.set(`product:${productId}`, product);
    
    // Add product to shop's products list
    const shopProductsKey = `shop:${productData.shopId}:products`;
    const shopProducts = await kv.get(shopProductsKey) || [];
    shopProducts.push(productId);
    await kv.set(shopProductsKey, shopProducts);

    // Add product to global products list
    const allProducts = await kv.get('products:all') || [];
    allProducts.push(productId);
    await kv.set('products:all', allProducts);

    return c.json({ success: true, product });
  } catch (error) {
    console.error('Error adding product:', error);
    return c.json({ error: `Failed to add product: ${error.message}` }, 500);
  }
});

// Get all products
app.get("/make-server-4c9f49ef/products", async (c) => {
  try {
    const productIds = await kv.get('products:all') || [];
    const products = [];

    for (const productId of productIds) {
      const product = await kv.get(`product:${productId}`);
      if (product) {
        products.push(product);
      }
    }

    return c.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return c.json({ error: `Failed to fetch products: ${error.message}` }, 500);
  }
});

// Get products by shop
app.get("/make-server-4c9f49ef/products/shop/:shopId", async (c) => {
  try {
    const shopId = c.req.param('shopId');
    const productIds = await kv.get(`shop:${shopId}:products`) || [];
    const products = [];

    for (const productId of productIds) {
      const product = await kv.get(`product:${productId}`);
      if (product) {
        products.push(product);
      }
    }

    return c.json({ products });
  } catch (error) {
    console.error('Error fetching shop products:', error);
    return c.json({ error: `Failed to fetch shop products: ${error.message}` }, 500);
  }
});

// Upload product image
app.post("/make-server-4c9f49ef/products/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('image') as File;
    const ownerUsername = formData.get('ownerUsername') as string;
    
    if (!file || !ownerUsername) {
      return c.json({ error: 'Missing image file or owner username' }, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${ownerUsername}/${fileName}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('make-4c9f49ef-product-images')
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: `Failed to upload image: ${uploadError.message}` }, 500);
    }

    // Generate signed URL (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('make-4c9f49ef-product-images')
      .createSignedUrl(filePath, 31536000); // 1 year in seconds

    if (urlError) {
      console.error('URL generation error:', urlError);
      return c.json({ error: `Failed to generate image URL: ${urlError.message}` }, 500);
    }

    return c.json({ 
      success: true, 
      imageUrl: urlData.signedUrl,
      filePath 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return c.json({ error: `Failed to upload image: ${error.message}` }, 500);
  }
});

// Update product
app.put("/make-server-4c9f49ef/products/:productId", async (c) => {
  try {
    const productId = c.req.param('productId');
    const updates = await c.req.json();
    
    const product = await kv.get(`product:${productId}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    // Verify ownership
    if (updates.ownerUsername && product.ownerUsername !== updates.ownerUsername) {
      return c.json({ error: 'Unauthorized: You can only update your own products' }, 403);
    }

    const updatedProduct = {
      ...product,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`product:${productId}`, updatedProduct);

    return c.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return c.json({ error: `Failed to update product: ${error.message}` }, 500);
  }
});

// Delete product
app.delete("/make-server-4c9f49ef/products/:productId", async (c) => {
  try {
    const productId = c.req.param('productId');
    const ownerUsername = c.req.query('ownerUsername');
    
    const product = await kv.get(`product:${productId}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    // Verify ownership
    if (product.ownerUsername !== ownerUsername) {
      return c.json({ error: 'Unauthorized: You can only delete your own products' }, 403);
    }

    // Remove from shop's products list
    const shopProductsKey = `shop:${product.shopId}:products`;
    let shopProducts = await kv.get(shopProductsKey) || [];
    shopProducts = shopProducts.filter(id => id !== productId);
    await kv.set(shopProductsKey, shopProducts);

    // Remove from global products list
    let allProducts = await kv.get('products:all') || [];
    allProducts = allProducts.filter(id => id !== productId);
    await kv.set('products:all', allProducts);

    // Delete product
    await kv.del(`product:${productId}`);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return c.json({ error: `Failed to delete product: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);




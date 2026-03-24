import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

declare const process: any;

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@localhost:5432/apple_shop',
});

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await pool.query('DELETE FROM "Review"');
  await pool.query('DELETE FROM "OrderItem"');
  await pool.query('DELETE FROM "Order"');
  await pool.query('DELETE FROM "Address"');
  await pool.query('DELETE FROM "Product"');
  await pool.query('DELETE FROM "Category"');
  await pool.query('DELETE FROM "User"');

  // Create admin
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const adminResult = await pool.query(
    'INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING id',
    ['Admin', 'admin@shop.com', adminPassword, 'ADMIN']
  );
  console.log('✅ Admin created: admin@shop.com / Admin123!');

  // Create users
  const userPassword = await bcrypt.hash('User123!', 10);
  const user1Result = await pool.query(
    'INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING id',
    ['John Doe', 'john@example.com', userPassword, 'USER']
  );
  const user2Result = await pool.query(
    'INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING id',
    ['Jane Smith', 'jane@example.com', userPassword, 'USER']
  );
  const user3Result = await pool.query(
    'INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW()) RETURNING id',
    ['Bob Wilson', 'bob@example.com', userPassword, 'USER']
  );
  console.log('✅ Users created');

  // Create categories
  const category1Result = await pool.query(
    'INSERT INTO "Category" (id, name, slug, image) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id',
    ['iPhone', 'iphone', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400']
  );
  const category2Result = await pool.query(
    'INSERT INTO "Category" (id, name, slug, image) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id',
    ['MacBook', 'macbook', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400']
  );
  const category3Result = await pool.query(
    'INSERT INTO "Category" (id, name, slug, image) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id',
    ['iPad', 'ipad', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400']
  );
  const category4Result = await pool.query(
    'INSERT INTO "Category" (id, name, slug, image) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id',
    ['Apple Watch', 'apple-watch', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400']
  );
  const category5Result = await pool.query(
    'INSERT INTO "Category" (id, name, slug, image) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id',
    ['AirPods', 'airpods', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400']
  );
  const category6Result = await pool.query(
    'INSERT INTO "Category" (id, name, slug, image) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id',
    ['Accessories', 'accessories', 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400']
  );
  console.log('✅ Categories created');

  // Create products
  const products = [
    // iPhones
    { name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max', description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system.', price: 1199, comparePrice: 1299, stock: 50, categoryId: category1Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600']), tags: JSON.stringify(['new', 'featured']), featured: true },
    { name: 'iPhone 15 Pro', slug: 'iphone-15-pro', description: 'Pro camera system, A17 Pro chip, titanium design.', price: 999, comparePrice: 1099, stock: 75, categoryId: category1Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600']), tags: JSON.stringify(['new']), featured: false },
    { name: 'iPhone 15', slug: 'iphone-15', description: 'Dynamic Island, 48MP camera, USB-C.', price: 799, stock: 100, categoryId: category1Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600']), tags: JSON.stringify([]), featured: false },
    { name: 'iPhone 14', slug: 'iphone-14', description: 'Cinematic mode, action mode, amazing battery life.', price: 699, stock: 80, categoryId: category1Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600']), tags: JSON.stringify([]), featured: false },
    // MacBooks
    { name: 'MacBook Pro 16" M3 Max', slug: 'macbook-pro-16-m3-max', description: 'The most powerful MacBook Pro with M3 Max chip.', price: 3499, stock: 25, categoryId: category2Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600']), tags: JSON.stringify(['new', 'featured']), featured: true },
    { name: 'MacBook Pro 14" M3 Pro', slug: 'macbook-pro-14-m3-pro', description: 'Pro performance in a portable design.', price: 2499, stock: 35, categoryId: category2Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600']), tags: JSON.stringify(['new']), featured: false },
    { name: 'MacBook Air 15" M3', slug: 'macbook-air-15-m3', description: 'Impossibly thin, incredibly powerful.', price: 1299, stock: 60, categoryId: category2Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600']), tags: JSON.stringify([]), featured: false },
    { name: 'MacBook Air 13" M2', slug: 'macbook-air-13-m2', description: 'Supercharged by M2 chip.', price: 1099, stock: 70, categoryId: category2Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600']), tags: JSON.stringify([]), featured: false },
    // iPads
    { name: 'iPad Pro 12.9" M2', slug: 'ipad-pro-12-9-m2', description: 'The ultimate iPad experience with M2 chip.', price: 1099, stock: 40, categoryId: category3Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600']), tags: JSON.stringify(['featured']), featured: true },
    { name: 'iPad Air M2', slug: 'ipad-air-m2', description: 'Power meets versatility.', price: 599, stock: 55, categoryId: category3Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600']), tags: JSON.stringify([]), featured: false },
    { name: 'iPad 10th Gen', slug: 'ipad-10th-gen', description: 'Colorful, capable, and fun.', price: 449, stock: 85, categoryId: category3Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600']), tags: JSON.stringify([]), featured: false },
    { name: 'iPad Mini', slug: 'ipad-mini', description: 'Mega power. Mini size.', price: 499, stock: 65, categoryId: category3Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600']), tags: JSON.stringify([]), featured: false },
    // Apple Watch
    { name: 'Apple Watch Ultra 2', slug: 'apple-watch-ultra-2', description: 'The most rugged Apple Watch ever.', price: 799, stock: 30, categoryId: category4Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600']), tags: JSON.stringify(['new', 'featured']), featured: true },
    { name: 'Apple Watch Series 9', slug: 'apple-watch-series-9', description: 'Smarter. Brighter. Mightier.', price: 399, stock: 50, categoryId: category4Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600']), tags: JSON.stringify(['new']), featured: false },
    { name: 'Apple Watch SE', slug: 'apple-watch-se', description: 'All the essentials. Light on price.', price: 249, stock: 70, categoryId: category4Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600']), tags: JSON.stringify([]), featured: false },
    // AirPods
    { name: 'AirPods Pro 2', slug: 'airpods-pro-2', description: 'Rebuilt from the sound up with USB-C.', price: 249, stock: 90, categoryId: category5Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600']), tags: JSON.stringify(['new', 'featured']), featured: true },
    { name: 'AirPods 3rd Gen', slug: 'airpods-3rd-gen', description: 'All-new design with spatial audio.', price: 179, stock: 100, categoryId: category5Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600']), tags: JSON.stringify([]), featured: false },
    { name: 'AirPods Max', slug: 'airpods-max', description: 'High-fidelity audio with Active Noise Cancellation.', price: 549, stock: 45, categoryId: category5Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600']), tags: JSON.stringify([]), featured: false },
    // Accessories
    { name: 'MagSafe Charger', slug: 'magsafe-charger', description: 'Perfectly aligned wireless charging.', price: 39, stock: 150, categoryId: category6Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600']), tags: JSON.stringify([]), featured: false },
    { name: 'Apple Pencil 2', slug: 'apple-pencil-2', description: 'Pixel-perfect precision.', price: 129, stock: 80, categoryId: category6Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600']), tags: JSON.stringify([]), featured: false },
    { name: 'Magic Keyboard', slug: 'magic-keyboard', description: 'Typing at its finest.', price: 99, stock: 60, categoryId: category6Result.rows[0].id, images: JSON.stringify(['https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600']), tags: JSON.stringify([]), featured: false },
  ];

  for (const product of products) {
    await pool.query(
      'INSERT INTO "Product" (id, name, slug, description, price, "comparePrice", stock, images, "categoryId", tags, featured, "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, NOW(), NOW())',
      [product.name, product.slug, product.description, product.price, product.comparePrice || null, product.stock, product.images, product.categoryId, product.tags, product.featured]
    );
  }
  console.log('✅ Products created');

  // Create addresses for users
  const users = [user1Result.rows[0], user2Result.rows[0], user3Result.rows[0]];
  for (const user of users) {
    await pool.query(
      'INSERT INTO "Address" (id, "userId", "fullName", phone, street, city, province, "isDefault") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, true)',
      [user.id, user.name, '+1234567890', '123 Main Street', 'New York', 'NY']
    );
  }
  console.log('✅ Addresses created');

  // Create sample orders
  const allProducts = await pool.query('SELECT * FROM "Product"');
  
  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomProducts = allProducts.rows.slice(0, Math.floor(Math.random() * 3) + 1);
    
    const total = randomProducts.reduce((sum: number, p: any) => sum + p.price, 0);
    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const paymentStatuses = ['UNPAID', 'PAID'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomPaymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    
    const orderResult = await pool.query(
      'INSERT INTO "Order" (id, "userId", status, total, "shippingAddress", "paymentStatus", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), NOW()) RETURNING id',
      [randomUser.id, randomStatus, total, JSON.stringify({ fullName: randomUser.name, phone: '+1234567890', street: '123 Main Street', city: 'New York', province: 'NY' }), randomPaymentStatus]
    );

    for (const product of randomProducts) {
      await pool.query(
        'INSERT INTO "OrderItem" (id, "orderId", "productId", quantity, price, snapshot) VALUES (gen_random_uuid(), $1, $2, 1, $3, $4)',
        [orderResult.rows[0].id, product.id, product.price, JSON.stringify({ name: product.name, image: JSON.parse(product.images)[0] || '' })]
      );
    }
  }
  console.log('✅ Orders created');

  // Create reviews for delivered orders
  const deliveredOrders = await pool.query(
    'SELECT o.*, oi."productId" FROM "Order" o JOIN "OrderItem" oi ON o.id = oi."orderId" WHERE o.status = \'DELIVERED\''
  );

  for (const row of deliveredOrders.rows) {
    const existingReview = await pool.query(
      'SELECT * FROM "Review" WHERE "userId" = $1 AND "productId" = $2',
      [row.userId, row.productId]
    );

    if (existingReview.rows.length === 0) {
      await pool.query(
        'INSERT INTO "Review" (id, "userId", "productId", rating, comment, "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())',
        [row.userId, row.productId, Math.floor(Math.random() * 3) + 3, 'Great product! Highly recommend.']
      );
    }
  }
  console.log('✅ Reviews created');

  console.log('\n🎉 Seed completed!');
  console.log('\n📝 Test accounts:');
  console.log('   Admin: admin@shop.com / Admin123!');
  console.log('   User:  john@example.com / User123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    (process as any).exit(1);
  })
  .finally(async () => {
    await pool.end();
  });

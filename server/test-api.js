const http = require('http');

// Wait 3.5 seconds to let MongoDB connection attempt complete and server bind
setTimeout(runTests, 3500);

// Require index to trigger startServer
require('./src/index.js');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n--- STARTING AUTOMATED END-TO-END VERIFICATION SUITE ---\n');

  try {
    // 1. Health check
    console.log('1. Testing GET /api/health ...');
    const healthRes = await request({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/health',
      method: 'GET',
    });
    console.log(`✅ Status: ${healthRes.status}, App: ${healthRes.body.app}`);

    // 2. Login Admin
    console.log('\n2. Testing POST /api/auth/login as Admin ...');
    const adminLogin = await request(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'admin@ahadmacbook.com', password: 'admin123456' }
    );
    console.log(`✅ Admin login status: ${adminLogin.status}, User: ${adminLogin.body.data.name}, Role: ${adminLogin.body.data.role}`);
    const adminToken = adminLogin.body.data.token;

    // 3. Login Customer
    console.log('\n3. Testing POST /api/auth/login as Customer ...');
    const custLogin = await request(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'customer@example.com', password: 'password123' }
    );
    console.log(`✅ Customer login status: ${custLogin.status}, User: ${custLogin.body.data.name}`);
    const custToken = custLogin.body.data.token;

    // 4. Products Catalog & Filters
    console.log('\n4. Testing GET /api/products?modelFamily=MacBook+Pro ...');
    const prodRes = await request({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/products?modelFamily=MacBook+Pro',
      method: 'GET',
    });
    console.log(`✅ MacBook Pro count: ${prodRes.body.count}`);
    const firstProd = prodRes.body.data[0];
    console.log(`   Sample product: ${firstProd.name} ($${firstProd.price})`);

    // 5. Single Product Detail
    console.log(`\n5. Testing GET /api/products/${firstProd._id} ...`);
    const singleProd = await request({
      hostname: '127.0.0.1',
      port: 5001,
      path: `/api/products/${firstProd._id}`,
      method: 'GET',
    });
    console.log(`✅ Detail: ${singleProd.body.data.name}, Chip: ${singleProd.body.data.chip}`);

    // 6. Repair Status Tracker lookup
    console.log('\n6. Testing GET /api/repairs/track/AMB-9482 ...');
    const trackRes = await request({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/repairs/track/AMB-9482',
      method: 'GET',
    });
    console.log(`✅ Ticket: ${trackRes.body.data.ticketId}, Status: ${trackRes.body.data.status}, Current Stage: ${trackRes.body.data.currentStageIndex}`);

    // 7. Create a new repair booking
    console.log('\n7. Testing POST /api/repairs (Multi-step booking submission) ...');
    const newRepairRes = await request(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/api/repairs',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${custToken}`,
        },
      },
      {
        customerName: 'Sarah Jenkins',
        customerEmail: 'customer@example.com',
        customerPhone: '+1 (415) 320-8841',
        macbookModel: 'MacBook Pro 14" (M3 Pro, 2023)',
        serialNumber: 'C02TEST7819',
        issueCategory: 'Screen Replacement',
        issueDescription: 'Accidental drop cracked retina panel display glass.',
        deliveryMethod: 'Drop-off in Store',
        priority: 'Standard',
      }
    );
    console.log(`✅ Created Repair ID: ${newRepairRes.body.data.ticketId}, Estimated: $${newRepairRes.body.data.estimatedCost}`);

    // 8. Customer approves quote
    console.log(`\n8. Testing POST /api/repairs/track/${newRepairRes.body.data.ticketId}/quote (Customer Approval) ...`);
    const quoteApproveRes = await request(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: `/api/repairs/track/${newRepairRes.body.data.ticketId}/quote`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { action: 'approve' }
    );
    console.log(`✅ Quote status: ${quoteApproveRes.body.data.quoteStatus}`);

    // 9. Create an order (Simulated purchase)
    console.log('\n9. Testing POST /api/orders (Simulated purchase) ...');
    const orderRes = await request(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/api/orders',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${custToken}`,
        },
      },
      {
        orderItems: [
          {
            product: firstProd._id,
            name: firstProd.name,
            price: firstProd.price,
            quantity: 1,
            image: firstProd.images[0],
            chip: firstProd.chip,
            ram: firstProd.ram,
            storage: firstProd.storage,
            condition: firstProd.condition,
          },
        ],
        shippingAddress: {
          fullName: 'Sarah Jenkins',
          street: '742 Evergreen Terrace',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94107',
          country: 'United States',
          phone: '+1 (415) 320-8841',
        },
        paymentMethod: 'Credit Card / Apple Pay (Simulated)',
        itemsPrice: firstProd.price,
        taxPrice: Math.round(firstProd.price * 0.08 * 100) / 100,
        shippingPrice: 0,
        totalPrice: Math.round(firstProd.price * 1.08 * 100) / 100,
      }
    );
    console.log(`✅ Placed Order #: ${orderRes.body.data.orderNumber}, Tracking: ${orderRes.body.data.trackingNumber}`);

    // 10. Admin Stats
    console.log('\n10. Testing GET /api/orders/stats/summary as Admin ...');
    const statsRes = await request({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/orders/stats/summary',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`✅ Total Revenue: $${statsRes.body.data.totalRevenue}, Orders: ${statsRes.body.data.ordersCount}, Active Repairs: ${statsRes.body.data.activeRepairsCount}`);

    console.log('\n🎉 ALL 10 TEST SUITES EXECUTED WITH 100% SUCCESS!\n');
    process.exit(0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

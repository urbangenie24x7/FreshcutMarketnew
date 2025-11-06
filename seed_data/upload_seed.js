const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadSeedData() {
  try {
    console.log('Starting seed data upload...');
    
    // Read the master data
    const masterData = JSON.parse(fs.readFileSync('./master_data.json', 'utf8'));
    
    // Upload Product Catalog
    console.log('Uploading product catalog...');
    const catalogBatch = db.batch();
    for (const [id, data] of Object.entries(masterData.product_catalog)) {
      const docRef = db.collection('product_catalog').doc(id);
      catalogBatch.set(docRef, data);
    }
    await catalogBatch.commit();
    console.log(`✅ Uploaded ${Object.keys(masterData.product_catalog).length} catalog items`);
    
    // Upload Users (Vendor Registrations)
    console.log('Uploading user registrations...');
    const userBatch = db.batch();
    for (const [id, data] of Object.entries(masterData.users)) {
      const docRef = db.collection('users').doc(id);
      userBatch.set(docRef, data);
    }
    await userBatch.commit();
    console.log(`✅ Uploaded ${Object.keys(masterData.users).length} user registrations`);
    
    // Upload Vendors
    console.log('Uploading vendors...');
    const vendorBatch = db.batch();
    for (const [id, data] of Object.entries(masterData.vendors)) {
      const docRef = db.collection('vendors').doc(id);
      vendorBatch.set(docRef, data);
    }
    await vendorBatch.commit();
    console.log(`✅ Uploaded ${Object.keys(masterData.vendors).length} vendors`);
    
    // Upload Products
    console.log('Uploading products...');
    const productBatch = db.batch();
    for (const [id, data] of Object.entries(masterData.products)) {
      const docRef = db.collection('products').doc(id);
      productBatch.set(docRef, data);
    }
    await productBatch.commit();
    console.log(`✅ Uploaded ${Object.keys(masterData.products).length} products`);
    
    console.log('🎉 All seed data uploaded successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error uploading seed data:', error);
    process.exit(1);
  }
}

uploadSeedData();
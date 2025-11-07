import { useState, useEffect } from 'react'
import Navigation from '../../components/Navigation'
import SEOHead from '../../components/SEOHead'

export default function VendorDashboard() {
  const [mounted, setMounted] = useState(false)
  const [currentVendor, setCurrentVendor] = useState(null)
  const [products, setProducts] = useState([])
  const [vendorProducts, setVendorProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    productId: '',
    price: '',
    available: true,
    deliveryTime: '2 hours',
    deliveryOption: 'free',
    deliveryCharges: 0,
    minValueForFreeDelivery: 0,
    specialOffer: ''
  })
  const [editingProduct, setEditingProduct] = useState(null)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    setMounted(true)
    loadVendorData()
  }, [])

  const loadVendorData = async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      // Load products
      const productsSnap = await getDocs(collection(db, 'products'))
      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      // Load current vendor (simulate login - in real app, get from auth)
      const vendorsSnap = await getDocs(collection(db, 'vendors'))
      const vendor = vendorsSnap.docs[0] // Simulate first vendor login
      if (vendor) {
        setCurrentVendor({ id: vendor.id, ...vendor.data() })
        
        // Load vendor's products
        const vendorProductsSnap = await getDocs(collection(db, 'vendorProducts'))
        const myProducts = vendorProductsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(vp => vp.vendorId === vendor.id)
        setVendorProducts(myProducts)
      }
      
      // Load orders
      const ordersSnap = await getDocs(collection(db, 'orders'))
      const myOrders = ordersSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(order => order.vendorId === vendor?.id)
      setOrders(myOrders)
    } catch (error) {
      console.error('Error loading vendor data:', error)
      console.log('Products loaded:', products.length)
      console.log('Products:', products)
    }
  }

  const addProduct = async () => {
    try {
      const { collection, addDoc, updateDoc, doc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const existingProduct = vendorProducts.find(vp => vp.productId === newProduct.productId)
      
      if (existingProduct) {
        // Update existing product
        await updateDoc(doc(db, 'vendorProducts', existingProduct.id), {
          price: parseFloat(newProduct.price),
          available: newProduct.available,
          deliveryTime: newProduct.deliveryTime,
          deliveryOption: newProduct.deliveryOption,
          deliveryCharges: newProduct.deliveryOption === 'charges' ? parseFloat(newProduct.deliveryCharges) : 0,
          minValueForFreeDelivery: newProduct.deliveryOption === 'conditional' ? parseFloat(newProduct.minValueForFreeDelivery) : 0,
          specialOffer: newProduct.specialOffer,
          updatedAt: serverTimestamp()
        })
        alert('Product updated successfully!')
      } else {
        // Add new product
        await addDoc(collection(db, 'vendorProducts'), {
          productId: newProduct.productId,
          vendorId: currentVendor.id,
          price: parseFloat(newProduct.price),
          available: newProduct.available,
          deliveryTime: newProduct.deliveryTime,
          deliveryOption: newProduct.deliveryOption,
          deliveryCharges: newProduct.deliveryOption === 'charges' ? parseFloat(newProduct.deliveryCharges) : 0,
          minValueForFreeDelivery: newProduct.deliveryOption === 'conditional' ? parseFloat(newProduct.minValueForFreeDelivery) : 0,
          specialOffer: newProduct.specialOffer,
          createdAt: serverTimestamp()
        })
        alert('Product added successfully!')
      }
      
      setNewProduct({ productId: '', price: '', available: true, deliveryTime: '2 hours', deliveryOption: 'free', deliveryCharges: 0, minValueForFreeDelivery: 0, specialOffer: '' })
      setShowAddProduct(false)
      loadVendorData()
    } catch (error) {
      alert('Error saving product: ' + error.message)
    }
  }

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : 'Unknown Product'
  }

  const getProductCategory = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.category : 'unknown'
  }

  if (!mounted || !currentVendor) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <>
      <SEOHead 
        title={`${currentVendor?.name || 'Vendor'} Dashboard | FreshCuts`}
        description="Manage your meat vendor business. Add products, set prices, manage orders and track sales on FreshCuts marketplace."
        url="https://freshcuts.com/vendor"
      />
      <Navigation />
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#16a34a', fontSize: '32px', marginBottom: '10px' }}>{currentVendor.name}</h1>
        <p style={{ color: '#666' }}>Manage your products and orders</p>
      </header>

      {/* Products Management */}
      <section style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>My Products ({vendorProducts.length})</h2>
          <button
            onClick={() => setShowAddProduct(!showAddProduct)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {showAddProduct ? 'Cancel' : 'Add Product'}
          </button>
        </div>
        
        {showAddProduct && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#f9fafb', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Product</label>
                {newProduct.productId ? (
                  <div style={{ 
                    padding: '10px', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '4px', 
                    backgroundColor: '#f9fafb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>
                      {(() => {
                        const product = products.find(p => p.id === newProduct.productId)
                        return product ? `${product.name} (${product.category}) - Default: ₹${product.default_price}` : 'Unknown Product'
                      })()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewProduct({...newProduct, productId: ''})}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <select
                    value={newProduct.productId}
                    onChange={(e) => setNewProduct({...newProduct, productId: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  >
                    <option value="">Select Product</option>
                    {products.length === 0 ? (
                      <option disabled>No products available</option>
                    ) : (
                      products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} ({product.category}) - Default: ₹{product.default_price || 'N/A'}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Your Price (₹)</label>
                <input
                  type="number"
                  placeholder="Enter your price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Availability</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="checkbox"
                      checked={newProduct.available}
                      onChange={(e) => setNewProduct({...newProduct, available: e.target.checked})}
                    />
                    Available for sale
                  </label>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Delivery Time</label>
                <select
                  value={newProduct.deliveryTime}
                  onChange={(e) => setNewProduct({...newProduct, deliveryTime: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                >
                  <option value="30 mins">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="Same day">Same day</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Delivery Options</label>
                <select
                  value={newProduct.deliveryOption}
                  onChange={(e) => setNewProduct({...newProduct, deliveryOption: e.target.value})}
                  style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                >
                  <option value="free">Free Delivery</option>
                  <option value="charges">Delivery Charges</option>
                  <option value="conditional">Free above minimum value</option>
                </select>
              </div>
            </div>
            {newProduct.deliveryOption === 'charges' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Delivery Charges (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter delivery charges"
                    value={newProduct.deliveryCharges}
                    onChange={(e) => setNewProduct({...newProduct, deliveryCharges: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
              </div>
            )}
            {newProduct.deliveryOption === 'conditional' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Delivery Charges (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter delivery charges"
                    value={newProduct.deliveryCharges}
                    onChange={(e) => setNewProduct({...newProduct, deliveryCharges: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Min Value for Free Delivery (₹)</label>
                  <input
                    type="number"
                    placeholder="Minimum order value"
                    value={newProduct.minValueForFreeDelivery}
                    onChange={(e) => setNewProduct({...newProduct, minValueForFreeDelivery: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                </div>
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Special Offer (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Buy 2 get 1 free, 10% off on bulk orders"
                value={newProduct.specialOffer}
                onChange={(e) => setNewProduct({...newProduct, specialOffer: e.target.value})}
                style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '15px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={addProduct}
                disabled={!newProduct.productId || !newProduct.price}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  opacity: (!newProduct.productId || !newProduct.price) ? 0.5 : 1
                }}
              >
                {vendorProducts.find(vp => vp.productId === newProduct.productId) ? 'Update Product' : 'Add Product'}
              </button>
              {newProduct.productId && (
                <button
                  onClick={() => {
                    setNewProduct({ productId: '', price: '', available: true, deliveryTime: '2 hours', deliveryOption: 'free', deliveryCharges: 0, minValueForFreeDelivery: 0, specialOffer: '' })
                    setShowAddProduct(false)
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* All Products List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '15px' }}>
          {products.map(product => {
            const vendorProduct = vendorProducts.find(vp => vp.productId === product.id)
            const isOffered = !!vendorProduct
            
            return (
              <div key={product.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '15px',
                backgroundColor: isOffered ? (vendorProduct.available ? 'white' : '#f9fafb') : '#fafafa',
                opacity: isOffered && !vendorProduct.available ? 0.7 : 1
              }}>
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <img 
                    src={product.image_url || 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'} 
                    alt={product.name}
                    style={{ 
                      width: '100%', 
                      height: '120px', 
                      objectFit: 'cover', 
                      borderRadius: '6px'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                  <h3 style={{ color: '#16a34a', margin: '0' }}>{product.name}</h3>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: isOffered ? (vendorProduct.available ? '#dcfce7' : '#fecaca') : '#e5e7eb',
                    color: isOffered ? (vendorProduct.available ? '#16a34a' : '#dc2626') : '#6b7280'
                  }}>
                    {isOffered ? (vendorProduct.available ? 'Available' : 'Unavailable') : 'Not Offered'}
                  </span>
                </div>
                
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                  Category: {product.category}
                </p>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                  Default Price: ₹{product.default_price}
                </p>
                
                {product.variations && (
                  <div style={{ marginBottom: '8px' }}>
                    <p style={{ color: '#374151', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Variations:</p>
                    <div style={{ maxHeight: '60px', overflowY: 'auto' }}>
                      {product.variations.slice(0, 3).map((variation, index) => (
                        <p key={index} style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>
                          • {variation.weight && `${variation.weight}g`}
                          {variation.quantity && `${variation.quantity} pieces`}
                          {variation.size && ` ${variation.size}`}
                          {variation.cut && ` - ${variation.cut}`}
                          {variation.prep && ` (${variation.prep})`}
                          {variation.unit && ` ${variation.unit}`}
                        </p>
                      ))}
                      {product.variations.length > 3 && (
                        <p style={{ color: '#9ca3af', fontSize: '12px' }}>+{product.variations.length - 3} more...</p>
                      )}
                    </div>
                  </div>
                )}
                
                {isOffered ? (
                  <div>
                    {editingProduct === vendorProduct.id ? (
                      <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '12px', backgroundColor: '#f9fafb', marginBottom: '8px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                          <div>
                            <label style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', display: 'block' }}>Price (₹)</label>
                            <input
                              type="number"
                              value={editData.price || ''}
                              onChange={(e) => setEditData({...editData, price: e.target.value})}
                              style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', display: 'block' }}>Delivery Time</label>
                            <select
                              value={editData.deliveryTime || ''}
                              onChange={(e) => setEditData({...editData, deliveryTime: e.target.value})}
                              style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                            >
                              <option value="30 mins">30 mins</option>
                              <option value="1 hour">1 hour</option>
                              <option value="2 hours">2 hours</option>
                              <option value="3 hours">3 hours</option>
                              <option value="Same day">Same day</option>
                            </select>
                          </div>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', display: 'block' }}>Delivery Option</label>
                          <select
                            value={editData.deliveryOption || ''}
                            onChange={(e) => setEditData({...editData, deliveryOption: e.target.value})}
                            style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                          >
                            <option value="free">Free Delivery</option>
                            <option value="charges">Delivery Charges</option>
                            <option value="conditional">Free above minimum</option>
                          </select>
                        </div>
                        {editData.deliveryOption === 'charges' && (
                          <div style={{ marginBottom: '8px' }}>
                            <label style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', display: 'block' }}>Delivery Charges (₹)</label>
                            <input
                              type="number"
                              value={editData.deliveryCharges || ''}
                              onChange={(e) => setEditData({...editData, deliveryCharges: e.target.value})}
                              style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                            />
                          </div>
                        )}
                        {editData.deliveryOption === 'conditional' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            <div>
                              <label style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', display: 'block' }}>Charges (₹)</label>
                              <input
                                type="number"
                                value={editData.deliveryCharges || ''}
                                onChange={(e) => setEditData({...editData, deliveryCharges: e.target.value})}
                                style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', display: 'block' }}>Min Value (₹)</label>
                              <input
                                type="number"
                                value={editData.minValueForFreeDelivery || ''}
                                onChange={(e) => setEditData({...editData, minValueForFreeDelivery: e.target.value})}
                                style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                              />
                            </div>
                          </div>
                        )}
                        <div style={{ marginBottom: '8px' }}>
                          <label style={{ fontSize: '12px', color: '#374151', marginBottom: '4px', display: 'block' }}>Special Offer</label>
                          <input
                            type="text"
                            value={editData.specialOffer || ''}
                            onChange={(e) => setEditData({...editData, specialOffer: e.target.value})}
                            placeholder="e.g., Buy 2 get 1 free"
                            style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <input
                            type="checkbox"
                            checked={editData.available !== false}
                            onChange={(e) => setEditData({...editData, available: e.target.checked})}
                            id={`available-${vendorProduct.id}`}
                          />
                          <label htmlFor={`available-${vendorProduct.id}`} style={{ fontSize: '12px', color: '#374151' }}>Available for sale</label>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={async () => {
                              try {
                                const { doc, updateDoc } = await import('firebase/firestore')
                                const { db } = await import('../../lib/firebase')
                                await updateDoc(doc(db, 'vendorProducts', vendorProduct.id), {
                                  price: parseFloat(editData.price),
                                  available: editData.available,
                                  deliveryTime: editData.deliveryTime,
                                  deliveryOption: editData.deliveryOption,
                                  deliveryCharges: editData.deliveryOption === 'charges' || editData.deliveryOption === 'conditional' ? parseFloat(editData.deliveryCharges) || 0 : 0,
                                  minValueForFreeDelivery: editData.deliveryOption === 'conditional' ? parseFloat(editData.minValueForFreeDelivery) || 0 : 0,
                                  specialOffer: editData.specialOffer || ''
                                })
                                setEditingProduct(null)
                                setEditData({})
                                loadVendorData()
                                alert('Product updated successfully!')
                              } catch (error) {
                                alert('Error updating product: ' + error.message)
                              }
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#16a34a',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingProduct(null)
                              setEditData({})
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                          Your Price: ₹{vendorProduct.price}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                          Delivery: {vendorProduct.deliveryTime}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                          Delivery: {vendorProduct.deliveryOption === 'free' ? 'Free' : 
                                    vendorProduct.deliveryOption === 'charges' ? `₹${vendorProduct.deliveryCharges}` :
                                    `₹${vendorProduct.deliveryCharges} (Free above ₹${vendorProduct.minValueForFreeDelivery})`}
                        </p>
                        {vendorProduct.specialOffer && (
                          <p style={{ color: '#16a34a', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                            Offer: {vendorProduct.specialOffer}
                          </p>
                        )}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setEditingProduct(vendorProduct.id)
                          setEditData({
                            price: vendorProduct.price,
                            available: vendorProduct.available,
                            deliveryTime: vendorProduct.deliveryTime,
                            deliveryOption: vendorProduct.deliveryOption,
                            deliveryCharges: vendorProduct.deliveryCharges || 0,
                            minValueForFreeDelivery: vendorProduct.minValueForFreeDelivery || 0,
                            specialOffer: vendorProduct.specialOffer || ''
                          })
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Remove ${product.name} from your store?`)) {
                            try {
                              const { doc, deleteDoc } = await import('firebase/firestore')
                              const { db } = await import('../../lib/firebase')
                              await deleteDoc(doc(db, 'vendorProducts', vendorProduct.id))
                              loadVendorData()
                              alert('Product removed from your store!')
                            } catch (error) {
                              alert('Error removing product: ' + error.message)
                            }
                          }
                        }}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
                        const { db } = await import('../../lib/firebase')
                        
                        await addDoc(collection(db, 'vendorProducts'), {
                          productId: product.id,
                          vendorId: currentVendor.id,
                          price: product.default_price || 100,
                          available: true,
                          deliveryTime: '2 hours',
                          deliveryOption: 'free',
                          deliveryCharges: 0,
                          minValueForFreeDelivery: 0,
                          specialOffer: '',
                          createdAt: serverTimestamp()
                        })
                        
                        alert(`${product.name} added to your store!`)
                        loadVendorData()
                      } catch (error) {
                        console.error('Error adding product:', error)
                        alert('Error adding product: ' + error.message)
                      }
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Add to My Store
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Orders */}
      <section style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '24px', color: '#374151', marginBottom: '20px' }}>Orders ({orders.length})</h2>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
          {orders.length === 0 ? (
            <p style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No orders yet</p>
          ) : (
            orders.map(order => (
              <div key={order.id} style={{ 
                padding: '15px', 
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: 'bold' }}>Order #{order.id.slice(-6)}</p>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>{order.customerName}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#16a34a', fontWeight: 'bold' }}>KSh {order.total}</p>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>{order.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      </div>
    </>
  )
}
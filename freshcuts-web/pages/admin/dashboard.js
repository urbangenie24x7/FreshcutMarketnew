import { useState, useEffect } from 'react'
import Navigation from '../../components/Navigation'
import SEOHead from '../../components/SEOHead'

export default function Admin() {
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState({ marginPercentage: 15 })
  const [vendors, setVendors] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [vendorProducts, setVendorProducts] = useState([])
  const [expandedSections, setExpandedSections] = useState({
    vendors: false,
    products: false,
    users: false,
    orders: false
  })
  const [editingProduct, setEditingProduct] = useState(null)
  const [editImageUrl, setEditImageUrl] = useState('')
  const [editingVariations, setEditingVariations] = useState(null)
  const [variationsData, setVariationsData] = useState([])
  const [editingPrice, setEditingPrice] = useState(null)
  const [editPriceValue, setEditPriceValue] = useState('')
  const [uploadingImage, setUploadingImage] = useState(null)
  const [editingDetails, setEditingDetails] = useState(null)
  const [editNameValue, setEditNameValue] = useState('')
  const [editCategoryValue, setEditCategoryValue] = useState('')
  const [showVendorForm, setShowVendorForm] = useState(false)
  const [newVendor, setNewVendor] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    categories: []
  })

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      // Load settings
      const settingsSnap = await getDocs(collection(db, 'settings'))
      if (settingsSnap.docs.length > 0) {
        setSettings(settingsSnap.docs[0].data())
      }
      
      // Load vendors
      const vendorsSnap = await getDocs(collection(db, 'vendors'))
      setVendors(vendorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      // Load products
      const productsSnap = await getDocs(collection(db, 'products'))
      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      // Load users
      const usersSnap = await getDocs(collection(db, 'users'))
      setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      // Load orders
      const ordersSnap = await getDocs(collection(db, 'orders'))
      setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      
      // Load vendor products
      const vendorProductsSnap = await getDocs(collection(db, 'vendorProducts'))
      setVendorProducts(vendorProductsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error loading admin data:', error)
    }
  }

  const updateMargin = async () => {
    try {
      const { collection, getDocs, addDoc, updateDoc, doc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const settingsSnap = await getDocs(collection(db, 'settings'))
      if (settingsSnap.docs.length > 0) {
        await updateDoc(doc(db, 'settings', settingsSnap.docs[0].id), settings)
      } else {
        await addDoc(collection(db, 'settings'), settings)
      }
      alert('Margin updated successfully!')
    } catch (error) {
      alert('Error updating margin: ' + error.message)
    }
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getVendorOrderCount = (vendorId) => {
    return orders.filter(order => order.vendorId === vendorId).length
  }

  const getVendorProductCount = (vendorId) => {
    return vendorProducts.filter(vp => vp.vendorId === vendorId).length
  }

  const onboardVendor = async () => {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      // Add vendor
      await addDoc(collection(db, 'vendors'), {
        name: newVendor.name,
        email: newVendor.email,
        phone: newVendor.phone,
        address: newVendor.address,
        products: newVendor.categories,
        location: { lat: -1.2921, lng: 36.8219 },
        createdAt: serverTimestamp()
      })
      
      // Add vendor user account
      await addDoc(collection(db, 'users'), {
        name: newVendor.name,
        email: newVendor.email,
        password: newVendor.password,
        role: 'vendor',
        shopName: newVendor.name,
        createdAt: serverTimestamp()
      })
      
      alert(`Vendor onboarded successfully!\nEmail: ${newVendor.email}\nPassword: ${newVendor.password}`)
      setNewVendor({ name: '', email: '', password: '', phone: '', address: '', categories: [] })
      setShowVendorForm(false)
      loadData()
    } catch (error) {
      alert('Error onboarding vendor: ' + error.message)
    }
  }

  const toggleCategory = (category) => {
    setNewVendor(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const startEditingImage = (product) => {
    setEditingProduct(product.id)
    setEditImageUrl(product.image_url || '')
  }

  const updateProductImage = async (productId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'products', productId), {
        image_url: editImageUrl
      })
      
      setEditingProduct(null)
      setEditImageUrl('')
      loadData()
      alert('Product image updated successfully!')
    } catch (error) {
      alert('Error updating image: ' + error.message)
    }
  }

  const startEditingVariations = (product) => {
    setEditingVariations(product.id)
    setVariationsData(product.variations || [])
  }

  const updateProductVariations = async (productId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'products', productId), {
        variations: variationsData
      })
      
      setEditingVariations(null)
      setVariationsData([])
      loadData()
      alert('Product variations updated successfully!')
    } catch (error) {
      alert('Error updating variations: ' + error.message)
    }
  }

  const addVariation = () => {
    setVariationsData([...variationsData, { weight: '', priceMultiplier: 1 }])
  }

  const updateVariation = (index, field, value) => {
    const updated = [...variationsData]
    updated[index] = { ...updated[index], [field]: value }
    setVariationsData(updated)
  }

  const removeVariation = (index) => {
    const newVariations = variationsData.filter((_, i) => i !== index)
    setVariationsData(newVariations)
    console.log('Removed variation at index:', index, 'New variations:', newVariations)
  }

  const startEditingPrice = (product) => {
    setEditingPrice(product.id)
    setEditPriceValue(product.default_price || '')
  }

  const updateProductPrice = async (productId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'products', productId), {
        default_price: parseFloat(editPriceValue)
      })
      
      setEditingPrice(null)
      setEditPriceValue('')
      loadData()
      alert('Product price updated successfully!')
    } catch (error) {
      alert('Error updating price: ' + error.message)
    }
  }

  const startEditingDetails = (product) => {
    setEditingDetails(product.id)
    setEditNameValue(product.name || '')
    setEditCategoryValue(product.category || '')
  }

  const updateProductDetails = async (productId) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await updateDoc(doc(db, 'products', productId), {
        name: editNameValue,
        category: editCategoryValue
      })
      
      setEditingDetails(null)
      setEditNameValue('')
      setEditCategoryValue('')
      loadData()
      alert('Product details updated successfully!')
    } catch (error) {
      alert('Error updating product details: ' + error.message)
    }
  }

  const deleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      const { doc, deleteDoc } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      await deleteDoc(doc(db, 'products', productId))
      
      loadData()
      alert('Product deleted successfully!')
    } catch (error) {
      alert('Error deleting product: ' + error.message)
    }
  }

  const duplicateProduct = async (product) => {
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      const duplicatedProduct = {
        ...product,
        name: `${product.name} (Copy)`,
        createdAt: serverTimestamp()
      }
      
      // Remove the id field as it will be auto-generated
      delete duplicatedProduct.id
      
      await addDoc(collection(db, 'products'), duplicatedProduct)
      
      loadData()
      alert('Product duplicated successfully!')
    } catch (error) {
      alert('Error duplicating product: ' + error.message)
    }
  }

  const uploadImageToCloudinary = async (file, productId) => {
    try {
      setUploadingImage(productId)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'Freshcuts')
      formData.append('folder', 'freshcuts/products')
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY)
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.secure_url) {
        const { db } = await import('../../lib/firebase')
        
        if (db) {
          const { doc, updateDoc } = await import('firebase/firestore')
          await updateDoc(doc(db, 'products', productId), {
            image_url: data.secure_url
          })
        }
        
        setUploadingImage(null)
        loadData()
        alert(`Image uploaded successfully to Cloudinary!\nURL: ${data.secure_url}`)
      } else {
        throw new Error('Upload failed: ' + (data.error?.message || 'Unknown error'))
      }
    } catch (error) {
      setUploadingImage(null)
      alert('Error uploading image: ' + error.message)
    }
  }

  if (!mounted) {
    return <div style={{ padding: '20px' }}>Loading...</div>
  }

  return (
    <>
      <SEOHead 
        title="Admin Dashboard | FreshCuts"
        description="Manage FreshCuts marketplace. Vendor onboarding, product management, and platform settings."
        url="https://freshcuts.com/admin"
      />
      <Navigation />
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#16a34a', fontSize: '32px', margin: '0' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={async () => {
              const { seedTestData } = await import('../../lib/seedData')
              const result = await seedTestData()
              alert(result ? 'Seed data added successfully!' : 'Seed data failed!')
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Seed Database
          </button>
          <button
            onClick={async () => {
              const { addVendorProducts } = await import('../../lib/addVendorProducts')
              const result = await addVendorProducts()
              alert(result ? 'Vendor products added successfully!' : 'Vendor products failed!')
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Add Vendor Products
          </button>
        </div>
      </div>
      
      {/* Margin Settings */}
      <section style={{ marginBottom: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#374151' }}>Margin Settings</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label style={{ fontSize: '16px', color: '#374151' }}>Platform Margin:</label>
          <input
            type="number"
            value={settings.marginPercentage}
            onChange={(e) => setSettings({ ...settings, marginPercentage: parseFloat(e.target.value) })}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px',
              width: '100px'
            }}
          />
          <span style={{ fontSize: '16px', color: '#374151' }}>%</span>
          <button
            onClick={updateMargin}
            style={{
              padding: '8px 16px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Update
          </button>
        </div>
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
            <strong>Pricing Formula:</strong> Customer Price = Vendor Price + {settings.marginPercentage}% margin
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            <strong>Example:</strong> Vendor Price KSh 500 → Customer Price KSh {Math.round(500 * (1 + settings.marginPercentage / 100))}
          </p>
        </div>
      </section>

      {/* Vendor Onboarding */}
      <section style={{ marginBottom: '20px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Vendor Onboarding</h2>
          <button
            onClick={() => setShowVendorForm(!showVendorForm)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {showVendorForm ? 'Cancel' : 'Add New Vendor'}
          </button>
        </div>
        
        {showVendorForm && (
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', backgroundColor: '#f9fafb' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Vendor Name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
              <input
                type="email"
                placeholder="Email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
              <input
                type="password"
                placeholder="Password"
                value={newVendor.password}
                onChange={(e) => setNewVendor({...newVendor, password: e.target.value})}
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newVendor.phone}
                onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
            <input
              type="text"
              placeholder="Address"
              value={newVendor.address}
              onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
              style={{ width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '15px' }}
            />
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Product Categories:</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['chicken', 'mutton', 'seafood'].map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      backgroundColor: newVendor.categories.includes(category) ? '#16a34a' : 'white',
                      color: newVendor.categories.includes(category) ? 'white' : '#374151',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={onboardVendor}
              disabled={!newVendor.name || !newVendor.email || !newVendor.password}
              style={{
                padding: '12px 24px',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                opacity: (!newVendor.name || !newVendor.email || !newVendor.password) ? 0.5 : 1
              }}
            >
              Onboard Vendor
            </button>
          </div>
        )}
      </section>

      {/* Vendors Management */}
      <section style={{ marginBottom: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div 
          onClick={() => toggleSection('vendors')}
          style={{ 
            padding: '20px', 
            cursor: 'pointer', 
            borderBottom: expandedSections.vendors ? '1px solid #e5e7eb' : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Vendors ({vendors.length})</h2>
          <span style={{ fontSize: '20px', color: '#6b7280' }}>{expandedSections.vendors ? '▼' : '▶'}</span>
        </div>
        {expandedSections.vendors && (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              {vendors.map(vendor => (
                <div key={vendor.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
                  <h3 style={{ color: '#16a34a', marginBottom: '8px' }}>{vendor.name}</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                    Categories: {vendor.products?.join(', ')}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                    Products: {getVendorProductCount(vendor.id)}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                    Total Orders: {getVendorOrderCount(vendor.id)}
                  </p>
                  <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                    ID: {vendor.id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Products */}
      <section style={{ marginBottom: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div 
          onClick={() => toggleSection('products')}
          style={{ 
            padding: '20px', 
            cursor: 'pointer', 
            borderBottom: expandedSections.products ? '1px solid #e5e7eb' : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Products ({products.length})</h2>
          <span style={{ fontSize: '20px', color: '#6b7280' }}>{expandedSections.products ? '▼' : '▶'}</span>
        </div>
        {expandedSections.products && (
          <div style={{ padding: '20px' }}>
            {Object.entries(
              products.reduce((acc, product) => {
                const category = product.category || 'uncategorized'
                if (!acc[category]) acc[category] = []
                acc[category].push(product)
                return acc
              }, {})
            ).map(([category, categoryProducts]) => (
              <div key={category} style={{ marginBottom: '30px' }}>
                <h3 style={{ 
                  color: '#16a34a', 
                  fontSize: '18px', 
                  marginBottom: '15px', 
                  textTransform: 'capitalize',
                  borderBottom: '2px solid #16a34a',
                  paddingBottom: '5px'
                }}>
                  {category} ({categoryProducts.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  {categoryProducts.map(product => (
                <div key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
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
                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            uploadImageToCloudinary(e.target.files[0], product.id)
                          }
                        }}
                        style={{ display: 'none' }}
                        id={`file-${product.id}`}
                      />
                      <label
                        htmlFor={`file-${product.id}`}
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {uploadingImage === product.id ? 'Uploading...' : 'Upload'}
                      </label>
                      <button
                        onClick={() => startEditingImage(product)}
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        URL
                      </button>
                    </div>
                    <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        onClick={() => deleteProduct(product.id, product.name)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}
                        title="Delete product"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => duplicateProduct(product)}
                        style={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}
                        title="Duplicate product"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  
                  {editingProduct === product.id && (
                    <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                      <input
                        type="url"
                        placeholder="Enter image URL"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          marginBottom: '8px'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => updateProductImage(product.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingProduct(null)}
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
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ color: '#374151', margin: '0', fontSize: '16px' }}>{product.name}</h3>
                    <button
                      onClick={() => startEditingDetails(product)}
                      style={{
                        padding: '2px 6px',
                        backgroundColor: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                    Category: {product.category}
                  </p>
                  
                  {editingDetails === product.id && (
                    <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                      <input
                        type="text"
                        placeholder="Product name"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          marginBottom: '8px'
                        }}
                      />
                      <select
                        value={editCategoryValue}
                        onChange={(e) => setEditCategoryValue(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          marginBottom: '8px'
                        }}
                      >
                        <option value="chicken">Chicken</option>
                        <option value="country-chicken">Country Chicken</option>
                        <option value="mutton">Mutton</option>
                        <option value="fish">Fish</option>
                        <option value="prawns">Prawns</option>
                        <option value="crabs">Crabs</option>
                        <option value="eggs">Eggs</option>
                      </select>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => updateProductDetails(product.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingDetails(null)}
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
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                    Unit: {product.unit}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>
                      Default Price: ₹{product.default_price}
                    </p>
                    <button
                      onClick={() => startEditingPrice(product)}
                      style={{
                        padding: '2px 6px',
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  
                  {editingPrice === product.id && (
                    <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Enter default price"
                        value={editPriceValue}
                        onChange={(e) => setEditPriceValue(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          marginBottom: '8px'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => updateProductPrice(product.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingPrice(null)}
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
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <p style={{ color: '#374151', fontSize: '13px', fontWeight: '500', margin: '0' }}>Variations:</p>
                      <button
                        onClick={() => startEditingVariations(product)}
                        style={{
                          padding: '2px 6px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          fontSize: '10px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                    </div>
                    {product.variations && product.variations.length > 0 ? (
                      <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
                        {product.variations.map((variation, index) => (
                          <p key={index} style={{ color: '#6b7280', fontSize: '12px', marginBottom: '2px' }}>
                            • {variation.weight && `${variation.weight}g`}
                            {variation.quantity && `${variation.quantity} pieces`}
                            {variation.size && ` ${variation.size}`}
                            {variation.cut && ` - ${variation.cut}`}
                            {variation.prep && ` (${variation.prep})`}
                            {variation.unit && ` ${variation.unit}`}
                            {` - ₹${Math.round(product.default_price * variation.priceMultiplier)}`}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#9ca3af', fontSize: '12px' }}>No variations defined</p>
                    )}
                  </div>
                  
                  {editingVariations === product.id && (
                    <div style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                      <h4 style={{ color: '#374151', fontSize: '14px', marginBottom: '10px' }}>Edit Variations</h4>
                      {variationsData.map((variation, index) => (
                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder={product.category === 'chicken' || product.category === 'mutton' ? 'Weight (e.g., 500g)' : 
                                       product.category === 'fish' ? 'Cut (e.g., Whole Fish)' :
                                       product.category === 'prawns' ? 'Size (e.g., Large)' :
                                       product.category === 'eggs' ? 'Quantity (e.g., 6 pieces)' : 'Description'}
                            value={variation.weight || variation.quantity || variation.size || variation.cut || ''}
                            onChange={(e) => {
                              const field = product.category === 'chicken' || product.category === 'mutton' ? 'weight' :
                                           product.category === 'fish' ? 'cut' :
                                           product.category === 'prawns' ? 'size' :
                                           product.category === 'eggs' ? 'quantity' : 'weight'
                              updateVariation(index, field, e.target.value)
                            }}
                            style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                          />
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            placeholder="Price multiplier"
                            value={variation.priceMultiplier || ''}
                            onChange={(e) => {
                              const value = e.target.value
                              updateVariation(index, 'priceMultiplier', value === '' ? '' : parseFloat(value))
                            }}
                            style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '12px' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              console.log('Delete clicked for index:', index)
                              removeVariation(index)
                            }}
                            style={{
                              padding: '8px 10px',
                              backgroundColor: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '16px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              minWidth: '30px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Delete this variation"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button
                          onClick={addVariation}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Add Variation
                        </button>
                        <button
                          onClick={() => updateProductVariations(product.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingVariations(null)}
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
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                    <p style={{ color: product.available ? '#10b981' : '#ef4444', fontSize: '12px' }}>
                      {product.available ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Users Management */}
      <section style={{ marginBottom: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div 
          onClick={() => toggleSection('users')}
          style={{ 
            padding: '20px', 
            cursor: 'pointer', 
            borderBottom: expandedSections.users ? '1px solid #e5e7eb' : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Users ({users.length})</h2>
          <span style={{ fontSize: '20px', color: '#6b7280' }}>{expandedSections.users ? '▼' : '▶'}</span>
        </div>
        {expandedSections.users && (
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
              {users.map(user => (
                <div key={user.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
                  <h3 style={{ color: '#374151', marginBottom: '8px' }}>{user.name}</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                    Email: {user.email}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    Role: {user.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Orders Management */}
      <section style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <div 
          onClick={() => toggleSection('orders')}
          style={{ 
            padding: '20px', 
            cursor: 'pointer', 
            borderBottom: expandedSections.orders ? '1px solid #e5e7eb' : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Orders ({orders.length})</h2>
          <span style={{ fontSize: '20px', color: '#6b7280' }}>{expandedSections.orders ? '▼' : '▶'}</span>
        </div>
        {expandedSections.orders && (
          <div style={{ padding: '20px' }}>
            {orders.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No orders found</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
                {orders.map(order => (
                  <div key={order.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
                    <h3 style={{ color: '#374151', marginBottom: '8px' }}>Order #{order.id.slice(-6)}</h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                      Customer: {order.customerName || 'Unknown'}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                      Vendor: {vendors.find(v => v.id === order.vendorId)?.name || 'Unknown'}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                      Amount: KSh {order.total || 0}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>
                      Status: {order.status || 'Pending'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      </div>
    </>
  )
}
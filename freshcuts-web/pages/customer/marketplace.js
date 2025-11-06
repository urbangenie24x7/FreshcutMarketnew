import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function CustomerMarketplace() {
  const [mounted, setMounted] = useState(false)
  const [vendors, setVendors] = useState([])
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [vendorProducts, setVendorProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showVendors, setShowVendors] = useState(false)
  const [marginPercentage, setMarginPercentage] = useState(15)
  const [selectedVariations, setSelectedVariations] = useState({})

  useEffect(() => {
    setMounted(true)
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      // Load margin settings
      const settingsSnap = await getDocs(collection(db, 'settings'))
      if (settingsSnap.docs.length > 0) {
        setMarginPercentage(settingsSnap.docs[0].data().marginPercentage || 15)
      }
      
      const vendorsSnap = await getDocs(collection(db, 'vendors'))
      setVendors(vendorsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const loadVendorProducts = async (vendorId) => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const { db } = await import('../../lib/firebase')
      
      // Get current margin settings
      const settingsSnap = await getDocs(collection(db, 'settings'))
      let currentMargin = 15
      if (settingsSnap.docs.length > 0) {
        currentMargin = settingsSnap.docs[0].data().marginPercentage || 15
      }
      
      // Get vendor products
      const vendorProductsSnap = await getDocs(collection(db, 'vendorProducts'))
      const vendorProducts = vendorProductsSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(vp => vp.vendorId === vendorId && vp.available)
      
      // Get products
      const productsSnap = await getDocs(collection(db, 'products'))
      const products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Combine vendor products with product details and calculate customer price
      const combinedProducts = vendorProducts.map(vp => {
        const product = products.find(p => p.id === vp.productId)
        const customerPrice = Math.round(vp.price * (1 + currentMargin / 100))
        return {
          id: vp.id,
          name: product?.name || 'Unknown Product',
          category: product?.category || 'unknown',
          vendorPrice: vp.price,
          price: customerPrice,
          deliveryTime: vp.deliveryTime,
          deliveryCharges: vp.deliveryCharges || 0,
          freeDelivery: vp.freeDelivery || false,
          minOrder: vp.minOrder,
          unit: product?.unit || 'kg',
          available: vp.available && product?.available,
          imageUrl: product?.image_url || 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop',
          variations: product?.variations || null
        }
      })
      
      setVendorProducts(combinedProducts)
    } catch (error) {
      console.error('Error loading vendor products:', error)
    }
  }

  const selectVendor = (vendor) => {
    setSelectedVendor(vendor)
    loadVendorProducts(vendor.id)
  }

  const categories = ['all', 'chicken', 'country-chicken', 'mutton', 'fish', 'prawns', 'crabs']
  const categoryData = {
    chicken: { emoji: '🐔', name: 'Chicken', description: 'Fresh poultry from local farms' },
    'country-chicken': { emoji: '🐓', name: 'Country Chicken', description: 'Free-range country chicken' },
    mutton: { emoji: '🐐', name: 'Mutton', description: 'Premium mutton cuts' },
    fish: { emoji: '🐟', name: 'Fish', description: 'Fresh fish from local waters' },
    prawns: { emoji: '🦐', name: 'Prawns', description: 'Fresh prawns and shrimp' },
    crabs: { emoji: '🦀', name: 'Crabs', description: 'Live and fresh crabs' }
  }
  
  const getRandomDiscount = () => {
    const hasDiscount = Math.random() > 0.7
    return hasDiscount ? Math.floor(Math.random() * 20) + 5 : 0
  }
  
  const filteredVendors = selectedCategory === 'all'
    ? vendors
    : vendors.filter(vendor => vendor.products?.includes(selectedCategory))

  if (!mounted) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
        <h1 style={{ color: '#16a34a', fontSize: '32px', marginBottom: '20px' }}>FreshCuts</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>FreshCuts - Fresh Meat Marketplace</title>
        <style>{`
          @keyframes scroll-left {
            0% { transform: translate3d(100%, 0, 0); }
            100% { transform: translate3d(-100%, 0, 0); }
          }
          .scrolling-text {
            animation: scroll-left 120s linear infinite;
          }
        `}</style>
      </Head>
      
      {/* Customer Navigation Bar */}
      <nav style={{
        backgroundColor: '#16a34a',
        padding: '10px 20px',
        marginBottom: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Link href="/customer/marketplace" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              fontSize: '20px', 
              fontWeight: 'bold' 
            }}>
              FreshCuts
            </Link>
            
            {/* Breadcrumb in same bar */}
            {(showVendors || selectedVendor) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <span>|</span>
                <span 
                  onClick={() => {
                    setSelectedVendor(null)
                    setShowVendors(false)
                    setSelectedCategory('all')
                  }}
                  style={{ 
                    cursor: 'pointer', 
                    color: (!selectedVendor && !showVendors) ? 'white' : 'rgba(255,255,255,0.8)'
                  }}
                >
                  🏠 Home
                </span>
                <span>→</span>
                <span 
                  onClick={() => {
                    setSelectedVendor(null)
                    setShowVendors(true)
                  }}
                  style={{ 
                    cursor: 'pointer',
                    color: (showVendors && !selectedVendor) ? 'white' : 'rgba(255,255,255,0.8)',
                    textTransform: 'capitalize'
                  }}
                >
                  {selectedCategory === 'all' ? 'All Categories' : selectedCategory} Vendors
                </span>
                {selectedVendor && (
                  <>
                    <span>→</span>
                    <span style={{ color: 'white' }}>
                      {selectedVendor.name}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/customer/cart" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
              🛒
            </Link>
            <Link href="/customer/orders" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
              📦
            </Link>
          </div>
        </div>
      </nav>
      
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '1200px', margin: '0 auto' }}>

      {selectedVendor && (
        <>
          {/* Vendor Details Section */}
          <div style={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb', 
            borderRadius: '12px', 
            padding: '30px', 
            marginBottom: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
              <div>
                <h2 style={{ color: '#16a34a', fontSize: '28px', marginBottom: '15px' }}>{selectedVendor.name}</h2>
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ color: '#374151', fontSize: '16px', marginBottom: '8px' }}>
                    📍 <strong>Location:</strong> {Math.floor(Math.random() * 3) + 1}km away
                  </p>
                  <p style={{ color: '#374151', fontSize: '16px', marginBottom: '8px' }}>
                    ⭐ <strong>Rating:</strong> {(4.2 + Math.random() * 0.7).toFixed(1)}/5.0
                  </p>
                </div>
              </div>
              <div>
                <h3 style={{ color: '#374151', fontSize: '18px', marginBottom: '15px' }}>Specialties</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                  {selectedVendor.products?.map(product => (
                    <span key={product} style={{
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      textTransform: 'capitalize',
                      fontWeight: '500'
                    }}>
                      {product}
                    </span>
                  ))}
                </div>
                <div style={{
                  backgroundColor: '#f0f9ff',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe'
                }}>
                  <p style={{ color: '#1e40af', fontSize: '14px', margin: '0' }}>
                    💡 <strong>Fresh Daily:</strong> All products sourced fresh every morning from local farms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!selectedVendor && !showVendors && (
        <section style={{ marginBottom: '50px', marginTop: '10px' }}>
          {/* Scrolling Advertisement Strip */}
          <div style={{ 
            background: 'linear-gradient(135deg, #fef3c7, #fde68a, #fed7aa)',
            color: '#92400e', 
            padding: '12px 0', 
            marginBottom: '30px',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            position: 'relative',
            width: '100%',
            height: '50px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div className="scrolling-text" style={{
              display: 'inline-block',
              paddingLeft: '100%'
            }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>
                🎉 Fresh Deals Daily! • Free Delivery on Orders Above ₹500 • 🥩 Premium Quality Guaranteed • 🚚 Same Day Delivery Available • 🌟 Rated #1 Local Meat Vendor • 💰 Best Prices in Town • 🔥 Hot Offers Today • 🏆 Award Winning Service • 📱 Order via App & Save More • 🎯 100% Fresh Guarantee • 🕒 Open 6AM to 10PM • 🛡️ Safe & Hygienic • 
              </span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            {Object.entries(categoryData).map(([key, category]) => (
              <div 
                key={key}
                onClick={() => {
                  setSelectedCategory(key)
                  setShowVendors(true)
                }}
                style={{
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.borderColor = '#16a34a'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>{category.emoji}</div>
                <h3 style={{ color: '#374151', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{category.name}</h3>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0' }}>{category.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {!selectedVendor && showVendors && (
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#374151' }}>Local Vendors ({filteredVendors.length})</h2>
          {filteredVendors.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>No vendors found for this category.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredVendors.map(vendor => (
                <div 
                  key={vendor.id} 
                  onClick={() => selectVendor(vendor)}
                  style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px', 
                    padding: '20px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <h3 style={{ color: '#16a34a', marginBottom: '10px' }}>{vendor.name || 'Unnamed Vendor'}</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>
                    {Math.floor(Math.random() * 3) + 1}km away
                  </p>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {vendor.products?.map(product => (
                      <span key={product} style={{
                        backgroundColor: '#f0f9ff',
                        color: '#1e40af',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        textTransform: 'capitalize'
                      }}>
                        {product}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#16a34a', fontSize: '14px', fontWeight: 'bold', margin: '0' }}>View Products →</p>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>{Math.floor(Math.random() * 15) + 5} items</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {selectedVendor && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '24px', color: '#374151', margin: '0' }}>Available Products ({vendorProducts.length})</h2>
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '8px 16px', 
              borderRadius: '20px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              Fresh stock updated daily
            </div>
          </div>
          {vendorProducts.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ color: '#6b7280', fontSize: '18px', marginBottom: '10px' }}>No products available from this vendor</p>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Check back later for new products</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {vendorProducts.map(product => {
                const discount = getRandomDiscount()
                const originalPrice = product.price
                const discountedPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice
                
                return (
                  <div key={product.id} style={{ 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    {discount > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        zIndex: 1
                      }}>
                        -{discount}%
                      </div>
                    )}
                    <img 
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <h3 style={{ color: '#374151', margin: '0', fontSize: '18px', fontWeight: '600' }}>{product.name}</h3>
                        <span style={{
                          backgroundColor: '#dcfce7',
                          color: '#16a34a',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          textTransform: 'capitalize',
                          fontWeight: '500'
                        }}>
                          {product.category}
                        </span>
                      </div>
                      {/* Variations Selector */}
                      {product.variations && (
                        <div style={{ marginBottom: '15px' }}>
                          <label style={{ fontSize: '14px', color: '#374151', marginBottom: '8px', display: 'block', fontWeight: '500' }}>
                            {product.category === 'chicken' || product.category === 'mutton' ? 'Weight:' :
                             product.category === 'fish' ? 'Option:' :
                             product.category === 'prawns' ? 'Size & Weight:' :
                             product.category === 'eggs' ? 'Quantity:' : 'Select:'}
                          </label>
                          <select
                            value={selectedVariations[product.id] || 0}
                            onChange={(e) => setSelectedVariations({
                              ...selectedVariations,
                              [product.id]: parseInt(e.target.value)
                            })}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '14px',
                              backgroundColor: 'white'
                            }}
                          >
                            {product.variations.map((variation, index) => {
                              const variationPrice = Math.round(product.price * variation.priceMultiplier)
                              const variationDiscountedPrice = discount > 0 ? Math.round(variationPrice * (1 - discount / 100)) : variationPrice
                              
                              return (
                                <option key={index} value={index}>
                                  {variation.weight && `${variation.weight}g`}
                                  {variation.quantity && `${variation.quantity} pieces`}
                                  {variation.size && ` ${variation.size}`}
                                  {variation.cut && ` - ${variation.cut}`}
                                  {variation.prep && ` (${variation.prep})`}
                                  {variation.count && ` ${variation.count}`}
                                  {variation.unit && ` ${variation.unit}`}
                                  {` - KSh ${discount > 0 ? variationDiscountedPrice : variationPrice}`}
                                </option>
                              )
                            })}
                          </select>
                        </div>
                      )}
                      
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {(() => {
                            if (product.variations) {
                              const selectedVariation = product.variations[selectedVariations[product.id] || 0]
                              const variationPrice = Math.round(product.price * selectedVariation.priceMultiplier)
                              const variationDiscountedPrice = discount > 0 ? Math.round(variationPrice * (1 - discount / 100)) : variationPrice
                              return (
                                <>
                                  <p style={{ color: '#16a34a', fontSize: '24px', fontWeight: 'bold', margin: '0' }}>KSh {variationDiscountedPrice}</p>
                                  {discount > 0 && (
                                    <p style={{ color: '#9ca3af', fontSize: '16px', textDecoration: 'line-through', margin: '0' }}>KSh {variationPrice}</p>
                                  )}
                                </>
                              )
                            } else {
                              return (
                                <>
                                  <p style={{ color: '#16a34a', fontSize: '24px', fontWeight: 'bold', margin: '0' }}>KSh {discountedPrice}</p>
                                  {discount > 0 && (
                                    <p style={{ color: '#9ca3af', fontSize: '16px', textDecoration: 'line-through', margin: '0' }}>KSh {originalPrice}</p>
                                  )}
                                </>
                              )
                            }
                          })()}
                        </div>
                        <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 0 0' }}>
                          {product.variations ? 
                            (() => {
                              const selectedVariation = product.variations[selectedVariations[product.id] || 0]
                              return `${selectedVariation.weight || selectedVariation.quantity || ''}${selectedVariation.weight ? 'g' : selectedVariation.quantity ? ' pieces' : ''} ${selectedVariation.unit || product.unit || ''}`
                            })() : 
                            product.unit
                          }
                        </p>
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ color: '#10b981', fontSize: '12px' }}>✓</span>
                          <span style={{ color: '#6b7280', fontSize: '13px' }}>Delivery: {product.deliveryTime}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ color: '#10b981', fontSize: '12px' }}>✓</span>
                          <span style={{ color: '#6b7280', fontSize: '13px' }}>
                            {product.deliveryOption === 'free' ? 'Free Delivery' : 
                             product.deliveryOption === 'charges' ? `Delivery: ₹${product.deliveryCharges}` :
                             `Delivery: ₹${product.deliveryCharges} (Free above ₹${product.minValueForFreeDelivery})`}
                          </span>
                        </div>
                      </div>
                      <button style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}
      </div>
    </>
  )
}
import Link from 'next/link'
import { useCart } from '../../lib/CartContext'
import SEOHead from '../../components/SEOHead'

export default function CustomerCart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount, clearCart } = useCart()
  return (
    <>
      <SEOHead 
        title={`Shopping Cart (${getCartCount()} items) | FreshCuts`}
        description={`Review your fresh meat order. ${getCartCount()} items totaling ₹${getCartTotal()}. Secure checkout with free delivery.`}
        url="https://freshcuts.com/cart"
      />
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
          <Link href="/customer/marketplace" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '20px', 
            fontWeight: 'bold' 
          }}>
            FreshCuts
          </Link>
          
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#16a34a', fontSize: '32px', margin: '0' }}>Shopping Cart ({getCartCount()} items)</h1>
          {cartItems.length > 0 && (
            <button 
              onClick={clearCart}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Clear Cart
            </button>
          )}
        </div>
        
        {cartItems.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🛒</div>
            <h2 style={{ color: '#374151', marginBottom: '10px' }}>Your cart is empty</h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>Add some fresh products to get started!</p>
            <Link href="/customer/marketplace" style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#16a34a',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Cart Items */}
            <div style={{ display: 'grid', gap: '15px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto auto',
                  gap: '15px',
                  alignItems: 'center'
                }}>
                  <img 
                    src={item.imageUrl}
                    alt={`${item.name} from ${item.vendorName} - ₹${item.price} in cart`}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <div>
                    <h3 style={{ color: '#374151', margin: '0 0 5px 0', fontSize: '18px' }}>{item.name}</h3>
                    <p style={{ color: '#6b7280', margin: '0 0 5px 0', fontSize: '14px' }}>From {item.vendorName}</p>
                    {item.variation && (
                      <p style={{ color: '#6b7280', margin: '0', fontSize: '12px' }}>
                        {item.variation.weight && `${item.variation.weight}g`}
                        {item.variation.quantity && `${item.variation.quantity} pieces`}
                        {item.variation.size && ` ${item.variation.size}`}
                        {item.variation.cut && ` - ${item.variation.cut}`}
                      </p>
                    )}
                    <p style={{ color: '#16a34a', margin: '5px 0 0 0', fontSize: '16px', fontWeight: 'bold' }}>₹{item.price}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: '30px',
                        height: '30px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '16px', fontWeight: '600', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: '30px',
                        height: '30px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            {/* Cart Summary */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '25px',
              marginTop: '20px'
            }}>
              <h3 style={{ color: '#374151', marginBottom: '15px', fontSize: '20px' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#6b7280' }}>Subtotal ({getCartCount()} items)</span>
                <span style={{ fontWeight: '600' }}>₹{getCartTotal()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#6b7280' }}>Delivery</span>
                <span style={{ color: '#16a34a' }}>Free</span>
              </div>
              <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontSize: '18px', fontWeight: '600' }}>Total</span>
                <span style={{ fontSize: '18px', fontWeight: '600', color: '#16a34a' }}>₹{getCartTotal()}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href="/customer/marketplace" style={{
                  flex: '1',
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: '600'
                }}>
                  Continue Shopping
                </Link>
                <button style={{
                  flex: '1',
                  padding: '12px',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
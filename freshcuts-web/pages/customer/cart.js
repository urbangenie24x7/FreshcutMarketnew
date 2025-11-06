import Link from 'next/link'

export default function CustomerCart() {
  return (
    <>
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
        <h1 style={{ color: '#16a34a', fontSize: '32px', marginBottom: '20px' }}>Shopping Cart</h1>
        
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
      </div>
    </>
  )
}
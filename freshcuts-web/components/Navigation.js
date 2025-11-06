import Link from 'next/link'

export default function Navigation() {
  return (
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
        <Link href="/" style={{ 
          color: 'white', 
          textDecoration: 'none', 
          fontSize: '20px', 
          fontWeight: 'bold' 
        }}>
          FreshCuts
        </Link>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
            🛒
          </Link>
          <Link href="/vendor" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
            🏪
          </Link>
          <Link href="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '20px' }}>
            ⚙️
          </Link>
        </div>
      </div>
    </nav>
  )
}
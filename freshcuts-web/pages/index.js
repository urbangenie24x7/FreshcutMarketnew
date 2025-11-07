import { useRouter } from 'next/router'
import SEOHead from '../components/SEOHead'

export default function Home() {
  const router = useRouter()

  const runSeedData = async () => {
    const { seedTestData } = await import('../lib/seedData')
    const result = await seedTestData()
    alert(result ? 'Seed data added successfully!' : 'Seed data failed!')
  }

  const addVendorProducts = async () => {
    const { addVendorProducts } = await import('../lib/addVendorProducts')
    const result = await addVendorProducts()
    alert(result ? 'Vendor products added successfully!' : 'Vendor products failed!')
  }

  return (
    <>
      <SEOHead 
        title="FreshCuts - Fresh Meat Marketplace | Local Vendors"
        description="Connect with local meat vendors. Fresh chicken, mutton, fish, prawns and more delivered to your door. Support local businesses with FreshCuts."
        url="https://freshcuts.com"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "FreshCuts",
          "description": "Fresh meat marketplace platform",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web, iOS, Android"
        }}
      />
      <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1 style={{ color: '#16a34a', fontSize: '32px', marginBottom: '20px' }}>FreshCuts</h1>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={runSeedData} style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '5px' }}>
          Run Seed Data
        </button>
        <button onClick={addVendorProducts} style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px' }}>
          Add Vendor Products
        </button>
      </div>
      <button 
        onClick={() => router.push('/customer/marketplace')} 
        style={{ padding: '12px 24px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', marginTop: '10px' }}
      >
        Go to Marketplace
      </button>
      </div>
    </>
  )
}
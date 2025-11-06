import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to customer marketplace
    router.push('/customer/marketplace')
  }, [])

  const runSeedData = async () => {
    const { seedTestData } = await import('../lib/seedData')
    const result = await seedTestData()
    alert(result ? 'Seed data added successfully!' : 'Seed data failed!')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', textAlign: 'center' }}>
      <h1 style={{ color: '#16a34a', fontSize: '32px', marginBottom: '20px' }}>FreshCuts</h1>
      <button onClick={runSeedData} style={{ padding: '10px 20px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '20px' }}>
        Run Seed Data
      </button>
      <p style={{ fontSize: '18px', color: '#666' }}>Redirecting to marketplace...</p>
    </div>
  )
}
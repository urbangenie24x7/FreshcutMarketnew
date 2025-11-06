export async function testFirebaseConnection() {
  try {
    const { db } = await import('./firebase')
    const { collection, getDocs } = await import('firebase/firestore')
    await getDocs(collection(db, 'test'))
    return true
  } catch (error) {
    console.error('Firebase test failed:', error.message)
    return false
  }
}
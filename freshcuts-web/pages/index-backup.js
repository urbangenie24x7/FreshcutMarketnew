import { useState, useEffect } from 'react'
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

export default function Home() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('phone')
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadVendors()
  }, [])

  const loadVendors = async () => {
    try {
      setLoading(true)
      const vendorsRef = collection(db, 'vendors')
      const snapshot = await getDocs(vendorsRef)
      setVendors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Failed to load vendors:', error)
      setError('Failed to load vendors. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        size: 'invisible'
      }, auth)
      const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier)
      window.confirmationResult = confirmation
      setStep('otp')
    } catch (error) {
      console.error('OTP send failed:', error)
      setError('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }
    
    try {
      setLoading(true)
      setError('')
      await window.confirmationResult.confirm(otp)
      setStep('home')
    } catch (error) {
      console.error('OTP verification failed:', error)
      setError('Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'phone') {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">FreshCuts</h1>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <input
            type="tel"
            placeholder="Enter 10-digit phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            className="w-full p-3 border rounded-lg mb-4"
            maxLength="10"
          />
          <div id="recaptcha-container"></div>
          <button
            onClick={sendOTP}
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
          <p className="text-gray-600 mb-4">OTP sent to +91{phone}</p>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full p-3 border rounded-lg mb-4"
            maxLength="6"
          />
          <button
            onClick={verifyOTP}
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            onClick={() => setStep('phone')}
            className="w-full bg-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-400"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4">
        <h1 className="text-xl font-bold">FreshCuts</h1>
      </header>
      
      <main className="p-4">
        <h2 className="text-lg font-semibold mb-4">Nearby Vendors</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button 
              onClick={loadVendors}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-2 text-gray-600">Loading vendors...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {vendors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No vendors found in your area
              </div>
            ) : (
              vendors.map(vendor => (
                <div key={vendor.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                  <h3 className="font-semibold">{vendor.shopName}</h3>
                  <p className="text-gray-600">{vendor.address}</p>
                  <p className="text-green-600 font-medium">₹{vendor.deliveryFee} delivery</p>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
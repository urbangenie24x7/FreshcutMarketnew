import { storage } from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const uploadProductImage = async (file, productName) => {
  try {
    const fileName = `${productName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${file.name.split('.').pop()}`
    const imageRef = ref(storage, `products/${fileName}`)
    const snapshot = await uploadBytes(imageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading product image:', error)
    throw error
  }
}
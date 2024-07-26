import axios from 'axios'
import Config from '../config/config'
import ApiEndpoint from '../config/api-endpoint'
import { auth, db, storage } from '../utils/firebase'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const Transactions = {
  async getAll() {
    const userId = auth.currentUser.uid
    console.log(userId)
    const transactionsRef = collection(db, `users/${userId}/transactions`)
    const querySnapshot = await getDocs(transactionsRef)
    const transactions = []
    querySnapshot.forEach((item) => {
      const data = item.data()

      if (data.date && data.date.seconds !== undefined && data.date.nanoseconds !== undefined) {
        const dateObj = new Date(data.date.seconds * 1000 + data.date.nanoseconds / 1000000)
        data.date = dateObj.toDateString()
      }

      transactions.push({
        id: item.id,
        ...data,
      })
    })
    console.log(transactions)
    return transactions
  },

  async getById(id) {
    const userId = auth.currentUser.uid
    const transactionsRef = doc(db, `users/${userId}/transactions`, id)
    const docSnapshot = await getDoc(transactionsRef)
    return docSnapshot.data()
  },

  async store({ name, date, amount, type, description, evidence, createdAt, updatedAt }) {
    const userId = auth.currentUser.uid
    const transactionsRef = collection(db, `users/${userId}/transactions`)
    const data = { name, date, amount, type, description, evidence, createdAt, updatedAt }
    return await addDoc(transactionsRef, {
      ...data,
    })
  },

  async update({ id, name, date, amount, type, description, evidence, updatedAt }) {
    const userId = auth.currentUser.uid
    const transactionsRef = doc(db, `users/${userId}/transactions`, id)
    const data = { name, date, amount, type, description, evidence, updatedAt }

    if (!data.evidence) delete data.evidence

    return await updateDoc(transactionsRef, data)
  },

  async destroy(id) {
    const transactionRef = doc(db, 'transactions', id)
    return await deleteDoc(transactionRef)
  },

  async storeEvidence(file) {
    const storageRef = ref(storage, `transactions/${auth.currentUser.uid}/${file.name}`)
    return await uploadBytes(storageRef, file)
  },

  async getEvidenceURL(fileFullPath) {
    const storageRef = ref(storage, fileFullPath)
    return await getDownloadURL(storageRef)
  },

  async destroyEvidence(fileFullPath) {
    const desertRef = ref(storage, fileFullPath)
    return await deleteObject(desertRef)
  },
}

export default Transactions

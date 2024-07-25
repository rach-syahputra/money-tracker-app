import axios from 'axios'
import Config from '../config/config'
import ApiEndpoint from '../config/api-endpoint'
import { auth, db } from '../utils/firebase'
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
    const transactionRef = doc(db, 'transactions', id)
    const docSnapshot = await getDoc(transactionRef)
    return docSnapshot.data()
  },

  async store({ name, date, amount, type, description, evidence }) {
    const userId = auth.currentUser.uid
    const transactionsRef = collection(db, `users/${userId}/transactions`)
    const data = { name, date, amount, type, description, evidence }
    return await addDoc(transactionsRef, {
      ...data,
    })
  },

  async update({ id, name, date, amount, type, description, evidence }) {
    const transactionRef = doc(db, 'transactions', id)
    const data = { name, date, amount, type, description, evidence }

    if (!data.evidence) delete data.evidence

    return await updateDoc(transactionRef, data)
  },

  async destroy(id) {
    const transactionRef = doc(db, 'transactions', id)
    return await deleteDoc(transactionRef)
  },
}

export default Transactions

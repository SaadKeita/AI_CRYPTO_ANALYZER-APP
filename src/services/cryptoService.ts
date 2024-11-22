import { collection, addDoc, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { CryptoData } from '../types/crypto';

export const saveCryptoData = async (data: CryptoData[]) => {
  try {
    const batch = data.map(async (crypto) => {
      const docRef = await addDoc(collection(db, 'cryptoData'), {
        ...crypto,
        timestamp: new Date(),
      });
      return docRef;
    });
    
    await Promise.all(batch);
    return true;
  } catch (error) {
    console.error('Error saving crypto data:', error);
    return false;
  }
};

export const getLatestCryptoData = async () => {
  try {
    const q = query(
      collection(db, 'cryptoData'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    return [];
  }
};

export const getCryptoHistory = async (cryptoId: string) => {
  try {
    const q = query(
      collection(db, 'cryptoData'),
      where('id', '==', cryptoId),
      orderBy('timestamp', 'desc'),
      limit(30)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching crypto history:', error);
    return [];
  }
};
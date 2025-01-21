import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase' // Update with your Firebase config path

import { fetchCollectionData } from './commonFunctions'

export async function getUserProfile(email: string) {
  try {
    const profile = await fetchCollectionData('profile', {
      fieldPath: 'email',
      operator: '==',
      value: email,
    })
    return profile.length > 0 ? profile[0] : null
  } catch (err) {
    console.error('[FIREBASE]: ', err)
    throw new Error('Error fetching user profile.')
  }
}

export async function initializeUserProfile(email: string) {
  try {
    const existingProfile = await getUserProfile(email)

    if (!existingProfile) {
      const newProfile = {
        email,
        classicQuizCompleted: 0,
      }

      await addDoc(collection(db, 'profile'), newProfile)
      console.log('User profile initialized:', newProfile)
    } else {
      console.log('User profile already exists.')
    }
  } catch (err) {
    console.error('[FIREBASE]: Error initializing user profile:', err)
    throw new Error('Unable to initialize user profile.')
  }
}

export async function incrementClassicQuizCompleted(email: string) {
  try {
    const profileQuery = query(
      collection(db, 'profile'),
      where('email', '==', email),
    )
    const querySnapshot = await getDocs(profileQuery)

    if (querySnapshot.empty) {
      console.error('Profile not found for email:', email)
      throw new Error('Profile not found')
    }

    const docRef = querySnapshot.docs[0].ref

    await updateDoc(docRef, {
      classicQuizCompleted:
        (querySnapshot.docs[0].data().classicQuizCompleted || 0) + 1,
    })

    console.log(`Classic quiz completion incremented for ${email}`)
  } catch (error) {
    console.error(
      '[FIREBASE]: Error incrementing classic quiz completion:',
      error,
    )
    throw new Error('Unable to increment classic quiz completion')
  }
}

export async function incrementGuessTheLocationCompleted(email: string) {
  try {
    const profileQuery = query(
      collection(db, 'profile'),
      where('email', '==', email),
    )
    const querySnapshot = await getDocs(profileQuery)

    if (querySnapshot.empty) {
      console.error('Profile not found for email:', email)
      throw new Error('Profile not found')
    }

    const docRef = querySnapshot.docs[0].ref

    await updateDoc(docRef, {
      guessTheLocationCompleted:
        (querySnapshot.docs[0].data().guessTheLocationCompleted || 0) + 1,
    })

    console.log(`Guess the location completion incremented for ${email}`)
  } catch (error) {
    console.error(
      '[FIREBASE]: Error incrementing guess the location completion:',
      error,
    )
    throw new Error('Unable to increment guess the location completion')
  }
}

export async function incrementTimeSpent(email: string, timeInMinutes: number) {
  try {
    console.log(timeInMinutes)
    const profileQuery = query(
      collection(db, 'profile'),
      where('email', '==', email),
    )
    const querySnapshot = await getDocs(profileQuery)

    if (querySnapshot.empty) {
      console.error('Profile not found for email:', email)
      throw new Error('Profile not found')
    }

    const docRef = querySnapshot.docs[0].ref

    await updateDoc(docRef, {
      timeSpent: (querySnapshot.docs[0].data().timeSpent || 0) + timeInMinutes,
    })

    console.log(
      `Time spent incremented by ${timeInMinutes} minutes for ${email}`,
    )
  } catch (error) {
    console.error('[FIREBASE]: Error incrementing time spent:', error)
    throw new Error('Unable to increment time spent')
  }
}

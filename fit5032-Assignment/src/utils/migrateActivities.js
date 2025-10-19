// Migration script to add missing fields to existing activities
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

/**
 * Add missing ratings fields to all existing activities
 */
export const migrateActivitiesToIncludeRatings = async () => {
  try {
    const activitiesRef = collection(db, 'activities')
    const snapshot = await getDocs(activitiesRef)

    let updatedCount = 0
    let skippedCount = 0

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data()

      if (!('ratings' in data) || !('averageRating' in data)) {
        const activityRef = doc(db, 'activities', docSnapshot.id)

        await updateDoc(activityRef, {
          ratings: data.ratings || [],
          averageRating: data.averageRating || 0
        })

        updatedCount++
      } else {
        skippedCount++
      }
    }

    return { updatedCount, skippedCount, total: snapshot.docs.length }
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

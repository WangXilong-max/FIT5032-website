// Firebase Firestore Database Operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore'
import { db } from './config'

// ==================== ACTIVITIES COLLECTION ====================

/**
 * Get all activities
 * @returns {Promise<Array>} Array of all activities
 */
export const getAllActivities = async () => {
  try {
    const activitiesRef = collection(db, 'activities')
    const q = query(activitiesRef, orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)

    const activities = []
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data()
      })
    })

    console.log('Fetched activities from Firestore:', activities.length)
    return activities
  } catch (error) {
    console.error('Error fetching activities:', error)
    return []
  }
}

/**
 * Get a single activity by ID
 * @param {string} activityId - Activity ID
 * @returns {Promise<Object|null>} Activity data or null
 */
export const getActivityById = async (activityId) => {
  try {
    const activityRef = doc(db, 'activities', activityId)
    const activitySnap = await getDoc(activityRef)

    if (activitySnap.exists()) {
      return {
        id: activitySnap.id,
        ...activitySnap.data()
      }
    } else {
      console.log('No such activity!')
      return null
    }
  } catch (error) {
    console.error('Error fetching activity:', error)
    return null
  }
}

/**
 * Create a new activity
 * @param {Object} activityData - Activity data
 * @returns {Promise<Object>} Created activity with ID
 */
export const createActivity = async (activityData) => {
  try {
    const activitiesRef = collection(db, 'activities')
    const docRef = await addDoc(activitiesRef, {
      ...activityData,
      participants: [],
      participantCount: 0,
      ratings: [],
      averageRating: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    console.log('Activity created with ID:', docRef.id)
    return {
      id: docRef.id,
      ...activityData
    }
  } catch (error) {
    console.error('Error creating activity:', error)
    throw error
  }
}

/**
 * Update an activity
 * @param {string} activityId - Activity ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<boolean>} Success status
 */
export const updateActivity = async (activityId, updates) => {
  try {
    const activityRef = doc(db, 'activities', activityId)
    await updateDoc(activityRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })

    console.log('Activity updated:', activityId)
    return true
  } catch (error) {
    console.error('Error updating activity:', error)
    return false
  }
}

/**
 * Delete an activity
 * @param {string} activityId - Activity ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteActivity = async (activityId) => {
  try {
    const activityRef = doc(db, 'activities', activityId)
    await deleteDoc(activityRef)

    console.log('Activity deleted:', activityId)
    return true
  } catch (error) {
    console.error('Error deleting activity:', error)
    return false
  }
}

/**
 * Get activities created by a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of user's activities
 */
export const getActivitiesByCreator = async (userId) => {
  try {
    const activitiesRef = collection(db, 'activities')
    const q = query(activitiesRef, where('creatorId', '==', userId))
    const querySnapshot = await getDocs(q)

    const activities = []
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return activities
  } catch (error) {
    console.error('Error fetching user activities:', error)
    return []
  }
}

// ==================== PARTICIPANTS OPERATIONS ====================

/**
 * Join an activity
 * @param {string} activityId - Activity ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const joinActivity = async (activityId, userId) => {
  try {
    const activityRef = doc(db, 'activities', activityId)
    await updateDoc(activityRef, {
      participants: arrayUnion(userId),
      participantCount: increment(1),
      updatedAt: serverTimestamp()
    })

    console.log('User joined activity:', { activityId, userId })
    return true
  } catch (error) {
    console.error('Error joining activity:', error)
    return false
  }
}

/**
 * Leave an activity
 * @param {string} activityId - Activity ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const leaveActivity = async (activityId, userId) => {
  try {
    const activityRef = doc(db, 'activities', activityId)
    await updateDoc(activityRef, {
      participants: arrayRemove(userId),
      participantCount: increment(-1),
      updatedAt: serverTimestamp()
    })

    console.log('User left activity:', { activityId, userId })
    return true
  } catch (error) {
    console.error('Error leaving activity:', error)
    return false
  }
}

/**
 * Get activities joined by a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of joined activities
 */
export const getJoinedActivities = async (userId) => {
  try {
    const activitiesRef = collection(db, 'activities')
    const q = query(activitiesRef, where('participants', 'array-contains', userId))
    const querySnapshot = await getDocs(q)

    const activities = []
    querySnapshot.forEach((doc) => {
      activities.push({
        id: doc.id,
        ...doc.data()
      })
    })

    return activities
  } catch (error) {
    console.error('Error fetching joined activities:', error)
    return []
  }
}

/**
 * Get participants details for an activity
 * @param {string} activityId - Activity ID
 * @returns {Promise<Array>} Array of participant details
 */
export const getActivityParticipants = async (activityId) => {
  try {
    const activityRef = doc(db, 'activities', activityId)
    const activitySnap = await getDoc(activityRef)

    if (!activitySnap.exists()) {
      console.error('Activity not found:', activityId)
      return []
    }

    const activityData = activitySnap.data()
    const participantIds = activityData.participants || []

    if (participantIds.length === 0) {
      return []
    }

    // Fetch user details for each participant
    const participants = []
    for (const userId of participantIds) {
      const userProfile = await getUserProfile(userId)
      if (userProfile) {
        participants.push({
          userId,
          email: userProfile.email || 'N/A',
          displayName: userProfile.displayName || userProfile.email || 'Anonymous',
          joinedAt: userProfile.joinedAt || new Date().toISOString()
        })
      } else {
        // If user profile doesn't exist, add basic info
        participants.push({
          userId,
          email: 'N/A',
          displayName: 'User ' + userId.substring(0, 6),
          joinedAt: new Date().toISOString()
        })
      }
    }

    console.log('Fetched participants for activity:', activityId, participants.length)
    return participants
  } catch (error) {
    console.error('Error fetching activity participants:', error)
    return []
  }
}

// ==================== RATINGS OPERATIONS ====================

/**
 * Add a rating to an activity
 * @param {string} activityId - Activity ID
 * @param {number} rating - Rating value (1-5)
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} Success status
 */
export const addRating = async (activityId, rating, userId) => {
  try {
    console.log('addRating called with:', { activityId, rating, userId, ratingType: typeof rating })

    const activityRef = doc(db, 'activities', activityId)
    const activitySnap = await getDoc(activityRef)

    if (!activitySnap.exists()) {
      console.error('Activity not found:', activityId)
      return false
    }

    const activityData = activitySnap.data()
    console.log('Current activity data:', activityData)

    let ratings = activityData.ratings || []
    console.log('Current ratings array:', ratings)

    // Check if user has already rated this activity
    const existingRatingIndex = ratings.findIndex(r => r.userId === userId)

    if (existingRatingIndex !== -1) {
      // Update existing rating
      console.log('User has already rated, updating existing rating')
      ratings[existingRatingIndex] = {
        rating: parseInt(rating),
        userId,
        timestamp: Date.now()
      }
      console.log('Updated rating:', ratings[existingRatingIndex])
    } else {
      // Add new rating
      const newRating = {
        rating: parseInt(rating),
        userId,
        timestamp: Date.now()
      }
      ratings.push(newRating)
      console.log('New rating to add:', newRating)
    }

    // Calculate new average
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    console.log('Calculated average:', averageRating)

    await updateDoc(activityRef, {
      ratings,
      averageRating,
      updatedAt: serverTimestamp()
    })

    console.log('✅ Rating successfully saved to Firestore:', { activityId, rating, averageRating, totalRatings: ratings.length })
    return true
  } catch (error) {
    console.error('❌ Error adding rating:', error)
    return false
  }
}// ==================== USERS COLLECTION ====================

/**
 * Create or update user profile
 * @param {string} userId - User ID
 * @param {Object} userData - User data
 * @returns {Promise<boolean>} Success status
 */
export const saveUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    }).catch(async () => {
      // If user doesn't exist, create new document
      await addDoc(collection(db, 'users'), {
        id: userId,
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    })

    console.log('User profile saved:', userId)
    return true
  } catch (error) {
    console.error('Error saving user profile:', error)
    return false
  }
}

/**
 * Get user profile
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User data or null
 */
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

// ==================== DASHBOARD STATISTICS ====================

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const activities = await getAllActivities()

    const stats = {
      totalActivities: activities.length,
      upcomingActivities: activities.filter(a => a.status === 'upcoming').length,
      ongoingActivities: activities.filter(a => a.status === 'ongoing').length,
      totalParticipants: activities.reduce((sum, a) => sum + (a.participantCount || 0), 0),
      averageRating: activities.reduce((sum, a) => sum + (a.averageRating || 0), 0) / activities.length || 0,
      categoryCounts: {},
      recentActivities: activities.slice(0, 5)
    }

    // Count activities by category
    activities.forEach(activity => {
      const category = activity.category || 'Other'
      stats.categoryCounts[category] = (stats.categoryCounts[category] || 0) + 1
    })

    return stats
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return null
  }
}

export default {
  // Activities
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitiesByCreator,

  // Participants
  joinActivity,
  leaveActivity,
  getJoinedActivities,
  getActivityParticipants,

  // Ratings
  addRating,

  // Users
  saveUserProfile,
  getUserProfile,

  // Dashboard
  getDashboardStats
}

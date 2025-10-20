// Firebase Firestore Database Operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore'
import { db } from './config'

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
        ...doc.data(),
      })
    })

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
        ...activitySnap.data(),
      }
    } else {
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
    const creatorId = activityData.creatorId

    // Ensure creator's profile exists in Firestore
    try {
      const existingProfile = await getUserProfile(creatorId)
      if (!existingProfile) {
        // Get current user from Firebase Auth
        const { auth } = await import('./config')
        const currentUser = auth.currentUser
        if (currentUser && currentUser.uid === creatorId) {
          // Save creator's profile to Firestore
          await saveUserProfile(creatorId, {
            email: currentUser.email || activityData.creatorEmail,
            displayName: currentUser.displayName || activityData.creatorName || currentUser.email,
          })
        }
      }
    } catch (profileError) {
      console.error('Error ensuring creator profile:', profileError)
      // Continue creating activity even if profile creation fails
    }

    const docRef = await addDoc(activitiesRef, {
      ...activityData,
      participants: [creatorId],
      participantCount: 1,
      ratings: [],
      averageRating: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return {
      id: docRef.id,
      ...activityData,
      participants: [creatorId],
      participantCount: 1,
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
      updatedAt: serverTimestamp(),
    })

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
        ...doc.data(),
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
    // Ensure user's profile exists in Firestore
    try {
      const existingProfile = await getUserProfile(userId)
      if (!existingProfile) {
        // Get current user from Firebase Auth
        const { auth } = await import('./config')
        const currentUser = auth.currentUser
        if (currentUser && currentUser.uid === userId) {
          // Save user's profile to Firestore
          await saveUserProfile(userId, {
            email: currentUser.email,
            displayName: currentUser.displayName || currentUser.email,
          })
        }
      }
    } catch (profileError) {
      console.error('Error ensuring user profile:', profileError)
      // Continue joining activity even if profile creation fails
    }

    const activityRef = doc(db, 'activities', activityId)
    await updateDoc(activityRef, {
      participants: arrayUnion(userId),
      participantCount: increment(1),
      updatedAt: serverTimestamp(),
    })

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
      updatedAt: serverTimestamp(),
    })

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
        ...doc.data(),
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

    // Import Firebase Auth to get user data
    const { auth } = await import('./config')
    const { getAuth } = await import('firebase/auth')

    // Fetch user details for each participant
    const participants = []
    for (const userId of participantIds) {
      try {
        // Try to get from Firestore first
        const userProfile = await getUserProfile(userId)
        if (userProfile && userProfile.email) {
          participants.push({
            userId,
            email: userProfile.email,
            displayName: userProfile.displayName || userProfile.email,
            joinedAt: userProfile.joinedAt || new Date().toISOString(),
          })
        } else {
          // Fallback: Try to get current user's email from Firebase Auth if it's the logged in user
          const currentUser = auth.currentUser
          if (currentUser && currentUser.uid === userId) {
            participants.push({
              userId,
              email: currentUser.email || 'Anonymous User',
              displayName: currentUser.displayName || currentUser.email || 'Anonymous',
              joinedAt: new Date().toISOString(),
            })
          } else {
            // Last resort: show user ID prefix
            participants.push({
              userId,
              email: `User ${userId.substring(0, 8)}`,
              displayName: `User ${userId.substring(0, 8)}`,
              joinedAt: new Date().toISOString(),
            })
          }
        }
      } catch (err) {
        console.error('Error fetching participant:', userId, err)
        participants.push({
          userId,
          email: `User ${userId.substring(0, 8)}`,
          displayName: `User ${userId.substring(0, 8)}`,
          joinedAt: new Date().toISOString(),
        })
      }
    }

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
    const activityRef = doc(db, 'activities', activityId)
    const activitySnap = await getDoc(activityRef)

    if (!activitySnap.exists()) {
      console.error('Activity not found:', activityId)
      return false
    }

    const activityData = activitySnap.data()

    let ratings = activityData.ratings || []

    // Check if user has already rated this activity
    const existingRatingIndex = ratings.findIndex((r) => r.userId === userId)

    if (existingRatingIndex !== -1) {
      // Update existing rating
      ratings[existingRatingIndex] = {
        rating: parseInt(rating),
        userId,
        timestamp: Date.now(),
      }
    } else {
      // Add new rating
      const newRating = {
        rating: parseInt(rating),
        userId,
        timestamp: Date.now(),
      }
      ratings.push(newRating)
    }

    // Calculate new average
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length

    await updateDoc(activityRef, {
      ratings,
      averageRating,
      updatedAt: serverTimestamp(),
    })

    return true
  } catch (error) {
    console.error('❌ Error adding rating:', error)
    return false
  }
}

// ==================== USERS COLLECTION ====================

/**
 * Create or update user profile
 * @param {string} userId - User ID
 * @param {Object} userData - User data
 * @returns {Promise<boolean>} Success status
 */
export const saveUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId)
    
    // Try to update first, if doesn't exist, create with setDoc
    try {
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      // If document doesn't exist, create it with setDoc (using userId as document ID)
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    }

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
        ...userSnap.data(),
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
export const getDashboardStats = async () => {
  try {
    const activities = await getAllActivities()

    const stats = {
      totalActivities: activities.length,
      upcomingActivities: activities.filter((a) => a.status === 'upcoming').length,
      ongoingActivities: activities.filter((a) => a.status === 'ongoing').length,
      totalParticipants: activities.reduce((sum, a) => sum + (a.participantCount || 0), 0),
      averageRating:
        activities.reduce((sum, a) => sum + (a.averageRating || 0), 0) / activities.length || 0,
      categoryCounts: {},
      recentActivities: activities.slice(0, 5),
    }

    // Count activities by category
    activities.forEach((activity) => {
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
  getDashboardStats,
}

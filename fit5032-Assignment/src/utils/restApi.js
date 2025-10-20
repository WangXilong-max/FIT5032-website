// REST API Utility Functions
// Reusable functions to call your Cloud Functions REST API

const API_BASE_URL = 'https://us-central1-fit5032-a3-xilongwang.cloudfunctions.net'

/**
 * Fetch all activities from REST API
 * @returns {Promise<Object>} { success: boolean, data: Array, count: number }
 */
export const fetchAllActivitiesFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/getActivities`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching activities from API:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Fetch a specific activity by ID from REST API
 * @param {string} activityId - The activity ID
 * @returns {Promise<Object>} { success: boolean, data: Object }
 */
export const fetchActivityByIdFromAPI = async (activityId) => {
  try {
    if (!activityId) {
      return {
        success: false,
        error: 'Activity ID is required',
      }
    }

    const response = await fetch(`${API_BASE_URL}/getActivityById?id=${encodeURIComponent(activityId)}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching activity from API:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Example usage in a Vue component:
 * 
 * import { fetchAllActivitiesFromAPI, fetchActivityByIdFromAPI } from '@/utils/restApi'
 * 
 * // Get all activities
 * const result = await fetchAllActivitiesFromAPI()
 * if (result.success) {
 *   console.log('Activities:', result.data)
 *   console.log('Total:', result.count)
 * }
 * 
 * // Get specific activity
 * const activity = await fetchActivityByIdFromAPI('some-activity-id')
 * if (activity.success) {
 *   console.log('Activity:', activity.data)
 * }
 */

export default {
  fetchAllActivitiesFromAPI,
  fetchActivityByIdFromAPI,
  API_BASE_URL,
}


// ==================== Firebase Cloud Functions 调用示例 ====================
// 将这些函数添加到 src/firebase/database.js 中

import { getFunctions, httpsCallable } from 'firebase/functions'

// 初始化 Functions
const functions = getFunctions()

/**
 * 调用评分 Cloud Function
 * 优点：后端验证，更安全
 */
export const rateActivityCloud = async (activityId, rating) => {
  try {
    const rateActivity = httpsCallable(functions, 'rateActivity')
    const result = await rateActivity({ activityId, rating })
    return result.data
    // 返回: { success: true, averageRating: 4.5, totalRatings: 10 }
  } catch (error) {
    console.error('Cloud Function error:', error.code, error.message)
    throw error
  }
}

/**
 * 调用删除活动 Cloud Function
 * 优点：验证创建者权限，防止恶意删除
 */
export const deleteActivityCloud = async (activityId) => {
  try {
    const deleteActivity = httpsCallable(functions, 'deleteActivity')
    const result = await deleteActivity({ activityId })
    return result.data
    // 返回: { success: true }
  } catch (error) {
    console.error('Cloud Function error:', error.code, error.message)
    throw error
  }
}

// ==================== 组件中使用示例 ====================

/*
// 在 EventCard.vue 中使用评分功能：

import { rateActivityCloud } from '@/firebase/database'

const rateEvent = async (activityId, rating) => {
  try {
    isLoading.value = true
    const result = await rateActivityCloud(activityId, rating)

    console.log('Rating success:', result)
    // result: { success: true, averageRating: 4.5, totalRatings: 10 }

    // 更新本地数据
    activity.value.averageRating = result.averageRating

    alert('Rating submitted successfully!')
  } catch (error) {
    if (error.code === 'unauthenticated') {
      alert('Please login to rate activities')
    } else if (error.code === 'invalid-argument') {
      alert('Invalid rating value')
    } else {
      alert('Failed to submit rating: ' + error.message)
    }
  } finally {
    isLoading.value = false
  }
}
*/

/*
// 在 ActivitiesView.vue 中使用删除功能：

import { deleteActivityCloud } from '@/firebase/database'

const deleteActivity = async (activityId) => {
  if (!confirm('Are you sure you want to delete this activity?')) {
    return
  }

  try {
    isLoading.value = true
    await deleteActivityCloud(activityId)

    // 从列表中移除
    activities.value = activities.value.filter(a => a.id !== activityId)

    alert('Activity deleted successfully!')
  } catch (error) {
    if (error.code === 'permission-denied') {
      alert('You can only delete your own activities')
    } else if (error.code === 'not-found') {
      alert('Activity not found')
    } else {
      alert('Failed to delete activity: ' + error.message)
    }
  } finally {
    isLoading.value = false
  }
}
*/

// ==================== 错误处理参考 ====================

/*
Cloud Functions 常见错误代码：

- 'unauthenticated': 用户未登录
- 'permission-denied': 权限不足
- 'invalid-argument': 参数错误
- 'not-found': 资源不存在
- 'already-exists': 资源已存在
- 'resource-exhausted': 配额用尽
- 'failed-precondition': 前置条件失败
- 'internal': 服务器内部错误
- 'unavailable': 服务不可用
- 'deadline-exceeded': 请求超时
*/

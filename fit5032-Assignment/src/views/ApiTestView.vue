<template>
  <div class="api-test-page">
    <div class="container py-4 mt-4">
      <div class="text-center mb-4">
        <h2 class="display-4 fw-bold">REST API Testing</h2>
        <p class="lead text-muted">Public APIs for third-party access</p>
      </div>

      <!-- API 1 -->
      <div class="card mb-3">
        <div class="card-header">
          <strong>API 1: Get All Activities</strong>
        </div>
        <div class="card-body">
          <p class="mb-2">
            <strong>URL:</strong> <code class="small">{{ apiBaseUrl }}/getActivities</code>
          </p>

          <button class="btn btn-primary btn-sm" @click="testGetAllActivities" :disabled="loading1">
            {{ loading1 ? 'Loading...' : 'Test API' }}
          </button>

          <div v-if="response1" class="mt-3">
            <div :class="['alert', response1.success ? 'alert-success' : 'alert-danger']" class="py-2">
              {{ response1.success ? '✅ Success' : '❌ Error' }}
              <span v-if="response1.count"> - {{ response1.count }} activities found</span>
            </div>
            <div class="response-box">
              <pre class="mb-0">{{ JSON.stringify(response1, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- API 2 -->
      <div class="card mb-3">
        <div class="card-header">
          <strong>API 2: Get Activity by ID</strong>
        </div>
        <div class="card-body">
          <p class="mb-2">
            <strong>URL:</strong> <code class="small">{{ apiBaseUrl }}/getActivityById?id=ID</code>
          </p>

          <input
            type="text"
            class="form-control form-control-sm mb-2"
            v-model="activityId"
            placeholder="Enter activity ID"
            style="max-width: 400px"
          />

          <button class="btn btn-primary btn-sm me-2" @click="testGetActivityById" :disabled="loading2">
            {{ loading2 ? 'Loading...' : 'Test API' }}
          </button>
          <button class="btn btn-outline-secondary btn-sm" @click="testWithoutId" :disabled="loading2">
            Test Error
          </button>

          <div v-if="response2" class="mt-3">
            <div :class="['alert', response2.success ? 'alert-success' : 'alert-danger']" class="py-2">
              {{ response2.success ? '✅ Success' : '❌ Error' }}
              <span v-if="response2.error"> - {{ response2.error }}</span>
            </div>
            <div class="response-box">
              <pre class="mb-0">{{ JSON.stringify(response2, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const apiBaseUrl = 'https://us-central1-fit5032-a3-xilongwang.cloudfunctions.net'
const activityId = ref('')
const response1 = ref(null)
const response2 = ref(null)
const loading1 = ref(false)
const loading2 = ref(false)

const testGetAllActivities = async () => {
  loading1.value = true
  response1.value = null

  try {
    const response = await fetch(`${apiBaseUrl}/getActivities`)
    const data = await response.json()
    response1.value = data
  } catch (error) {
    response1.value = {
      success: false,
      error: error.message,
    }
  } finally {
    loading1.value = false
  }
}

const testGetActivityById = async () => {
  loading2.value = true
  response2.value = null

  try {
    const url = activityId.value
      ? `${apiBaseUrl}/getActivityById?id=${encodeURIComponent(activityId.value)}`
      : `${apiBaseUrl}/getActivityById`

    const response = await fetch(url)
    const data = await response.json()
    response2.value = data
  } catch (error) {
    response2.value = {
      success: false,
      error: error.message,
    }
  } finally {
    loading2.value = false
  }
}

const testWithoutId = () => {
  activityId.value = ''
  testGetActivityById()
}

const copyToClipboard = async (data) => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    alert('Copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}
</script>

<style scoped>
.api-test-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 80px;
}

.card {
  border: 1px solid #ddd;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

code {
  background: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
  color: #d63384;
}

.response-box {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  max-height: 300px;
  overflow-y: auto;
}

.response-box pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 0.8em;
  color: #333;
}
</style>


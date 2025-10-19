<template>
  <div class="dashboard-container">
    <div class="container-fluid mt-4">
      <!-- Header -->
      <div class="text-center mb-5">
        <h2 class="display-4 fw-bold text-dark">Sports Participation Analytics Dashboard</h2>
        <p class="lead text-muted">Interactive data visualization and analysis</p>
      </div>

      <!-- Data Visualization Grid -->
      <div class="row g-4">
        <!-- 1. Annual Trends Chart -->
        <ChartCard
          title="Annual Participation Trends (2015-2023)"
          icon="bi-graph-up"
          chart-title="Participation Rate Over Time"
          chart-type="line"
          :chart-data="annualTrendsChartData"
          :chart-options="lineChartOptions"
          :table-data="annualTrendsData"
          :table-columns="annualTrendsColumns"
        />

        <!-- 2. Regional Analysis Chart -->
        <ChartCard
          title="Regional Participation Analysis (2023)"
          icon="bi-geo-alt"
          chart-title="Highest vs Lowest Participation by Region"
          chart-type="bar"
          :chart-data="regionalChartData"
          :chart-options="barChartOptions"
          :table-data="regionalData"
          :table-columns="regionalColumns"
        />

        <!-- 3. Age Distribution Chart -->
        <ChartCard
          title="Age Group Distribution (2023)"
          icon="bi-people"
          chart-title="Participation by Age Group"
          chart-type="bar"
          :chart-data="ageChartData"
          :chart-options="ageChartOptions"
          :table-data="ageDistributionData"
          :table-columns="ageDistributionColumns"
        />

        <!-- 4. Gender Analysis Chart -->
        <ChartCard
          title="Gender Participation Analysis (2023)"
          icon="bi-gender-ambiguous"
          chart-title="Participation by Gender"
          chart-type="bar"
          :chart-data="genderChartData"
          :chart-options="genderChartOptions"
          :table-data="genderAnalysisData"
          :table-columns="genderAnalysisColumns"
        />
      </div>
    </div>
  </div>
</template><script>
import { ref, onMounted, watch } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'
import ChartCard from '@/components/ChartCard.vue'

// Import configurations
import {
  generateAnnualTrendsChart,
  generateRegionalChart,
  generateAgeChart,
  generateGenderChart,
  lineChartOptions,
  barChartOptions,
  ageChartOptions,
  genderChartOptions
} from '@/data/dashboardChartConfigs'

import {
  annualTrendsColumns,
  regionalColumns,
  ageDistributionColumns,
  genderAnalysisColumns
} from '@/data/dashboardTableColumns'

export default {
  name: 'DashboardView',
  components: {
    ChartCard
  },
  setup() {
    // Data refs
    const annualTrendsData = ref([])
    const regionalData = ref([])
    const ageDistributionData = ref([])
    const genderAnalysisData = ref([])

    // Chart data refs
    const annualTrendsChartData = ref({ labels: [], datasets: [] })
    const regionalChartData = ref({ labels: [], datasets: [] })
    const ageChartData = ref({ labels: [], datasets: [] })
    const genderChartData = ref({ labels: [], datasets: [] })

    // Age group sorting order
    const ageOrder = {
      '4 years': 1,
      '5-9 years': 2,
      '10-14 years': 3,
      '15-19 years': 4,
      '20-24 years': 5,
      '25-29 years': 6,
      '30-34 years': 7,
      '35+ years': 8
    }

    // Load data from Firestore
    const loadDashboardData = async () => {
      try {
        // Load all collections in parallel
        const [annualSnapshot, regionalSnapshot, ageSnapshot, genderSnapshot] = await Promise.all([
          getDocs(query(collection(db, 'dashboard_annual_trends'), orderBy('year', 'asc'))),
          getDocs(collection(db, 'dashboard_regional')),
          getDocs(collection(db, 'dashboard_age_distribution')),
          getDocs(collection(db, 'dashboard_gender'))
        ])

        // Process annual trends data
        annualTrendsData.value = annualSnapshot.docs.map((doc, index) => ({
          id: index + 1,
          ...doc.data()
        }))

        // Process regional data
        regionalData.value = regionalSnapshot.docs.map((doc, index) => ({
          id: index + 1,
          ...doc.data()
        }))

        // Process age distribution data with sorting
        ageDistributionData.value = ageSnapshot.docs
          .map((doc, index) => ({
            id: index + 1,
            ...doc.data()
          }))
          .sort((a, b) => {
            const orderA = ageOrder[a.ageGroup] || 999
            const orderB = ageOrder[b.ageGroup] || 999
            return orderA - orderB
          })

        // Process gender analysis data
        genderAnalysisData.value = genderSnapshot.docs.map((doc, index) => ({
          id: index + 1,
          ...doc.data()
        }))

        // Generate chart data using imported functions
        annualTrendsChartData.value = generateAnnualTrendsChart(annualTrendsData.value)
        regionalChartData.value = generateRegionalChart(regionalData.value)
        ageChartData.value = generateAgeChart(ageDistributionData.value)
        genderChartData.value = generateGenderChart(genderAnalysisData.value)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }

    // Watch for data changes and regenerate charts
    watch([annualTrendsData, regionalData, ageDistributionData, genderAnalysisData], () => {
      if (annualTrendsData.value.length > 0) {
        annualTrendsChartData.value = generateAnnualTrendsChart(annualTrendsData.value)
      }
      if (regionalData.value.length > 0) {
        regionalChartData.value = generateRegionalChart(regionalData.value)
      }
      if (ageDistributionData.value.length > 0) {
        ageChartData.value = generateAgeChart(ageDistributionData.value)
      }
      if (genderAnalysisData.value.length > 0) {
        genderChartData.value = generateGenderChart(genderAnalysisData.value)
      }
    }, { deep: true })

    onMounted(async () => {
      await loadDashboardData()
    })

    return {
      // Data
      annualTrendsData,
      regionalData,
      ageDistributionData,
      genderAnalysisData,
      // Chart data
      annualTrendsChartData,
      regionalChartData,
      ageChartData,
      genderChartData,
      // Chart options
      lineChartOptions,
      barChartOptions,
      ageChartOptions,
      genderChartOptions,
      // Table columns
      annualTrendsColumns,
      regionalColumns,
      ageDistributionColumns,
      genderAnalysisColumns
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-top: 80px;
}
</style>

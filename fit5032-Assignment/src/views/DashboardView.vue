<template>
  <div class="dashboard-container">
    <div class="container-fluid mt-4">
      <div class="text-center mb-5">
        <h2 class="display-4 fw-bold text-dark">Sports Participation Analytics Dashboard</h2>
        <p class="lead text-muted">Interactive data visualization and analysis</p>
      </div>

            <!-- Data Visualization Grid -->
      <div class="row g-4">
        <!-- 1. Annual Trends - Line Chart + Table -->
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-dark text-white">
              <h6 class="mb-0"><i class="bi bi-graph-up me-2"></i>Annual Participation Trends (2015-2023)</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-7">
                  <h6 class="text-muted mb-3">Participation Rate Over Time</h6>

                  <DataChart
                    type="line"
                    :data="annualTrendsChartData"
                    :options="lineChartOptions"
                  />
                </div>
                <div class="col-lg-5">
                  <h6 class="text-muted mb-3">Data Table</h6>
                  <InteractiveTable
                    :data="annualTrendsData"
                    :columns="annualTrendsColumns"
                    table-title=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Regional Analysis - Bar Chart + Table -->
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-dark text-white">
              <h6 class="mb-0"><i class="bi bi-geo-alt me-2"></i>Regional Participation Analysis (2023)</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-7">
                  <h6 class="text-muted mb-3">Highest vs Lowest Participation by Region</h6>
                  <DataChart
                    type="bar"
                    :data="regionalChartData"
                    :options="barChartOptions"
                  />
                </div>
                <div class="col-lg-5">
                  <h6 class="text-muted mb-3">Data Table</h6>
                  <InteractiveTable
                    :data="regionalData"
                    :columns="regionalColumns"
                    table-title=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

                <!-- 3. Age Demographics - Bar Chart + Table -->
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-dark text-white">
              <h6 class="mb-0"><i class="bi bi-people me-2"></i>Age Group Distribution (2023)</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-7">
                  <h6 class="text-muted mb-3">Participation by Age Group</h6>
                  <DataChart
                    type="bar"
                    :data="ageChartData"
                    :options="ageChartOptions"
                  />
                </div>
                <div class="col-lg-5">
                  <h6 class="text-muted mb-3">Data Table</h6>
                  <InteractiveTable
                    :data="ageDistributionData"
                    :columns="ageDistributionColumns"
                    table-title=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Gender Analysis - Bar Chart + Table -->
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-dark text-white">
              <h6 class="mb-0"><i class="bi bi-gender-ambiguous me-2"></i>Gender Participation Analysis (2023)</h6>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-lg-7">
                  <h6 class="text-muted mb-3">Participation by Gender</h6>
                  <DataChart
                    type="bar"
                    :data="genderChartData"
                    :options="genderChartOptions"
                  />
                </div>
                <div class="col-lg-5">
                  <h6 class="text-muted mb-3">Data Table</h6>
                  <InteractiveTable
                    :data="genderAnalysisData"
                    :columns="genderAnalysisColumns"
                    table-title=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template><script>
import { ref, onMounted } from 'vue'
import InteractiveTable from '@/components/InteractiveTable.vue'
import DataChart from '@/components/DataChart.vue'

export default {
  name: 'DashboardView',
  components: {
    InteractiveTable,
    DataChart
  },
  setup() {
    // Annual Participation Trends Data (2015-2023)
    const annualTrendsData = ref([
      { id: 1, year: 2015, participants: 749037, participationRate: '12.6%', notes: '' },
      { id: 2, year: 2016, participants: 827974, participationRate: '13.4%', notes: '' },
      { id: 3, year: 2017, participants: 857400, participationRate: '13.6%', notes: '' },
      { id: 4, year: 2018, participants: 845135, participationRate: '13.1%', notes: '' },
      { id: 5, year: 2019, participants: 864410, participationRate: '13.1%', notes: '' },
      { id: 6, year: 2020, participants: 634130, participationRate: '9.5%', notes: 'COVID Impact' },
      { id: 7, year: 2021, participants: 862246, participationRate: '13.2%', notes: 'Recovery' },
      { id: 8, year: 2022, participants: 919112, participationRate: '13.9%', notes: '' },
      { id: 9, year: 2023, participants: 939295, participationRate: '14.2%', notes: 'Historical High' }
    ])

    // Regional Analysis Data (2023)
    const regionalData = ref([
      { id: 1, regionType: 'Metropolitan - Other', highestLGA: 'Bayside', highestRate: '26.2%', lowestLGA: 'Greater Dandenong', lowestRate: '5.3%' },
      { id: 2, regionType: 'Metropolitan - Growth', highestLGA: 'Cardinia', highestRate: '14.2%', lowestLGA: 'Melton', lowestRate: '8.7%' },
      { id: 3, regionType: 'Regional - Growth', highestLGA: 'Surf Coast', highestRate: '24.7%', lowestLGA: 'Moorabool', lowestRate: '14.2%' },
      { id: 4, regionType: 'Regional - Other', highestLGA: 'Buloke', highestRate: '26.9%', lowestLGA: 'Hepburn', lowestRate: '11.7%' }
    ])

    // Age Distribution Data (2023)
    const ageDistributionData = ref([
      { id: 1, ageGroup: '4 years', participationRate: '25%', category: 'Early Childhood' },
      { id: 2, ageGroup: '5-9 years', participationRate: '58%', category: 'Primary School' },
      { id: 3, ageGroup: '10-14 years', participationRate: '61%', category: 'Secondary School' },
      { id: 4, ageGroup: '15-19 years', participationRate: '32%', category: 'Late Teens' },
      { id: 5, ageGroup: '20-24 years', participationRate: '14%', category: 'Young Adults' },
      { id: 6, ageGroup: '25-29 years', participationRate: '12%', category: 'Adults' },
      { id: 7, ageGroup: '30-34 years', participationRate: '11%', category: 'Adults' },
      { id: 8, ageGroup: '35+ years', participationRate: '<7%', category: 'Mature Adults' }
    ])

    // Gender Analysis Data (2023)
    const genderAnalysisData = ref([
      { id: 1, gender: 'Male', participants: 727578, participationRate: '22.2%', category: 'Individual' },
      { id: 2, gender: 'Female', participants: 389499, participationRate: '11.6%', category: 'Individual' },
      { id: 3, gender: 'Total (16 Sports)', participants: 1117077, participationRate: '16.9%', category: 'Combined' }
    ])

    // Column Definitions
    const annualTrendsColumns = ref([
      { key: 'year', label: 'Year', sortable: true, searchable: true },
      { key: 'participants', label: 'Participants', sortable: true, searchable: true },
      { key: 'participationRate', label: 'Rate (%)', sortable: true, searchable: true },
      { key: 'notes', label: 'Notes', sortable: false, searchable: true }
    ])

    const regionalColumns = ref([
      { key: 'regionType', label: 'Region Type', sortable: true, searchable: true },
      { key: 'highestLGA', label: 'Highest LGA', sortable: true, searchable: true },
      { key: 'highestRate', label: 'Max Rate', sortable: true, searchable: true },
      { key: 'lowestLGA', label: 'Lowest LGA', sortable: true, searchable: true },
      { key: 'lowestRate', label: 'Min Rate', sortable: true, searchable: true }
    ])

    const ageDistributionColumns = ref([
      { key: 'ageGroup', label: 'Age Group', sortable: true, searchable: true },
      { key: 'participationRate', label: 'Participation Rate', sortable: true, searchable: true },
      { key: 'category', label: 'Category', sortable: true, searchable: true }
    ])

    const genderAnalysisColumns = ref([
      { key: 'gender', label: 'Gender', sortable: true, searchable: true },
      { key: 'participants', label: 'Participants', sortable: true, searchable: true },
      { key: 'participationRate', label: 'Rate (%)', sortable: true, searchable: true },
      { key: 'category', label: 'Type', sortable: true, searchable: true }
    ])

    // Chart Data
    const annualTrendsChartData = ref({
      labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
      datasets: [{
        label: 'Participation Rate (%)',
        data: [12.6, 13.4, 13.6, 13.1, 13.1, 9.5, 13.2, 13.9, 14.2],
        borderColor: '#000000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#000000',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    })

    const regionalChartData = ref({
      labels: ['Metropolitan-Other', 'Metropolitan-Growth', 'Regional-Growth', 'Regional-Other'],
      datasets: [
        {
          label: 'Highest Rate (%)',
          data: [26.2, 14.2, 24.7, 26.9],
          backgroundColor: '#000000',
          borderColor: '#000000',
          borderWidth: 1
        },
        {
          label: 'Lowest Rate (%)',
          data: [5.3, 8.7, 14.2, 11.7],
          backgroundColor: '#808080',
          borderColor: '#808080',
          borderWidth: 1
        }
      ]
    })

    const ageChartData = ref({
      labels: ['4 years', '5-9 years', '10-14 years', '15-19 years', '20-24 years', '25-29 years', '30-34 years', '35+ years'],
      datasets: [{
        label: 'Participation Rate (%)',
        data: [25, 58, 61, 32, 14, 12, 11, 7],
        backgroundColor: [
          '#000000', '#2a2a2a', '#555555', '#808080',
          '#aaaaaa', '#cccccc', '#e6e6e6', '#ffffff'
        ],
        borderColor: '#000000',
        borderWidth: 1
      }]
    })

    const genderChartData = ref({
      labels: ['Male', 'Female'],
      datasets: [{
        label: 'Participation Rate (%)',
        data: [22.2, 11.6],
        backgroundColor: ['#000000', '#808080'],
        borderColor: '#000000',
        borderWidth: 2
      }]
    })

    // Chart Options
    const lineChartOptions = {
      plugins: {
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 16,
          ticks: {
            callback: function(value) {
              return value + '%'
            }
          }
        }
      }
    }

    const barChartOptions = {
      plugins: {
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value + '%'
            }
          }
        }
      }
    }

    const ageChartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 70,
          ticks: {
            callback: function(value) {
              return value + '%'
            }
          }
        }
      }
    }

    const genderChartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 25,
          ticks: {
            callback: function(value) {
              return value + '%'
            }
          }
        }
      }
    }

    onMounted(() => {
      // Dashboard loaded
    })

    return {
      annualTrendsData,
      regionalData,
      ageDistributionData,
      genderAnalysisData,
      annualTrendsColumns,
      regionalColumns,
      ageDistributionColumns,
      genderAnalysisColumns,
      annualTrendsChartData,
      regionalChartData,
      ageChartData,
      genderChartData,
      lineChartOptions,
      barChartOptions,
      ageChartOptions,
      genderChartOptions
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

/* Title styles now use Bootstrap classes */

.card {
  border: none;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background: white;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.card-header {
  background: linear-gradient(135deg, #2c3e50, #34495e) !important;
  border: none;
  border-radius: 12px 12px 0 0 !important;
  padding: 1rem 1.5rem;
}

.card-header h6 {
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0;
}

.card-body {
  padding: 1rem !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1.8rem;
  }

  .card-header h6 {
    font-size: 0.85rem;
  }
}/* Icon styling */
.bi {
  opacity: 0.9;
}

/* Table in chart cards */
.card-body .interactive-table {
  max-height: 400px;
  overflow-y: auto;
}
</style>

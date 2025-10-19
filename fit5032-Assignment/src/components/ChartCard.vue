<template>
  <div class="col-12">
    <div class="card shadow-sm">
      <div class="card-header bg-dark text-white">
        <h6 class="mb-0">
          <i :class="`bi ${icon} me-2`"></i>{{ title }}
        </h6>
      </div>
      <div class="card-body">
        <div class="row">
          <!-- Chart Section -->
          <div class="col-lg-7">
            <h6 class="text-muted mb-3">{{ chartTitle }}</h6>
            <DataChart
              :type="chartType"
              :data="chartData"
              :options="chartOptions"
            />
          </div>
          <!-- Table Section -->
          <div class="col-lg-5">
            <h6 class="text-muted mb-3">Data Table</h6>
            <InteractiveTable
              :data="tableData"
              :columns="tableColumns"
              table-title=""
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InteractiveTable from '@/components/InteractiveTable.vue'
import DataChart from '@/components/DataChart.vue'

export default {
  name: 'ChartCard',
  components: {
    InteractiveTable,
    DataChart
  },
  props: {
    // Card header
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'bi-graph-up'
    },
    // Chart section
    chartTitle: {
      type: String,
      required: true
    },
    chartType: {
      type: String,
      required: true,
      validator: (value) => ['line', 'bar', 'pie', 'doughnut'].includes(value)
    },
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    },
    // Table section
    tableData: {
      type: Array,
      required: true
    },
    tableColumns: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
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

.bi {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .card-header h6 {
    font-size: 0.85rem;
  }
}
</style>

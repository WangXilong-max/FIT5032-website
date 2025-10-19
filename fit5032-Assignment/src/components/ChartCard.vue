<template>
  <div class="col-12">
    <div class="card shadow-sm">
      <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <h6 class="mb-0">
          <i :class="`bi ${icon} me-2`"></i>{{ title }}
        </h6>
        <div class="btn-group btn-group-sm">
          <button @click="exportCSV" class="btn btn-outline-light" aria-label="Export as CSV">
            <i class="bi bi-file-earmark-spreadsheet me-1"></i>CSV
          </button>
          <button @click="exportPDF" class="btn btn-outline-light" aria-label="Export as PDF">
            <i class="bi bi-file-earmark-pdf me-1"></i>PDF
          </button>
        </div>
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
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

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
  },
  methods: {
    exportCSV() {
      const headers = this.tableColumns.map(col => col.label)
      const rows = this.tableData.map(item =>
        this.tableColumns.map(col => item[col.key] || '')
      )
      
      const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${this.title}.csv`
      link.click()
      URL.revokeObjectURL(url)
    },
    
    exportPDF() {
      const doc = new jsPDF()
      
      doc.setFontSize(14)
      doc.text(this.title, 14, 15)
      
      const headers = this.tableColumns.map(col => col.label)
      const rows = this.tableData.map(item =>
        this.tableColumns.map(col => item[col.key] || '')
      )
      
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 25,
        theme: 'grid',
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        styles: { fontSize: 9 }
      })
      
      doc.save(`${this.title}.pdf`)
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
  background: #000000 !important;
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

<template>
  <div class="interactive-table">
    <!-- Compact Header -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="d-flex align-items-center gap-2">
        <input
          v-model="globalSearch"
          type="text"
          class="form-control form-control-sm search-input"
          placeholder="Search..."
        />
        <button
          @click="toggleColumnFilters"
          class="btn btn-outline-dark btn-sm"
          :class="{ active: showColumnFilters }"
        >
          <i class="bi bi-funnel"></i>
        </button>
      </div>
      <select v-model="entriesPerPage" class="form-select form-select-sm entries-select">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
      </select>
    </div>

    <!-- Column Filters -->
    <div class="column-filters mb-2" v-if="showColumnFilters">
      <div class="row g-1">
        <div v-for="column in searchableColumns" :key="column.key" class="col-6 col-md-3">
          <input
            v-model="columnSearches[column.key]"
            type="text"
            class="form-control form-control-sm"
            :placeholder="`${column.label}...`"
          />
        </div>
      </div>
    </div>
    <!-- Table -->
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="column.sortable ? sortBy(column.key) : null"
              :class="{ sortable: column.sortable }"
            >
              {{ column.label }}
              <span v-if="column.sortable" class="sort-indicator">
                <i
                  v-if="sortKey === column.key && sortOrder === 'asc'"
                  class="bi bi-caret-up-fill"
                ></i>
                <i
                  v-else-if="sortKey === column.key && sortOrder === 'desc'"
                  class="bi bi-caret-down-fill"
                ></i>
                <i v-else class="bi bi-caret-up text-muted"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="item.id || item.key">
            <td v-for="column in columns" :key="column.key">
              {{ formatCellValue(item[column.key]) }}
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length" class="text-center text-muted py-4">
              No data found matching your search criteria
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Compact Pagination -->
    <div class="d-flex justify-content-between align-items-center mt-2 pagination-wrapper">
      <small class="text-muted">
        {{ paginationStart }}-{{ paginationEnd }} of {{ filteredData.length }}
        <span v-if="filteredData.length !== data.length">({{ data.length }} total)</span>
      </small>

      <div class="btn-group btn-group-sm" v-if="totalPages > 1">
        <button
          class="btn btn-outline-dark"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          <i class="bi bi-chevron-left"></i>
        </button>

        <button
          v-for="page in visiblePages"
          :key="page"
          class="btn"
          :class="page === currentPage ? 'btn-dark' : 'btn-outline-dark'"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="btn btn-outline-dark"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, reactive } from 'vue'

export default {
  name: 'InteractiveTable',
  props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    tableTitle: {
      type: String,
      default: 'Data Table',
    },
  },
  setup(props) {
    // Reactive state
    const sortKey = ref('')
    const sortOrder = ref('asc')
    const globalSearch = ref('')
    const columnSearches = reactive({})
    const currentPage = ref(1)
    const entriesPerPage = ref(10)
    const showColumnFilters = ref(false)

    // Initialize column searches
    props.columns.forEach((column) => {
      if (column.searchable) {
        columnSearches[column.key] = ''
      }
    })

    // Computed properties
    const searchableColumns = computed(() => {
      return props.columns.filter((column) => column.searchable)
    })

    const filteredData = computed(() => {
      let filtered = props.data

      // Apply global search
      if (globalSearch.value) {
        const searchTerm = globalSearch.value.toLowerCase()
        filtered = filtered.filter((item) => {
          return props.columns.some((column) => {
            const value = item[column.key]
            return String(value).toLowerCase().includes(searchTerm)
          })
        })
      }

      // Apply column-specific searches
      Object.keys(columnSearches).forEach((key) => {
        const searchTerm = columnSearches[key]
        if (searchTerm) {
          filtered = filtered.filter((item) => {
            const value = item[key]
            return String(value).toLowerCase().includes(searchTerm.toLowerCase())
          })
        }
      })

      return filtered
    })

    const sortedData = computed(() => {
      let sorted = [...filteredData.value]

      if (sortKey.value) {
        sorted.sort((a, b) => {
          let aVal = a[sortKey.value]
          let bVal = b[sortKey.value]

          // Handle different data types
          if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
          } else {
            aVal = String(aVal).toLowerCase()
            bVal = String(bVal).toLowerCase()
            if (sortOrder.value === 'asc') {
              return aVal.localeCompare(bVal)
            } else {
              return bVal.localeCompare(aVal)
            }
          }
        })
      }

      return sorted
    })

    const totalPages = computed(() => {
      return Math.ceil(sortedData.value.length / entriesPerPage.value)
    })

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * entriesPerPage.value
      const end = start + entriesPerPage.value
      return sortedData.value.slice(start, end)
    })

    const paginationStart = computed(() => {
      return filteredData.value.length === 0
        ? 0
        : (currentPage.value - 1) * entriesPerPage.value + 1
    })

    const paginationEnd = computed(() => {
      const end = currentPage.value * entriesPerPage.value
      return Math.min(end, filteredData.value.length)
    })

    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages.value, start + maxVisible - 1)

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    })

    // Methods
    const sortBy = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
      currentPage.value = 1 // Reset to first page when sorting
    }

    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    const toggleColumnFilters = () => {
      showColumnFilters.value = !showColumnFilters.value
    }

    const formatCellValue = (value) => {
      if (value === null || value === undefined || value === '') {
        return '-'
      }
      // Format large numbers with commas
      if (typeof value === 'number' && value > 999) {
        return value.toLocaleString()
      }
      return value
    }

    // Watch for changes that should reset pagination
    watch([globalSearch, columnSearches, entriesPerPage], () => {
      currentPage.value = 1
    })

    return {
      sortKey,
      sortOrder,
      globalSearch,
      columnSearches,
      currentPage,
      entriesPerPage,
      showColumnFilters,
      searchableColumns,
      filteredData,
      sortedData,
      totalPages,
      paginatedData,
      paginationStart,
      paginationEnd,
      visiblePages,
      sortBy,
      goToPage,
      toggleColumnFilters,
      formatCellValue,
    }
  },
}
</script>

<style scoped>
.interactive-table {
  background: white;
  padding: 0.75rem;
}

.search-input {
  width: 200px;
}

.entries-select {
  width: 80px;
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
}

.sort-indicator {
  margin-left: 0.4rem;
  font-size: 0.75rem;
  opacity: 0.7;
}

.table {
  margin-bottom: 0.5rem;
}

.table th {
  border-top: none;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.6rem 0.75rem;
  background: #000000;
  color: white;
  border: none;
}

.table td {
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  vertical-align: middle;
  border-bottom: 1px solid #f1f3f4;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.column-filters {
  background-color: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.pagination-wrapper {
  padding-top: 0.5rem;
  border-top: 1px solid #f1f3f4;
}

.btn-outline-dark.active {
  background-color: #000;
  border-color: #000;
}

/* Responsive */
@media (max-width: 768px) {
  .search-input {
    width: 150px;
  }

  .table th,
  .table td {
    font-size: 0.8rem;
    padding: 0.4rem 0.5rem;
  }
}
</style>

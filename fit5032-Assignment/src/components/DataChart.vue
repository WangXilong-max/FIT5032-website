<template>
  <div class="chart-wrapper">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'DataChart',
  props: {
    type: String,
    data: Object,
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const canvas = ref(null)
    let chart = null

    const createChart = () => {
      if (chart) {
        chart.destroy()
      }

      if (canvas.value) {
        const ctx = canvas.value.getContext('2d')
        chart = new Chart(ctx, {
          type: props.type,
          data: props.data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            ...props.options,
          },
        })
      }
    }

    onMounted(() => {
      setTimeout(createChart, 500)
    })

    onBeforeUnmount(() => {
      if (chart) {
        chart.destroy()
      }
    })

    return {
      canvas,
    }
  },
}
</script>
<style scoped>
.chart-wrapper {
  position: relative;
  height: 300px;
  width: 100%;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>

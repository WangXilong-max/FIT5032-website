// Dashboard Chart Configurations
// Centralized configuration for all dashboard charts

export const chartColors = {
  primary: '#000000',
  secondary: '#808080',
  ageGradient: [
    '#000000', '#2a2a2a', '#555555', '#808080',
    '#aaaaaa', '#cccccc', '#e6e6e6', '#ffffff'
  ],
  genderColors: ['#000000', '#808080']
}

// Helper function to parse percentage string to number
export const parsePercentage = (value) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    return parseFloat(value.replace('%', ''))
  }
  return 0
}

// Chart data generators
export const generateAnnualTrendsChart = (data) => ({
  labels: data.map(d => d.year.toString()),
  datasets: [{
    label: 'Participation Rate (%)',
    data: data.map(d => parsePercentage(d.participationRate)),
    borderColor: chartColors.primary,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 2,
    fill: true,
    tension: 0.4,
    pointBackgroundColor: chartColors.primary,
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    pointRadius: 5
  }]
})

export const generateRegionalChart = (data) => ({
  labels: data.map(d => d.regionType.split(' - ')[0]),
  datasets: [
    {
      label: 'Highest Rate (%)',
      data: data.map(d => parsePercentage(d.highestRate)),
      backgroundColor: chartColors.primary,
      borderColor: chartColors.primary,
      borderWidth: 1
    },
    {
      label: 'Lowest Rate (%)',
      data: data.map(d => parsePercentage(d.lowestRate)),
      backgroundColor: chartColors.secondary,
      borderColor: chartColors.secondary,
      borderWidth: 1
    }
  ]
})

export const generateAgeChart = (data) => ({
  labels: data.map(d => d.ageGroup),
  datasets: [{
    label: 'Participation Rate (%)',
    data: data.map(d => parsePercentage(d.participationRate)),
    backgroundColor: chartColors.ageGradient,
    borderColor: chartColors.primary,
    borderWidth: 1
  }]
})

export const generateGenderChart = (data) => {
  const filtered = data.filter(d => d.category === 'Individual')
  return {
    labels: filtered.map(d => d.gender),
    datasets: [{
      label: 'Participation Rate (%)',
      data: filtered.map(d => parsePercentage(d.participationRate)),
      backgroundColor: chartColors.genderColors,
      borderColor: chartColors.primary,
      borderWidth: 2
    }]
  }
}

// Chart options
export const lineChartOptions = {
  plugins: {
    title: { display: false }
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

export const barChartOptions = {
  plugins: {
    title: { display: false }
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

export const ageChartOptions = {
  plugins: {
    legend: { display: false }
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

export const genderChartOptions = {
  plugins: {
    legend: { display: false }
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

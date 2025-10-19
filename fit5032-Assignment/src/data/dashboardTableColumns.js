// Dashboard Table Column Configurations
// Centralized column definitions for all dashboard tables

export const annualTrendsColumns = [
  { key: 'year', label: 'Year', sortable: true, searchable: true },
  { key: 'participants', label: 'Participants', sortable: true, searchable: true },
  { key: 'participationRate', label: 'Rate (%)', sortable: true, searchable: true },
  { key: 'notes', label: 'Notes', sortable: false, searchable: true }
]

export const regionalColumns = [
  { key: 'regionType', label: 'Region Type', sortable: true, searchable: true },
  { key: 'highestLGA', label: 'Highest LGA', sortable: true, searchable: true },
  { key: 'highestRate', label: 'Max Rate', sortable: true, searchable: true },
  { key: 'lowestLGA', label: 'Lowest LGA', sortable: true, searchable: true },
  { key: 'lowestRate', label: 'Min Rate', sortable: true, searchable: true }
]

export const ageDistributionColumns = [
  { key: 'ageGroup', label: 'Age Group', sortable: true, searchable: true },
  { key: 'participationRate', label: 'Participation Rate', sortable: true, searchable: true },
  { key: 'category', label: 'Category', sortable: true, searchable: true }
]

export const genderAnalysisColumns = [
  { key: 'gender', label: 'Gender', sortable: true, searchable: true },
  { key: 'participants', label: 'Participants', sortable: true, searchable: true },
  { key: 'participationRate', label: 'Rate (%)', sortable: true, searchable: true },
  { key: 'category', label: 'Type', sortable: true, searchable: true }
]

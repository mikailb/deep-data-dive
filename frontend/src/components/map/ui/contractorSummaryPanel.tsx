// frontend/src/components/map/ui/contractorSummaryPanel.tsx
import React from 'react' // Import React
import styles from '../../../styles/map/panels.module.css' // Import panel styles
import layerStyles from '../../../styles/map/layers.module.css' // Import layer styles

// Combine styles from both modules
const combinedStyles = { ...styles, ...layerStyles }

// Interface defining contractor summary panel properties
interface ContractorSummaryPanelProps {
	data: any // Contractor summary data including exploration information
	onClose: () => void // Function to close this panel
	onCloseAll: () => void // Function to close all panels
}

// Component for displaying a summary of a selected contractor
export const ContractorSummaryPanel: React.FC<ContractorSummaryPanelProps> = ({ data, onClose, onCloseAll }) => {
	if (!data) return null // Don't render if no data available

	// Format date helper function
	const formatDate = (dateString: string) => {
		if (!dateString || dateString === '0001-01-01T00:00:00') return 'N/A' // Return N/A for null or default date
		return new Date(dateString).toLocaleDateString() // Format as local date string
	}

	return (
		<div className={styles.detailPanel + ' ' + styles.compactDetailPanel}>
			{/* Header with close button */}
			<div className={styles.detailHeader}>
				<h3>{data.contractor.contractorName}</h3>
				<div className={styles.headerControls}>
					<button className={styles.closeButton} onClick={onClose}>
						×
					</button>
				</div>
			</div>

			{/* Content - Simplified and more compact layout */}
			<div className={styles.detailContent}>
				<div className={styles.contractorBasicInfo}>
					<div className={styles.detailField}>
						<span className={styles.fieldLabel}>Contract Type:</span>
						<span>{data.contractor.contractType}</span>
					</div>
					<div className={styles.detailField}>
						<span className={styles.fieldLabel}>Status:</span>
						<span
							className={styles.statusBadge}
							style={{
								backgroundColor:
									data.contractor.status === 'Active'
										? '#4CAF50' // Green for active
										: data.contractor.status === 'Pending'
										? '#FFC107' // Yellow for pending
										: '#9E9E9E', // Grey for other statuses
							}}>
							{data.contractor.status}
						</span>
					</div>
					<div className={styles.detailField}>
						<span className={styles.fieldLabel}>Sponsoring State:</span>
						<span>{data.contractor.sponsoringState}</span>
					</div>
				</div>

				{/* Summary Stats - Compact layout with key metrics */}
				<div className={styles.analyticsSection}>
					<h4>Exploration Summary</h4>

					<div className={styles.compactSummaryStats}>
						<div className={styles.statBox}>
							<span className={styles.statValue}>{data.summary.totalAreas}</span>
							<span className={styles.statLabel}>Areas</span>
						</div>
						<div className={styles.statBox}>
							<span className={styles.statValue}>{data.summary.totalBlocks}</span>
							<span className={styles.statLabel}>Blocks</span>
						</div>
						<div className={styles.statBox}>
							<span className={styles.statValue}>{data.summary.totalAreaKm2.toLocaleString()}</span>
							<span className={styles.statLabel}>km²</span>
						</div>
						<div className={styles.statBox}>
							<span className={styles.statValue}>{data.summary.totalStations}</span>
							<span className={styles.statLabel}>Stations</span>
						</div>
					</div>

					{/* Only show date info if it exists and is not the default date */}
					{data.summary.earliestCruise && data.summary.earliestCruise !== '0001-01-01T00:00:00' && (
						<div className={styles.expeditionInfo}>
							<div className={styles.detailField}>
								<span className={styles.fieldLabel}>Earliest Cruise:</span>
								<span>{formatDate(data.summary.earliestCruise)}</span>
							</div>
							<div className={styles.detailField}>
								<span className={styles.fieldLabel}>Latest Cruise:</span>
								<span>{formatDate(data.summary.latestCruise)}</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Footer actions - Close and Close All buttons */}
			<div className={styles.detailActions}>
				<button className={styles.actionButton} onClick={onClose}>
					Close
				</button>
				<button className={styles.actionButton} onClick={onCloseAll}>
					Close All
				</button>
			</div>
		</div>
	)
}

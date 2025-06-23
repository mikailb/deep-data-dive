// frontend/src/components/map/markers/cruiseMarker.tsx
import React, { useState } from 'react' // Import React and useState hook
import { Marker } from 'react-map-gl' // Import Marker component from react-map-gl
import styles from '../../../styles/map/markers.module.css' // Import marker styles

// CruiseMarker component for displaying cruises on the map
const CruiseMarker = ({ cruise, onClick }) => {
	const [isHovered, setIsHovered] = useState(false) // State to track hover for tooltip

	// Calculate cruise position with multiple fallbacks
	const calculatePosition = () => {
		// First try: Use cruise's explicit center coordinates if available
		if (cruise.centerLatitude && cruise.centerLongitude) {
			// Store these values on the cruise object if they weren't already there
			if (!cruise.centerLatSet) {
				cruise.centerLatSet = true // Mark that we've processed this cruise
				console.log(`Using explicit center coordinates for cruise ${cruise.cruiseName}`)
			}
			return { lat: cruise.centerLatitude, lng: cruise.centerLongitude }
		}

		// Second try: Calculate average position from stations
		if (cruise.stations && cruise.stations.length > 0) {
			// Filter out stations with invalid coordinates
			const validStations = cruise.stations.filter(
				s => s.latitude !== undefined && s.longitude !== undefined && !isNaN(s.latitude) && !isNaN(s.longitude)
			)

			if (validStations.length > 0) {
				// Calculate average position
				const avgLat = validStations.reduce((sum, s) => sum + s.latitude, 0) / validStations.length
				const avgLon = validStations.reduce((sum, s) => sum + s.longitude, 0) / validStations.length

				// Cache the calculated center for future use
				if (!cruise.centerLatSet) {
					cruise.centerLatitude = avgLat
					cruise.centerLongitude = avgLon
					cruise.centerLatSet = true // Mark that we've set a calculated center
					console.log(`Calculated and stored center coordinates for cruise ${cruise.cruiseName}`)
				}

				return { lat: avgLat, lng: avgLon }
			}
		}

		// Fallback: Check if cruise has any area or block associations
		if (cruise.contractorId) {
			// This is just a placeholder for potential implementation
			console.log('Using fallback positioning for cruise:', cruise.cruiseName)
		}

		// Last resort: If no valid coordinates, don't render
		return null
	}

	const position = calculatePosition() // Get position for this cruise

	// Skip rendering if we couldn't determine a valid position
	if (!position) {
		console.warn(`Cannot display cruise ${cruise.cruiseName} - no valid coordinates available`)
		return null
	}

	return (
		<Marker
			longitude={position.lng}
			latitude={position.lat}
			anchor='bottom' // Anchor at bottom of icon
			onClick={e => {
				e.originalEvent.stopPropagation() // Prevent map click
				onClick(cruise) // Handle cruise click
			}}>
			<div
				className={styles.cruiseMarker}
				onMouseEnter={() => setIsHovered(true)} // Show tooltip on hover
				onMouseLeave={() => setIsHovered(false)}>
				{' '}
				{/* Hide tooltip when not hovering */}
				{/* Tooltip showing cruise name on hover */}
				{isHovered && <div className={styles.cruiseTooltip}>{cruise.cruiseName}</div>}
				{/* Cruise icon - ship/boat SVG */}
				<div className={`${styles.cruiseIcon} ${cruise.isSelected ? styles.selectedCruise : ''}`}>
					<svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M12 8C14.2091 8 16 6.20914 16 4C16 1.79086 14.2091 0 12 0C9.79086 0 8 1.79086 8 4C8 6.20914 9.79086 8 12 8Z'
							fill='#8B4513'
						/>
						<path d='M12 9V21' stroke='#8B4513' strokeWidth='3' strokeLinecap='round' />
						<path
							d='M5 13.4V17.4C5 17.4 8 21.5 12 17.4C16 21.5 19 17.4 19 17.4V13.4'
							stroke='#8B4513'
							strokeWidth='3'
							strokeLinecap='round'
						/>
					</svg>
				</div>
			</div>
		</Marker>
	)
}

export default CruiseMarker

// Mapbox initialization script
// This file loads after mapbox-gl.js and handles all map functionality

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    function initMapbox() {
        // Check if map container exists
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.warn('Map container not found, retrying in 100ms...');
            setTimeout(initMapbox, 100);
            return;
        }
        
        // Check if mapboxgl is available
        if (typeof mapboxgl === 'undefined') {
            console.warn('Mapbox GL JS not loaded yet, retrying in 100ms...');
            setTimeout(initMapbox, 100);
            return;
        }
        
        // Your Mapbox access token
	mapboxgl.accessToken = 'pk.eyJ1Ijoic2hhaHphZDMyMyIsImEiOiJjbWI5YmZ1NTEwamYxMmtzYmxtdGpjdXZmIn0.a9llU_BffIuTPkce8OrJXA';
	
	// Dubai location data with time and marker images - ORIGINAL CORRECT COORDINATES
	const locations = [
		{
			id: 1,
			name: "Dubai Sports City",
			time: "15 Minutes",
			coordinates: [55.2183, 25.0383], // Dubai Sports City - Mohammad Bin Zayed Road
			image: "images/sports-city.jpg",
			markerImage: "images/sports-city.jpg"
		},
		{
			id: 2,
			name: "Motor City",
			time: "15 Minutes", 
			coordinates: [55.2391, 25.0506], // Dubai Motor City coordinates
			image: "images/motor-city.jpg",
			markerImage: "images/motor-city.jpg"
		},
		{
			id: 3,
			name: "Damac Hills",
			time: "15 Minutes",
			coordinates: [55.2555, 25.0234], // DAMAC Hills (formerly Akoya) coordinates
			image: "images/damac-hills.jpg",
			markerImage: "images/damac-hills.jpg"
		},
		{
			id: 4,
			name: "Expo 2020 Venue",
			time: "20 Minutes",
			coordinates: [55.1511, 24.9601], // Expo 2020 Dubai site coordinates
			image: "images/expo.jpg",
			markerImage: "images/expo.jpg"
		},
		{
			id: 5,
			name: "Al Maktoum International Airport",
			time: "23 Minutes",
			coordinates: [55.1431, 24.8978], // Al Maktoum International Airport (DWC)
			image: "images/maktoum.jpg",
			markerImage: "images/maktoum.jpg"
		}
	];
	
	const isMobile = window.innerWidth <= 768;
	
	// Initialize map
    const map = new mapboxgl.Map({
    	container: 'map',
    	style: 'mapbox://styles/mapbox/light-v10',
    	center: [55.2839366,25.0228691],
    	zoom: isMobile ? 8 : 10 // Increased zoom level from 10 to 12
    });
    
    map.on('load', () => {
        // Force map to resize to fit container
        setTimeout(() => {
            map.resize();
        }, 100);
    });
    
    // disable map zoom when using scroll
    map.scrollZoom.disable();
    
    const card = document.getElementById('location-card');
    const markers = [];
    let activeLocation = null;
    let cardTimeout;
    
    // Create location buttons with time display
    const buttonsContainer = document.getElementById('location-buttons');
    locations.forEach(location => {
    	const button = document.createElement('button');
    	button.className = 'location-btn';
    	button.dataset.locationId = location.id;
    	
    	// Create the button content with time and name
    	button.innerHTML = `
    		<div class="btn-content">
    			<span class="location-time">${location.time}</span>
    			<span class="location-name">${location.name}</span>
    		</div>
    	`;
    	
    	button.addEventListener('mouseenter', () => showLocationCard(location, button));
    	button.addEventListener('mouseleave', hideLocationCard);
    	button.addEventListener('click', () => flyToLocation(location));
    	
    	buttonsContainer.appendChild(button);
    });
	// Add markers to map
	// Add markers to map
map.on('load', () => {
	locations.forEach(location => {
		// Create marker element with image
		const markerElement = document.createElement('div');
		markerElement.className = 'custom-marker';
		markerElement.dataset.locationId = location.id;
		
		// Create image element using the specific marker image
		const markerImg = document.createElement('img');
		markerImg.src = location.markerImage; // Use markerImage instead of image
		markerImg.alt = location.name;
		markerImg.style.width = '100%';
		markerImg.style.height = '100%';
		markerImg.style.objectFit = 'cover';
		markerImg.style.borderRadius = '50%';
		
		// Add image to marker
		markerElement.appendChild(markerImg);

		// Create marker
		const marker = new mapboxgl.Marker({
			element: markerElement,
			anchor: 'center'
		})
		.setLngLat(location.coordinates)
		.addTo(map);

		// Add hover events to marker - removed click event
		markerElement.addEventListener('mouseenter', () => showLocationCard(location, markerElement));
		markerElement.addEventListener('mouseleave', hideLocationCard);

		markers.push({ marker, element: markerElement, location });
	});

	// PASTE THE ADDITIONAL MARKER CODE HERE - AFTER THE FOREACH LOOP BUT INSIDE map.on('load')
	// Additional marker with div background and logo design
	const additionalMarkerData = {
		coordinates: [55.2839366,25.0228691], // Replace with your desired lat/lng
		backgroundImage: 'images/pointer.svg', // Your background image
		logoImage: 'images/damac-islands-logo.svg' // Your logo image
	};

	// Create the additional marker element
	const additionalMarkerElement = document.createElement('div');
	additionalMarkerElement.className = 'additional-custom-marker';

	// Set background image on the div
	additionalMarkerElement.style.backgroundImage = `url(${additionalMarkerData.backgroundImage})`;
	additionalMarkerElement.style.backgroundSize = 'cover';
	additionalMarkerElement.style.backgroundPosition = 'center';
	additionalMarkerElement.style.backgroundRepeat = 'no-repeat';

	// Create logo image element
	const logoImg = document.createElement('img');
	logoImg.src = additionalMarkerData.logoImage;
	logoImg.alt = 'Logo';
	logoImg.className = 'additional-marker-logo';

	// Add logo to marker
	additionalMarkerElement.appendChild(logoImg);

	// Create and add the additional marker to map
	const additionalMarker = new mapboxgl.Marker({
		element: additionalMarkerElement,
		anchor: 'center'
	})
	.setLngLat(additionalMarkerData.coordinates)
	.addTo(map);
});
	
	function showLocationCard(location, element) {
		clearTimeout(cardTimeout);
		
		// Update card content
		document.getElementById('card-image').src = location.image;
		document.getElementById('card-title').textContent = location.name;

		// Find the marker element for this location
		const markerElement = markers.find(m => m.location.id === location.id)?.element;
		
		if (markerElement) {
			const markerRect = markerElement.getBoundingClientRect();
			const mapRect = document.getElementById('map').getBoundingClientRect();
			
			// Check if mobile
			const isMobile = window.innerWidth <= 768;
			const cardWidth = 280;
			const cardHeight = 180; // Adjusted for smaller card without address
			
			let cardLeft, cardTop;
			
			if (isMobile) {
				// Mobile positioning: center horizontally on marker
				const markerCenterX = markerRect.left - mapRect.left + (markerRect.width / 2);
				cardLeft = markerCenterX - (cardWidth / 2);
				
				// Keep card within mobile map bounds (395px width)
				cardLeft = Math.max(10, Math.min(cardLeft, 395 - cardWidth - 10));
				
				// Position card above marker (5px spacing)
				const markerTop = markerRect.top - mapRect.top;
				cardTop = markerTop - cardHeight - 5;
				
				// If no space above, show below marker
				if (cardTop < 10) {
					cardTop = markerTop + markerRect.height + 5;
				}
			} else {
				// Desktop positioning
				const markerLeft = markerRect.left - mapRect.left;
				const markerTop = markerRect.top - mapRect.top;
				
				cardLeft = markerLeft - 130; // Center card
				cardTop = markerTop - 247;   // Above marker
				
				// Desktop boundary checks
				if (cardLeft < 10) cardLeft = 10;
				if (cardLeft > mapRect.width - 290) cardLeft = mapRect.width - 290;
				if (cardTop < 10) cardTop = markerTop + 50;
			}
			
			card.style.left = cardLeft + 'px';
			card.style.top = cardTop + 'px';
		}

		card.classList.add('show');
		setActiveLocation(location.id);
	}
	
	function hideLocationCard() {
		cardTimeout = setTimeout(() => {
			card.classList.remove('show');
			clearActiveLocation();
		}, 300);
	}
	
	function setActiveLocation(locationId) {
		// Update button states
		document.querySelectorAll('.location-btn').forEach(btn => {
			btn.classList.toggle('active', btn.dataset.locationId == locationId);
		});
	
		// Update marker states
		markers.forEach(({ element, location }) => {
			element.classList.toggle('active', location.id == locationId);
		});
	
		activeLocation = locationId;
	}
	
	function clearActiveLocation() {
		document.querySelectorAll('.location-btn').forEach(btn => {
			btn.classList.remove('active');
		});
		
		markers.forEach(({ element }) => {
			element.classList.remove('active');
		});
	
		activeLocation = null;
	}
	
	// Removed flyToLocation function as it's no longer needed
	
	// Keep card visible when hovering over it
	card.addEventListener('mouseenter', () => {
		clearTimeout(cardTimeout);
	});
	
	card.addEventListener('mouseleave', hideLocationCard);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMapbox);
    } else {
        initMapbox();
    }
})(); 
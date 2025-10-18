// Test file to verify improved tourist attractions search
import { TouristSpotService } from './apiService';
import { stations } from './stationData';

export const testAttractionsSearch = async () => {
  console.log('Testing improved tourist attractions search...');
  
  // Test with multiple stations to ensure we get results
  const testStations = [
    { id: 'SBC', name: 'Bangalore City', lat: 12.9716, lon: 77.5946 },
    { id: 'MAS', name: 'Chennai Central', lat: 13.0827, lon: 80.2707 },
    { id: 'NDLS', name: 'New Delhi', lat: 28.6139, lon: 77.209 },
    { id: 'BCT', name: 'Mumbai Central', lat: 18.9718, lon: 72.8194 },
    { id: 'TVC', name: 'Thiruvananthapuram Central', lat: 8.4875, lon: 76.9525 }
  ];
  
  for (const station of testStations) {
    console.log(`\n--- Testing ${station.name} ---`);
    try {
      const attractions = await TouristSpotService.getNearbyAttractions(station.lat, station.lon);
      console.log(`Found ${attractions.length} attractions for ${station.name}`);
      
      if (attractions.length > 0) {
        console.log('Sample attraction:', {
          name: attractions[0].name,
          type: attractions[0].type,
          distance: attractions[0].distance
        });
      } else {
        console.log('No attractions found for this station');
      }
    } catch (error) {
      console.error(`Error testing ${station.name}:`, error);
    }
  }
};

// Uncomment to run test
// testAttractionsSearch();

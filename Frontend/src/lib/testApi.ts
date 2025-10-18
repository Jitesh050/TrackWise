// Test file to verify API integration
import { TouristSpotService, HotelService } from './apiService';
import { stations } from './stationData';

export const testApiIntegration = async () => {
  console.log('Testing API integration...');
  
  // Test with Bangalore City station
  const testStation = stations.find(s => s.id === 'SBC');
  if (!testStation) {
    console.error('Test station not found');
    return;
  }
  
  console.log(`Testing with station: ${testStation.name}`);
  
  try {
    // Test tourist spots API
    console.log('Fetching tourist spots...');
    const touristSpots = await TouristSpotService.getNearbyAttractions(testStation.lat, testStation.lon);
    console.log('Tourist spots found:', touristSpots.length);
    console.log('Sample tourist spot:', touristSpots[0]);
    
    // Test hotels API
    console.log('Fetching hotels...');
    const hotels = await HotelService.getNearbyHotels(testStation.lat, testStation.lon);
    console.log('Hotels found:', hotels.length);
    console.log('Sample hotel:', hotels[0]);
    
    return { touristSpots, hotels };
  } catch (error) {
    console.error('API test failed:', error);
    return null;
  }
};

// Uncomment to run test
// testApiIntegration();

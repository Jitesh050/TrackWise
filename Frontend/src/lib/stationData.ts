// Station data with coordinates for all 25 stations
export interface Station {
  id: string;
  name: string;
  lat: number;
  lon: number;
  state: string;
}

export interface TouristSpot {
  name: string;
  type: string;
  rating: number;
  distance: string;
  description: string;
  openHours: string;
  googleMapsLink: string;
  imageUrl?: string;
}

export interface Hotel {
  name: string;
  rating: number;
  price: string;
  distance: string;
  amenities: string[];
  phone: string;
  website: string;
  address: string;
  imageUrl?: string;
}

export interface StationWithDetails extends Station {
  touristSpots: TouristSpot[];
  hotels: Hotel[];
}

export const stations: Station[] = [
  {"id":"TVC","name":"Thiruvananthapuram Central","lat":8.4875,"lon":76.9525,"state":"Kerala"},
  {"id":"ERS","name":"Ernakulam Junction","lat":9.9816,"lon":76.2999,"state":"Kerala"},
  {"id":"CBE","name":"Coimbatore Junction","lat":11.0168,"lon":76.9558,"state":"Tamil Nadu"},
  {"id":"MAS","name":"Chennai Central","lat":13.0827,"lon":80.2707,"state":"Tamil Nadu"},
  {"id":"BZA","name":"Vijayawada Junction","lat":16.5062,"lon":80.648,"state":"Andhra Pradesh"},
  {"id":"SC","name":"Secunderabad Junction","lat":17.4399,"lon":78.4983,"state":"Telangana"},
  {"id":"KCG","name":"Hyderabad Deccan","lat":17.385,"lon":78.4867,"state":"Telangana"},
  {"id":"SBC","name":"Bangalore City","lat":12.9716,"lon":77.5946,"state":"Karnataka"},
  {"id":"UBL","name":"Hubballi Junction","lat":15.3647,"lon":75.124,"state":"Karnataka"},
  {"id":"PUNE","name":"Pune Junction","lat":18.5204,"lon":73.8567,"state":"Maharashtra"},
  {"id":"BCT","name":"Mumbai Central","lat":18.9718,"lon":72.8194,"state":"Maharashtra"},
  {"id":"NGP","name":"Nagpur Junction","lat":21.1458,"lon":79.0882,"state":"Maharashtra"},
  {"id":"BPL","name":"Bhopal Junction","lat":23.2599,"lon":77.4126,"state":"Madhya Pradesh"},
  {"id":"JBP","name":"Jabalpur Junction","lat":23.1815,"lon":79.9864,"state":"Madhya Pradesh"},
  {"id":"RAIPUR","name":"Raipur Junction","lat":21.2514,"lon":81.6296,"state":"Chhattisgarh"},
  {"id":"HWH","name":"Howrah Junction","lat":22.5726,"lon":88.3639,"state":"West Bengal"},
  {"id":"KOAA","name":"Kolkata","lat":22.5726,"lon":88.3639,"state":"West Bengal"},
  {"id":"PNBE","name":"Patna Junction","lat":25.5941,"lon":85.1376,"state":"Bihar"},
  {"id":"GKP","name":"Gorakhpur Junction","lat":26.7606,"lon":83.3732,"state":"Uttar Pradesh"},
  {"id":"LKO","name":"Lucknow Junction","lat":26.8467,"lon":80.9462,"state":"Uttar Pradesh"},
  {"id":"CNB","name":"Kanpur Central","lat":26.4499,"lon":80.3319,"state":"Uttar Pradesh"},
  {"id":"NDLS","name":"New Delhi","lat":28.6139,"lon":77.209,"state":"Delhi"},
  {"id":"JP","name":"Jaipur Junction","lat":26.9124,"lon":75.7873,"state":"Rajasthan"},
  {"id":"ADI","name":"Ahmedabad Junction","lat":23.0225,"lon":72.5714,"state":"Gujarat"},
  {"id":"CDG","name":"Chandigarh","lat":30.7333,"lon":76.7794,"state":"Punjab"}
];

// Helper function to generate Google Maps directions link
export const getGoogleMapsDirections = (fromLat: number, fromLon: number, toLat: number, toLon: number): string => {
  return `https://www.google.com/maps/dir/${fromLat},${fromLon}/${toLat},${toLon}`;
};

// Helper function to calculate distance between two points
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

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
  phone?: string;
  website: string;
  address: string;
  imageUrl?: string;
}

export interface StationWithDetails extends Station {
  touristSpots: TouristSpot[];
  hotels: Hotel[];
}

export const stations: Station[] = [
  {"id":"TVC","name":"Thiruvananthapuram Central","lat":8.4870167,"lon":76.9526408,"state":"Kerala"},
  {"id":"ERS","name":"Ernakulam Junction","lat":9.9706145,"lon":76.2909707,"state":"Kerala"},
  {"id":"CBE","name":"Coimbatore Junction","lat":10.9975681,"lon":76.9663657,"state":"Tamil Nadu"},
  {"id":"MAS","name":"Chennai Central","lat":13.0825901,"lon":80.2763077,"state":"Tamil Nadu"},
  {"id":"BZA","name":"Vijayawada Junction","lat":16.5204153,"lon":80.6196802,"state":"Andhra Pradesh"},
  {"id":"SC","name":"Secunderabad Junction","lat":17.4399,"lon":78.4983,"state":"Telangana"},
  {"id":"KCG","name":"Hyderabad Deccan","lat":17.3924223,"lon":78.4675956,"state":"Telangana"},
  {"id":"SBC","name":"Bangalore City","lat":12.9779,"lon":77.5725,"state":"Karnataka"},
  {"id":"UBL","name":"Hubballi Junction","lat":15.3647,"lon":75.124,"state":"Karnataka"},
  {"id":"PUNE","name":"Pune Junction","lat":18.5288773,"lon":73.8744146,"state":"Maharashtra"},
  {"id":"BCT","name":"Mumbai Central","lat":18.9695855,"lon":72.8193152,"state":"Maharashtra"},
  {"id":"NGP","name":"Nagpur Junction","lat":21.1458,"lon":79.0882,"state":"Maharashtra"},
  {"id":"BPL","name":"Bhopal Junction","lat":23.2664845,"lon":77.4130845,"state":"Madhya Pradesh"},
  {"id":"JBP","name":"Jabalpur Junction","lat":23.1815,"lon":79.9864,"state":"Madhya Pradesh"},
  {"id":"RAIPUR","name":"Raipur Junction","lat":21.2560953,"lon":81.6297323,"state":"Chhattisgarh"},
  {"id":"HWH","name":"Howrah Junction","lat":22.5827943,"lon":88.3423933,"state":"West Bengal"},
  {"id":"KOAA","name":"Kolkata","lat":22.6012775,"lon":88.3841474,"state":"West Bengal"},
  {"id":"PNBE","name":"Patna Junction","lat":25.6032109,"lon":85.1376861,"state":"Bihar"},
  {"id":"GKP","name":"Gorakhpur Junction","lat":26.7604641,"lon":83.3798194,"state":"Uttar Pradesh"},
  {"id":"LKO","name":"Lucknow Junction","lat":26.8467,"lon":80.9462,"state":"Uttar Pradesh"},
  {"id":"CNB","name":"Kanpur Central","lat":26.4538613,"lon":80.3512433,"state":"Uttar Pradesh"},
  {"id":"NDLS","name":"New Delhi","lat":28.6402816,"lon":77.2204103,"state":"Delhi"},
  {"id":"JP","name":"Jaipur Junction","lat":26.9207888,"lon":75.7866539,"state":"Rajasthan"},
  {"id":"ADI","name":"Ahmedabad Junction","lat":23.0263312,"lon":72.6010000,"state":"Gujarat"},
  {"id":"CDG","name":"Chandigarh","lat":30.7021622,"lon":76.8214533,"state":"Punjab"}
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

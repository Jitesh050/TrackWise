import { Station, TouristSpot, Hotel } from './stationData';

const OPENTRIPMAP_API_KEY = '5ae2e3f221c38a28845f05b6b3fa1b0ebc61af498e582315f53ae35d';
const GEOAPIFY_API_KEY = 'ee9fee55c12246cbb74d6f7c663cf595';

// Geoapify API service for tourist attractions
export class TouristSpotService {
  private static cache = new Map<string, TouristSpot[]>();
  private static readonly MAX_CACHE_SIZE = 50;

  static async getNearbyAttractions(lat: number, lon: number, radius: number = 25000): Promise<TouristSpot[]> {
    const cacheKey = `${lat},${lon},${radius}`;

    if (this.cache.has(cacheKey)) {
      console.log(`[Cache Hit] Serving attractions for ${cacheKey}`);
      return JSON.parse(JSON.stringify(this.cache.get(cacheKey)));
    }

    try {
      console.log(`Searching for attractions near lat: ${lat}, lon: ${lon}, radius: ${radius}m`);
      
      // Search for tourist attractions using Geoapify
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=tourism&filter=circle:${lon},${lat},${radius}&limit=10&apiKey=${GEOAPIFY_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Found ${data.features?.length || 0} attractions`);
      
      if (!data.features || data.features.length === 0) {
        return [];
      }
      
      const attractions: TouristSpot[] = data.features.map((feature: any) => {
        const distance = this.calculateDistance(lat, lon, feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        const properties = feature.properties;
        
        // Filter out unnamed or generic places
        if (!properties.name || properties.name.toLowerCase().includes('unknown') || properties.name.length < 3) {
          return null;
        }
        
        const attractionType = this.getAttractionType(properties);
        const description = this.getAttractionDescription(properties.name, attractionType);
        
        return {
          name: properties.name,
          type: attractionType,
          rating: this.getRandomRating(),
          distance: `${Math.max(distance, 0.1).toFixed(1)} km from station`,
          description: description,
          openHours: 'Hours vary - Check before visiting',
          googleMapsLink: `https://www.google.com/maps/dir/${lat},${lon}/${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}`,
          imageUrl: properties.image_url || undefined
        };
      }).filter(Boolean); // Remove null entries
      
      if (this.cache.size >= this.MAX_CACHE_SIZE) {
        this.cache.clear();
      }
      this.cache.set(cacheKey, attractions);

      return attractions;
    } catch (error) {
      console.error('Error fetching tourist attractions:', error);
      return [];
    }
  }
  
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  private static getAttractionType(properties: any): string {
    const name = properties.name?.toLowerCase() || '';
    const categories = properties.categories || [];
    
    // Check categories first
    if (categories.includes('tourism.attraction')) return 'Tourist Attraction';
    if (categories.includes('tourism.museum')) return 'Museum';
    if (categories.includes('tourism.zoo')) return 'Zoo';
    if (categories.includes('tourism.aquarium')) return 'Aquarium';
    if (categories.includes('tourism.theme_park')) return 'Theme Park';
    if (categories.includes('tourism.art_gallery')) return 'Art Gallery';
    if (categories.includes('tourism.culture')) return 'Cultural Site';
    if (categories.includes('tourism.historic')) return 'Historic Site';
    if (categories.includes('tourism.religious')) return 'Religious Site';
    
    // Check name patterns
    if (name.includes('temple') || name.includes('mandir')) return 'Temple';
    if (name.includes('church') || name.includes('cathedral')) return 'Church';
    if (name.includes('mosque') || name.includes('masjid')) return 'Mosque';
    if (name.includes('palace') || name.includes('mahal')) return 'Palace';
    if (name.includes('fort') || name.includes('qila')) return 'Fort';
    if (name.includes('garden') || name.includes('park')) return 'Garden';
    if (name.includes('museum')) return 'Museum';
    if (name.includes('memorial') || name.includes('samadhi')) return 'Memorial';
    if (name.includes('monument')) return 'Monument';
    if (name.includes('zoo')) return 'Zoo';
    if (name.includes('aquarium')) return 'Aquarium';
    if (name.includes('beach')) return 'Beach';
    if (name.includes('lake') || name.includes('talab')) return 'Lake';
    if (name.includes('hill') || name.includes('mountain')) return 'Hill Station';
    if (name.includes('waterfall') || name.includes('falls')) return 'Waterfall';
    if (name.includes('market') || name.includes('bazaar')) return 'Market';
    if (name.includes('shopping')) return 'Shopping Center';
    if (name.includes('restaurant') || name.includes('food')) return 'Restaurant';
    
    return 'Tourist Attraction';
  }
  
  private static getRandomRating(): number {
    return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // Rating between 3.5 and 5.0
  }

  private static getAttractionDescription(name: string, type: string): string {
    const descriptions: { [key: string]: string } = {
      'Tourist Attraction': `A popular destination that attracts visitors from near and far. ${name} offers a unique experience worth exploring and provides insights into the local culture and heritage.`,
      'Temple': `A sacred Hindu temple known for its spiritual significance and architectural beauty. ${name} is a popular pilgrimage destination and showcases traditional temple architecture.`,
      'Church': `A historic Christian place of worship with architectural and spiritual significance. ${name} represents the region's religious diversity and offers peaceful contemplation.`,
      'Mosque': `A sacred Islamic place of worship known for its architectural beauty and spiritual importance. ${name} showcases Islamic art and provides a space for prayer and reflection.`,
      'Palace': `A magnificent royal residence that reflects the grandeur of bygone eras. ${name} showcases exquisite architecture and historical importance, offering a glimpse into royal heritage.`,
      'Fort': `A historic fortification that played a significant role in the region's defense and history. ${name} offers panoramic views and historical insights into the area's military past.`,
      'Garden': `A beautifully landscaped garden featuring diverse flora and peaceful surroundings. ${name} is perfect for leisurely walks and relaxation, showcasing natural beauty.`,
      'Museum': `A treasure trove of artifacts and exhibits that tell the story of the region's history and culture. ${name} offers educational and enriching experiences for visitors of all ages.`,
      'Memorial': `An important memorial structure commemorating significant events or people. ${name} stands as a testament to the region's history and cultural memory.`,
      'Monument': `An important memorial or commemorative structure of historical significance. ${name} stands as a testament to the region's heritage and cultural legacy.`,
      'Zoo': `A wildlife conservation center that houses various animal species. ${name} provides educational experiences and opportunities to observe wildlife in naturalistic habitats.`,
      'Aquarium': `An underwater world showcasing marine life and aquatic ecosystems. ${name} offers fascinating insights into underwater life and conservation efforts.`,
      'Beach': `A beautiful coastal destination perfect for relaxation and water activities. ${name} offers stunning views, water sports, and a peaceful seaside atmosphere.`,
      'Lake': `A serene water body surrounded by natural beauty. ${name} provides opportunities for boating, fishing, and enjoying peaceful lakeside moments.`,
      'Hill Station': `A scenic mountain destination offering cool climate and breathtaking views. ${name} is perfect for nature lovers and those seeking a peaceful mountain retreat.`,
      'Waterfall': `A magnificent natural waterfall surrounded by lush greenery. ${name} offers a refreshing experience and stunning natural beauty.`,
      'Market': `A vibrant local market offering goods and cultural experiences. ${name} provides insights into local commerce and traditional trading practices.`,
      'Shopping Center': `A modern shopping destination with various retail outlets and entertainment options. ${name} offers a comprehensive shopping and dining experience.`,
      'Restaurant': `A culinary destination known for its delicious food and dining experiences. ${name} offers a taste of local cuisine and regional specialties.`,
      'Historic Site': `A significant historical landmark that showcases the rich cultural heritage of the region. ${name} is a must-visit destination for history enthusiasts.`,
      'Cultural Site': `An important cultural center that represents the local traditions and artistic heritage. ${name} offers insights into the region's cultural identity.`,
      'Religious Site': `A sacred place of worship and spiritual significance. ${name} attracts pilgrims and visitors seeking peace and spiritual enlightenment.`,
      'Theme Park': `An exciting entertainment destination that offers fun and recreational activities. ${name} provides entertainment options for visitors of all ages.`,
      'Art Gallery': `A cultural space showcasing artistic works and creative expressions. ${name} offers insights into local and international art and culture.`
    };
    
    return descriptions[type] || `A popular ${type.toLowerCase()} that attracts visitors from near and far. ${name} offers a unique experience worth exploring and provides insights into the local culture and heritage.`;
  }
}

// Geoapify API service for hotels
export class HotelService {
  private static cache = new Map<string, Hotel[]>();
  private static readonly MAX_CACHE_SIZE = 50;

  static async getNearbyHotels(lat: number, lon: number, radius: number = 5000): Promise<Hotel[]> {
    const cacheKey = `${lat},${lon},${radius}`;

    if (this.cache.has(cacheKey)) {
      console.log(`[Cache Hit] Serving hotels for ${cacheKey}`);
      return JSON.parse(JSON.stringify(this.cache.get(cacheKey)));
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},${radius}&limit=5&apiKey=${GEOAPIFY_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        return [];
      }
      
      const hotels: Hotel[] = data.features.map((feature: any) => {
        const distance = this.calculateDistance(lat, lon, feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        const properties = feature.properties;
        
        return {
          name: properties.name || 'Hotel',
          rating: this.getRandomRating(),
          price: this.getRandomPrice(),
          distance: `${distance.toFixed(1)} km from station`,
          amenities: this.getRandomAmenities(),
          phone: properties.phone || '+91-XXXX-XXXXXX',
          website: properties.website || `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(properties.name || 'hotel')}`,
          address: properties.formatted || 'Address not available',
          imageUrl: properties.image_url || undefined
        };
      });
      
      if (this.cache.size >= this.MAX_CACHE_SIZE) {
        this.cache.clear();
      }
      this.cache.set(cacheKey, hotels);

      return hotels;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return [];
    }
  }
  
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  private static getRandomRating(): number {
    return Math.round((Math.random() * 1.5 + 3.5) * 10) / 10; // Rating between 3.5 and 5.0
  }
  
  private static getRandomPrice(): string {
    const prices = ['₹2,500/night', '₹4,200/night', '₹6,800/night', '₹9,500/night', '₹12,000/night', '₹15,000/night'];
    return prices[Math.floor(Math.random() * prices.length)];
  }
  
  private static getRandomAmenities(): string[] {
    const allAmenities = ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Breakfast', 'Parking', 'Room Service', 'Air Conditioning', 'Business Center'];
    const numAmenities = Math.floor(Math.random() * 4) + 3; // 3-6 amenities
    return allAmenities.sort(() => 0.5 - Math.random()).slice(0, numAmenities);
  }
}

// Combined service to get both tourist spots and hotels for a station
export class StationDetailsService {
  static async getStationDetails(station: Station): Promise<{ touristSpots: TouristSpot[]; hotels: Hotel[] }> {
    try {
      const [touristSpots, hotels] = await Promise.all([
        TouristSpotService.getNearbyAttractions(station.lat, station.lon),
        HotelService.getNearbyHotels(station.lat, station.lon)
      ]);
      
      return { touristSpots, hotels };
    } catch (error) {
      console.error('Error fetching station details:', error);
      return { touristSpots: [], hotels: [] };
    }
  }
}

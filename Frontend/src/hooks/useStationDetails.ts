import { useState, useEffect, useCallback } from 'react';
import { Station, TouristSpot, Hotel } from '@/lib/stationData';
import { TouristSpotService, HotelService } from '@/lib/apiService';

interface StationDetails extends Station {
  touristSpots: TouristSpot[];
  hotels: Hotel[];
}

export const useStationDetails = (station: Station) => {
  const [stationDetails, setStationDetails] = useState<StationDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [touristSpots, hotels] = await Promise.all([
        TouristSpotService.getNearbyAttractions(station.lat, station.lon, 25000), // 25km radius
        HotelService.getNearbyHotels(station.lat, station.lon, 5000) // 5km radius
      ]);

      setStationDetails({
        ...station,
        touristSpots,
        hotels,
      });
    } catch (err) {
      console.error("Failed to fetch station details:", err);
      setError("Failed to load details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [station]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { stationDetails, loading, error, refetch: fetchDetails };
};
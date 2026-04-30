
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, Mic, MicOff, User, Bot, MapPin, Star, Clock, ExternalLink, Heart, Share2, Filter, Phone, Navigation, RefreshCw, Info } from "lucide-react";
import { stations, Station, TouristSpot, Hotel } from "@/lib/stationData";
import { TouristSpotService, HotelService } from "@/lib/apiService";
const CHATBOT_API = import.meta.env.VITE_CHATBOT_API_URL as string | undefined;

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

type ChatBotFlow =
  | 'idle'
  | 'select_option'
  | 'station_selection'
  | 'category_selection'
  | 'show_results'
  | 'item_details'
  | 'train_status_pnr'
  | 'train_status_result'
  | 'query';

interface DiscoverData {
  selectedStation?: Station;
  selectedCategory?: 'hotels' | 'attractions';
  selectedItem?: TouristSpot | Hotel;
  results?: {
    hotels: Hotel[];
    attractions: TouristSpot[];
  };
  filters?: {
    maxDistance?: number;
    minRating?: number;
    maxPrice?: number;
    attractionTypes?: string[];
  };
  favorites?: {
    hotels: string[];
    attractions: string[];
  };
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your Trip Planner assistant. I can help you discover tourist attractions and hotels near railway stations across India. Select 'Discover Trip' to get started!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
const [flow, setFlow] = useState<ChatBotFlow>('select_option');
const [discover, setDiscover] = useState<DiscoverData>({});
const [pendingOption, setPendingOption] = useState<string | null>(null);
const [trainStatusPNR, setTrainStatusPNR] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<{hotels: string[], attractions: string[]}>({hotels: [], attractions: []});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Utility functions
  const toggleFavorite = (itemId: string, type: 'hotels' | 'attractions') => {
    setFavorites(prev => ({
      ...prev,
      [type]: prev[type].includes(itemId)
        ? prev[type].filter(id => id !== itemId)
        : [...prev[type], itemId]
    }));
  };

  const isFavorite = (itemId: string, type: 'hotels' | 'attractions') => {
    return favorites[type].includes(itemId);
  };

  const shareItem = (item: TouristSpot | Hotel, type: 'hotels' | 'attractions') => {
    let text: string;
    let url: string;
    
    if (type === 'hotels') {
      const hotel = item as Hotel;
      text = `${hotel.name} - Hotel near ${discover.selectedStation?.name}\n\n${hotel.price}\n\n${hotel.website}`;
      url = hotel.website;
    } else {
      const attraction = item as TouristSpot;
      text = `${attraction.name} - Attraction near ${discover.selectedStation?.name}\n\n${attraction.type}\n\n${attraction.googleMapsLink}`;
      url = attraction.googleMapsLink;
    }
    
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: text,
        url: url
      });
    } else {
      navigator.clipboard.writeText(text);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `Copied ${item.name} details to clipboard!`,
        isBot: true,
        timestamp: new Date()
      }]);
    }
  };

  const filterResults = (results: TouristSpot[] | Hotel[], type: 'hotels' | 'attractions') => {
    if (!discover.filters) return results;
    
    return results.filter(item => {
      if (discover.filters.maxDistance) {
        const distance = parseFloat(item.distance.split(' ')[0]);
        if (distance > discover.filters.maxDistance) return false;
      }
      if (discover.filters.minRating && item.rating < discover.filters.minRating) {
        return false;
      }
      if (type === 'hotels' && discover.filters.maxPrice) {
        const price = parseInt((item as Hotel).price.replace(/[^\d]/g, ''));
        if (price > discover.filters.maxPrice) return false;
      }
      return true;
    });
  };

  // Lightweight intent helpers for local fallback in 'query' mode
  const findStationFromText = (text: string): Station | undefined => {
    const lower = text.toLowerCase();
    // common aliases map
    const aliases: Record<string, string> = {
      bangalore: 'SBC', bengaluru: 'SBC', bengalore: 'SBC',
      delhi: 'NDLS', newdelhi: 'NDLS',
      mumbai: 'BCT', bombay: 'BCT',
      chennai: 'MAS', madras: 'MAS',
      hyderabad: 'KCG', secunderabad: 'SC',
      kolkata: 'KOAA', howrah: 'HWH',
      patna: 'PNBE', ahmedabad: 'ADI', jaipur: 'JP', lucknow: 'LKO'
    };
    for (const key of Object.keys(aliases)) {
      if (lower.replace(/\s+/g,'').includes(key)) {
        const code = aliases[key];
        const stByAlias = stations.find(s => s.id.toUpperCase() === code);
        if (stByAlias) return stByAlias;
      }
    }
    const byCode = stations.find(s => lower.includes(s.id.toLowerCase()));
    if (byCode) return byCode;
    return stations.find(s => lower.includes(s.name.toLowerCase().split(' ')[0]));
  };

  const inferCategory = (text: string): 'hotels' | 'attractions' | undefined => {
    const lower = text.toLowerCase();
    if (lower.includes('hotel') || lower.includes('stay') || lower.includes('room')) return 'hotels';
    if (lower.includes('place') || lower.includes('visit') || lower.includes('attraction') || lower.includes('site') || lower.includes('tourist')) return 'attractions';
    return undefined;
  };

  const getSmartSuggestions = () => {
    if (!discover.selectedStation) return [];
    
    const suggestions = [
      `What are the top-rated attractions near ${discover.selectedStation.name}?`,
      `Show me budget-friendly hotels near ${discover.selectedStation.name}`,
      `What historical sites can I visit near ${discover.selectedStation.name}?`,
      `Find hotels with good ratings near ${discover.selectedStation.name}`,
      `What are the must-visit places near ${discover.selectedStation.name}?`
    ];
    
    return suggestions.slice(0, 3);
  };

  const getItemSpecificSuggestions = () => {
    if (!discover.selectedItem) return [];
    
    const item = discover.selectedItem;
    const suggestions = [];
    
    if (discover.selectedCategory === 'hotels') {
      const hotel = item as Hotel;
      suggestions.push(
        `What's the phone number of ${hotel.name}?`,
        `How far is ${hotel.name} from the station?`,
        `What amenities does ${hotel.name} have?`,
        `What's the price of ${hotel.name}?`,
        `Where is ${hotel.name} located?`,
        `What's the website of ${hotel.name}?`
      );
    } else {
      const attraction = item as TouristSpot;
      suggestions.push(
        `How far is ${attraction.name} from the station?`,
        `What are the opening hours of ${attraction.name}?`,
        `What type of place is ${attraction.name}?`,
        `Tell me more about ${attraction.name}`,
        `How can I get to ${attraction.name}?`,
        `What's the rating of ${attraction.name}?`
      );
    }
    
    return suggestions.slice(0, 4);
  };

  const handleItemSpecificQuestion = (question: string, item: TouristSpot | Hotel) => {
    const q = question.toLowerCase();
    let answer = '';
    
    if (discover.selectedCategory === 'hotels') {
      const hotel = item as Hotel;
      
      if (q.includes('phone') || q.includes('number') || q.includes('contact')) {
        answer = `The phone number of ${hotel.name} is ${hotel.phone}`;
      } else if (q.includes('distance') || q.includes('far') || q.includes('how far')) {
        answer = `${hotel.name} is located ${hotel.distance} from ${discover.selectedStation?.name} station.`;
      } else if (q.includes('amenities') || q.includes('facilities') || q.includes('features')) {
        answer = `${hotel.name} offers the following amenities: ${hotel.amenities.join(', ')}.`;
      } else if (q.includes('price') || q.includes('cost') || q.includes('rate')) {
        answer = `The price for ${hotel.name} is ${hotel.price}.`;
      } else if (q.includes('address') || q.includes('location') || q.includes('where')) {
        answer = `${hotel.name} is located at ${hotel.address}.`;
      } else if (q.includes('website') || q.includes('site') || q.includes('url')) {
        answer = `You can visit the website of ${hotel.name} at ${hotel.website}`;
      } else if (q.includes('rating') || q.includes('stars') || q.includes('review')) {
        answer = `${hotel.name} has a rating of ${hotel.rating} stars.`;
      } else {
        answer = `Here's information about ${hotel.name}:\n\n• Rating: ${hotel.rating} stars\n• Price: ${hotel.price}\n• Distance: ${hotel.distance}\n• Address: ${hotel.address}\n• Phone: ${hotel.phone}\n• Amenities: ${hotel.amenities.join(', ')}\n• Website: ${hotel.website}`;
      }
    } else {
      const attraction = item as TouristSpot;
      
      if (q.includes('distance') || q.includes('far') || q.includes('how far')) {
        answer = `${attraction.name} is located ${attraction.distance} from ${discover.selectedStation?.name} station.`;
      } else if (q.includes('hours') || q.includes('time') || q.includes('open') || q.includes('close')) {
        answer = `The opening hours of ${attraction.name} are: ${attraction.openHours}`;
      } else if (q.includes('type') || q.includes('kind') || q.includes('category')) {
        answer = `${attraction.name} is a ${attraction.type}.`;
      } else if (q.includes('description') || q.includes('about') || q.includes('tell me more')) {
        answer = `${attraction.description}`;
      } else if (q.includes('directions') || q.includes('how to get') || q.includes('route')) {
        answer = `To get directions to ${attraction.name}, you can use this Google Maps link: ${attraction.googleMapsLink}`;
      } else if (q.includes('rating') || q.includes('stars') || q.includes('review')) {
        answer = `${attraction.name} has a rating of ${attraction.rating} stars.`;
      } else {
        answer = `Here's information about ${attraction.name}:\n\n• Type: ${attraction.type}\n• Rating: ${attraction.rating} stars\n• Distance: ${attraction.distance}\n• Opening Hours: ${attraction.openHours}\n• Description: ${attraction.description}\n• Directions: ${attraction.googleMapsLink}`;
      }
    }
    
    return answer;
  };

  const handleSendMessage = async () => {
  if (!inputText.trim()) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    text: inputText,
    isBot: false,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputText("");
  setIsTyping(true);

  // Conversational flow logic
  setTimeout(() => {
    let botResponse = "";
    let nextFlow: ChatBotFlow = flow;
    const updateDiscover = { ...discover };

    switch (flow) {
      case 'select_option':
        botResponse = "Please select an option above.";
        break;
      case 'station_selection':
        // This will be handled by the station selection component
        return;
      case 'category_selection':
        // This will be handled by the category selection component
        return;
      case 'show_results':
        // Results are displayed in the UI, no text response needed
        return;
      case 'item_details':
        // Handle item-specific questions
        if (discover.selectedItem) {
          const answer = handleItemSpecificQuestion(userMessage.text, discover.selectedItem);
          botResponse = answer;
          nextFlow = 'item_details'; // Stay in item details mode
        } else {
          botResponse = "Please select an item first to ask questions about it.";
          nextFlow = 'show_results';
        }
        break;
      case 'train_status_pnr':
        setTrainStatusPNR(userMessage.text);
        botResponse = "Checking status for PNR: " + userMessage.text + "...";
        nextFlow = 'train_status_result';
        setIsTyping(true);
        fetch('/api/train-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pnr: userMessage.text })
        })
          .then(res => res.json())
          .then(data => {
            setMessages(prev => [...prev, {
              id: (Date.now() + 2).toString(),
              text: data.status
                ? `Train Status for PNR ${userMessage.text}:\n${data.status}`
                : `No status found for PNR ${userMessage.text}.`,
              isBot: true,
              timestamp: new Date()
            }]);
            setIsTyping(false);
          })
          .catch(() => {
            setMessages(prev => [...prev, {
              id: (Date.now() + 2).toString(),
              text: 'Could not fetch train status.',
              isBot: true,
              timestamp: new Date()
            }]);
            setIsTyping(false);
          });
        return;
      case 'query':
      default:
        // Fallback-first approach: try to satisfy common intents locally
        {
          const st = findStationFromText(userMessage.text);
          const cat = inferCategory(userMessage.text);
          if (st && cat) {
            setIsTyping(true);
            setDiscover(prev => ({ ...prev, selectedStation: st, selectedCategory: cat }));
            const run = async () => {
              try {
                if (cat === 'hotels') {
                  const hotels = await HotelService.getNearbyHotels(st.lat, st.lon);
                  setDiscover(prev => ({
                    ...prev,
                    results: {
                      hotels,
                      attractions: prev.results?.attractions ?? []
                    }
                  }));
                  setMessages(prev => [...prev, { id: (Date.now()+2).toString(), text: `Found ${hotels.length} hotels near ${st.name}.`, isBot: true, timestamp: new Date() }]);
                } else {
                  const attractions = await TouristSpotService.getNearbyAttractions(st.lat, st.lon);
                  setDiscover(prev => ({
                    ...prev,
                    results: {
                      hotels: prev.results?.hotels ?? [],
                      attractions
                    }
                  }));
                  setMessages(prev => [...prev, { id: (Date.now()+2).toString(), text: `Found ${attractions.length} attractions near ${st.name}.`, isBot: true, timestamp: new Date() }]);
                }
                setFlow('show_results');
              } finally {
                setIsTyping(false);
              }
            };
            run();
            return;
          }
        }
        // Otherwise, try backend; if it fails, provide canned guidance
        if (!CHATBOT_API) {
          // No backend configured; answer locally
          setMessages(prev => [...prev, {
            id: (Date.now() + 2).toString(),
            text: generateBotResponse(userMessage.text),
            isBot: true,
            timestamp: new Date()
          }]);
          return;
        }
        setIsTyping(true);
        fetch(`${CHATBOT_API}/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userMessage.text })
        })
          .then(async res => {
            if (!res.ok) throw new Error(String(res.status));
            return res.json();
          })
          .then(data => {
            setMessages(prev => [...prev, {
              id: (Date.now() + 2).toString(),
              text: data.answer || generateBotResponse(userMessage.text),
              isBot: true,
              timestamp: new Date()
            }]);
            setIsTyping(false);
          })
          .catch(() => {
            setMessages(prev => [...prev, {
              id: (Date.now() + 2).toString(),
              text: generateBotResponse(userMessage.text),
              isBot: true,
              timestamp: new Date()
            }]);
            setIsTyping(false);
          });
        return;
    }
    setDiscover(updateDiscover);
    setFlow(nextFlow);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      isBot: true,
      timestamp: new Date()
    }]);
    setIsTyping(false);
    // Redirect logic removed - no booking functionality
  }, 1200);
};

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // discourage booking, focus on discovery
    if (input.includes("book") || input.includes("ticket")) {
      return "I no longer book tickets. I can help you plan your trip: ask me about cities, hotels, or places to visit (e.g., 'Bengaluru hotels', 'Mumbai places').";
    }
    
    if (input.includes("train status") || input.includes("delay")) {
      return "I can help you check train status! Please provide:\n\n1. Train number (e.g., EXP101)\n- OR -\n2. Route details (departure and destination stations)\n\nI'll give you real-time information about delays, platform numbers, and expected arrival times.";
    }
    
    if (input.includes("cancel")) {
      return "To cancel your booking, I'll need your PNR number. You can find this in your booking confirmation email or ticket. Please note that cancellation charges may apply depending on how close to departure time you are canceling.";
    }
    
    if (input.includes("refund")) {
      return "Refunds are processed based on our cancellation policy:\n\n• More than 24 hours before departure: 90% refund\n• 12-24 hours before: 75% refund\n• 4-12 hours before: 50% refund\n• Less than 4 hours: No refund\n\nRefunds typically take 5-7 business days to process.";
    }
    
    if (input.includes("platform") || input.includes("station")) {
      return "I can help you find platform information! Please provide your train number or departure/arrival stations. Platform assignments are usually confirmed 2 hours before departure.";
    }
    
    return "I can help you plan trips: find destinations, hotels, attractions, or train status. Try 'Bengaluru hotels', 'Mumbai attractions', or 'Check train status'.";
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      // Stop speech recognition
    } else {
      setIsListening(true);
      // Start speech recognition (would require Web Speech API implementation)
      setTimeout(() => {
        setIsListening(false);
        setInputText("I want to book a ticket from New York to Boston");
      }, 3000);
    }
  };


  const handleStationSelect = async (stationId: string) => {
    const selectedStation = stations.find(s => s.id === stationId);
    if (!selectedStation) return;

    setDiscover(prev => ({ ...prev, selectedStation }));
    setFlow('category_selection');
    
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      text: `Selected: ${selectedStation.name}`, 
      isBot: false, 
      timestamp: new Date() 
    }]);
  };

  const handleCategorySelect = async (category: 'hotels' | 'attractions') => {
    if (!discover.selectedStation) return;

    setDiscover(prev => ({ ...prev, selectedCategory: category }));
    setFlow('show_results');
    
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      text: `Selected: ${category === 'hotels' ? 'Recommended Hotels' : 'Tourist Attractions'}`, 
      isBot: false, 
      timestamp: new Date() 
    }]);

    // Fetch data based on category
    setIsTyping(true);
    try {
      if (category === 'hotels') {
        const hotels = await HotelService.getNearbyHotels(
          discover.selectedStation.lat, 
          discover.selectedStation.lon
        );
        setDiscover(prev => ({ 
          ...prev, 
          results: { 
            ...prev.results, 
            hotels 
          } 
        }));
      } else {
        const attractions = await TouristSpotService.getNearbyAttractions(
          discover.selectedStation.lat, 
          discover.selectedStation.lon
        );
        setDiscover(prev => ({ 
          ...prev, 
          results: { 
            ...prev.results, 
            attractions 
          } 
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleItemSelect = (item: TouristSpot | Hotel) => {
    setDiscover(prev => ({ ...prev, selectedItem: item }));
    setFlow('item_details');
    
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      text: `Selected: ${item.name}`, 
      isBot: false, 
      timestamp: new Date() 
    }]);

    // Add bot message with item details and suggestions
    setTimeout(() => {
      const itemInfo = discover.selectedCategory === 'hotels' 
        ? `Great choice! ${item.name} is a ${(item as Hotel).rating}-star hotel located ${item.distance} from ${discover.selectedStation?.name} station.`
        : `Excellent! ${item.name} is a ${(item as TouristSpot).type} with a ${item.rating}-star rating, located ${item.distance} from ${discover.selectedStation?.name} station.`;
      
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: `${itemInfo}\n\nYou can ask me specific questions about this ${discover.selectedCategory === 'hotels' ? 'hotel' : 'attraction'}. Try the suggestions below or ask your own question!`, 
        isBot: true, 
        timestamp: new Date() 
      }]);
    }, 500);
  };

  const handleOptionClick = (option: string) => {
    switch (option) {
      case 'book_ticket':
        setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Trip Discovery', isBot: false, timestamp: new Date() }]);
        setFlow('station_selection');
        break;
      case 'ask_query':
        setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Ask a Query', isBot: false, timestamp: new Date() }]);
        setFlow('query');
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: 'What would you like to ask?', isBot: true, timestamp: new Date() }]);
          setIsTyping(false);
        }, 800);
        break;
      case 'train_status':
        setMessages(prev => [...prev, { id: Date.now().toString(), text: 'Check Train Status', isBot: false, timestamp: new Date() }]);
        setFlow('train_status_pnr');
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: 'Please enter your PNR number:', isBot: true, timestamp: new Date() }]);
          setIsTyping(false);
        }, 800);
        break;
      default:
        break;
    }
  };

  return (
    <Card className="max-w-xl w-full h-[1400px] max-h-[95vh] flex flex-col mx-auto shadow-2xl border border-gray-200 bg-white">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          TrackWise Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.isBot ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
                }`}>
                  {message.isBot ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-3 rounded-lg break-words ${
                  message.isBot 
                    ? 'bg-gray-100 text-gray-900 border border-gray-200' 
                    : 'bg-blue-600 text-white border border-blue-500'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Options Area */}
        {flow === 'select_option' && (
          <div className="border-t p-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleOptionClick('book_ticket')}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  Discover Trip
                </Button>
                <Button 
                  onClick={() => handleOptionClick('ask_query')}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  Ask Query
                </Button>
                <Button 
                  onClick={() => handleOptionClick('train_status')}
                  className="bg-orange-600 hover:bg-orange-700 flex-1"
                >
                  Train Status
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-lg font-bold text-blue-600">25</div>
                  <div className="text-xs text-gray-600">Stations</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-lg font-bold text-green-600">25km</div>
                  <div className="text-xs text-gray-600">Search Radius</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="text-lg font-bold text-purple-600">∞</div>
                  <div className="text-xs text-gray-600">Attractions</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Station Selection */}
        {flow === 'station_selection' && (
          <div className="border-t p-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select the city which you are interested in:</p>
              <Select onValueChange={handleStationSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a railway station..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id}>
                      {station.name} ({station.state})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Category Selection */}
        {flow === 'category_selection' && discover.selectedStation && (
          <div className="border-t p-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                What would you like to explore near {discover.selectedStation.name}?
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleCategorySelect('attractions')}
                  className="bg-green-600 hover:bg-green-700 flex-1"
                >
                  Tourist Attractions
                </Button>
                <Button
                  onClick={() => handleCategorySelect('hotels')}
                  className="bg-orange-600 hover:bg-orange-700 flex-1"
                >
                  Recommended Hotels
                </Button>
              </div>

              {/* Smart Suggestions */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Quick suggestions:</p>
                <div className="space-y-1">
                  {getSmartSuggestions().map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start text-xs h-auto py-2 px-3"
                      onClick={() => {
                        setInputText(suggestion);
                        handleSendMessage();
                      }}
                    >
                      <Info className="h-3 w-3 mr-2 text-blue-500" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {flow === 'show_results' && discover.results && (
          <div className="border-t p-4 max-h-[700px] overflow-y-auto">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-800">
                {discover.selectedCategory === 'attractions' ? 'Tourist Attractions' : 'Recommended Hotels'} near {discover.selectedStation?.name}
              </h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFlow('category_selection')}
                >
                  Back
                </Button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-600">Max Distance (km)</label>
                    <Select onValueChange={(value) => setDiscover(prev => ({
                      ...prev,
                      filters: { ...prev.filters, maxDistance: parseInt(value) }
                    }))}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="10">10 km</SelectItem>
                        <SelectItem value="15">15 km</SelectItem>
                        <SelectItem value="25">25 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Min Rating</label>
                    <Select onValueChange={(value) => setDiscover(prev => ({
                      ...prev,
                      filters: { ...prev.filters, minRating: parseFloat(value) }
                    }))}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3.0">3.0+</SelectItem>
                        <SelectItem value="3.5">3.5+</SelectItem>
                        <SelectItem value="4.0">4.0+</SelectItem>
                        <SelectItem value="4.5">4.5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {discover.selectedCategory === 'hotels' && (
                  <div>
                    <label className="text-xs text-gray-600">Max Price (₹)</label>
                    <Select onValueChange={(value) => setDiscover(prev => ({
                      ...prev,
                      filters: { ...prev.filters, maxPrice: parseInt(value) }
                    }))}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5000">₹5,000</SelectItem>
                        <SelectItem value="10000">₹10,000</SelectItem>
                        <SelectItem value="15000">₹15,000</SelectItem>
                        <SelectItem value="20000">₹20,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDiscover(prev => ({ ...prev, filters: undefined }))}
                  className="w-full text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              </div>
            )}

            {discover.selectedCategory === 'attractions' && discover.results.attractions && (
              <div className="space-y-3">
                {filterResults(discover.results.attractions, 'attractions').map((attraction, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleItemSelect(attraction)}>
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{attraction.name}</h5>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm">{attraction.rating}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(`${attraction.name}-${index}`, 'attractions');
                          }}
                          className="p-1 h-6 w-6"
                        >
                          <Heart className={`h-3 w-3 ${isFavorite(`${attraction.name}-${index}`, 'attractions') ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{(attraction as TouristSpot).type}</p>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">{(attraction as TouristSpot).description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{attraction.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{(attraction as TouristSpot).openHours}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open((attraction as TouristSpot).googleMapsLink, '_blank');
                        }}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareItem(attraction, 'attractions');
                        }}
                        className="px-3"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {discover.selectedCategory === 'hotels' && discover.results.hotels && (
              <div className="space-y-3">
                {filterResults(discover.results.hotels, 'hotels').map((hotel, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleItemSelect(hotel)}>
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{hotel.name}</h5>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm">{hotel.rating}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(`${hotel.name}-${index}`, 'hotels');
                          }}
                          className="p-1 h-6 w-6"
                        >
                          <Heart className={`h-3 w-3 ${isFavorite(`${hotel.name}-${index}`, 'hotels') ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-green-600 font-medium mb-2">{(hotel as Hotel).price}</p>
                    <p className="text-xs text-gray-500 mb-2">{(hotel as Hotel).address}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{hotel.distance}</span>
                      </div>
                      {(hotel as Hotel).phone !== '+91-XXXX-XXXXXX' && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{(hotel as Hotel).phone}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(hotel as Hotel).amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open((hotel as Hotel).website, '_blank');
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Website
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          shareItem(hotel, 'hotels');
                        }}
                        className="px-3"
                      >
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Item Details Section */}
        {flow === 'item_details' && discover.selectedItem && (
          <div className="border-t p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">
                  Ask about {discover.selectedItem.name}
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFlow('show_results')}
                >
                  Back to Results
                </Button>
              </div>
              
              {/* Item Summary */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{discover.selectedItem.name}</h5>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{discover.selectedItem.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{discover.selectedItem.distance}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {discover.selectedCategory === 'hotels' ? 'Hotel' : 'Attraction'}
                  </div>
                </div>
              </div>
              
              {/* Smart Suggestions */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Quick questions:</p>
                <div className="space-y-1">
                  {getItemSpecificSuggestions().map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start text-xs h-auto py-2 px-3"
                      onClick={() => {
                        setInputText(suggestion);
                        handleSendMessage();
                      }}
                    >
                      <Info className="h-3 w-3 mr-2 text-blue-500" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Input Area */}
        {flow !== 'select_option' && (
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVoiceInput}
                className={isListening ? 'bg-red-100 border-red-300' : ''}
              >
                {isListening ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input
                placeholder="Type your message or use voice..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!inputText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isListening && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                Listening... Speak now
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatBot;

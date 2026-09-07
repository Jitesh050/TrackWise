import React, { useState, useEffect } from 'react';
import { MENU_ITEMS } from '../data/foodMenu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Utensils, Clock, ShoppingCart, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from "sonner";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  id: string;
  ticketNumber: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  estimatedTime: string;
  createdAt: string;
}

const FoodOrdering = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ticketNumber, setTicketNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState("menu");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    // Simulate network delay
    setTimeout(() => {
      setMenu(MENU_ITEMS);
      setLoading(false);
    }, 500);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart(prev => {
      return prev.map(i => {
        if (i.id === itemId) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : i;
        }
        return i;
      });
    });
  };

  const placeOrder = async () => {
    if (!ticketNumber) {
      toast.error("Please enter your ticket number");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Simulate backend order processing
    setLoading(true); // Re-using loading state or we could add a specific submitting state
    
    setTimeout(() => {
      // Calculate total amount
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Calculate estimated delivery time (15-30 mins mock)
      const baseTime = 15;
      const randomVariance = Math.floor(Math.random() * 15);
      const estimatedTime = `${baseTime + randomVariance} mins`;

      const newOrder: Order = {
        id: Date.now().toString(),
        ticketNumber,
        items: [...cart],
        totalAmount: total,
        status: 'Preparing',
        estimatedTime,
        createdAt: new Date().toISOString()
      };

      setOrderPlaced(newOrder);
      setCart([]);
      setActiveTab("status");
      toast.success("Order placed successfully!");
      setLoading(false);
    }, 1500);
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const categories = Array.from(new Set(menu.map(item => item.category)));

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Utensils className="h-8 w-8 text-primary" />
            On-Board Dining
          </h1>
          <p className="text-muted-foreground mt-1">Order fresh food directly to your seat</p>
        </div>
        {orderPlaced && (
           <Card className="mt-4 md:mt-0 bg-green-50 border-green-200">
             <CardContent className="p-4 flex items-center gap-4">
               <div className="bg-green-100 p-2 rounded-full">
                 <Clock className="h-6 w-6 text-green-600" />
               </div>
               <div>
                 <p className="text-sm font-medium text-green-800">Estimated Delivery</p>
                 <p className="text-2xl font-bold text-green-700">{orderPlaced.estimatedTime}</p>
               </div>
             </CardContent>
           </Card>
        )}
      </div>

      <Tabs defaultValue="menu" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="cart" className="relative">
            Cart
            {cart.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-6">
          {loading ? (
            <div className="text-center py-12">Loading menu...</div>
          ) : (
            categories.map(category => (
              <div key={category} className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menu.filter(item => item.category === category).map(item => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-48 bg-gray-100 relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Food';
                          }}
                        />
                        <Badge className="absolute top-2 right-2 bg-white/90 text-black hover:bg-white">
                          ₹{item.price}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0">
                        <Button onClick={() => addToCart(item)} className="w-full">
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="cart">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Order</CardTitle>
                  <CardDescription>Review items before placing order</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      Your cart is empty
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">₹{item.price} x {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border rounded-md">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, 1)}>+</Button>
                          </div>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeFromCart(item.id)}>
                            <span className="sr-only">Remove</span>
                            ×
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket">Ticket Number / PNR</Label>
                    <Input 
                      id="ticket" 
                      placeholder="Enter your ticket number" 
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Required to locate your seat</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Charge</span>
                    <span>₹{cart.length > 0 ? 20 : 0}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{cart.length > 0 ? totalAmount + 20 : 0}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" onClick={placeOrder} disabled={cart.length === 0 || !ticketNumber}>
                    Place Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="status">
           {orderPlaced ? (
             <div className="max-w-2xl mx-auto text-center space-y-6 py-12">
               <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                 <CheckCircle className="h-12 w-12 text-green-600" />
               </div>
               <div>
                 <h2 className="text-3xl font-bold text-green-800">Order Confirmed!</h2>
                 <p className="text-muted-foreground mt-2">Your food is being prepared and will be delivered to your seat.</p>
               </div>
               
               <Card className="text-left">
                 <CardHeader>
                   <CardTitle>Order Details #{orderPlaced.id.slice(-6)}</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <p className="text-sm text-muted-foreground">Ticket Number</p>
                       <p className="font-medium">{orderPlaced.ticketNumber}</p>
                     </div>
                     <div>
                       <p className="text-sm text-muted-foreground">Estimated Time</p>
                       <p className="font-medium text-green-600">{orderPlaced.estimatedTime}</p>
                     </div>
                   </div>
                   <Separator />
                   <div className="space-y-2">
                     {orderPlaced.items.map((item, idx) => (
                       <div key={idx} className="flex justify-between text-sm">
                         <span>{item.quantity}x {item.name}</span>
                         <span>₹{item.price * item.quantity}</span>
                       </div>
                     ))}
                   </div>
                   <Separator />
                   <div className="flex justify-between font-bold">
                     <span>Total Paid</span>
                     <span>₹{orderPlaced.totalAmount + 20}</span>
                   </div>
                 </CardContent>
                 <CardFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => {
                      setOrderPlaced(null);
                      setTicketNumber('');
                      setActiveTab('menu');
                    }}>Place Another Order</Button>
                 </CardFooter>
               </Card>
             </div>
           ) : (
             <div className="text-center py-12">
               <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
               <p>No active order found. Please place an order first.</p>
               <Button variant="link" onClick={() => setActiveTab('menu')}>Go to Menu</Button>
             </div>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodOrdering;

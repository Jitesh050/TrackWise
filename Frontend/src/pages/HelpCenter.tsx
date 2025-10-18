import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, MessageCircle, Phone, Mail, HelpCircle, Send } from "lucide-react";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{id: string, message: string, sender: 'user' | 'bot', timestamp: Date}>>([
    {
      id: '1',
      message: "Hello! I'm TrackWise Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const faqs = [
    {
      question: "How do I book a ticket online?",
      answer: "To book a ticket online, go to the 'Book Ticket' section, enter your journey details including origin, destination, date, and number of passengers. Select your preferred train and class, then proceed to seat selection and payment."
    },
    {
      question: "Can I cancel my ticket?",
      answer: "Yes, you can cancel your ticket through the 'User Portal' under 'My Tickets'. Cancellation charges may apply depending on the time of cancellation. Full refund is available if cancelled 24 hours before departure."
    },
    {
      question: "How do I check train status?",
      answer: "Visit the 'Train Status' page and search by train number, name, or station. You'll get real-time updates on delays, platform changes, and current location of your train."
    },
    {
      question: "What if I miss my train?",
      answer: "If you miss your train, you can either reschedule your ticket for the next available train (subject to availability and charges) or request a refund. Contact our customer service for assistance."
    },
    {
      question: "How do I download my e-ticket?",
      answer: "After successful booking, your e-ticket will be available in the 'User Portal' under 'My Tickets'. You can download it as a PDF or save the QR code to your phone for contactless travel."
    },
    {
      question: "What are the baggage limits?",
      answer: "Economy class: 20kg, Business class: 30kg, First class: 40kg. Additional charges apply for excess baggage. Prohibited items include flammable substances, weapons, and hazardous materials."
    }
  ];

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      message: chatMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        message: "Thank you for your question! I'm processing your request. For complex queries, please contact our customer service team.",
        sender: 'bot' as const,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botResponse]);
    }, 1000);

    setChatMessage("");
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto space-y-8 pb-10 animate-enter">
      <header>
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-gray-600">Find answers to your questions or get in touch with our support team</p>
      </header>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="chatbot">Live Chat</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>

        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle size={20} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find quick answers to common questions about booking, cancellations, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  placeholder="Search FAQs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFaqs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">No FAQs match your search. Try different keywords or contact our support team.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chatbot">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle size={20} />
                Live Chat Assistant
              </CardTitle>
              <CardDescription>
                Chat with our AI assistant for instant help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 h-80 overflow-y-auto space-y-3">
                  {chatHistory.map((chat) => (
                    <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs p-3 rounded-lg ${
                        chat.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{chat.message}</p>
                        <p className={`text-xs mt-1 ${
                          chat.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {chat.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send size={16} />
                  </Button>
                </form>

                <p className="text-xs text-gray-500 text-center">
                  Our AI assistant is available 24/7. For complex issues, please contact human support.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Get in touch with our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Customer Service</p>
                    <p className="text-sm text-gray-600">1-800-TRACK-WI (1-800-872-2594)</p>
                    <p className="text-xs text-gray-600">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@trackwise.com</p>
                    <p className="text-xs text-gray-600">Response within 24 hours</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium mb-2">Emergency Contact</h4>
                  <p className="text-sm text-gray-600 mb-1">For urgent safety concerns or emergencies:</p>
                  <p className="font-medium text-red-600">Emergency Hotline: 911</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>We'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message</label>
                    <Textarea 
                      placeholder="Describe your issue or question..."
                      className="h-24"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpCenter;
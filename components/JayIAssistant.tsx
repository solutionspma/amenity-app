'use client';

import { useState, useRef, useEffect } from 'react';
import { useElements } from '@/contexts/ElementContext';
import { useBackdrop } from '@/contexts/BackdropContext';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface JayIAssistantProps {
  isSubscribed?: boolean;
  onSubscribe?: () => void;
  context?: 'visual-editor' | 'general';
  selectedComponent?: string | null;
  activePage?: string;
}

export default function JayIAssistant({ 
  isSubscribed = false, 
  onSubscribe, 
  context = 'general',
  selectedComponent = null,
  activePage = 'homepage'
}: JayIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { applyToComponent } = useElements();
  const { updatePageBackdrop } = useBackdrop();
  
  const getInitialMessage = () => {
    if (context === 'visual-editor') {
      return "🎨 Hey designer! I'm Jay-I, your AI creative director. I can help you style components, choose color schemes, create layouts, and optimize your design for faith-based engagement. What would you like to design today?";
    }
    return "👋 Hey there! I'm Jay-I, your AI creative director and advertisement specialist. I can help you craft compelling copy, design strategies, and creative campaigns that convert. What would you like to create today?";
  };
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: getInitialMessage(),
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response (in production, this would call your AI API)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getJayIResponse(userMessage.content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const getVisualEditorResponse = (lowerInput: string): string => {
    // Quick style suggestions
    if (lowerInput.includes('make') && (lowerInput.includes('blue') || lowerInput.includes('navy'))) {
      if (selectedComponent) {
        applyToComponent(selectedComponent, { backgroundColor: '#1e40af', color: '#ffffff' }, activePage);
        return "✨ Applied navy blue styling to your " + selectedComponent + " component! The deep blue conveys trust and stability - perfect for faith-based platforms.";
      }
      return "🎨 Great choice! Navy blue conveys trust and wisdom. Select a component first, then ask me to apply the styling.";
    }
    
    if (lowerInput.includes('make') && (lowerInput.includes('gold') || lowerInput.includes('yellow'))) {
      if (selectedComponent) {
        applyToComponent(selectedComponent, { backgroundColor: '#f59e0b', color: '#000000' }, activePage);
        return "✨ Applied golden styling to your " + selectedComponent + " component! Gold represents divine blessing and premium quality.";
      }
      return "🎨 Excellent! Gold symbolizes divinity and prosperity. Select a component to apply this styling.";
    }
    
    if (lowerInput.includes('shadow') || lowerInput.includes('glow')) {
      if (selectedComponent) {
        applyToComponent(selectedComponent, { boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 0 0 1px rgba(59,130,246,0.1)' }, activePage);
        return "✨ Added a subtle shadow with divine glow to your " + selectedComponent + "! This creates depth and draws attention.";
      }
      return "🌟 Shadows create visual hierarchy and depth. Select a component to apply beautiful shadow effects.";
    }
    
    if (lowerInput.includes('rounded') || lowerInput.includes('border')) {
      if (selectedComponent) {
        applyToComponent(selectedComponent, { borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }, activePage);
        return "✨ Applied rounded corners and subtle borders to your " + selectedComponent + "! This creates a modern, approachable feel.";
      }
      return "🔄 Rounded corners feel more welcoming and modern. Select a component to apply this styling.";
    }
    
    // Background suggestions
    if (lowerInput.includes('background') || lowerInput.includes('backdrop')) {
      const suggestions = [
        "🎨 **Background Design Ideas:**\n\n• **Gradient Heaven**: Deep purple to navy blue\n• **Sunrise Blessing**: Warm orange to golden yellow\n• **Pure Light**: Soft white with subtle texture\n• **Divine Night**: Black with subtle star pattern\n\nType 'apply [name]' to use any of these!",
      ];
      
      if (lowerInput.includes('gradient')) {
        updatePageBackdrop(activePage, {
          type: 'gradient',
          primary: '#581c87',
          secondary: '#1e3a8a',
          overlay: 20
        });
        return "✨ Applied divine gradient background to " + activePage + " page! The purple-to-blue represents spiritual depth and trust.";
      }
      
      return suggestions[0];
    }
    
    // Component-specific advice
    if (selectedComponent) {
      return `🎨 **Styling ${selectedComponent.charAt(0).toUpperCase() + selectedComponent.slice(1)} Component**\n\nI can help you:\n• Change colors (try "make it blue" or "apply gold")\n• Add shadows ("add glow" or "create depth")\n• Adjust spacing ("add padding" or "increase margin")\n• Create borders ("make it rounded" or "add border")\n\nWhat would you like to do with your ${selectedComponent}?`;
    }
    
    // General design advice
    if (lowerInput.includes('color') || lowerInput.includes('palette')) {
      return "🎨 **Faith-Based Color Palette Recommendations:**\n\n**Primary Colors:**\n• Deep Navy (#1e40af) - Trust, stability\n• Royal Purple (#7c3aed) - Spirituality, wisdom\n• Golden Yellow (#f59e0b) - Divine light, joy\n\n**Accent Colors:**\n• Soft White (#f8fafc) - Purity, new beginnings\n• Warm Gray (#6b7280) - Balance, neutrality\n• Forest Green (#059669) - Growth, life\n\nSelect a component and ask me to apply any of these colors!";
    }
    
    return "🎨 I'm your design assistant! I can help you style components, choose colors, create layouts, and optimize for engagement. Try saying:\n• 'Make the navigation blue'\n• 'Add shadow to the logo'\n• 'Change the background'\n• 'What colors work best?'\n\nWhat would you like to design?";
  };

  const getJayIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Design assistance for visual editor context
    if (context === 'visual-editor') {
      return getVisualEditorResponse(lowerInput);
    }
    
    if (lowerInput.includes('ad') || lowerInput.includes('advertisement') || lowerInput.includes('marketing')) {
      return "🎯 **Advertisement Strategy Incoming!** \n\nFor faith-based advertising, I recommend focusing on:\n\n• **Emotional Connection**: Use testimonials and transformation stories\n• **Community Values**: Highlight fellowship and shared beliefs\n• **Call to Action**: 'Join Our Growing Faith Community' works better than generic CTAs\n• **Visual Elements**: Warm, welcoming imagery with diverse representation\n\nWhat specific product or service are you advertising? I can craft targeted copy that resonates with your audience.";
    }
    
    if (lowerInput.includes('copy') || lowerInput.includes('headline') || lowerInput.includes('text')) {
      return "✍️ **Copy Creation Mode Activated!** \n\nI specialize in high-converting copy that speaks to the heart. Here are some proven formulas:\n\n**For Headlines:**\n• 'Transform Your [Problem] Into [Solution] Through Faith'\n• 'Join 10,000+ Believers Who Have Already [Achieved Result]'\n• 'The Faith-Based Solution to [Pain Point]'\n\n**For Body Copy:**\n• Start with empathy (acknowledge their struggle)\n• Present the solution (your product/service)\n• Show proof (testimonials, results)\n• Clear call to action\n\nWhat's the specific piece you need copy for?";
    }
    
    if (lowerInput.includes('design') || lowerInput.includes('layout') || lowerInput.includes('visual')) {
      return "🎨 **Design Strategy Engaged!** \n\nFor faith-based platforms, visual hierarchy is crucial:\n\n**Color Psychology:**\n• Deep blues: Trust, stability, wisdom\n• Warm golds: Divine, premium, enlightenment\n• Pure whites: Cleanliness, new beginnings\n• Soft purples: Spirituality, transformation\n\n**Layout Principles:**\n• F-pattern reading flow\n• White space for 'breathing room'\n• Central focus points for key messages\n• Mobile-first responsive design\n\nAre you working on a specific page or element? I can provide detailed design recommendations.";
    }
    
    if (lowerInput.includes('conversion') || lowerInput.includes('sales') || lowerInput.includes('funnel')) {
      return "💰 **Conversion Optimization Expert Here!** \n\nFaith-based conversions require trust-building:\n\n**The FAITH Funnel:**\n• **F**ind (targeted traffic)\n• **A**ttract (compelling content)\n• **I**nspire (transformation stories)\n• **T**rust (social proof, testimonials)\n• **H**andoff (clear, non-pushy CTA)\n\n**Key Metrics to Track:**\n• Engagement time on testimonial videos\n• Email signup rates from free resources\n• Community participation before purchase\n• Retention rates (very important for faith communities)\n\nWhat's your current conversion challenge?";
    }
    
    return `🤖 **Jay-I Analysis:** \n\nI understand you're asking about "${userInput}". As your creative AI specialist, I can help with:\n\n• 📢 **Advertisement Copy** - High-converting headlines and body text\n• 🎨 **Design Strategy** - Visual hierarchy and user experience\n• 💰 **Conversion Optimization** - Funnels that build trust and convert\n• 📊 **Campaign Analytics** - Performance tracking and optimization\n• ✨ **Creative Direction** - Brand voice and messaging strategy\n\nCould you be more specific about what you'd like to create or improve? The more details you give me, the better I can help you craft something that truly resonates with your faith community!`;
  };

  if (!isSubscribed) {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg">
        <div className="text-white text-sm font-medium mb-2">🤖 Jay-I AI Assistant</div>
        <div className="text-purple-100 text-xs mb-3">
          Premium AI assistant specializing in faith-based advertisement copy, creative direction, and conversion optimization.
        </div>
        <button 
          onClick={onSubscribe}
          className="w-full px-4 py-2 bg-white/20 text-white text-xs font-medium rounded hover:bg-white/30 transition-colors"
        >
          🚀 Subscribe to Jay-I Pro
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Jay-I Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 z-50 ${
          isOpen 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
        }`}
      >
        {isOpen ? (
          <span className="text-white text-xl">✕</span>
        ) : (
          <span className="text-white text-xl">🤖</span>
        )}
      </button>

      {/* Jay-I Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-40 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Jay-I Assistant</div>
                  <div className="text-purple-100 text-xs">AI Creative Director</div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-purple-100 text-xs">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Jay-I about ads, copy, design..."
                className="flex-1 px-3 py-2 bg-gray-800 text-white rounded text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-1 mt-2">
              {['Ad Copy', 'Headlines', 'Design Tips'].map((action) => (
                <button
                  key={action}
                  onClick={() => setInputValue(`Help me with ${action.toLowerCase()}`)}
                  className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded hover:bg-gray-700 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { aiTranslationService, SOUTH_AFRICAN_LANGUAGES } from '../../services/AITranslationService';
import { Product } from '../../types';

interface VoiceAssistantProps {
  preferredLanguage: string;
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

export function VoiceAssistant({ preferredLanguage, products, onAddToCart }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [feedback, setFeedback] = useState('');

  const startListening = () => {
    setIsListening(true);
    setFeedback(`🎶 Listening in ${preferredLanguage}... Speak now!`);
    
    aiTranslationService.startVoiceRecognition(preferredLanguage, (text) => {
      setIsListening(false);
      setTranscript(text);
      
      if (text) {
        processVoiceCommand(text);
      } else {
        setFeedback('❌ No speech detected. Please try again.');
      }
    });
  };

  const processVoiceCommand = (command: string) => {
    setFeedback('📃 Processing your command...');
    
    // Translate and process command
    const result = aiTranslationService.translateVoiceCommand(command, preferredLanguage);
    setTranslation(result.translatedText);
    
    if (result.intent === 'order' && result.items.length > 0) {
      let addedItems = 0;
      result.items.forEach(itemName => {
        const product = products.find(p => p.name === itemName);
        if (product) {
          onAddToCart(product, 1);
          addedItems++;
        }
      });
      
      if (addedItems > 0) {
        const responseText = `✅ Added ${addedItems} item(s) to your cart: ${result.items.join(', ')}`;
        setFeedback(responseText);
        aiTranslationService.speak(
          aiTranslationService.translate(responseText, 'en', preferredLanguage),
          preferredLanguage
        );
      } else {
        setFeedback('❌ Items not found in stock');
      }
    } else {
      setFeedback('❓ Command not recognized. Try saying "Order bread and milk"');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl mb-4">🎶 AI Voice Assistant</h2>
      <p className="text-gray-600 mb-6">
        Speak in any of South Africa's 11 official languages
      </p>

      {/* Language Selection */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
        <label className="block text-sm mb-2 text-gray-700">
          Currently listening in: <strong>{preferredLanguage}</strong>
        </label>
        <p className="text-xs text-gray-600">
          Change your language preference in your profile settings
        </p>
      </div>

      {/* Voice Control Button */}
      <button
        onClick={startListening}
        disabled={isListening}
        className={`w-full py-6 rounded-xl text-white text-xl transition-all transform ${
          isListening
            ? 'bg-red-600 animate-pulse'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
        }`}
      >
        {isListening ? (
          <>
            <span className="text-3xl mb-2 block">🔴</span>
            <span>LISTENING...</span>
          </>
        ) : (
          <>
            <span className="text-3xl mb-2 block">🎶</span>
            <span>Click & Speak Your Order</span>
          </>
        )}
      </button>

      {/* Feedback Display */}
      {feedback && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm mb-2 text-gray-700">AI Response:</h3>
          <p className="text-gray-800">{feedback}</p>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm mb-2 text-blue-700">You said:</h3>
          <p className="text-gray-800">{transcript}</p>
          {translation && transcript !== translation && (
            <>
              <h3 className="text-sm mt-3 mb-2 text-blue-700">Translation:</h3>
              <p className="text-gray-800">{translation}</p>
            </>
          )}
        </div>
      )}

      {/* Example Commands */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h3 className="text-sm mb-3 text-green-800">Example Voice Commands:</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>🇬🇧 English: "Order bread and milk"</p>
          <p>🇿🇦 isiZulu: "Ngifuna isinkwa nobisi"</p>
          <p>🇿🇦 isiXhosa: "Ndifuna isonka nobisi"</p>
          <p>🇿🇦 Afrikaans: "Bestel brood en melk"</p>
          <p>🇿🇦 Sepedi: "Ke nyaka senkgwe le maswi"</p>
          <p className="text-xs text-gray-500 mt-2">
            * AI will understand and translate from any of the 11 official languages
          </p>
        </div>
      </div>

      {/* Supported Languages */}
      <div className="mt-6">
        <h3 className="text-sm mb-3 text-gray-700">Supported Languages:</h3>
        <div className="flex flex-wrap gap-2">
          {SOUTH_AFRICAN_LANGUAGES.map(lang => (
            <span
              key={lang.code}
              className={`px-3 py-1 rounded-full text-xs ${
                lang.name === preferredLanguage
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {lang.nativeName}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}





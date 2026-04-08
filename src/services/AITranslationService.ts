// AI Translation Service for 11 Official South African Languages
export const SOUTH_AFRICAN_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zu', name: 'isiZulu', nativeName: 'isiZulu' },
  { code: 'xh', name: 'isiXhosa', nativeName: 'isiXhosa' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'nso', name: 'Sepedi', nativeName: 'Sepedi' },
  { code: 'tn', name: 'Setswana', nativeName: 'Setswana' },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho' },
  { code: 'ts', name: 'Xitsonga', nativeName: 'Xitsonga' },
  { code: 'ss', name: 'siSwati', nativeName: 'siSwati' },
  { code: 've', name: 'Tshivenda', nativeName: 'Tshivenda' },
  { code: 'nr', name: 'isiNdebele', nativeName: 'isiNdebele' }
];

export class AITranslationService {
  // Simulated product descriptions in multiple languages
  private productDescriptions: Record<string, Record<string, string>> = {
    'Bread': {
      'en': 'Fresh baked bread, soft and fluffy, perfect for sandwiches and breakfast',
      'zu': 'Isinkwa esisha esivuthiwe, esithambile futhi esiphuphuma, siphelele ukwenza ama-sandwich nesidlo sasekuseni',
      'xh': 'Isonka esifreshe esibhakiweyo, esithambileyo nesifuthunyeziweyo, esilungele iisandwich nesidlo sakusasa',
      'af': 'Vars gebakte brood, sag en pluisig, perfek vir toebroodjies en ontbyt'
    },
    'Milk 1L': {
      'en': 'Fresh full cream milk, 1 liter, perfect for tea, coffee, and cooking',
      'zu': 'Ubisi olunobulungisa, uhlamvu oyi-1, oluhle ukwenza itiye, ikhofi nokupheka',
      'xh': 'Ubisi olufreshwe olukreyim epheleleyo, ilitha-1, ilungele itiye, ikofu nokupheka',
      'af': 'Vars volroommelk, 1 liter, perfek vir tee, koffie en kook'
    },
    'Rice 2kg': {
      'en': 'Premium white rice, 2kg pack, ideal for family meals and traditional dishes',
      'zu': 'Ulayisi omhlophe wekhwalithi ephezulu, iphakethe lama-2kg, olungele ukudla komndeni nezitsha zesintu',
      'xh': 'Irayisi emhlophe ekumgangatho ophezulu, iipakethe ze-2kg, zilungele ukutya losapho nezitya zemveli',
      'af': 'Premium wit rys, 2kg pak, ideaal vir gesinsmaaltye en tradisionele disse'
    }
  };

  // Voice translation simulation
  translate(text: string, from: string, to: string): string {
    // In a real implementation, this would use Google Translate API or similar
    // For demo, we'll use predefined translations
    const commonPhrases: Record<string, Record<string, string>> = {
      'Welcome': {
        'en': 'Welcome',
        'zu': 'Siyakwamukela',
        'xh': 'Wamkelekile',
        'af': 'Welkom'
      },
      'Your order is ready': {
        'en': 'Your order is ready',
        'zu': 'Ukhodla lwakho selulungile',
        'xh': 'I-odolo yakho ilungile',
        'af': 'Jou bestelling is gereed'
      },
      'Thank you': {
        'en': 'Thank you',
        'zu': 'Siyabonga',
        'xh': 'Enkosi',
        'af': 'Dankie'
      }
    };

    // Try to find exact match
    if (commonPhrases[text] && commonPhrases[text][to]) {
      return commonPhrases[text][to];
    }

    // Return original with note (in real app, this would call translation API)
    return `[${to}] ${text}`;
  }

  // Voice command translation
  translateVoiceCommand(command: string, from: string): {
    originalLanguage: string;
    translatedText: string;
    intent: string;
    items: string[];
  } {
    // Simulate voice recognition and translation
    const lowerCommand = command.toLowerCase();
    
    let intent = 'unknown';
    let items: string[] = [];

    if (lowerCommand.includes('bread') || lowerCommand.includes('isinkwa') || lowerCommand.includes('isonka')) {
      intent = 'order';
      items.push('Bread');
    }
    
    if (lowerCommand.includes('milk') || lowerCommand.includes('ubisi')) {
      intent = 'order';
      items.push('Milk 1L');
    }

    if (lowerCommand.includes('medicine') || lowerCommand.includes('umuthi') || lowerCommand.includes('iyeza')) {
      intent = 'order';
      items.push('Medicine');
    }

    return {
      originalLanguage: from,
      translatedText: this.translate(command, from, 'en'),
      intent,
      items
    };
  }

  // Get product description in specific language
  getProductDescription(productName: string, language: string): string {
    if (this.productDescriptions[productName] && this.productDescriptions[productName][language]) {
      return this.productDescriptions[productName][language];
    }
    
    // Return English as fallback
    return this.productDescriptions[productName]?.['en'] || 
           'Quality product available at your local spaza shop';
  }

  // Text-to-speech simulation
  speak(text: string, language: string): void {
    // In real implementation, this would use Web Speech API
    console.log(`[TTS ${language}]: ${text}`);
    
    // For browsers that support it:
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode(language);
      window.speechSynthesis.speak(utterance);
    }
  }

  // Voice recognition simulation
  startVoiceRecognition(language: string, callback: (transcript: string) => void): void {
    // In real implementation, this would use Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = this.getLanguageCode(language);
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        callback(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        callback(''); // Return empty on error
      };

      recognition.start();
    } else {
      // Fallback for browsers without speech recognition
      setTimeout(() => {
        callback('Order bread and milk'); // Simulate voice input
      }, 2000);
    }
  }

  private getLanguageCode(language: string): string {
    const langMap: Record<string, string> = {
      'English': 'en-ZA',
      'isiZulu': 'zu-ZA',
      'isiXhosa': 'xh-ZA',
      'Afrikaans': 'af-ZA',
      'Sepedi': 'nso-ZA',
      'Setswana': 'tn-ZA',
      'Sesotho': 'st-ZA',
      'Xitsonga': 'ts-ZA',
      'siSwati': 'ss-ZA',
      'Tshivenda': 've-ZA',
      'isiNdebele': 'nr-ZA'
    };
    return langMap[language] || 'en-ZA';
  }
}

export const aiTranslationService = new AITranslationService();





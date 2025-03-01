import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Languages, Loader2, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceAssistantProps {
  preferredLanguage: 'en' | 'es';
}

interface Flashcard {
  question: string;
  answer: string;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ preferredLanguage }) => {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<'en' | 'es'>(preferredLanguage);
  const [mode, setMode] = useState<'assistant' | 'translate' | 'grammar' | 'flashcards'>('assistant');
  const [translatedText, setTranslatedText] = useState('');
  const [grammarResult, setGrammarResult] = useState<{
    original: string;
    corrected: string;
    hasErrors: boolean;
    explanation?: string;
  } | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [textToCheck, setTextToCheck] = useState('');
  const [textToTranslate, setTextToTranslate] = useState('');
  const [flashcardTopic, setFlashcardTopic] = useState('');

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Remove API key check since we use only hardcoded responses
  useEffect(() => {
    // No API key is needed; using only hardcoded responses.
  }, []);

  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      if (mode === 'assistant') {
        handleProcessQuery();
      } else if (mode === 'translate') {
        setTextToTranslate(transcript);
      } else if (mode === 'grammar') {
        setTextToCheck(transcript);
      } else if (mode === 'flashcards') {
        setFlashcardTopic(transcript);
      }
    }
  }, [isListening, transcript, mode]);

  const toggleListening = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: targetLanguage === 'en' ? 'en-US' : 'es-ES'
      });
      setIsListening(true);
    }
  };

  const handleProcessQuery = async () => {
    if (!transcript) return;
    setIsProcessing(true);
    try {
      // Simulate a delay for processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      const lowerTranscript = transcript.toLowerCase();

      // Hardcoded responses based on keywords
      if (lowerTranscript.includes('bus') || lowerTranscript.includes('autobús')) {
        setResponse(
          targetLanguage === 'en'
            ? "The nearest MARTA station is Five Points, about 0.5 miles away. Bus route 51 stops at Decatur St and Piedmont Ave every 15 minutes."
            : "La estación MARTA más cercana es Five Points, a aproximadamente 0.8 kilómetros. La ruta de autobús 51 se detiene en Decatur St y Piedmont Ave cada 15 minutos."
        );
      } else if (lowerTranscript.includes('scholarship') || lowerTranscript.includes('beca')) {
        setResponse(
          targetLanguage === 'en'
            ? "There are several scholarships available for Hispanic students. The Hispanic Scholarship Fund offers awards ranging from $500 to $5,000. The application deadline is February 15, 2025."
            : "Hay varias becas disponibles para estudiantes hispanos. El Fondo Hispano de Becas ofrece premios que van desde $500 hasta $5,000. La fecha límite de solicitud es el 15 de febrero de 2025."
        );
      } else if (lowerTranscript.includes('mentor') || lowerTranscript.includes('tutor')) {
        setResponse(
          targetLanguage === 'en'
            ? "We have 8 mentors available in your area who can help with academic subjects and career guidance. You can find them in the Mentor Match section of this app."
            : "Tenemos 8 mentores disponibles en tu área que pueden ayudarte con materias académicas y orientación profesional. Puedes encontrarlos en la sección de Emparejamiento de Mentores de esta aplicación."
        );
      } else {
        setResponse(
          targetLanguage === 'en'
            ? "I'm here to help with education, transportation, and community resources. How can I assist you today?"
            : "Estoy aquí para ayudar con educación, transporte y recursos comunitarios. ¿Cómo puedo ayudarte hoy?"
        );
      }
    } catch (error) {
      console.error('Error processing query:', error);
      setResponse(
        targetLanguage === 'en'
          ? "I'm sorry, I couldn't process your request. Please try again."
          : "Lo siento, no pude procesar tu solicitud. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranslate = async () => {
    if (!textToTranslate) return;
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Hardcoded translation logic based on sample keywords
      if (textToTranslate.includes("Hola") || textToTranslate.includes("Hello")) {
        setTranslatedText(
          targetLanguage === 'en'
            ? "Hello, how are you?"
            : "Hola, ¿cómo estás?"
        );
      } else if (textToTranslate.includes("homework") || textToTranslate.includes("tarea")) {
        setTranslatedText(
          targetLanguage === 'en'
            ? "I need help with my homework"
            : "Necesito ayuda con mi tarea"
        );
      } else if (textToTranslate.includes("library") || textToTranslate.includes("biblioteca")) {
        setTranslatedText(
          targetLanguage === 'en'
            ? "Where is the library?"
            : "¿Dónde está la biblioteca?"
        );
      } else {
        setTranslatedText(
          targetLanguage === 'en'
            ? "[Translated to English]: " + textToTranslate
            : "[Traducido al Español]: " + textToTranslate
        );
      }
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslatedText(
        targetLanguage === 'en'
          ? "I'm sorry, I couldn't translate that text. Please try again."
          : "Lo siento, no pude traducir ese texto. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckGrammar = async () => {
    if (!textToCheck) return;
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Hardcoded grammar check based on simple keywords
      if (textToCheck.includes("goed") || textToCheck.includes("fue")) {
        setGrammarResult({
          original: textToCheck,
          corrected: targetLanguage === 'en'
            ? textToCheck.replace("goed", "went")
            : textToCheck.replace("yo fue", "yo fui"),
          hasErrors: true,
          explanation: targetLanguage === 'en'
            ? "The past tense of 'go' is 'went', not 'goed'."
            : "La forma correcta del pretérito para 'yo' es 'fui', no 'fue'."
        });
      } else if (textToCheck.includes("They was") || textToCheck.includes("Ellos es")) {
        setGrammarResult({
          original: textToCheck,
          corrected: targetLanguage === 'en'
            ? textToCheck.replace("They was", "They were")
            : textToCheck.replace("Ellos es", "Ellos son"),
          hasErrors: true,
          explanation: targetLanguage === 'en'
            ? "The plural form of 'was' is 'were'. 'They' requires the plural verb form."
            : "El verbo debe concordar con el sujeto plural 'ellos' usando 'son' en lugar de 'es'."
        });
      } else {
        setGrammarResult({
          original: textToCheck,
          corrected: textToCheck,
          hasErrors: false
        });
      }
    } catch (error) {
      console.error('Error checking grammar:', error);
      setGrammarResult({
        original: textToCheck,
        corrected: textToCheck,
        hasErrors: false,
        explanation: targetLanguage === 'en'
          ? "I'm sorry, I couldn't check the grammar. Please try again."
          : "Lo siento, no pude revisar la gramática. Por favor, inténtalo de nuevo."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!flashcardTopic) return;
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Hardcoded flashcards based on topic keywords
      const lowerTopic = flashcardTopic.toLowerCase();
      if (lowerTopic.includes("spanish") || lowerTopic.includes("verb")) {
        setFlashcards(
          targetLanguage === 'en'
            ? [
                {
                  question: "What is the present tense conjugation of 'hablar' (to speak) for 'yo'?",
                  answer: "Yo hablo (I speak)"
                },
                {
                  question: "What is the present tense conjugation of 'comer' (to eat) for 'tú'?",
                  answer: "Tú comes (You eat)"
                },
                {
                  question: "What is the present tense conjugation of 'vivir' (to live) for 'él/ella'?",
                  answer: "Él/Ella vive (He/She lives)"
                }
              ]
            : [
                {
                  question: "¿Cuál es la conjugación en presente de 'to speak' (hablar) para 'I'?",
                  answer: "I speak (Yo hablo)"
                },
                {
                  question: "¿Cuál es la conjugación en presente de 'to eat' (comer) para 'you'?",
                  answer: "You eat (Tú comes)"
                },
                {
                  question: "¿Cuál es la conjugación en presente de 'to live' (vivir) para 'he/she'?",
                  answer: "He/She lives (Él/Ella vive)"
                }
              ]
        );
      } else if (lowerTopic.includes("history") || lowerTopic.includes("historia")) {
        setFlashcards(
          targetLanguage === 'en'
            ? [
                {
                  question: "In what year was the Declaration of Independence signed?",
                  answer: "1776"
                },
                {
                  question: "Who was the first President of the United States?",
                  answer: "George Washington"
                },
                {
                  question: "What was the name of the conflict between the North and South from 1861-1865?",
                  answer: "The American Civil War"
                }
              ]
            : [
                {
                  question: "¿En qué año se firmó la Declaración de Independencia?",
                  answer: "1776"
                },
                {
                  question: "¿Quién fue el primer Presidente de los Estados Unidos?",
                  answer: "George Washington"
                },
                {
                  question: "¿Cómo se llamó el conflicto entre el Norte y el Sur de 1861-1865?",
                  answer: "La Guerra Civil Americana"
                }
              ]
        );
      } else if (lowerTopic.includes("math") || lowerTopic.includes("matemática")) {
        setFlashcards(
          targetLanguage === 'en'
            ? [
                {
                  question: "What is the formula for the area of a circle?",
                  answer: "A = πr² (where r is the radius)"
                },
                {
                  question: "What is the Pythagorean theorem?",
                  answer: "a² + b² = c² (where c is the hypotenuse of a right triangle)"
                },
                {
                  question: "What is the formula for the quadratic equation?",
                  answer: "x = (-b ± √(b² - 4ac)) / 2a"
                }
              ]
            : [
                {
                  question: "¿Cuál es la fórmula para el área de un círculo?",
                  answer: "A = πr² (donde r es el radio)"
                },
                {
                  question: "¿Qué es el teorema de Pitágoras?",
                  answer: "a² + b² = c² (donde c es la hipotenusa de un triángulo rectángulo)"
                },
                {
                  question: "¿Cuál es la fórmula para la ecuación cuadrática?",
                  answer: "x = (-b ± √(b² - 4ac)) / 2a"
                }
              ]
        );
      } else {
        setFlashcards(
          targetLanguage === 'en'
            ? [
                {
                  question: "What is Hispanic Assist?",
                  answer: "Hispanic Assist is a multilingual platform designed to help Hispanic students in Atlanta with education, communication, and transportation resources."
                },
                {
                  question: "What features does Hispanic Assist offer?",
                  answer: "Voice assistant, homework help, translation services, resource maps, scholarship finder, transit guide, and mentor matching."
                },
                {
                  question: "How can I change the language in Hispanic Assist?",
                  answer: "Click on the language toggle button in the top right corner of any feature to switch between English and Spanish."
                }
              ]
            : [
                {
                  question: "¿Qué es Hispanic Assist?",
                  answer: "Hispanic Assist es una plataforma multilingüe diseñada para ayudar a los estudiantes hispanos en Atlanta con recursos de educación, comunicación y transporte."
                },
                {
                  question: "¿Qué funciones ofrece Hispanic Assist?",
                  answer: "Asistente de voz, ayuda con tareas, servicios de traducción, mapas de recursos, buscador de becas, guía de transporte y emparejamiento con mentores."
                },
                {
                  question: "¿Cómo puedo cambiar el idioma en Hispanic Assist?",
                  answer: "Haz clic en el botón de cambio de idioma en la esquina superior derecha de cualquier función para alternar entre inglés y español."
                }
              ]
        );
      }
      setCurrentFlashcard(0);
      setShowFlashcardAnswer(false);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setFlashcards([
        {
          question: targetLanguage === 'en' ? "Error" : "Error",
          answer: targetLanguage === 'en'
            ? "I'm sorry, I couldn't generate flashcards. Please try again."
            : "Lo siento, no pude generar tarjetas de estudio. Por favor, inténtalo de nuevo."
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleLanguage = () => {
    setTargetLanguage(prev => (prev === 'en' ? 'es' : 'en'));
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLanguage === 'en' ? 'en-US' : 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  const nextFlashcard = () => {
    if (currentFlashcard < flashcards.length - 1) {
      setCurrentFlashcard(prev => prev + 1);
      setShowFlashcardAnswer(false);
    }
  };

  const prevFlashcard = () => {
    if (currentFlashcard > 0) {
      setCurrentFlashcard(prev => prev - 1);
      setShowFlashcardAnswer(false);
    }
  };

  const resetMode = () => {
    setMode('assistant');
    setTranslatedText('');
    setGrammarResult(null);
    setFlashcards([]);
    resetTranscript();
    setResponse('');
    setTextToCheck('');
    setTextToTranslate('');
    setFlashcardTopic('');
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">
          Your browser doesn't support speech recognition. Please try using Chrome.
        </p>
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-600">
          Microphone access is needed for the voice assistant. Please allow microphone access.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {targetLanguage === 'en' ? 'Voice Assistant' : 'Asistente de Voz'}
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleLanguage}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
          >
            <Languages className="h-5 w-5" />
            <span>{targetLanguage === 'en' ? 'English' : 'Español'}</span>
          </button>
        </div>
      </div>
      
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        <button
          onClick={() => resetMode()}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            mode === 'assistant' 
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {targetLanguage === 'en' ? 'Assistant' : 'Asistente'}
        </button>
        <button
          onClick={() => setMode('translate')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            mode === 'translate' 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {targetLanguage === 'en' ? 'Translate' : 'Traducir'}
        </button>
        <button
          onClick={() => setMode('grammar')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            mode === 'grammar' 
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {targetLanguage === 'en' ? 'Grammar Check' : 'Revisar Gramática'}
        </button>
        <button
          onClick={() => setMode('flashcards')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            mode === 'flashcards' 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {targetLanguage === 'en' ? 'Flashcards' : 'Tarjetas de Estudio'}
        </button>
      </div>
      
      {mode === 'assistant' && (
        <>
          <div className="mb-4 min-h-24 p-4 bg-gray-50 rounded-lg">
            {transcript ? (
              <p className="text-gray-700">{transcript}</p>
            ) : (
              <p className="text-gray-400 italic">
                {targetLanguage === 'en' 
                  ? 'Your speech will appear here...' 
                  : 'Tu voz aparecerá aquí...'}
              </p>
            )}
          </div>
          
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleListening}
              className={`p-4 rounded-full ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
              disabled={isProcessing}
            >
              {isListening ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {isProcessing && (
            <div className="flex justify-center mb-4">
              <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            </div>
          )}
          
          {response && (
            <div className="mb-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-800">{response}</p>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => speakText(response)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>{targetLanguage === 'en' ? 'Listen' : 'Escuchar'}</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
      
      {mode === 'translate' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {targetLanguage === 'en' 
                ? 'Text to translate (Spanish to English)' 
                : 'Texto para traducir (Inglés a Español)'}
            </label>
            <textarea
              value={textToTranslate}
              onChange={(e) => setTextToTranslate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder={targetLanguage === 'en' 
                ? 'Enter Spanish text to translate...' 
                : 'Ingresa texto en inglés para traducir...'}
            />
            <div className="flex items-center mt-2">
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full mr-2 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
                disabled={isProcessing}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
              <span className="text-sm text-gray-500">
                {targetLanguage === 'en' 
                  ? 'Or speak to translate' 
                  : 'O habla para traducir'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleTranslate}
              disabled={isProcessing || !textToTranslate.trim()}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Languages className="h-5 w-5" />
                  <span>{targetLanguage === 'en' ? 'Translate' : 'Traducir'}</span>
                </>
              )}
            </button>
          </div>
          
          {translatedText && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {targetLanguage === 'en' ? 'Translation' : 'Traducción'}
              </label>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-800">{translatedText}</p>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => speakText(translatedText)}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>{targetLanguage === 'en' ? 'Listen' : 'Escuchar'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {mode === 'grammar' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {targetLanguage === 'en' ? 'Text to check' : 'Texto para revisar'}
            </label>
            <textarea
              value={textToCheck}
              onChange={(e) => setTextToCheck(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder={targetLanguage === 'en' 
                ? 'Enter text to check grammar and spelling...' 
                : 'Ingresa texto para revisar gramática y ortografía...'}
            />
            <div className="flex items-center mt-2">
              <button
                onClick={toggleListening}
                className={`p-2 rounded-full mr-2 ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
                disabled={isProcessing}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
              <span className="text-sm text-gray-500">
                {targetLanguage === 'en' ? 'Or speak to check' : 'O habla para revisar'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleCheckGrammar}
              disabled={isProcessing || !textToCheck.trim()}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  <span>{targetLanguage === 'en' ? 'Check Grammar' : 'Revisar Gramática'}</span>
                </>
              )}
            </button>
          </div>
          
          {grammarResult && (
            <div>
              <div className="p-4 bg-purple-50 rounded-lg">
                {grammarResult.hasErrors ? (
                  <>
                    <div className="flex items-start mb-2">
                      <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-800">
                          {targetLanguage === 'en' ? 'Original Text:' : 'Texto Original:'}
                        </p>
                        <p className="text-gray-700">{grammarResult.original}</p>
                      </div>
                    </div>
                    <div className="flex items-start mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-800">
                          {targetLanguage === 'en' ? 'Corrected Text:' : 'Texto Corregido:'}
                        </p>
                        <p className="text-gray-700">{grammarResult.corrected}</p>
                      </div>
                    </div>
                    {grammarResult.explanation && (
                      <div className="mt-2 border-t border-purple-200 pt-2">
                        <p className="font-medium text-gray-800">
                          {targetLanguage === 'en' ? 'Explanation:' : 'Explicación:'}
                        </p>
                        <p className="text-gray-700">{grammarResult.explanation}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-gray-800">
                      {targetLanguage === 'en'
                        ? 'No grammar or spelling errors found!'
                        : '¡No se encontraron errores gramaticales u ortográficos!'}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => speakText(grammarResult.corrected)}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-800"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>{targetLanguage === 'en' ? 'Listen' : 'Escuchar'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {mode === 'flashcards' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {targetLanguage === 'en'
                ? 'Topic for flashcards'
                : 'Tema para tarjetas de estudio'}
            </label>
            <div className="flex">
              <input
                type="text"
                value={flashcardTopic}
                onChange={(e) => setFlashcardTopic(e.target.value)}
                className="flex-1 p-2.5 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={
                  targetLanguage === 'en'
                    ? 'Enter a topic (e.g., "Spanish verbs")'
                    : 'Ingresa un tema (ej., "Verbos en inglés")'
                }
              />
              <button
                onClick={toggleListening}
                className={`p-2.5 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white rounded-r-md`}
                disabled={isProcessing}
              >
                {isListening ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleGenerateFlashcards}
              disabled={isProcessing || !flashcardTopic.trim()}
              className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <BookOpen className="h-5 w-5" />
                  <span>{targetLanguage === 'en' ? 'Generate Flashcards' : 'Generar Tarjetas'}</span>
                </>
              )}
            </button>
          </div>
          
          {flashcards.length > 0 && (
            <div>
              <div
                className="min-h-40 flex items-center justify-center cursor-pointer p-6 bg-yellow-50 rounded-lg shadow-sm"
                onClick={() => setShowFlashcardAnswer(!showFlashcardAnswer)}
              >
                <p className="text-lg font-medium text-center">
                  {showFlashcardAnswer
                    ? flashcards[currentFlashcard].answer
                    : flashcards[currentFlashcard].question}
                </p>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">
                {targetLanguage === 'en'
                  ? 'Click the card to flip'
                  : 'Haz clic en la tarjeta para voltear'}
              </p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={prevFlashcard}
                  disabled={currentFlashcard === 0}
                  className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  {targetLanguage === 'en' ? 'Previous' : 'Anterior'}
                </button>
                <span className="text-sm text-gray-600">
                  {currentFlashcard + 1} / {flashcards.length}
                </span>
                <button
                  onClick={nextFlashcard}
                  disabled={currentFlashcard === flashcards.length - 1}
                  className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  {targetLanguage === 'en' ? 'Next' : 'Siguiente'}
                </button>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => speakText(showFlashcardAnswer ? flashcards[currentFlashcard].answer : flashcards[currentFlashcard].question)}
                  className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-800"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>{targetLanguage === 'en' ? 'Listen' : 'Escuchar'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="text-sm text-gray-500 mt-6">
        {targetLanguage === 'en'
          ? 'Ask me about transportation, homework help, scholarships, or finding mentors! You can also use the translation, grammar check, and flashcard features.'
          : '¡Pregúntame sobre transporte, ayuda con tareas, becas o cómo encontrar mentores! También puedes usar las funciones de traducción, revisión gramatical y tarjetas de estudio.'}
      </div>
    </div>
  );
};

export default VoiceAssistant;

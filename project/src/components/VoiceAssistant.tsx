import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Languages, Loader2, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import 'regenerator-runtime/runtime';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { generateContent, translateText, checkGrammar, generateFlashcards } from '../lib/gemini';

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
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    // Check if API key is configured
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      setApiKeyMissing(true);
    } else {
      setApiKeyMissing(false);
    }
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
      SpeechRecognition.startListening({ continuous: true, language: targetLanguage === 'en' ? 'en-US' : 'es-ES' });
      setIsListening(true);
    }
  };

  const handleProcessQuery = async () => {
    if (!transcript) return;
    
    setIsProcessing(true);
    
    try {
      // Check if the query is about translation
      const lowerTranscript = transcript.toLowerCase();
      
      if (lowerTranscript.includes('translate') || lowerTranscript.includes('traducir')) {
        setMode('translate');
        setTextToTranslate(transcript.replace(/translate|traducir/gi, '').trim());
        setIsProcessing(false);
        return;
      }
      
      // Check if the query is about grammar checking
      if (lowerTranscript.includes('check grammar') || lowerTranscript.includes('revisar gramática')) {
        setMode('grammar');
        setTextToCheck(transcript.replace(/check grammar|revisar gramática/gi, '').trim());
        setIsProcessing(false);
        return;
      }
      
      // Check if the query is about flashcards
      if (lowerTranscript.includes('flashcards') || lowerTranscript.includes('tarjetas')) {
        setMode('flashcards');
        setFlashcardTopic(transcript.replace(/flashcards|tarjetas/gi, '').trim());
        setIsProcessing(false);
        return;
      }
      
      // Process with Gemini
      const prompt = `You are a helpful assistant for Hispanic students in Atlanta. 
      Answer the following question in ${targetLanguage === 'en' ? 'English' : 'Spanish'}.
      Be concise but informative. If the question is about transit, education, or community resources,
      provide specific information for Atlanta.
      
      Question: ${transcript}`;
      
      const aiResponse = await generateContent(prompt, targetLanguage);
      setResponse(aiResponse);
    } catch (error) {
      console.error('Error processing query:', error);
      setResponse(targetLanguage === 'en' 
        ? "I'm sorry, I couldn't process your request. Please try again."
        : "Lo siento, no pude procesar tu solicitud. Por favor, inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranslate = async () => {
    if (!textToTranslate) return;
    
    setIsProcessing(true);
    try {
      const translated = await translateText(textToTranslate, targetLanguage);
      setTranslatedText(translated);
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslatedText(targetLanguage === 'en'
        ? "I'm sorry, I couldn't translate that text. Please try again."
        : "Lo siento, no pude traducir ese texto. Por favor, inténtalo de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckGrammar = async () => {
    if (!textToCheck) return;
    
    setIsProcessing(true);
    try {
      const result = await checkGrammar(textToCheck, targetLanguage);
      setGrammarResult({
        original: textToCheck,
        corrected: result.corrected,
        hasErrors: result.hasErrors,
        explanation: result.explanation
      });
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
      const cards = await generateFlashcards(flashcardTopic, targetLanguage);
      setFlashcards(cards);
      setCurrentFlashcard(0);
      setShowFlashcardAnswer(false);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setFlashcards([{
        question: targetLanguage === 'en' ? "Error" : "Error",
        answer: targetLanguage === 'en'
          ? "I'm sorry, I couldn't generate flashcards. Please try again."
          : "Lo siento, no pude generar tarjetas de estudio. Por favor, inténtalo de nuevo."
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleLanguage = () => {
    setTargetLanguage(prev => prev === 'en' ? 'es' : 'en');
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

  if (apiKeyMissing) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">API Key Required</h3>
        <p className="text-yellow-700 mb-4">
          To use the AI features, you need to add your Gemini API key to the <code>.env</code> file.
        </p>
        <ol className="list-decimal pl-5 text-yellow-700 space-y-2">
          <li>Get a Gemini API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google AI Studio</a></li>
          <li>Open the <code>.env</code> file in your project</li>
          <li>Replace <code>YOUR_GEMINI_API_KEY</code> with your actual API key</li>
          <li>Restart the development server</li>
        </ol>
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
                  <span>
                    {targetLanguage === 'en' ? 'Listen' : 'Escuchar'}
                  </span>
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
                  <span>
                    {targetLanguage === 'en' ? 'Listen' : 'Escuchar'}
                  </span>
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
              {targetLanguage === 'en' 
                ? 'Text to check' 
                : 'Texto para revisar'}
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
                {targetLanguage === 'en' 
                  ? 'Or speak to check' 
                  : 'O habla para revisar'}
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
                  <span>
                    {targetLanguage === 'en' ? 'Listen' : 'Escuchar'}
                  </span>
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
                placeholder={targetLanguage === 'en' 
                  ? 'Enter a topic (e.g., "Spanish verbs")' 
                  : 'Ingresa un tema (ej., "Verbos en inglés")'}
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
              <div className="p-6 bg-yellow-50 rounded-lg shadow-sm">
                <div 
                  className="min-h-40 flex items-center justify-center cursor-pointer"
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
              </div>
              
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
                  onClick={() => speakText(showFlashcardAnswer 
                    ? flashcards[currentFlashcard].answer 
                    : flashcards[currentFlashcard].question)}
                  className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-800"
                >
                  <Volume2 className="h-5 w-5" />
                  <span>
                    {targetLanguage === 'en' ? 'Listen' : 'Escuchar'}
                  </span>
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
import React, { useState } from 'react';
import { BookOpen, Languages, Send, Loader2, Volume2 } from 'lucide-react';
import { generateContent, translateText } from '../lib/gemini';

interface HomeworkHelperProps {
  preferredLanguage: 'en' | 'es';
}

const HomeworkHelper: React.FC<HomeworkHelperProps> = ({ preferredLanguage }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [translatedQuestion, setTranslatedQuestion] = useState('');
  const [translatedResponse, setTranslatedResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>(preferredLanguage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsLoading(true);
    setTranslatedQuestion('');
    setTranslatedResponse('');
    
    try {
      // First, translate the question to English if it's in Spanish
      let englishQuestion = question;
      if (language === 'es') {
        englishQuestion = await translateText(question, 'en');
        setTranslatedQuestion(englishQuestion);
      }
      
      // Generate response using Gemini
      const prompt = `You are a helpful homework assistant for Hispanic students. 
      A student has asked the following question: "${englishQuestion}"
      
      Provide a clear, educational explanation that would help the student understand the concept.
      Include examples if relevant. Keep your answer concise but informative.
      Focus on explaining the concept rather than just giving the answer.`;
      
      const aiResponse = await generateContent(prompt, 'en');
      
      // If the user's preferred language is Spanish, translate the response
      if (language === 'es') {
        const spanishResponse = await translateText(aiResponse, 'es');
        setResponse(spanishResponse);
      } else {
        setResponse(aiResponse);
      }
    } catch (error) {
      console.error('Error processing homework question:', error);
      setResponse(language === 'en' 
        ? "I'm sorry, I couldn't process your homework question. Please try again."
        : "Lo siento, no pude procesar tu pregunta de tarea. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  const translateResponse = async () => {
    if (!response) return;
    
    setIsTranslating(true);
    try {
      const targetLang = language === 'en' ? 'es' : 'en';
      const translated = await translateText(response, targetLang);
      setTranslatedResponse(translated);
    } catch (error) {
      console.error('Error translating response:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text: string, lang: 'en' | 'es') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'en' ? 'en-US' : 'es-ES';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            {language === 'en' ? 'Homework Helper' : 'Ayudante de Tareas'}
          </h2>
        </div>
        <button 
          onClick={toggleLanguage}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
        >
          <Languages className="h-5 w-5" />
          <span>{language === 'en' ? 'English' : 'Español'}</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'en' ? 'Enter your homework question:' : 'Ingresa tu pregunta de tarea:'}
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder={language === 'en' 
              ? "Example: How do I solve quadratic equations?" 
              : "Ejemplo: ¿Cómo resuelvo ecuaciones cuadráticas?"}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{language === 'en' ? 'Processing...' : 'Procesando...'}</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>{language === 'en' ? 'Submit' : 'Enviar'}</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      {translatedQuestion && language === 'es' && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
            {language === 'es' ? 'Tu pregunta traducida al inglés:' : 'Your question translated to English:'}
          </p>
          <p className="text-gray-800">{translatedQuestion}</p>
        </div>
      )}
      
      {response && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-800">
              {language === 'en' ? 'Response:' : 'Respuesta:'}
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => speakText(response, language)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <Volume2 className="h-5 w-5" />
                <span>{language === 'en' ? 'Listen' : 'Escuchar'}</span>
              </button>
              <button
                onClick={translateResponse}
                disabled={isTranslating}
                className="flex items-center space-x-1 text-green-600 hover:text-green-800"
              >
                <Languages className="h-5 w-5" />
                <span>
                  {isTranslating 
                    ? (language === 'en' ? 'Translating...' : 'Traduciendo...') 
                    : (language === 'en' ? 'Translate to Spanish' : 'Traducir al Inglés')}
                </span>
              </button>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg whitespace-pre-line">
            <p className="text-gray-800">{response}</p>
          </div>
        </div>
      )}
      
      {translatedResponse && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {language === 'en' ? 'Spanish Translation:' : 'Traducción al Inglés:'}
          </h3>
          <div className="p-4 bg-green-50 rounded-lg whitespace-pre-line">
            <p className="text-gray-800">{translatedResponse}</p>
          </div>
          <div className="mt-2 flex justify-end">
            <button
              onClick={() => speakText(translatedResponse, language === 'en' ? 'es' : 'en')}
              className="flex items-center space-x-1 text-green-600 hover:text-green-800"
            >
              <Volume2 className="h-5 w-5" />
              <span>{language === 'en' ? 'Listen (Spanish)' : 'Escuchar (Inglés)'}</span>
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        {language === 'en' 
          ? 'Ask any homework question in English or Spanish. I can help with math, science, history, and more!' 
          : '¡Haz cualquier pregunta de tarea en inglés o español. Puedo ayudar con matemáticas, ciencias, historia y más!'}
      </div>
    </div>
  );
};

export default HomeworkHelper;
import React, { useState } from 'react';
import { BookOpen, Languages, Send, Loader2, Volume2 } from 'lucide-react';

interface HomeworkHelperProps {
  preferredLanguage: 'en' | 'es';
}

const HomeworkHelper: React.FC<HomeworkHelperProps> = ({ preferredLanguage }) => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [translatedQuestion, setTranslatedQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  // "language" here indicates the language used for the initial response.
  // When translating, the response will change to the opposite language.
  const [language, setLanguage] = useState<'en' | 'es'>(preferredLanguage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    
    setIsLoading(true);
    setTranslatedQuestion('');
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Hardcoded response simulation based on keywords
      if (
        question.toLowerCase().includes("quadratic") ||
        question.toLowerCase().includes("cuadrática")
      ) {
        setResponse(
          language === 'en'
            ? "To solve quadratic equations in the form ax² + bx + c = 0, you can use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a. For example, to solve x² + 5x + 6 = 0:\n\n1. Identify a=1, b=5, c=6\n2. Substitute into the formula: x = (-5 ± √(5² - 4×1×6)) / 2×1\n3. Simplify: x = (-5 ± √(25 - 24)) / 2\n4. Simplify further: x = (-5 ± √1) / 2\n5. This gives us: x = (-5 + 1) / 2 = -2 or x = (-5 - 1) / 2 = -3\n\nSo the solutions are x = -2 or x = -3, which you can verify by substituting back into the original equation."
            : "Para resolver ecuaciones cuadráticas en la forma ax² + bx + c = 0, puedes usar la fórmula cuadrática: x = (-b ± √(b² - 4ac)) / 2a. Por ejemplo, para resolver x² + 5x + 6 = 0:\n\n1. Identifica a=1, b=5, c=6\n2. Sustituye en la fórmula: x = (-5 ± √(5² - 4×1×6)) / 2×1\n3. Simplifica: x = (-5 ± √(25 - 24)) / 2\n4. Simplifica más: x = (-5 ± √1) / 2\n5. Esto nos da: x = (-5 + 1) / 2 = -2 o x = (-5 - 1) / 2 = -3\n\nAsí que las soluciones son x = -2 o x = -3, lo que puedes verificar sustituyendo en la ecuación original."
        );
      } else if (
        question.toLowerCase().includes("photosynthesis") ||
        question.toLowerCase().includes("fotosíntesis")
      ) {
        setResponse(
          language === 'en'
            ? "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy in the form of glucose (sugar).\n\nThe basic equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nThis process occurs in the chloroplasts of plant cells, specifically in structures called thylakoids. Chlorophyll, the green pigment in plants, captures light energy which is then used to split water molecules. The hydrogen from water is combined with carbon dioxide to create glucose, while oxygen is released as a byproduct.\n\nPhotosynthesis has two main stages:\n1. Light-dependent reactions: Convert light energy to chemical energy (ATP and NADPH)\n2. Calvin cycle (light-independent reactions): Uses the chemical energy to fix carbon dioxide and produce glucose\n\nThis process is essential for life on Earth as it produces oxygen and serves as the base of most food chains."
            : "La fotosíntesis es el proceso mediante el cual las plantas verdes, algas y algunas bacterias convierten la energía luminosa, generalmente del sol, en energía química en forma de glucosa (azúcar).\n\nLa ecuación básica es: 6CO₂ + 6H₂O + energía luminosa → C₆H₁₂O₆ + 6O₂\n\nEste proceso ocurre en los cloroplastos de las células vegetales, específicamente en estructuras llamadas tilacoides. La clorofila, el pigmento verde de las plantas, captura la energía luminosa que luego se utiliza para dividir las moléculas de agua. El hidrógeno del agua se combina con el dióxido de carbono para crear glucosa, mientras que el oxígeno se libera como subproducto.\n\nLa fotosíntesis tiene dos etapas principales:\n1. Reacciones dependientes de la luz: Convierten la energía luminosa en energía química (ATP y NADPH)\n2. Ciclo de Calvin (reacciones independientes de la luz): Utiliza la energía química para fijar el dióxido de carbono y producir glucosa\n\nEste proceso es esencial para la vida en la Tierra, ya que produce oxígeno y sirve como base de la mayoría de las cadenas alimentarias."
        );
      } else if (
        question.toLowerCase().includes("world war") ||
        question.toLowerCase().includes("guerra mundial")
      ) {
        setResponse(
          language === 'en'
            ? "World War I (1914-1918) was triggered by multiple complex factors that had been building for decades. The key causes include:\n\n1. Militarism: European powers were engaged in an arms race, building up their military forces and capabilities.\n2. Alliances: Europe was divided into two opposing alliance systems - the Triple Alliance (Germany, Austria-Hungary, Italy) and the Triple Entente (Britain, France, Russia).\n3. Imperialism: Competition for colonies and resources created tensions between major powers.\n4. Nationalism: Strong patriotic sentiments and desires for independence among various ethnic groups created instability.\n5. Immediate trigger: The assassination of Archduke Franz Ferdinand in Sarajevo on June 28, 1914, led to a rapid escalation into global conflict."
            : "La Primera Guerra Mundial (1914-1918) fue desencadenada por múltiples factores complejos que se habían estado acumulando durante décadas. Las causas principales incluyen:\n\n1. Militarismo: Las potencias europeas estaban involucradas en una carrera armamentista, aumentando sus fuerzas y capacidades militares.\n2. Alianzas: Europa estaba dividida en dos sistemas de alianzas opuestas - la Triple Alianza (Alemania, Austria-Hungría, Italia) y la Triple Entente (Gran Bretaña, Francia, Rusia).\n3. Imperialismo: La competencia por colonias y recursos creó tensiones entre las principales potencias.\n4. Nacionalismo: Fuertes sentimientos patrióticos y deseos de independencia entre varios grupos étnicos crearon inestabilidad.\n5. Detonante inmediato: El asesinato del Archiduque Francisco Fernando en Sarajevo el 28 de junio de 1914 desencadenó rápidamente un conflicto global."
        );
      } else {
        setResponse(
          language === 'en'
            ? "I'd be happy to help with your homework question. Could you provide more details or specify the subject area? This will help me give you a more accurate and helpful response."
            : "Estaré encantado de ayudarte con tu pregunta de tarea. ¿Podrías proporcionar más detalles o especificar el área temática? Esto me ayudará a darte una respuesta más precisa y útil."
        );
      }

      // Simulate a translation for the question if needed
      if (language === 'en' && /[áéíóúñ¿¡]/i.test(question)) {
        setTranslatedQuestion("Translated question: " + question.replace(/[áéíóúñ¿¡]/gi, ''));
      } else if (language === 'es' && !/[áéíóúñ¿¡]/i.test(question)) {
        setTranslatedQuestion("Pregunta traducida: " + question);
      }
    } catch (error) {
      console.error('Error processing homework question:', error);
      setResponse(
        language === 'en'
          ? "I'm sorry, I couldn't process your homework question. Please try again."
          : "Lo siento, no pude procesar tu pregunta de tarea. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle the preferred language (affects the initial response)
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'es' : 'en'));
  };

  // Translate the current response to the opposite language (hot translate)
  const translateResponse = async () => {
    if (!response) return;
    setIsTranslating(true);
    try {
      // Simulate a short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      let newResponse = response;
      const lowerQ = question.toLowerCase();

      // When the initial language is English, translate to Spanish
      if (language === 'en') {
        if (lowerQ.includes("quadratic") || lowerQ.includes("cuadrática")) {
          newResponse = "Para resolver ecuaciones cuadráticas en la forma ax² + bx + c = 0, puedes usar la fórmula cuadrática: x = (-b ± √(b² - 4ac)) / 2a. Por ejemplo, para resolver x² + 5x + 6 = 0:\n\n1. Identifica a=1, b=5, c=6\n2. Sustituye en la fórmula: x = (-5 ± √(5² - 4×1×6)) / 2×1\n3. Simplifica: x = (-5 ± √(25 - 24)) / 2\n4. Simplifica más: x = (-5 ± √1) / 2\n5. Esto nos da: x = (-5 + 1) / 2 = -2 o x = (-5 - 1) / 2 = -3\n\nAsí que las soluciones son x = -2 o x = -3, lo que puedes verificar sustituyendo en la ecuación original.";
        } else if (lowerQ.includes("photosynthesis") || lowerQ.includes("fotosíntesis")) {
          newResponse = "La fotosíntesis es el proceso mediante el cual las plantas verdes, algas y algunas bacterias convierten la energía luminosa, generalmente del sol, en energía química en forma de glucosa (azúcar).\n\nLa ecuación básica es: 6CO₂ + 6H₂O + energía luminosa → C₆H₁₂O₆ + 6O₂\n\nEste proceso ocurre en los cloroplastos de las células vegetales, específicamente en estructuras llamadas tilacoides. La clorofila, el pigmento verde de las plantas, captura la energía luminosa que luego se utiliza para dividir las moléculas de agua. El hidrógeno del agua se combina con el dióxido de carbono para crear glucosa, mientras que el oxígeno se libera como subproducto.\n\nLa fotosíntesis tiene dos etapas principales:\n1. Reacciones dependientes de la luz: Convierten la energía luminosa en energía química (ATP y NADPH)\n2. Ciclo de Calvin (reacciones independientes de la luz): Utiliza la energía química para fijar el dióxido de carbono y producir glucosa\n\nEste proceso es esencial para la vida en la Tierra, ya que produce oxígeno y sirve como base de la mayoría de las cadenas alimentarias.";
        } else if (lowerQ.includes("world war") || lowerQ.includes("guerra mundial")) {
          newResponse = "La Primera Guerra Mundial (1914-1918) fue desencadenada por múltiples factores complejos que se habían estado acumulando durante décadas. Las causas principales incluyen:\n\n1. Militarismo: Las potencias europeas estaban involucradas en una carrera armamentista, aumentando sus fuerzas y capacidades militares.\n2. Alianzas: Europa estaba dividida en dos sistemas de alianzas opuestas - la Triple Alianza (Alemania, Austria-Hungría, Italia) y la Triple Entente (Gran Bretaña, Francia, Rusia).\n3. Imperialismo: La competencia por colonias y recursos creó tensiones entre las principales potencias.\n4. Nacionalismo: Fuertes sentimientos patrióticos y deseos de independencia entre varios grupos étnicos crearon inestabilidad.\n5. Detonante inmediato: El asesinato del Archiduque Francisco Fernando en Sarajevo el 28 de junio de 1914 desencadenó rápidamente un conflicto global.";
        } else {
          newResponse = "Esta es la traducción por defecto de la respuesta. (Traducción simulada)";
        }
      }
      // When the initial language is Spanish, translate to English
      else {
        if (lowerQ.includes("quadratic") || lowerQ.includes("cuadrática")) {
          newResponse = "To solve quadratic equations in the form ax² + bx + c = 0, you can use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a. For example, to solve x² + 5x + 6 = 0:\n\n1. Identify a=1, b=5, c=6\n2. Substitute into the formula: x = (-5 ± √(5² - 4×1×6)) / 2×1\n3. Simplify: x = (-5 ± √(25 - 24)) / 2\n4. Simplify further: x = (-5 ± √1) / 2\n5. This gives us: x = (-5 + 1) / 2 = -2 or x = (-5 - 1) / 2 = -3\n\nSo the solutions are x = -2 or x = -3, which you can verify by substituting back into the original equation.";
        } else if (lowerQ.includes("photosynthesis") || lowerQ.includes("fotosíntesis")) {
          newResponse = "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy in the form of glucose (sugar).\n\nThe basic equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\nThis process occurs in the chloroplasts of plant cells, specifically in structures called thylakoids. Chlorophyll, the green pigment in plants, captures light energy which is then used to split water molecules. The hydrogen from water is combined with carbon dioxide to create glucose, while oxygen is released as a byproduct.\n\nPhotosynthesis has two main stages:\n1. Light-dependent reactions: Convert light energy to chemical energy (ATP and NADPH)\n2. Calvin cycle (light-independent reactions): Uses the chemical energy to fix carbon dioxide and produce glucose\n\nThis process is essential for life on Earth as it produces oxygen and serves as the base of most food chains.";
        } else if (lowerQ.includes("world war") || lowerQ.includes("guerra mundial")) {
          newResponse = "World War I (1914-1918) was triggered by multiple complex factors that had been building for decades. The key causes include:\n\n1. Militarism: European powers were engaged in an arms race, building up their military forces and capabilities.\n2. Alliances: Europe was divided into two opposing alliance systems - the Triple Alliance (Germany, Austria-Hungary, Italy) and the Triple Entente (Britain, France, Russia).\n3. Imperialism: Competition for colonies and resources created tensions between major powers.\n4. Nationalism: Strong patriotic sentiments and desires for independence among various ethnic groups created instability.\n5. Immediate trigger: The assassination of Archduke Franz Ferdinand in Sarajevo on June 28, 1914, led to a rapid escalation into global conflict.";
        } else {
          newResponse = "This is the default English translation of the response. (Simulated translation)";
        }
      }
      setResponse(newResponse);
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
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {language === 'en'
              ? 'Enter your homework question:'
              : 'Ingresa tu pregunta de tarea:'}
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder={
              language === 'en'
                ? "Example: How do I solve quadratic equations?"
                : "Ejemplo: ¿Cómo resuelvo ecuaciones cuadráticas?"
            }
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

      {translatedQuestion && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
            {language === 'en'
              ? 'Translated question:'
              : 'Pregunta traducida:'}
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
                    ? language === 'en'
                      ? 'Translating...'
                      : 'Traduciendo...'
                    : language === 'en'
                    ? 'Translate to Spanish'
                    : 'Translate to English'}
                </span>
              </button>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg whitespace-pre-line">
            <p className="text-gray-800">{response}</p>
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

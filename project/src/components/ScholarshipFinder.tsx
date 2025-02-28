import React, { useState } from 'react';
import { GraduationCap, Search, Calendar, DollarSign, ExternalLink, Languages } from 'lucide-react';

interface ScholarshipFinderProps {
  preferredLanguage: 'en' | 'es';
}

const ScholarshipFinder: React.FC<ScholarshipFinderProps> = ({ preferredLanguage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState<'en' | 'es'>(preferredLanguage);
  
  // Mock scholarship data
  const scholarships = [
    {
      id: '1',
      name: language === 'en' ? 'Hispanic Scholarship Fund' : 'Fondo de Becas Hispanas',
      description: language === 'en' 
        ? 'Scholarships for Hispanic students in all disciplines.' 
        : 'Becas para estudiantes hispanos en todas las disciplinas.',
      eligibility: language === 'en' 
        ? 'Hispanic heritage, minimum 3.0 GPA, US citizen or permanent resident' 
        : 'Herencia hispana, GPA mínimo de 3.0, ciudadano estadounidense o residente permanente',
      amount: '$500 - $5,000',
      deadline: '2025-02-15',
      website: 'https://www.hsf.net'
    },
    {
      id: '2',
      name: language === 'en' ? 'TheDream.US Scholarship' : 'Beca TheDream.US',
      description: language === 'en'
        ? 'For DREAMers who have DACA or TPS status.'
        : 'Para DREAMers que tienen estatus DACA o TPS.',
      eligibility: language === 'en'
        ? 'DACA or TPS eligible, 3.0 GPA, financial need'
        : 'Elegible para DACA o TPS, GPA de 3.0, necesidad financiera',
      amount: 'Up to $33,000',
      deadline: '2025-03-01',
      website: 'https://www.thedream.us'
    },
    {
      id: '3',
      name: language === 'en' ? 'Georgia Hispanic Chamber of Commerce Scholarship' : 'Beca de la Cámara de Comercio Hispana de Georgia',
      description: language === 'en'
        ? 'For Hispanic students pursuing business degrees in Georgia.'
        : 'Para estudiantes hispanos que cursan carreras empresariales en Georgia.',
      eligibility: language === 'en'
        ? 'Hispanic heritage, Georgia resident, business major, 3.0 GPA'
        : 'Herencia hispana, residente de Georgia, especialización en negocios, GPA de 3.0',
      amount: '$2,500',
      deadline: '2025-04-15',
      website: 'https://ghcc.org/scholarships'
    },
    {
      id: '4',
      name: language === 'en' ? 'LULAC National Scholarship Fund' : 'Fondo Nacional de Becas LULAC',
      description: language === 'en'
        ? 'Scholarships for Hispanic students at various education levels.'
        : 'Becas para estudiantes hispanos en varios niveles educativos.',
      eligibility: language === 'en'
        ? 'Hispanic heritage, US citizen or permanent resident, 3.0 GPA'
        : 'Herencia hispana, ciudadano estadounidense o residente permanente, GPA de 3.0',
      amount: '$250 - $2,000',
      deadline: '2025-03-31',
      website: 'https://lulac.org/programs/education/scholarships/'
    },
    {
      id: '5',
      name: language === 'en' ? 'GSU Hispanic Alumni Scholarship' : 'Beca de Exalumnos Hispanos de GSU',
      description: language === 'en'
        ? 'For Hispanic students attending Georgia State University.'
        : 'Para estudiantes hispanos que asisten a la Universidad Estatal de Georgia.',
      eligibility: language === 'en'
        ? 'Hispanic heritage, enrolled at GSU, 3.0 GPA, financial need'
        : 'Herencia hispana, inscrito en GSU, GPA de 3.0, necesidad financiera',
      amount: '$1,000 - $3,000',
      deadline: '2025-05-01',
      website: 'https://alumni.gsu.edu/scholarships'
    }
  ];

  const filteredScholarships = scholarships.filter(scholarship => 
    scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.eligibility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            {language === 'en' ? 'Scholarship Finder' : 'Buscador de Becas'}
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
      
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'en' ? 'Search scholarships...' : 'Buscar becas...'}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredScholarships.map(scholarship => (
          <div key={scholarship.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium text-gray-800">{scholarship.name}</h3>
            <p className="text-gray-600 mt-1">{scholarship.description}</p>
            
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-500">
                    {language === 'en' ? 'Deadline' : 'Fecha límite'}
                  </p>
                  <p className="text-sm text-gray-700">{formatDate(scholarship.deadline)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-500">
                    {language === 'en' ? 'Amount' : 'Cantidad'}
                  </p>
                  <p className="text-sm text-gray-700">{scholarship.amount}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">
                {language === 'en' ? 'Eligibility' : 'Elegibilidad'}
              </p>
              <p className="text-sm text-gray-700">{scholarship.eligibility}</p>
            </div>
            
            <div className="mt-4 flex justify-end">
              <a 
                href={scholarship.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <span className="mr-1">
                  {language === 'en' ? 'Apply Now' : 'Aplicar Ahora'}
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
        
        {filteredScholarships.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {language === 'en' 
                ? 'No scholarships found matching your search.' 
                : 'No se encontraron becas que coincidan con tu búsqueda.'}
            </p>
          </div>
        )}
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-6">
        {language === 'en' 
          ? 'These scholarships are specifically available for Hispanic students.' 
          : 'Estas becas están disponibles específicamente para estudiantes hispanos.'}
      </div>
    </div>
  );
};

export default ScholarshipFinder;
import React, { useState } from 'react';
import { MapPin, Search, Phone, Globe, Filter } from 'lucide-react';

interface ResourceMapProps {
  preferredLanguage: 'en' | 'es';
}

const ResourceMap: React.FC<ResourceMapProps> = ({ preferredLanguage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>(preferredLanguage);
  
  // Mock resources data
  const resources = [
    {
      id: '1',
      name: language === 'en' ? 'Hispanic Student Association' : 'Asociación de Estudiantes Hispanos',
      description: language === 'en' 
        ? 'Student organization providing support and community for Hispanic students at GSU.' 
        : 'Organización estudiantil que brinda apoyo y comunidad a estudiantes hispanos en GSU.',
      category: 'education',
      address: '33 Gilmer St SE, Atlanta, GA 30303',
      phone: '(404) 555-1234',
      website: 'https://example.com/hsa'
    },
    {
      id: '2',
      name: language === 'en' ? 'Latin American Association' : 'Asociación Latinoamericana',
      description: language === 'en'
        ? 'Nonprofit organization offering immigration services, family services, and youth programs.'
        : 'Organización sin fines de lucro que ofrece servicios de inmigración, servicios familiares y programas juveniles.',
      category: 'community',
      address: '2750 Buford Hwy NE, Atlanta, GA 30324',
      phone: '(404) 638-1800',
      website: 'https://thelaa.org'
    },
    {
      id: '3',
      name: language === 'en' ? 'Hispanic Health Coalition' : 'Coalición de Salud Hispana',
      description: language === 'en'
        ? 'Provides healthcare resources, screenings, and education for the Hispanic community.'
        : 'Proporciona recursos de atención médica, exámenes y educación para la comunidad hispana.',
      category: 'healthcare',
      address: '515 Fairburn Rd NW, Atlanta, GA 30331',
      phone: '(404) 555-5678',
      website: 'https://example.com/hhc'
    },
    {
      id: '4',
      name: language === 'en' ? 'Georgia Latino Law Foundation' : 'Fundación Latina de Derecho de Georgia',
      description: language === 'en'
        ? 'Provides legal assistance and education to the Hispanic community.'
        : 'Proporciona asistencia legal y educación a la comunidad hispana.',
      category: 'legal',
      address: '100 Edgewood Ave NE, Atlanta, GA 30303',
      phone: '(404) 555-9012',
      website: 'https://example.com/gllf'
    },
    {
      id: '5',
      name: language === 'en' ? 'Hispanic Business Center' : 'Centro de Negocios Hispano',
      description: language === 'en'
        ? 'Resources for Hispanic entrepreneurs and business owners.'
        : 'Recursos para empresarios y dueños de negocios hispanos.',
      category: 'employment',
      address: '75 Marietta St NW, Atlanta, GA 30303',
      phone: '(404) 555-3456',
      website: 'https://example.com/hbc'
    }
  ];

  const categories = [
    { id: 'education', name: language === 'en' ? 'Education' : 'Educación', color: 'bg-blue-100 text-blue-800' },
    { id: 'community', name: language === 'en' ? 'Community' : 'Comunidad', color: 'bg-green-100 text-green-800' },
    { id: 'healthcare', name: language === 'en' ? 'Healthcare' : 'Salud', color: 'bg-red-100 text-red-800' },
    { id: 'legal', name: language === 'en' ? 'Legal' : 'Legal', color: 'bg-purple-100 text-purple-800' },
    { id: 'employment', name: language === 'en' ? 'Employment' : 'Empleo', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? resource.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-800';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <MapPin className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            {language === 'en' ? 'Community Resource Map' : 'Mapa de Recursos Comunitarios'}
          </h2>
        </div>
        <button 
          onClick={toggleLanguage}
          className="text-blue-600 hover:text-blue-800"
        >
          {language === 'en' ? 'English' : 'Español'}
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
            placeholder={language === 'en' ? 'Search resources...' : 'Buscar recursos...'}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Filter className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-700">
            {language === 'en' ? 'Filter by category:' : 'Filtrar por categoría:'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === category.id 
                  ? category.color.replace('bg-', 'bg-').replace('text-', 'text-')
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">
          {language === 'en' 
            ? `Showing ${filteredResources.length} resources` 
            : `Mostrando ${filteredResources.length} recursos`}
        </p>
        
        <div className="space-y-4">
          {filteredResources.map(resource => (
            <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-800">{resource.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                  {getCategoryName(resource.category)}
                </span>
              </div>
              <p className="text-gray-600 mt-1">{resource.description}</p>
              <div className="mt-3 text-sm">
                <div className="flex items-start mt-2">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  <span className="text-gray-600">{resource.address}</span>
                </div>
                {resource.phone && (
                  <div className="flex items-center mt-2">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <a href={`tel:${resource.phone}`} className="text-blue-600 hover:underline">
                      {resource.phone}
                    </a>
                  </div>
                )}
                {resource.website && (
                  <div className="flex items-center mt-2">
                    <Globe className="h-4 w-4 text-gray-400 mr-2" />
                    <a 
                      href={resource.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      {language === 'en' ? 'Visit Website' : 'Visitar Sitio Web'}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredResources.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {language === 'en' 
                  ? 'No resources found matching your criteria.' 
                  : 'No se encontraron recursos que coincidan con tus criterios.'}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-4">
        {language === 'en' 
          ? 'This map shows Hispanic-friendly resources in the Atlanta area.' 
          : 'Este mapa muestra recursos amigables para hispanos en el área de Atlanta.'}
      </div>
    </div>
  );
};

export default ResourceMap;
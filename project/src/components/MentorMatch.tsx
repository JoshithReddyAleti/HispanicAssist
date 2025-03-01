import React, { useState } from 'react';
import { Users, Search, Star, Calendar, MapPin, Languages, GraduationCap, BookOpen, Code, Calculator, Beaker, History, Globe } from 'lucide-react';

interface MentorMatchProps {
  preferredLanguage: 'en' | 'es';
}

const MentorMatch: React.FC<MentorMatchProps> = ({ preferredLanguage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>(preferredLanguage);
  
  // UNCOMMENT THIS SECTION TO USE THE ACTUAL SUPABASE API
  /*
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        // Fetch mentors from Supabase
        const { data, error } = await supabase
          .from('mentors')
          .select(`
            id,
            name,
            bio,
            specialties,
            availability,
            location,
            rating,
            imageUrl
          `);
          
        if (error) throw error;
        
        if (data) {
          setMentors(data);
        }
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMentors();
  }, []);
  */
  
  // Mock mentors data with 3 examples
  const mentors = [
    {
      id: '1',
      name: 'Carlos Rodriguez',
      bio: language === 'en' 
        ? 'Computer Science professor at GSU with 10+ years of experience teaching programming and AI.' 
        : 'Profesor de Ciencias de la Computación en GSU con más de 10 años de experiencia enseñando programación e IA.',
      specialties: ['Computer Science', 'Programming', 'Artificial Intelligence'],
      availability: language === 'en' ? 'Weekdays after 4 PM' : 'Días laborables después de las 4 PM',
      location: 'Downtown Atlanta',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
    },
    {
      id: '2',
      name: 'Maria Gonzalez',
      bio: language === 'en'
        ? 'ESL instructor specializing in academic English and college application essays.'
        : 'Instructora de ESL especializada en inglés académico y ensayos de solicitud universitaria.',
      specialties: ['English', 'Writing', 'College Applications'],
      availability: language === 'en' ? 'Weekends and Tuesday evenings' : 'Fines de semana y martes por la noche',
      location: 'Buckhead',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
    },
    {
      id: '3',
      name: 'Javier Mendez',
      bio: language === 'en'
        ? 'Mathematics tutor with expertise in calculus, statistics, and SAT/ACT prep.'
        : 'Tutor de matemáticas con experiencia en cálculo, estadística y preparación para SAT/ACT.',
      specialties: ['Mathematics', 'Statistics', 'Test Prep'],
      availability: language === 'en' ? 'Monday-Thursday, 6-9 PM' : 'Lunes a jueves, 6-9 PM',
      location: 'Decatur',
      rating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
    },
    {
      id: '4',
      name: 'Elena Fuentes',
      bio: language === 'en'
        ? 'Biology and Chemistry tutor, pre-med advisor, and lab assistant at GSU.'
        : 'Tutora de Biología y Química, asesora pre-médica y asistente de laboratorio en GSU.',
      specialties: ['Biology', 'Chemistry', 'Pre-Med'],
      availability: language === 'en' ? 'Weekends and Wednesday evenings' : 'Fines de semana y miércoles por la noche',
      location: 'Midtown',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
    },
    {
      id: '5',
      name: 'Roberto Sanchez',
      bio: language === 'en'
        ? 'Business and Economics tutor with experience in finance, accounting, and entrepreneurship.'
        : 'Tutor de Negocios y Economía con experiencia en finanzas, contabilidad y emprendimiento.',
      specialties: ['Business', 'Economics', 'Finance'],
      availability: language === 'en' ? 'Flexible schedule' : 'Horario flexible',
      location: 'Sandy Springs',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
    },
    // Additional mentors
    {
      id: '6',
      name: 'Ana Lucia Ortiz',
      bio: language === 'en'
        ? 'History professor specializing in Latin American studies and immigration history.'
        : 'Profesora de Historia especializada en estudios latinoamericanos e historia de la inmigración.',
      specialties: ['History', 'Latin American Studies', 'Immigration'],
      availability: language === 'en' ? 'Weekdays 1-5 PM' : 'Días laborables 1-5 PM',
      location: 'Brookhaven',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
    },
    {
      id: '7',
      name: 'Diego Morales',
      bio: language === 'en'
        ? 'Physics and Engineering tutor with NASA research experience and robotics expertise.'
        : 'Tutor de Física e Ingeniería con experiencia en investigación de la NASA y experiencia en robótica.',
      specialties: ['Physics', 'Engineering', 'Robotics'],
      availability: language === 'en' ? 'Weekends and Thursday evenings' : 'Fines de semana y jueves por la noche',
      location: 'Dunwoody',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
    },
    {
      id: '8',
      name: 'Sofia Ramirez',
      bio: language === 'en'
        ? 'Psychology professor and mental health counselor specializing in adolescent development and stress management.'
        : 'Profesora de Psicología y consejera de salud mental especializada en desarrollo adolescente y manejo del estrés.',
      specialties: ['Psychology', 'Mental Health', 'Counseling'],
      availability: language === 'en' ? 'Monday, Wednesday, Friday afternoons' : 'Lunes, miércoles y viernes por la tarde',
      location: 'Chamblee',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
    }
  ];

  // Extract all unique specialties
  const allSpecialties = Array.from(
    new Set(mentors.flatMap(mentor => mentor.specialties))
  ).sort();

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = selectedSpecialty 
      ? mentor.specialties.includes(selectedSpecialty)
      : true;
    
    return matchesSearch && matchesSpecialty;
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  // Function to get appropriate icon for specialty
  const getSpecialtyIcon = (specialty: string) => {
    switch(specialty.toLowerCase()) {
      case 'computer science':
      case 'programming':
        return <Code className="h-3 w-3" />;
      case 'mathematics':
      case 'statistics':
        return <Calculator className="h-3 w-3" />;
      case 'biology':
      case 'chemistry':
      case 'physics':
        return <Beaker className="h-3 w-3" />;
      case 'history':
      case 'latin american studies':
        return <History className="h-3 w-3" />;
      case 'english':
      case 'writing':
      case 'spanish':
        return <BookOpen className="h-3 w-3" />;
      case 'test prep':
      case 'college applications':
        return <GraduationCap className="h-3 w-3" />;
      default:
        return <Globe className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">
            {language === 'en' ? 'Mentor Match' : 'Emparejamiento de Mentores'}
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
            placeholder={language === 'en' ? 'Search mentors or topics...' : 'Buscar mentores o temas...'}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'en' ? 'Filter by specialty:' : 'Filtrar por especialidad:'}
        </label>
        <div className="flex flex-wrap gap-2">
          {allSpecialties.map(specialty => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(selectedSpecialty === specialty ? null : specialty)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedSpecialty === specialty 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        {filteredMentors.map(mentor => (
          <div key={mentor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start">
              <img 
                src={mentor.imageUrl} 
                alt={mentor.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-800">{mentor.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium">{mentor.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-1">{mentor.bio}</p>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                    <span className="text-sm text-gray-700">{mentor.availability}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
                    <span className="text-sm text-gray-700">{mentor.location}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">
                    {language === 'en' ? 'Specialties' : 'Especialidades'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.specialties.map(specialty => (
                      <span 
                        key={specialty}
                        className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs flex items-center"
                      >
                        {getSpecialtyIcon(specialty)}
                        <span className="ml-1">{specialty}</span>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-3 rounded-md">
                    {language === 'en' ? 'Connect' : 'Conectar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredMentors.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {language === 'en' 
                ? 'No mentors found matching your criteria.' 
                : 'No se encontraron mentores que coincidan con tus criterios.'}
            </p>
          </div>
        )}
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-6">
        {language === 'en' 
          ? 'Connect with Hispanic mentors in your area for academic and career guidance.' 
          : 'Conéctate con mentores hispanos en tu área para orientación académica y profesional.'}
      </div>
    </div>
  );
};

export default MentorMatch;
  );
};

export default MentorMatch;

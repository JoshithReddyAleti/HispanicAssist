import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { LogOut, Settings, Languages, Mic, BookOpen, MapPin, GraduationCap, Bus, Users } from 'lucide-react';
import VoiceAssistant from './VoiceAssistant';
import HomeworkHelper from './HomeworkHelper';
import ResourceMap from './ResourceMap';
import ScholarshipFinder from './ScholarshipFinder';
import TransitGuide from './TransitGuide';
import MentorMatch from './MentorMatch';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('voice');
  const [language, setLanguage] = useState<'en' | 'es'>(user.preferredLanguage || 'en');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const toggleLanguage = async () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    
    // Update user preference in Supabase
    try {
      await supabase.auth.updateUser({
        data: { preferredLanguage: newLanguage }
      });
    } catch (error) {
      console.error('Error updating language preference:', error);
    }
  };

  const tabs = [
    { id: 'voice', name: language === 'en' ? 'Voice Assistant' : 'Asistente de Voz', icon: <Mic className="h-5 w-5" /> },
    { id: 'homework', name: language === 'en' ? 'Homework Helper' : 'Ayudante de Tareas', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'resources', name: language === 'en' ? 'Resource Map' : 'Mapa de Recursos', icon: <MapPin className="h-5 w-5" /> },
    { id: 'scholarships', name: language === 'en' ? 'Scholarships' : 'Becas', icon: <GraduationCap className="h-5 w-5" /> },
    { id: 'transit', name: language === 'en' ? 'Transit Guide' : 'Guía de Transporte', icon: <Bus className="h-5 w-5" /> },
    { id: 'mentors', name: language === 'en' ? 'Mentor Match' : 'Emparejamiento de Mentores', icon: <Users className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Hispanic Assist</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <Languages className="h-5 w-5" />
                <span>{language === 'en' ? 'English' : 'Español'}</span>
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">
                  {language === 'en' ? 'Logout' : 'Cerrar Sesión'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? 'Welcome' : 'Bienvenido'}, {user.firstName || user.email}!
          </h2>
          <p className="text-gray-600 mt-1">
            {language === 'en' 
              ? 'How can we assist you today?' 
              : '¿Cómo podemos ayudarte hoy?'}
          </p>
        </div>
        
        <div className="mb-6 overflow-x-auto">
          <nav className="flex space-x-4 border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {activeTab === 'voice' && <VoiceAssistant preferredLanguage={language} />}
          {activeTab === 'homework' && <HomeworkHelper preferredLanguage={language} />}
          {activeTab === 'resources' && <ResourceMap preferredLanguage={language} />}
          {activeTab === 'scholarships' && <ScholarshipFinder preferredLanguage={language} />}
          {activeTab === 'transit' && <TransitGuide preferredLanguage={language} />}
          {activeTab === 'mentors' && <MentorMatch preferredLanguage={language} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
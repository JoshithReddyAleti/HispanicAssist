export interface User {
  id: string;
  email: string;
  isGSUStudent: boolean;
  isGSUAlumni: boolean;
  firstName?: string;
  lastName?: string;
  preferredLanguage: 'en' | 'es';
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  category: 'legal' | 'education' | 'healthcare' | 'community' | 'employment';
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  eligibility: string;
  amount: string;
  deadline: string;
  website: string;
}

export interface Mentor {
  id: string;
  userId: string;
  specialties: string[];
  availability: string;
  bio: string;
  rating: number;
  latitude?: number;
  longitude?: number;
}

export interface TransitRoute {
  id: string;
  name: string;
  type: 'bus' | 'train';
  stops: string[];
  schedule: string;
}

export interface CarpoolOffer {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  departureTime: string;
  returnTime?: string;
  seatsAvailable: number;
  notes?: string;
}
'use client';
import { Search } from 'lucide-react';
import { SearchFilters } from '@/types';
import { useState } from 'react';

interface SearchBarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

const PROVINCES = ['Centre', 'Littoral', 'Ouest', 'Nord', 'Extrême-Nord', 'Sud', 'Sud-Ouest', 'Nord-Ouest', 'Est', 'Adamaoua'];

// CLASSES COMPLÈTES - Système éducatif camerounais
const CLASS_GROUPS = {
  'Primaire Francophone': [
    'CP1', 'CP2', 'CE1', 'CE2', 'CM1', 'CM2'
  ],
  'Primary Anglophone': [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6'
  ],
  'Secondaire Francophone (Collège)': [
    '6ème', '5ème', '4ème', '3ème'
  ],
  'Secondaire Francophone (Lycée)': [
    'Seconde', 'Première', 'Terminale'
  ],
  'Secondary Anglophone (Ordinary Level)': [
    'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5'
  ],
  'Secondary Anglophone (Advanced Level)': [
    'Lower Sixth', 'Upper Sixth'
  ],
  'Supérieur / Higher Education': [
    'Licence 1 / Year 1', 
    'Licence 2 / Year 2', 
    'Licence 3 / Year 3',
    'Master 1 / Year 4', 
    'Master 2 / Year 5', 
    'Doctorat / PhD'
  ]
};

const ALL_CLASSES = Object.values(CLASS_GROUPS).flat();

// MATIÈRES COMPLÈTES - Francophone + Anglophone (Primaire à Université)
const SUBJECT_GROUPS = {
  'Sciences (Francophone)': [
    'Mathématiques', 'Physique', 'Chimie', 'Sciences de la Vie et de la Terre (SVT)', 
    'Sciences Physiques', 'Sciences Naturelles', 'Informatique', 'Technologie'
  ],
  'Sciences (Anglophone)': [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 
    'Information Technology (IT)', 'Further Mathematics', 'Pure Mathematics'
  ],
  'Langues (Francophone)': [
    'Français', 'Anglais', 'Allemand', 'Espagnol', 'Italien', 
    'Arabe', 'Latin', 'Grec'
  ],
  'Languages (Anglophone)': [
    'English Language', 'French', 'German', 'Spanish', 'Latin', 'Greek'
  ],
  'Littérature (Francophone)': [
    'Littérature Française', 'Littérature Comparée', 'Études Littéraires'
  ],
  'Literature (Anglophone)': [
    'English Literature', 'Literature in English', 'Comparative Literature'
  ],
  'Sciences Humaines (Francophone)': [
    'Histoire', 'Géographie', 'Philosophie', 'Psychologie', 'Sociologie', 
    'Économie', 'Sciences Économiques et Sociales (SES)', 'Éducation Civique'
  ],
  'Humanities (Anglophone)': [
    'History', 'Geography', 'Philosophy', 'Psychology', 'Sociology', 
    'Economics', 'Civic Education', 'Religious Studies'
  ],
  'Commerce & Gestion (Francophone)': [
    'Comptabilité', 'Gestion', 'Marketing', 'Économie Gestion', 
    'Droit des Affaires', 'Management'
  ],
  'Business & Management (Anglophone)': [
    'Accounting', 'Business Studies', 'Management', 'Marketing', 
    'Economics', 'Business Law', 'Finance'
  ],
  'Primaire (Francophone)': [
    'Lecture', 'Écriture', 'Calcul', 'Éveil Scientifique', 
    'Éducation Civique', 'Dessin', 'Éducation Physique et Sportive (EPS)'
  ],
  'Primary (Anglophone)': [
    'Reading', 'Writing', 'Arithmetic', 'Science', 
    'Social Studies', 'Drawing', 'Physical Education (PE)'
  ],
  'Arts & Culture': [
    'Arts Plastiques', 'Dessin', 'Peinture', 'Musique', 'Théâtre', 'Cinéma',
    'Fine Arts', 'Drawing', 'Painting', 'Music', 'Theatre', 'Dance'
  ],
  'Sport & Éducation Physique': [
    'Éducation Physique et Sportive (EPS)', 'Sport', 'Entraînement Sportif',
    'Physical Education (PE)', 'Sports Science', 'Coaching'
  ],
  'Professionnelles & Techniques': [
    'Génie Civil', 'Génie Mécanique', 'Génie Électrique', 
    'Hotellerie', 'Tourisme', 'Cuisine', 'Coiffure', 'Couture',
    'Civil Engineering', 'Mechanical Engineering', 'Electrical Engineering',
    'Hospitality', 'Tourism', 'Catering', 'Hairdressing', 'Tailoring'
  ]
};

const ALL_SUBJECTS = Object.values(SUBJECT_GROUPS).flat();

export default function SearchBar({ filters, onFilterChange, onSearch, isLoading }: SearchBarProps) {
  return (
    <div className="p-4 space-y-3 bg-slate-800 rounded-xl">
      {/* Province */}
      <select 
        className="w-full p-3 rounded-lg bg-slate-900 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        value={filters.province}
        onChange={(e) => onFilterChange({ ...filters, province: e.target.value })}
      >
        <option value="">Toutes les provinces / All provinces</option>
        {PROVINCES.map(province => (
          <option key={province} value={province}>{province}</option>
        ))}
      </select>
      
      {/* Ville */}
      <input 
        type="text" 
        placeholder="Ville / Town (ex: Yaoundé, Douala, Buea, Bamenda, Garoua...)"
        className="w-full p-3 rounded-lg bg-slate-900 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        value={filters.city}
        onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
      />
      
      {/* Classes avec groupes */}
      <select 
        className="w-full p-3 rounded-lg bg-slate-900 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        value={filters.class}
        onChange={(e) => onFilterChange({ ...filters, class: e.target.value })}
      >
        <option value="">Toutes les classes / All classes</option>
        {Object.entries(CLASS_GROUPS).map(([group, classes]) => (
          <optgroup key={group} label={group}>
            {classes.map(className => (
              <option key={className} value={className}>{className}</option>
            ))}
          </optgroup>
        ))}
      </select>
      
      {/* Matières avec groupes */}
      <select 
        className="w-full p-3 rounded-lg bg-slate-900 text-white border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        value={filters.subject}
        onChange={(e) => onFilterChange({ ...filters, subject: e.target.value })}
      >
        <option value="">Toutes les matières / All subjects</option>
        {Object.entries(SUBJECT_GROUPS).map(([group, subjects]) => (
          <optgroup key={group} label={group}>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </optgroup>
        ))}
      </select>
      
      {/* Bouton recherche */}
      <button 
        onClick={onSearch}
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        <Search size={20} /> 
        {isLoading ? 'Recherche en cours...' : 'Rechercher un répétiteur / Find a tutor'}
      </button>
    </div>
  );
}
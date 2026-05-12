import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SEOConfig {
  title: string;
  description: string;
  caption: string;
}

export interface ContentItem {
  id: string;
  type: 'project' | 'insight';
  title: string;
  category: string;
  date: string;
  image: string;
  description?: string;
  status: 'Published' | 'Draft';
  seo: SEOConfig;
}

interface ContentContextType {
  content: ContentItem[];
  addContent: (item: Omit<ContentItem, 'id' | 'date'>) => void;
  updateContent: (item: ContentItem) => void;
  deleteContent: (id: string) => void;
}

const DEFAULT_CONTENT: ContentItem[] = [
  {
    id: '1',
    type: 'project',
    title: 'Centennial Bridge',
    category: 'Infrastructure',
    date: '2023-11-20',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80&w=2070',
    description: 'Multi-modal transport bridge integrating green corridors.',
    status: 'Published',
    seo: {
      title: 'Centennial Bridge | MADECC Construction Projects',
      description: 'Explore the Centennial Bridge project, a multi-modal transport hub integrating green corridors and sustainable engineering.',
      caption: 'Green infrastructure landmark in the city center.'
    }
  },
  {
    id: '2',
    type: 'project',
    title: 'Skyline Towers',
    category: 'Commercial',
    date: '2023-12-15',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070',
    description: '45-story commercial complex with zero-carbon footprint.',
    status: 'Published',
    seo: {
      title: 'Skyline Towers | Sustainable Commercial Hub',
      description: 'The premier zero-carbon office space in the financial district.',
      caption: 'Redefining the metropolitan horizon.'
    }
  },
  {
    id: '3',
    type: 'insight',
    title: 'The Future of Sustainable Urban Concrete',
    category: 'Innovation',
    date: '2023-10-24',
    image: 'https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=2070',
    status: 'Published',
    seo: {
      title: 'Sustainable Urban Concrete Trends 2026 | MADECC Insights',
      description: 'Discover how eco-friendly concrete is revolutionizing urban construction and reducing carbon footprints.',
      caption: 'Revolutionizing materials for a greener tomorrow.'
    }
  },
  {
    id: '4',
    type: 'insight',
    title: 'Operational Integrity: The Backbone of MADECC',
    category: 'Corporate',
    date: '2024-03-12',
    image: 'https://images.unsplash.com/photo-1454165833767-13009d300067?auto=format&fit=crop&q=80&w=2070',
    status: 'Published',
    seo: {
      title: 'MADECC Corporate Governance | Accounting & Admin Excellence',
      description: 'How centralized command and specialized administrative roles like Accountants and Secretaries ensure structural integrity in business.',
      caption: 'Excellence begins in the office, not just on the field.'
    }
  }
];

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('madecc_content');
    return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
  });

  useEffect(() => {
    localStorage.setItem('madecc_content', JSON.stringify(content));
  }, [content]);

  const addContent = (item: Omit<ContentItem, 'id' | 'date'>) => {
    const newItem: ContentItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };
    setContent(prev => [...prev, newItem]);
  };

  const updateContent = (item: ContentItem) => {
    setContent(prev => prev.map(old => old.id === item.id ? item : old));
  };

  const deleteContent = (id: string) => {
    setContent(prev => prev.filter(item => item.id !== id));
  };

  return (
    <ContentContext.Provider value={{ content, addContent, updateContent, deleteContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}

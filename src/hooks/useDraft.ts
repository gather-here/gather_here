import { useState, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface DraftPost {
  title: string;
  category: string;
  location: string;
  duration: string;
  totalMembers: string;
  personalLink: string;
  targetPosition: Option[];
  recruitments: string;
  techStack: Option[];
  deadline: string;
  content: string;
  place: string;
}

const useDraft = () => {
  const [draft, setDraft] = useState<DraftPost>({
    title: '',
    category: '',
    location: '',
    duration: '',
    totalMembers: '',
    personalLink: '',
    targetPosition: [],
    recruitments: '',
    techStack: [],
    deadline: '',
    content: '',
    place: '',
  });

  useEffect(() => {
    const savedDraft = localStorage.getItem('draftPost');
    if (savedDraft) {
      setDraft(JSON.parse(savedDraft) as DraftPost);
    }
  }, []);

  const updateDraft = <K extends keyof DraftPost>(key: K, value: DraftPost[K]) => {
    setDraft((prevDraft) => ({ ...prevDraft, [key]: value }));
  };

  const saveDraft = () => {
    localStorage.setItem('draftPost', JSON.stringify(draft));
  };

  return { draft, updateDraft, saveDraft };
};

export default useDraft;

import { create } from 'zustand';

// ১. নতুন টাইপ ডিক্লেয়ারেশন
export type DayStatus = 'success' | 'failed' | 'pending';

export interface Attempt {
  id: string | number;
  name: string;
  days: DayStatus[];
}

interface ChallengeStore {
  tasks: {
    prayers_5_waqt: boolean;
    no_porn: boolean;
    no_masturbation: boolean;
    nafal_prayer: boolean;
    quran_reading: boolean;
    walk_minutes: number;
  };
  attemptsHistory: Attempt[]; // নতুন প্রপার্টি
  toggleTask: (task: keyof ChallengeStore['tasks']) => void;
  setWalkMinutes: (minutes: number) => void;
  resetTasks: () => void;
  setAttemptsHistory: (attempts: Attempt[]) => void;
}

export const useChallengeStore = create<ChallengeStore>((set) => ({
  tasks: {
    prayers_5_waqt: false,
    no_porn: false,
    no_masturbation: false,
    nafal_prayer: false,
    quran_reading: false,
    walk_minutes: 0,
  },
  
  // ২. ডেমো ডেটা (যাতে UI ক্র্যাশ না করে, পরে আমরা এটি Supabase থেকে আনবো)
  attemptsHistory: [
    {
      id: 'current',
      name: 'Current Journey',
      days: Array(41).fill('pending') // ৪১ টা pending বক্স
    }
  ],

  toggleTask: (task) =>
    set((state) => ({
      tasks: { ...state.tasks, [task]: typeof state.tasks[task] === 'boolean' ? !state.tasks[task] : state.tasks[task] },
    })),
    
  setWalkMinutes: (minutes) =>
    set((state) => ({
      tasks: { ...state.tasks, walk_minutes: minutes },
    })),
    
  resetTasks: () => set({
    tasks: {
      prayers_5_waqt: false,
      no_porn: false,
      no_masturbation: false,
      nafal_prayer: false,
      quran_reading: false,
      walk_minutes: 0,
    }
  }),
  
  setAttemptsHistory: (attempts) => set({ attemptsHistory: attempts }),
}));
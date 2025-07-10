
import { useState, useEffect } from 'react';

interface Profile {
  name: string;
  age: number;
  createdAt: string;
}

interface Habit {
  id: string;
  name: string;
  description: string;
  days: number[];
  category: string;
  reminderTime?: string;
  createdAt: string;
}

interface Completion {
  id: string;
  habitId: string;
  date: string;
  completedAt: string;
}

interface Score {
  id: string;
  habitId: string;
  date: string;
  score: number;
  createdAt: string;
}

const STORAGE_KEYS = {
  PROFILE: 'habit-tracker-profile',
  HABITS: 'habit-tracker-habits',
  COMPLETIONS: 'habit-tracker-completions',
  SCORES: 'habit-tracker-scores'
};

export const useHabitData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [scores, setScores] = useState<Score[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
        const savedHabits = localStorage.getItem(STORAGE_KEYS.HABITS);
        const savedCompletions = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
        const savedScores = localStorage.getItem(STORAGE_KEYS.SCORES);

        if (savedProfile) setProfile(JSON.parse(savedProfile));
        if (savedHabits) setHabits(JSON.parse(savedHabits));
        if (savedCompletions) setCompletions(JSON.parse(savedCompletions));
        if (savedScores) setScores(JSON.parse(savedScores));
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
    cleanOldData();
  }, []);

  // Clean data older than 30 days
  const cleanOldData = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

    const cleanCompletions = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETIONS) || '[]')
      .filter((c: Completion) => c.date >= cutoffDate);
    
    const cleanScores = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCORES) || '[]')
      .filter((s: Score) => s.date >= cutoffDate);

    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(cleanCompletions));
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(cleanScores));
  };

  // Save data to localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
  }, [completions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
  }, [scores]);

  const createProfile = (profileData: { name: string; age: number }) => {
    const newProfile: Profile = {
      ...profileData,
      createdAt: new Date().toISOString()
    };
    setProfile(newProfile);
  };

  const addHabit = (habitData: {
    name: string;
    description: string;
    days: number[];
    reminderTime?: string;
    category: string;
  }) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const completeHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingCompletion = completions.find(c => 
      c.habitId === habitId && c.date === today
    );

    if (!existingCompletion) {
      const newCompletion: Completion = {
        id: Date.now().toString(),
        habitId,
        date: today,
        completedAt: new Date().toISOString()
      };
      setCompletions(prev => [...prev, newCompletion]);
    }
  };

  const addScore = (habitId: string, score: number) => {
    const today = new Date().toISOString().split('T')[0];
    const existingScore = scores.find(s => 
      s.habitId === habitId && s.date === today
    );

    if (existingScore) {
      setScores(prev => prev.map(s => 
        s.id === existingScore.id ? { ...s, score } : s
      ));
    } else {
      const newScore: Score = {
        id: Date.now().toString(),
        habitId,
        date: today,
        score,
        createdAt: new Date().toISOString()
      };
      setScores(prev => [...prev, newScore]);
    }
  };

  const getStreakCount = (habitId: string): number => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;

    const sortedCompletions = completions
      .filter(c => c.habitId === habitId)
      .sort((a, b) => b.date.localeCompare(a.date));

    if (sortedCompletions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dayOfWeek = checkDate.getDay();
      
      // Check if this habit should be done on this day
      if (habit.days.includes(dayOfWeek)) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const completed = sortedCompletions.some(c => c.date === dateStr);
        
        if (completed) {
          streak++;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  const getTodayScore = (): number => {
    const today = new Date().toISOString().split('T')[0];
    const todayScores = scores.filter(s => s.date === today);
    
    if (todayScores.length === 0) return 0;
    
    return Math.round(
      todayScores.reduce((sum, s) => sum + s.score, 0) / todayScores.length
    );
  };

  const getWeeklyProgress = (): number[] => {
    const weekProgress = [];
    const today = new Date();
    
    // Start from Monday (day 1) to Sunday (day 0)
    // We need to show Mon, Tue, Wed, Thu, Fri, Sat, Sun in that order
    const daysOrder = [1, 2, 3, 4, 5, 6, 0]; // Monday to Sunday
    
    daysOrder.forEach(targetDay => {
      // Find the most recent occurrence of this day of week
      let checkDate = new Date(today);
      const currentDay = today.getDay();
      
      // Calculate days difference to get to the target day
      let daysDiff = targetDay - currentDay;
      if (daysDiff > 0) {
        daysDiff -= 7; // Go to previous week if target day is ahead
      }
      
      checkDate.setDate(today.getDate() + daysDiff);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayHabits = habits.filter(h => h.days.includes(targetDay));
      const dayCompletions = completions.filter(c => 
        c.date === dateStr && dayHabits.some(h => h.id === c.habitId)
      );
      
      const progress = dayHabits.length > 0 ? 
        Math.round((dayCompletions.length / dayHabits.length) * 100) : 0;
      
      weekProgress.push(progress);
    });
    
    return weekProgress;
  };

  return {
    profile,
    habits,
    completions,
    scores,
    createProfile,
    addHabit,
    completeHabit,
    addScore,
    getStreakCount,
    getTodayScore,
    getWeeklyProgress
  };
};

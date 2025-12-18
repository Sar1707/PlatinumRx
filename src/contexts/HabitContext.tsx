import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Habit {
  id: string;
  name: string;
  category: string;
  color: string;
  days: { [key: string]: boolean };
}

interface HabitContextType {
  habits: Habit[];
  addHabit: (name: string, category: string, color: string) => void;
  toggleDay: (habitId: string, day: string) => void;
  deleteHabit: (habitId: string) => void;
  clearAllHabits: () => void;
  getStreak: (habit: Habit) => number;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

interface HabitProviderProps {
  children: ReactNode;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const HabitProvider: React.FC<HabitProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);

  const getStorageKey = () => `habitforge_habits_${currentUser}`;

  useEffect(() => {
    if (currentUser) {
      const savedHabits = localStorage.getItem(getStorageKey());
      setHabits(savedHabits ? JSON.parse(savedHabits) : []);
    } else {
      setHabits([]);
    }
  }, [currentUser]);

  const saveHabits = (newHabits: Habit[]) => {
    if (currentUser) {
      localStorage.setItem(getStorageKey(), JSON.stringify(newHabits));
    }
    setHabits(newHabits);
  };

  const addHabit = (name: string, category: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      category,
      color,
      days: DAYS.reduce((acc, day) => ({ ...acc, [day]: false }), {}),
    };
    saveHabits([...habits, newHabit]);
  };

  const toggleDay = (habitId: string, day: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          days: {
            ...habit.days,
            [day]: !habit.days[day],
          },
        };
      }
      return habit;
    });
    saveHabits(updatedHabits);
  };

  const deleteHabit = (habitId: string) => {
    saveHabits(habits.filter(h => h.id !== habitId));
  };

  const clearAllHabits = () => {
    saveHabits([]);
  };

  const getStreak = (habit: Habit): number => {
    let streak = 0;
    let foundCompleted = false;
    
    // Iterate backwards from Sunday to find consecutive completed days
    for (let i = DAYS.length - 1; i >= 0; i--) {
      const day = DAYS[i];
      if (habit.days[day]) {
        if (!foundCompleted) {
          foundCompleted = true;
        }
        streak++;
      } else if (foundCompleted) {
        // Break the streak when we find an incomplete day after finding completed ones
        break;
      }
    }
    
    return streak;
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleDay, deleteHabit, clearAllHabits, getStreak }}>
      {children}
    </HabitContext.Provider>
  );
};
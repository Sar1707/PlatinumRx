import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useHabits } from '@/contexts/HabitContext'
import HabitCard from './HabitCard'
import AddHabitDialog from './AddHabitDialog'
import ThemeToggle from './ThemeToggle'
import { Button } from './ui/button'
import {toast} from 'sonner'
import { LogOut, Trash2, Award, Target, Calendar } from 'lucide-react';


const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { habits, clearAllHabits } = useHabits();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleClearAll = ()=>{
    if(habits.length===0)
      {  toast.error("No habits to clear");
        return;
      }

      clearAllHabits();
      toast.success("All habits cleared");
  };

   const totalHabits = habits.length;
  const completedToday = habits.filter(h => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const dayMap: { [key: string]: string } = {
      'Mon': 'Mon', 'Tue': 'Tue', 'Wed': 'Wed', 'Thu': 'Thu',
      'Fri': 'Fri', 'Sat': 'Sat', 'Sun': 'Sun'
    };
    return h.days[dayMap[today] || 'Mon'];
  }).length;
  const totalStreak = habits.reduce((acc, h) => acc + Object.values(h.days).filter(Boolean).length, 0);

   return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">HabitForge</h1>
                <p className="text-xs text-muted-foreground">
                  {currentUser?.slice(0, 3)}****{currentUser?.slice(-3)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <Target className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{totalHabits}</p>
            <p className="text-xs text-muted-foreground">Total Habits</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{completedToday}</p>
            <p className="text-xs text-muted-foreground">Done Today</p>
          </div>
          <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
            <Award className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{totalStreak}</p>
            <p className="text-xs text-muted-foreground">Habits Completed</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">My Habits</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="gap-1 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </Button>
            <AddHabitDialog />
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Target className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building better habits by adding your first one
            </p>
            <AddHabitDialog />
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
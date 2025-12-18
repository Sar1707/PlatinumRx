import React from 'react';
import { type Habit, useHabits } from '@/contexts/HabitContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Flame } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { toggleDay, deleteHabit, getStreak } = useHabits();
  const streak = getStreak(habit);

  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-shadow bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: habit.color }}
            />
            <div>
              <h3 className="font-semibold text-foreground text-lg">{habit.name}</h3>
              <Badge variant="secondary" className="text-xs mt-1">
                {habit.category}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-full">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-bold">{streak}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteHabit(habit.id)}
              className="text-muted-foreground hover:text-destructive h-8 w-8"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(habit.id, day)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                habit.days[day]
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              <span className="text-xs font-medium">{day}</span>
              <div
                className={`w-6 h-6 mt-1 rounded-full flex items-center justify-center ${
                  habit.days[day] ? 'bg-primary-foreground/20' : 'bg-background/50'
                }`}
              >
                {habit.days[day] && (
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
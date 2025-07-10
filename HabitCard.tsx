
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Star } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  description: string;
  days: number[];
  category: string;
  reminderTime?: string;
}

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  score: number;
  streak: number;
  onComplete: () => void;
  onScore: (score: number) => void;
  showAllDays?: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  score,
  streak,
  onComplete,
  onScore,
  showAllDays = false
}) => {
  const [showScoring, setShowScoring] = useState(false);
  const [tempScore, setTempScore] = useState(score || 70);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activeDays = habit.days.length === 7 ? 'Daily' : 
    habit.days.map(d => dayNames[d]).join(', ');

  const handleComplete = () => {
    if (!isCompleted) {
      onComplete();
      setShowScoring(true);
    }
  };

  const handleScoreSubmit = () => {
    onScore(tempScore);
    setShowScoring(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStreakBadgeColor = (streak: number) => {
    if (streak >= 7) return 'bg-green-500';
    if (streak >= 3) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className={`transition-all duration-200 ${
      isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold ${
                isCompleted ? 'text-green-700 line-through' : 'text-gray-800'
              }`}>
                {habit.name}
              </h3>
              {streak > 0 && (
                <Badge 
                  className={`text-white ${getStreakBadgeColor(streak)}`}
                  variant="secondary"
                >
                  {streak} day streak 🔥
                </Badge>
              )}
            </div>
            {habit.description && (
              <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>📅 {activeDays}</span>
              <Badge variant="outline">{habit.category}</Badge>
              {habit.reminderTime && (
                <span>⏰ {habit.reminderTime}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isCompleted && score > 0 && (
              <div className={`flex items-center gap-1 ${getScoreColor(score)}`}>
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{score}</span>
              </div>
            )}
            <Button
              onClick={handleComplete}
              disabled={isCompleted}
              size="sm"
              className={isCompleted ? 'bg-green-500 hover:bg-green-500' : ''}
            >
              <Check className="w-4 h-4" />
              {isCompleted ? 'Done' : 'Complete'}
            </Button>
          </div>
        </div>

        {showAllDays && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex gap-1">
              {dayNames.map((day, index) => (
                <div
                  key={day}
                  className={`flex-1 text-center py-1 px-2 rounded text-xs ${
                    habit.days.includes(index)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        )}

        {showScoring && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-3">Rate your performance today:</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Score: {tempScore}/100</span>
                  <span className={getScoreColor(tempScore)}>
                    {tempScore >= 80 ? 'Excellent!' : 
                     tempScore >= 60 ? 'Good job!' : 'Keep trying!'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={tempScore}
                  onChange={(e) => setTempScore(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleScoreSubmit}
                  size="sm"
                  className="flex-1"
                >
                  Save Score
                </Button>
                <Button
                  onClick={() => setShowScoring(false)}
                  variant="outline"
                  size="sm"
                >
                  Skip
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCard;

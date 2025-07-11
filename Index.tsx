
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Plus, Check, Star, Bell } from "lucide-react";
import ProfileSetup from "@/components/ProfileSetup";
import HabitForm from "@/components/HabitForm";
import HabitCard from "@/components/HabitCard";
import ProfileSection from "@/components/ProfileSection";
import NotificationSettings from "@/components/NotificationSettings";
import { useHabitData } from "@/hooks/useHabitData";
import { useNotifications } from "@/hooks/useNotifications";

const Index = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const {
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
  } = useHabitData();

  const { requestPermission, scheduleNotification } = useNotifications();

  useEffect(() => {
    requestPermission();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayHabits = habits.filter(habit => 
    habit.days.includes(new Date().getDay()) || habit.days.length === 7
  );

  const todayScore = getTodayScore();
  const weeklyProgress = getWeeklyProgress();

  if (!profile) {
    return <ProfileSetup onSave={createProfile} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-gray-600 mt-1">Let's build great habits together</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotifications(true)}
              className="flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          </div>
        </div>

        {/* Today's Score */}
        <Card className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Today's Score</h3>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold">{todayScore}/100</div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-current" />
                    <span>Keep it up!</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Completed Habits</p>
                <p className="text-2xl font-bold">
                  {completions.filter(c => c.date === today).length}/{todayHabits.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg shadow-sm">
          {[
            { id: 'today', label: 'Today', icon: Calendar },
            { id: 'habits', label: 'My Habits', icon: Check },
            { id: 'profile', label: 'Profile', icon: User }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'today' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Today's Habits</h2>
              <Button
                onClick={() => setShowHabitForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Habit
              </Button>
            </div>

            {todayHabits.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No habits for today
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Add your first habit to get started on your journey!
                  </p>
                  <Button onClick={() => setShowHabitForm(true)}>
                    Add Your First Habit
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {todayHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    isCompleted={completions.some(c => 
                      c.habitId === habit.id && c.date === today
                    )}
                    score={scores.find(s => 
                      s.habitId === habit.id && s.date === today
                    )?.score || 0}
                    streak={getStreakCount(habit.id)}
                    onComplete={() => completeHabit(habit.id)}
                    onScore={(score) => addScore(habit.id, score)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'habits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">All Habits</h2>
              <Button
                onClick={() => setShowHabitForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Habit
              </Button>
            </div>

            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                    const dayProgress = weeklyProgress[index] || 0;
                    return (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-12 text-sm font-medium">{day}</div>
                        <Progress value={dayProgress} className="flex-1" />
                        <Badge variant="secondary">{dayProgress}%</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={completions.some(c => 
                    c.habitId === habit.id && c.date === today
                  )}
                  score={scores.find(s => 
                    s.habitId === habit.id && s.date === today
                  )?.score || 0}
                  streak={getStreakCount(habit.id)}
                  onComplete={() => completeHabit(habit.id)}
                  onScore={(score) => addScore(habit.id, score)}
                  showAllDays={true}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfileSection
            profile={profile}
            totalHabits={habits.length}
            completedToday={completions.filter(c => c.date === today).length}
            averageScore={scores.length ? 
              Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length) : 0
            }
          />
        )}

        {/* Modals */}
        {showHabitForm && (
          <HabitForm
            onSave={(habit) => {
              addHabit(habit);
              setShowHabitForm(false);
              // Schedule notifications for the new habit
              if (habit.reminderTime) {
                scheduleNotification(habit.name, habit.reminderTime);
              }
            }}
            onClose={() => setShowHabitForm(false)}
          />
        )}

        {showNotifications && (
          <NotificationSettings
            habits={habits}
            onClose={() => setShowNotifications(false)}
            onSchedule={scheduleNotification}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

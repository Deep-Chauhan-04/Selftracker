
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, Target, Star } from "lucide-react";

interface Profile {
  name: string;
  age: number;
  createdAt: string;
}

interface ProfileSectionProps {
  profile: Profile;
  totalHabits: number;
  completedToday: number;
  averageScore: number;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  profile,
  totalHabits,
  completedToday,
  averageScore
}) => {
  const joinDate = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg font-semibold">{profile.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Age</label>
                <p className="text-lg font-semibold">{profile.age} years old</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Member since</label>
                <p className="text-lg font-semibold">{joinDate}</p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{totalHabits}</div>
            <p className="text-gray-600">Total Habits</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{completedToday}</div>
            <p className="text-gray-600">Completed Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{averageScore}</div>
            <p className="text-gray-600">Average Score</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievement Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {totalHabits >= 1 && (
              <Badge className="bg-green-500 text-white">🌱 First Habit</Badge>
            )}
            {totalHabits >= 5 && (
              <Badge className="bg-blue-500 text-white">🎯 Habit Master</Badge>
            )}
            {averageScore >= 80 && (
              <Badge className="bg-purple-500 text-white">⭐ High Achiever</Badge>
            )}
            {completedToday >= 3 && (
              <Badge className="bg-orange-500 text-white">🔥 Daily Champion</Badge>
            )}
            <Badge variant="outline" className="text-gray-400">
              🏆 More badges coming soon...
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;

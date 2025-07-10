
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Bell, Clock } from "lucide-react";

interface Habit {
  id: string;
  name: string;
  reminderTime?: string;
  days: number[];
}

interface NotificationSettingsProps {
  habits: Habit[];
  onClose: () => void;
  onSchedule: (habitName: string, time: string) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  habits,
  onClose,
  onSchedule
}) => {
  const habitsWithReminders = habits.filter(h => h.reminderTime);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const testNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Habit Tracker', {
        body: 'This is a test notification! 🎉',
        icon: '/favicon.ico'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Notification Status</h3>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm">
                {Notification.permission === 'granted' ? (
                  <span className="text-green-600">✅ Notifications enabled</span>
                ) : Notification.permission === 'denied' ? (
                  <span className="text-red-600">❌ Notifications blocked</span>
                ) : (
                  <span className="text-yellow-600">⚠️ Notifications not enabled</span>
                )}
              </p>
              {Notification.permission === 'granted' && (
                <Button
                  onClick={testNotification}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Test Notification
                </Button>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Active Reminders ({habitsWithReminders.length})</h3>
            {habitsWithReminders.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No habits with reminders set. Add reminder times when creating habits to get notifications.
              </p>
            ) : (
              <div className="space-y-3">
                {habitsWithReminders.map(habit => (
                  <div key={habit.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{habit.name}</h4>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {habit.reminderTime}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      {habit.days.length === 7 ? 'Daily' : 
                       habit.days.map(d => dayNames[d]).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>💡 Tips:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Set reminder times when creating habits</li>
              <li>Notifications work best when the app is open</li>
              <li>Enable browser notifications for best experience</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;

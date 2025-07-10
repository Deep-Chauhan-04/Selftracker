
import { useEffect } from 'react';

export const useNotifications = () => {
  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const scheduleNotification = (habitName: string, time: string) => {
    if (Notification.permission !== 'granted') {
      console.log('Notifications not granted');
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      new Notification(`Habit Reminder: ${habitName}`, {
        body: `Time to work on your habit: ${habitName}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });

      // Reschedule for next day
      scheduleNotification(habitName, time);
    }, timeUntilNotification);

    console.log(`Notification scheduled for ${habitName} at ${time}`);
  };

  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Habit Tracker Test', {
        body: 'This is a test notification! 🎉',
        icon: '/favicon.ico'
      });
    }
  };

  return {
    requestPermission,
    scheduleNotification,
    sendTestNotification
  };
};

import { useEffect, useState } from 'react';
import { User, CheckCircle, XCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { supabase } from '../supabase';

const MedicationSummaryCard = () => {
  const [greeting, setGreeting] = useState('Hello');
  const [streak, setStreak] = useState(0);
  const [todayTaken, setTodayTaken] = useState(false);
  const [monthlyRate, setMonthlyRate] = useState(0);

  const todayStr = dayjs().format('YYYY-MM-DD');
  const currentMonth = dayjs().format('YYYY-MM');

  useEffect(() => {
    const hour = dayjs().hour();
    if (hour < 12) setGreeting('Good Morning!');
    else if (hour < 17) setGreeting('Good Afternoon!');
    else setGreeting('Good Evening!');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

  
      const { data: logs, error } = await supabase
        .from('medicationLog')
        .select('date_taken')
        .eq('user_id', user.id);

      if (error || !logs) return;

      const uniqueDates = new Set(logs.map(log => log.date_taken));

 
      setTodayTaken(uniqueDates.has(todayStr));

      const monthLogs = Array.from(uniqueDates).filter(date =>
        date.startsWith(currentMonth)
      );
      const rate = (monthLogs.length / dayjs().date()) * 100;
      setMonthlyRate(Math.round(rate));

      const sortedDates = [...uniqueDates].sort().reverse();
      let streakCount = 0;
      let checkDate = dayjs();
      for (let i = 0; i < sortedDates.length; i++) {
        if (dayjs(sortedDates[i]).isSame(checkDate, 'day')) {
          streakCount++;
          checkDate = checkDate.subtract(1, 'day');
        } else {
          break;
        }
      }
      setStreak(streakCount);
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 text-white p-6 rounded-xl shadow-lg ">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-white bg-opacity-20 p-3 rounded-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{greeting}</h2>
          <p className="text-sm">Ready to stay on track with your medication?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
          <div className="text-xl font-semibold">{streak}</div>
          <div className="text-sm">Day Streak</div>
        </div>

        <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center flex flex-col items-center">
          {todayTaken ? (
            <CheckCircle className="w-5 h-5 mb-1 text-green-300" />
          ) : (
            <XCircle className="w-5 h-5 mb-1 text-red-300" />
          )}
          <div className="text-sm">Today's Status</div>
        </div>

        <div className="bg-white bg-opacity-10 p-4 rounded-lg text-center">
          <div className="text-xl font-semibold">{monthlyRate}%</div>
          <div className="text-sm">Monthly Rate</div>
        </div>
      </div>
    </div>
  );
};

export default MedicationSummaryCard;

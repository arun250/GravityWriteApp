import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { supabase } from '../supabase';


interface CalendarProps {
  onMarkAsTaken: () => void;
  hasMarkedToday: boolean;
  medicationLogs: { date_taken: string }[];

}

const Calendar: React.FC<CalendarProps> = ({ onMarkAsTaken, hasMarkedToday,medicationLogs }) => {
  const [markedDates, setMarkedDates] = useState<{ [date: string]: boolean }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const today = dayjs();
  const currentMonth = today.month();
  const currentYear = today.year();

  const daysInMonth = today.daysInMonth();

  useEffect(() => {
    const fetchMarkedDates = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('medicationLog')
        .select('date_taken')
        .eq('user_id', user.id);

      if (data) {
        const completed: { [date: string]: boolean } = {};
        data.forEach(entry => {
          completed[entry.date_taken] = true;
        });
        setMarkedDates(completed);
      }
    };

    fetchMarkedDates();
  }, []);

  const isMarked = (date: dayjs.Dayjs) => {
    return medicationLogs.some(log => dayjs(log.date_taken).isSame(date, 'day'));
  };




  const handleDateClick = (dateStr: string) => {
    if (dateStr === today.format('YYYY-MM-DD') && !hasMarkedToday) {
      setSelectedDate(dateStr);
      onMarkAsTaken();
    }
  };

  const renderDays = () => {
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = dayjs(`${currentYear}-${currentMonth + 1}-${day}`);
      const dateStr = dateObj.format('YYYY-MM-DD');
      const isToday = dateStr === today.format('YYYY-MM-DD');
      const isCompleted = markedDates[dateStr];

      days.push(
        <div
          key={day}
          className={`
            border rounded-md p-2 text-center cursor-pointer
            ${isToday ? 'bg-blue-100 border-blue-400' : ''}
            ${isCompleted ? 'bg-green-100 border-green-500' : ''}
            ${dateObj.isBefore(today, 'day') && !isCompleted ? 'opacity-50' : ''}
            
          `}
          onClick={() => handleDateClick(dateStr)}
        >
          <div>{day}</div>
          {isCompleted && (
            <div className="text-green-600 text-lg font-bold">✔️</div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-4 text-center">{today.format('MMMM YYYY')}</h3>
      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>
      <div className="flex justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded-full"></div> Taken</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded-full"></div> Today</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-300 rounded-full"></div> Missed</div>
      </div>
    </div>
  );
};

export default Calendar;

import React from 'react';

interface CountdownTimerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  days,
  hours,
  minutes,
  seconds,
}) => {
  return (
    <div className="flex gap-4 justify-center w-full">
      <div className="bg-[#2a3a2a] rounded-md p-4 text-center w-full">
        <div className="text-white text-xl font-bold">{days}</div>
        <div className="text-gray-400 text-sm">Days</div>
      </div>
      <div className="bg-[#2a3a2a] rounded-md p-4 text-center w-full">
        <div className="text-white text-xl font-bold">{hours}</div>
        <div className="text-gray-400 text-sm">Hours</div>
      </div>
      <div className="bg-[#2a3a2a] rounded-md p-4 text-center w-full">
        <div className="text-white text-xl font-bold">{minutes}</div>
        <div className="text-gray-400 text-sm">Minutes</div>
      </div>
      <div className="bg-[#2a3a2a] rounded-md p-4 text-center w-full">
        <div className="text-white text-xl font-bold">{seconds}</div>
        <div className="text-gray-400 text-sm">Seconds</div>
      </div>
    </div>
  );
};

export default CountdownTimer;

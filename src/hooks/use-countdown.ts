"use client";

import { useState, useEffect } from "react";

export function useCountdown(initialSeconds: number = 300) { // 300 seconds = 5 minutes
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return { 
    timeLeft, 
    formattedTime: formatTime(timeLeft), 
    isFinished: timeLeft === 0,
    reset: () => setTimeLeft(initialSeconds)
  };
}
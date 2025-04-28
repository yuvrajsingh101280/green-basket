import { useEffect, useState } from "react";
import React from "react";
import { assets } from "../assets/assets";

export default function CommingSoon() {
  // Set the launch date to 30 days from now
  const launchDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fffbfb] p-6 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center animate-[backgroundAnimation_20s_linear_infinite] z-0"
        style={{ backgroundImage: `url(${assets.bg})` }}
      ></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        {/* Logo */}
        {/* Logo */}
        {/* Logo */}
        <div className="mb-4 bg-white rounded-full p-2 flex items-center justify-center w-fit shadow-md">
          <img
            src={assets.logo1}
            alt="ChocoUI Logo"
            className="h-24 sm:h-32 md:h-56 lg:h-48 xl:h-56 w-auto object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-5xl md:text-6xl text-gray-100">
              Launching Soon
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-[#7fd957] italic">
              Your Daily Basket of Goodness.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-200">
                  {value}
                </div>
                <div className="text-xs uppercase tracking-widest text-gray-100">
                  {unit}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-900 to-transparent"></div>

          {/* Email Notification Form */}
          <div className="space-y-4">
            <p className="text-gray-100">Get notified at launch.</p>
            <form
              action="https://formspree.io/f/manedrng"
              method="POST"
              className="space-y-3"
            >
              <input
                id="email"
                name="Email"
                type="email"
                placeholder="Your email address"
                required
                className="w-full p-3 rounded-md border border-gray-800 bg-[#121111] text-white placeholder-gray-100 focus:outline-none focus:border-[#2BAF55]"
              />
              <button
                type="submit"
                className="w-full p-3 bg-[#7fd957] hover:bg-[#2dca5f] text-white rounded-md transition duration-200"
              >
                Notify Me
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-black text-xs mt-6">
            &copy; {new Date().getFullYear()} GreenBasket
          </div>
        </div>
      </div>

      {/* Top Gradient Line */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2BAF55] via-[#0f732f] to-[#2BAF55]"></div>
    </div>
  );
}

'use client';
import { useState } from 'react';

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000); // Reset after 3 seconds
  };

  return (
    <div className="bg-storeWhite py-20 border-t border-borderGray text-center px-4">
      <h2 className="text-3xl font-black uppercase tracking-widest text-storeBlack mb-4">
        Join Our Community!
      </h2>
      <p className="text-storeBlack/60 text-sm mb-8 max-w-lg mx-auto">
        Sign up for our newsletter and receive 10% off your first order.
      </p>
      <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 relative">
        <input 
          type="email" 
          required
          placeholder="Email address" 
          className="flex-1 bg-cardGray px-6 py-4 text-sm font-medium outline-none border border-transparent focus:border-storeBlack transition-colors" 
        />
        <button type="submit" className="bg-storeBlack text-storeWhite px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-storeBlack/80 transition-colors">
          {subscribed ? "Subscribed!" : "Subscribe"}
        </button>
      </form>
    </div>
  );
}
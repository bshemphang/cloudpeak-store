'use client';
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <ScrollReveal>
      <div className="bg-cardGray py-16 md:py-20 border-t border-borderGray text-center px-4">
        <h2 className="font-display text-3xl md:text-5xl uppercase tracking-widest text-midnightNavy mb-4">
          Join Our Community!
        </h2>
        <p className="text-midnightNavy/60 text-sm mb-8 max-w-lg mx-auto">
          Sign up for our newsletter and receive 10% off your first order.
        </p>
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="Email address"
            className="flex-1 bg-storeWhite px-6 py-4 text-sm font-medium outline-none border border-borderGray focus:border-summitGold transition-colors"
          />
          <button
            type="submit"
            className="bg-midnightNavy text-summitGold px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-midnightNavyLight transition-colors"
          >
            {subscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
      </div>
    </ScrollReveal>
  );
}

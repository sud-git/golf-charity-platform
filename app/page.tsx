'use client';

import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 sm:py-24">
          <div className="container-main text-center">
            <div className="mb-6 text-5xl sm:text-6xl">⛳</div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Score. Play. Give Back.
            </h1>
            <p className="text-xl text-primary-light mb-8 max-w-2xl mx-auto">
              Track your golf scores, participate in monthly draws, and support charities you care about.
              Every subscription directly funds the causes that matter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn bg-white text-primary hover:bg-primary-light font-bold">
                Start Free Trial
              </Link>
              <Link href="#features" className="btn border-2 border-white text-white hover:bg-white hover:bg-opacity-10">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="container-main">
            <div className="grid grid-cols-3 gap-4 sm:gap-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">$500K+</div>
                <p className="text-gray-600">Distributed to Charities</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">5000+</div>
                <p className="text-gray-600">Active Players</p>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">12</div>
                <p className="text-gray-600">Monthly Draws</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-light">
          <div className="container-main">
            <h2 className="section-title text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-lg text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Track Scores</h3>
                <p className="text-gray-600">
                  Enter your last 5 golf scores easily. The platform keeps your latest scores to determine draw odds.
                </p>
              </div>

              <div className="card-lg text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-2">Win Prizes</h3>
                <p className="text-gray-600">
                  Monthly draws with prizes for 3, 4, and 5-number matches. Jackpot rollovers keep growing.
                </p>
              </div>

              <div className="card-lg text-center">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-xl font-bold mb-2">Support Charities</h3>
                <p className="text-gray-600">
                  10%+ of your subscription goes directly to the charity you choose. See impact in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white">
          <div className="container-main">
            <h2 className="section-title text-center mb-12">Simple Pricing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="card-lg border-2 border-gray-300">
                <h3 className="text-2xl font-bold mb-2">Monthly</h3>
                <p className="text-4xl font-bold text-primary mb-1">$9.99</p>
                <p className="text-gray-600 mb-6">/month</p>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">✓ Track scores</li>
                  <li className="flex items-center gap-2">✓ Monthly draws</li>
                  <li className="flex items-center gap-2">✓ Charity contribution</li>
                  <li className="flex items-center gap-2">✓ Cancel anytime</li>
                </ul>
                <Link href="/signup?plan=monthly" className="btn-primary w-full">
                  Get Started
                </Link>
              </div>

              <div className="card-lg border-4 border-primary bg-primary-light">
                <div className="bg-primary text-white px-3 py-1 rounded w-fit text-xs font-bold mb-2">
                  POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">Yearly</h3>
                <p className="text-4xl font-bold text-primary mb-1">$99.99</p>
                <p className="text-gray-600 mb-6">/year (Save 17%)</p>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">✓ Track scores</li>
                  <li className="flex items-center gap-2">✓ Monthly draws</li>
                  <li className="flex items-center gap-2">✓ Charity contribution</li>
                  <li className="flex items-center gap-2">✓ 12-month commitment</li>
                </ul>
                <Link href="/signup?plan=yearly" className="btn-primary w-full">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-dark text-white">
          <div className="container-main text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Score, Play, and Give Back?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of golfers making a difference through monthly draws and charity support.
            </p>
            <Link href="/signup" className="btn bg-primary text-white hover:bg-primary-dark font-bold">
              Start Your Free Trial
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

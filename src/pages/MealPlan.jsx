import React from 'react';
import { Helmet } from 'react-helmet';
import MealPlanner from '@/components/MealPlanner';
import Header from '@/components/Header';

const MealPlan = () => {
  return (
    <>
      <Helmet>
        <title>Meal Planning - NutriPlan</title>
      </Helmet>
      <div className="relative min-h-screen bg-gradient-to-b from-green-100 to-blue-200 overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-10 w-48 h-48 bg-green-400/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-32 h-32 bg-red-400/30 rounded-full blur-3xl"></div>
        </div>

        <Header />
        <main className="pt-32 pb-20 px-4 relative z-10">
          <MealPlanner />
        </main>
      </div>
    </>
  );
};

export default MealPlan;

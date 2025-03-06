
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
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="pt-32 pb-20 px-4">
          <MealPlanner />
        </main>
      </div>
    </>
  );
};

export default MealPlan;

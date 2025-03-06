
import React from 'react';
import { Helmet } from 'react-helmet';
import FoodAnalysis from '@/components/FoodAnalysis';
import Header from '@/components/Header';

const Analysis = () => {
  return (
    <>
      <Helmet>
        <title>Food Analysis - NutriPlan</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="pt-32 pb-20 px-4">
          <FoodAnalysis />
        </main>
      </div>
    </>
  );
};

export default Analysis;

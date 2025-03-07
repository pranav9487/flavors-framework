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
      <div className="relative min-h-screen bg-gradient-to-b from-blue-200 to-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('path/to/your/background-image.jpg')] bg-cover bg-center opacity-30"></div>
        
        {/* SVG Background Shapes */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1440 320">
          <path fill="#4ade80" d="M0,128L30,144C60,160,120,192,180,202.7C240,213,300,203,360,186.7C420,171,480,149,540,144C600,139,660,149,720,160C780,171,840,181,900,186.7C960,192,1020,192,1080,186.7C1140,181,1200,171,1260,160C1320,149,1380,139,1410,134.7L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320H0Z"></path>
        </svg>

        <Header />
        <main className="pt-32 pb-20 px-4 relative z-10">
          <FoodAnalysis />
        </main>
      </div>
    </>
  );
};

export default Analysis;

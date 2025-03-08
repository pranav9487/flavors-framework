import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Search, Calendar, Sparkles } from 'lucide-react';

const Index = () => {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Transform scroll position into color values
  const backgroundColor = useTransform(
    scrollY,
    [0, 1000],
    ['#ffffff', '#f0f9ff']
  );

  return (
    <>
      <Helmet>
        <title>NutriPlan - Smart Nutrition & Meal Planning</title>
        <style>
          {`
            @keyframes gridMove {
              0% { transform: translateY(0); }
              100% { transform: translateY(40px); }
            }
            @keyframes float {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
              100% { transform: translateY(0px); }
            }
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </Helmet>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-white">
        {/* Interactive Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Dynamic Gradient Background */}
          <motion.div
            animate={{
              background: [
                'radial-gradient(circle at 0% 0%, #4ade80 0%, transparent 50%)',
                'radial-gradient(circle at 100% 0%, #60a5fa 0%, transparent 50%)',
                'radial-gradient(circle at 100% 100%, #f472b6 0%, transparent 50%)',
                'radial-gradient(circle at 0% 100%, #4ade80 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 opacity-50"
          />

          {/* Additional Animated Shapes */}
          <motion.div
            className="absolute w-48 h-48 bg-green-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: '20%', left: '10%' }}
          />
          <motion.div
            className="absolute w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: '60%', right: '15%' }}
          />
          <motion.div
            className="absolute w-32 h-32 bg-red-400/30 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ bottom: '25%', left: '30%' }}
          />

          {/* Animated Pattern Grid */}
          <div className="absolute inset-0 opacity-[0.05]">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #4ade80 1px, transparent 1px),
                  linear-gradient(to bottom, #4ade80 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                animation: 'gridMove 20s linear infinite',
              }}
            />
          </div>

          {/* Interactive Floating Elements */}
          <motion.div
            animate={{
              x: mousePosition.x * 0.05,
              y: mousePosition.y * 0.05,
            }}
            transition={{ type: "spring", stiffness: 50, damping: 30 }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: -mousePosition.x * 0.05,
              y: -mousePosition.y * 0.05,
            }}
            transition={{ type: "spring", stiffness: 50, damping: 30 }}
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
          />

          {/* Animated Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}

          {/* Animated Shapes */}
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/3 right-1/3 w-32 h-32 border-2 border-primary/20 rounded-full"
          />
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/3 left-1/3 w-24 h-24 border-2 border-green-400/20 rounded-full"
          />
        </div>

        {/* Content */}
        <main className="pt-32 pb-20 relative">
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 space-y-8 max-w-xl"
              >
                <h1 className="text-5xl md:text-6xl font-display font-medium leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-primary">
                  Nutrition Intelligence, <span className="text-primary">Personalized</span> 
                </h1>
                <p className="text-xl text-muted-foreground/90 leading-relaxed">
                  Discover the nutritional profile of any food and create personalized meal plans tailored to your unique needs and preferences.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="h-14 px-8 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Link to="/analysis">
                      Analyze Food
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Link to="/budget-meal">Budget Meal</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Link to="/meal-plan">Create Meal Plan</Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 w-full max-w-md"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2670&auto=format&fit=crop" 
                    alt="Healthy food"
                    className="relative rounded-2xl shadow-xl object-cover aspect-[4/3] w-full transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Sparkles className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">AI-Powered</p>
                        <p className="text-xs text-muted-foreground">Nutrition Analysis</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-medium text-center mb-16"
            >
              Key Features
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm bg-white/80"
              >
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-3">Food Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Get detailed nutritional information for any food item. Analyze macronutrients, micronutrients, calories, and more.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start group">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 transition-transform duration-300 group-hover:scale-110">
                      <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm group-hover:text-primary transition-colors duration-300">Comprehensive macro and micronutrient data</p>
                  </li>
                  <li className="flex items-start group">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 transition-transform duration-300 group-hover:scale-110">
                      <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm group-hover:text-primary transition-colors duration-300">Health benefits and potential concerns</p>
                  </li>
                  <li className="flex items-start group">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 transition-transform duration-300 group-hover:scale-110">
                      <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm group-hover:text-primary transition-colors duration-300">Text search or image-based analysis</p>
                  </li>
                </ul>
                <Button asChild variant="outline" className="mt-8 w-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Link to="/analysis">
                    Try Food Analysis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm bg-white/80"
              >
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-medium mb-3">Personalized Meal Planning</h3>
                <p className="text-muted-foreground mb-6">
                  Get AI-generated meal plans based on your dietary restrictions, health needs, and taste preferences.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start group">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 transition-transform duration-300 group-hover:scale-110">
                      <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm group-hover:text-primary transition-colors duration-300">7-day meal plans with detailed recipes</p>
                  </li>
                  <li className="flex items-start group">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 transition-transform duration-300 group-hover:scale-110">
                      <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm group-hover:text-primary transition-colors duration-300">Customized to your dietary restrictions</p>
                  </li>
                  <li className="flex items-start group">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5 transition-transform duration-300 group-hover:scale-110">
                      <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm group-hover:text-primary transition-colors duration-300">Automatic grocery list generation</p>
                  </li>
                </ul>
                <Button asChild variant="outline" className="mt-8 w-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Link to="/meal-plan">
                    Create Meal Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl p-10 md:p-16 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=2574&auto=format&fit=crop')] opacity-5 mix-blend-overlay bg-cover group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-medium mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-primary">
                  Ready to transform your nutrition?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Get started today with our AI-powered nutrition analysis and meal planning tools. Your personalized journey to better health begins here.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button asChild size="lg" className="text-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Link to="/analysis">
                      Analyze Food
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Link to="/budget-meal">
                      Budget Meal
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="bg-white/80 backdrop-blur-sm text-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <Link to="/meal-plan">
                      Create Meal Plan
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </section>
        </main>
        
        <footer className="py-10 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} NutriPlan. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;

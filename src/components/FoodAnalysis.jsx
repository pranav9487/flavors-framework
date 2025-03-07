import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Search, Upload, Utensils, PieChart, Heart, AlertTriangle } from 'lucide-react';
import { analyzeFoodItem } from '@/utils/geminiService';
import { cn } from '@/lib/utils';

const FoodAnalysis = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [foodName, setFoodName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);

  const handleFoodNameChange = (e) => {
    console.log(foodName);
    setFoodName(e.target.value);
    
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (activeTab === 'text' && !foodName.trim()) {
      toast.error('Please enter a food name');
      return;
    }

    if (activeTab === 'image' && !imageFile) {
      toast.error('Please upload an image');
      return;
    }

    setIsAnalyzing(true);
    toast.info('Analyzing your food...', { duration: 2000 });

    try {
      let searchTerm = foodName;
      let imageData = null;

      if (activeTab === 'image') {
        searchTerm = imageFile.name.replace(/\.[^/.]+$/, "");
        imageData = imagePreview; // This contains the base64 image data
      }

      const data = await analyzeFoodItem(searchTerm, imageData);
      
      if (data.error) {
        toast.error(data.message);
      } else {
        setNutritionData(data);
        toast.success('Analysis complete!');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      if (error.message === 'API key not configured') {
        toast.error('Please configure your Gemini API key in the .env file');
      } else {
        toast.error('Failed to analyze food. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setNutritionData(null);
    setFoodName('');
    setImageFile(null);
    setImagePreview('');
  };

  const NutritionCard = ({ title, children, icon }) => (
    <div className="glass-card rounded-xl p-5 transition-all duration-300 hover:shadow-md animate-fade-up">
      <div className="flex items-center mb-3">
        {icon}
        <h3 className="text-lg font-medium ml-2">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-b from-blue-100 to-white p-6 rounded-lg shadow-lg overflow-hidden">
      {/* SVG Background Shapes */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1440 320">
        <path fill="#4ade80" d="M0,128L30,144C60,160,120,192,180,202.7C240,213,300,203,360,186.7C420,171,480,149,540,144C600,139,660,149,720,160C780,171,840,181,900,186.7C960,192,1020,192,1080,186.7C1140,181,1200,171,1260,160C1320,149,1380,139,1410,134.7L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320H0Z"></path>
      </svg>

      {!nutritionData ? (
        <div className="space-y-6 animate-fade-up">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2 text-primary">Food Nutrition Analysis</h2>
            <p className="text-muted-foreground text-lg">
              Get detailed nutritional information by entering a food name or uploading an image
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-slate-200">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Search size={18} />
                  <span>Text Search</span>
                </TabsTrigger>
                <TabsTrigger value="image" className="flex items-center gap-2">
                  <Upload size={18} />
                  <span>Image Upload</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 mt-2">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter food name (e.g., Apple, Chicken Breast)"
                    value={foodName}
                    onChange={handleFoodNameChange}
                    className="text-lg py-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4 mt-2">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted rounded-lg p-8 transition-all hover:border-muted-foreground/50">
                  {imagePreview ? (
                    <div className="relative w-full">
                      <img 
                        src={imagePreview} 
                        alt="Food preview" 
                        className="max-h-64 rounded-md mx-auto object-contain shadow-lg" 
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center mb-2">
                        Drag and drop an image, or click to browse
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('image-upload').click()}
                        className="transition-all duration-300 hover:bg-primary hover:text-white"
                      >
                        Select Image
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  For best results, upload a clear image of a single food item
                </p>
              </TabsContent>

              <div className="mt-6">
                <Button 
                  className="w-full py-4 text-lg font-medium bg-primary text-white rounded-lg shadow-md transition-all duration-300 hover:bg-primary-dark"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Food'}
                </Button>
              </div>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-up">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-medium">{nutritionData.name}</h2>
            <Button variant="outline" onClick={resetAnalysis}>
              New Analysis
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NutritionCard 
              title="Nutrition Overview" 
              icon={<Utensils className="h-5 w-5 text-primary" />}
            >
              <div className="bg-slate-50 rounded-lg p-4 shadow-md">
                <div className="text-2xl font-medium text-center mb-2">
                  {nutritionData.calories} kcal
                  <div className="text-sm text-muted-foreground">per 100g</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center">
                    <div className="font-medium">{nutritionData.macronutrients.protein}g</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{nutritionData.macronutrients.fat}g</div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{nutritionData.macronutrients.carbs}g</div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                </div>
              </div>
            </NutritionCard>

            <NutritionCard 
              title="Micronutrients" 
              icon={<PieChart className="h-5 w-5 text-amber-500" />}
            >
              <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                {nutritionData.micronutrients.map((nutrient, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{nutrient.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{nutrient.amount}</span>
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {nutrient.dailyValue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </NutritionCard>

            <NutritionCard 
              title="Health Benefits" 
              icon={<Heart className="h-5 w-5 text-rose-500" />}
            >
              <ul className="list-disc pl-5 space-y-1">
                {nutritionData.benefits.map((benefit, index) => (
                  <li key={index} className="text-sm">{benefit}</li>
                ))}
              </ul>
            </NutritionCard>

            <NutritionCard 
              title="Potential Concerns" 
              icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
            >
              <ul className="list-disc pl-5 space-y-1">
                {nutritionData.concerns.map((concern, index) => (
                  <li key={index} className="text-sm">{concern}</li>
                ))}
              </ul>
            </NutritionCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodAnalysis;

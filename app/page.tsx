'use client';

import { useState, useEffect, useCallback } from 'react';
import { plants, categories, wetlandStatusDescriptions, Plant } from './data/plants';

type GameMode = 'menu' | 'flashcard' | 'quiz' | 'results';
type QuizType = 'name' | 'wetland' | 'mixed';

interface QuizQuestion {
  plant: Plant;
  type: 'name' | 'wetland';
  options: string[];
  correct: string;
}

export default function Home() {
  const [mode, setMode] = useState<GameMode>('menu');
  const [category, setCategory] = useState('all');
  const [quizType, setQuizType] = useState<QuizType>('mixed');
  
  // Flashcard state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  
  // Quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Get filtered plants
  const filteredPlants = category === 'all' 
    ? plants 
    : plants.filter(p => p.category === category);
  
  // Shuffle array helper
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  
  // Generate quiz questions
  const generateQuiz = useCallback(() => {
    const shuffledPlants = shuffle(filteredPlants).slice(0, 10);
    const newQuestions: QuizQuestion[] = shuffledPlants.map(plant => {
      const isNameQuestion = quizType === 'name' || (quizType === 'mixed' && Math.random() > 0.5);
      
      if (isNameQuestion) {
        // Scientific name question
        const otherPlants = shuffle(plants.filter(p => p.id !== plant.id)).slice(0, 3);
        const options = shuffle([plant.scientificName, ...otherPlants.map(p => p.scientificName)]);
        return {
          plant,
          type: 'name' as const,
          options,
          correct: plant.scientificName,
        };
      } else {
        // Wetland status question
        const statuses = ['OBL', 'FACW', 'FAC', 'FACU', 'UPL'];
        const otherStatuses = statuses.filter(s => s !== plant.wetlandStatus).slice(0, 3);
        const options = shuffle([plant.wetlandStatus, ...otherStatuses]);
        return {
          plant,
          type: 'wetland' as const,
          options,
          correct: plant.wetlandStatus,
        };
      }
    });
    
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [filteredPlants, quizType]);
  
  // Start quiz
  const startQuiz = () => {
    generateQuiz();
    setMode('quiz');
  };
  
  // Handle quiz answer
  const handleAnswer = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === questions[currentQuestion].correct) {
      setScore(s => s + 1);
    }
  };
  
  // Next question
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setMode('results');
    }
  };
  
  // Flashcard navigation
  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % filteredPlants.length);
    }, 150);
  };
  
  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((i) => (i - 1 + filteredPlants.length) % filteredPlants.length);
    }, 150);
  };
  
  const markKnown = () => {
    const plant = filteredPlants[currentIndex];
    setKnownCards(prev => new Set([...prev, plant.id]));
    nextCard();
  };
  
  // Reset when category changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [category]);
  
  const currentPlant = filteredPlants[currentIndex];
  
  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-800 flex items-center gap-2">
              🌿 VA Plants
            </h1>
            <p className="text-green-600 mt-1">Virginia Native Plants & Wetland Indicators</p>
          </div>
          {mode !== 'menu' && (
            <button
              onClick={() => setMode('menu')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              ← Menu
            </button>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        
        {/* MENU */}
        {mode === 'menu' && (
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      category === cat.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                {filteredPlants.length} plants in this category
              </p>
            </div>
            
            {/* Game Modes */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Flashcards */}
              <button
                onClick={() => { setCurrentIndex(0); setIsFlipped(false); setMode('flashcard'); }}
                className="bg-white rounded-2xl p-6 shadow-lg text-left hover:shadow-xl transition-shadow group"
              >
                <div className="text-4xl mb-3">🎴</div>
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-green-700">Flashcards</h3>
                <p className="text-gray-600 mt-2">
                  Flip cards to learn plant names, wetland status, and characteristics
                </p>
                <div className="mt-4 text-green-600 font-medium">
                  Start Learning →
                </div>
              </button>
              
              {/* Quiz */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-semibold text-gray-800">Quiz Mode</h3>
                <p className="text-gray-600 mt-2">
                  Test your knowledge with multiple choice questions
                </p>
                
                {/* Quiz Type Selection */}
                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="quizType"
                      checked={quizType === 'name'}
                      onChange={() => setQuizType('name')}
                      className="text-green-600"
                    />
                    <span className="text-sm">Scientific Names</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="quizType"
                      checked={quizType === 'wetland'}
                      onChange={() => setQuizType('wetland')}
                      className="text-green-600"
                    />
                    <span className="text-sm">Wetland Status</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="quizType"
                      checked={quizType === 'mixed'}
                      onChange={() => setQuizType('mixed')}
                      className="text-green-600"
                    />
                    <span className="text-sm">Mixed</span>
                  </label>
                </div>
                
                <button
                  onClick={startQuiz}
                  className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Start Quiz →
                </button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Progress</h3>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{knownCards.size}</div>
                  <div className="text-sm text-gray-500">Cards Mastered</div>
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${(knownCards.size / plants.length) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500">{plants.length} total</div>
              </div>
            </div>
            
            {/* Wetland Status Legend */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">💧 Wetland Indicator Status</h3>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                {Object.entries(wetlandStatusDescriptions).map(([code, desc]) => (
                  <div key={code} className="flex items-start gap-2">
                    <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                      code === 'OBL' ? 'bg-blue-600 text-white' :
                      code === 'FACW' ? 'bg-blue-400 text-white' :
                      code === 'FAC' ? 'bg-green-500 text-white' :
                      code === 'FACU' ? 'bg-yellow-500 text-white' :
                      'bg-orange-500 text-white'
                    }`}>
                      {code}
                    </span>
                    <span className="text-gray-600">{desc.split(' - ')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* FLASHCARD MODE */}
        {mode === 'flashcard' && currentPlant && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{currentIndex + 1} / {filteredPlants.length}</span>
              <span>{knownCards.has(currentPlant.id) ? '✅ Mastered' : ''}</span>
            </div>
            
            {/* Card */}
            <div 
              className={`flip-card cursor-pointer ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ minHeight: '400px' }}
            >
              <div className="flip-card-inner relative w-full h-full">
                {/* Front */}
                <div className="flip-card-front absolute inset-0 bg-white rounded-2xl shadow-xl p-6 flex flex-col">
                  {/* Image */}
                  <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={currentPlant.imageUrl} 
                      alt={currentPlant.commonName}
                      className="max-h-64 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=🌿';
                      }}
                    />
                  </div>
                  
                  {/* Question prompt */}
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-2">What is this plant?</p>
                    <p className="text-sm text-gray-400">Tap to reveal answer</p>
                  </div>
                </div>
                
                {/* Back */}
                <div className="flip-card-back absolute inset-0 bg-white rounded-2xl shadow-xl p-6 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-green-800">{currentPlant.commonName}</h2>
                      <p className="text-lg italic text-gray-600">{currentPlant.scientificName}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        currentPlant.wetlandStatus === 'OBL' ? 'bg-blue-600 text-white' :
                        currentPlant.wetlandStatus === 'FACW' ? 'bg-blue-400 text-white' :
                        currentPlant.wetlandStatus === 'FAC' ? 'bg-green-500 text-white' :
                        currentPlant.wetlandStatus === 'FACU' ? 'bg-yellow-500 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {currentPlant.wetlandStatus}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700 capitalize">
                        {currentPlant.category}
                      </span>
                      {currentPlant.native && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                          Native
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700">{currentPlant.description}</p>
                    
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm text-green-800">
                        <strong>Habitat:</strong> {currentPlant.habitat}
                      </p>
                    </div>
                    
                    {currentPlant.funFact && (
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <strong>💡 Fun Fact:</strong> {currentPlant.funFact}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevCard}
                className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl transition-colors"
              >
                ←
              </button>
              
              <button
                onClick={markKnown}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  knownCards.has(currentPlant.id)
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {knownCards.has(currentPlant.id) ? '✅ Mastered' : 'Mark as Known'}
              </button>
              
              <button
                onClick={nextCard}
                className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-2xl transition-colors"
              >
                →
              </button>
            </div>
            
            {/* Keyboard hint */}
            <p className="text-center text-sm text-gray-400">
              Tap card to flip • Use arrows to navigate
            </p>
          </div>
        )}
        
        {/* QUIZ MODE */}
        {mode === 'quiz' && questions.length > 0 && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-green-600">
                Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
            
            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Plant Image */}
              <div className="flex justify-center mb-4">
                <img 
                  src={questions[currentQuestion].plant.imageUrl}
                  alt="Plant"
                  className="max-h-48 rounded-lg object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=🌿';
                  }}
                />
              </div>
              
              {/* Question */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {questions[currentQuestion].plant.commonName}
                </h3>
                <p className="text-gray-600">
                  {questions[currentQuestion].type === 'name' 
                    ? 'What is the scientific name?' 
                    : 'What is the wetland indicator status?'}
                </p>
              </div>
              
              {/* Options */}
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, i) => {
                  const isCorrect = option === questions[currentQuestion].correct;
                  const isSelected = option === selectedAnswer;
                  
                  let buttonClass = 'w-full p-4 rounded-xl text-left font-medium transition-all ';
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += 'bg-green-500 text-white';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += 'bg-red-500 text-white';
                    } else {
                      buttonClass += 'bg-gray-100 text-gray-400';
                    }
                  } else {
                    buttonClass += 'bg-gray-100 hover:bg-gray-200 text-gray-700';
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={buttonClass}
                    >
                      {questions[currentQuestion].type === 'wetland' && (
                        <span className="font-mono mr-2">{option}</span>
                      )}
                      {questions[currentQuestion].type === 'name' && (
                        <span className="italic">{option}</span>
                      )}
                      {showResult && isCorrect && ' ✓'}
                      {showResult && isSelected && !isCorrect && ' ✗'}
                    </button>
                  );
                })}
              </div>
              
              {/* Result feedback */}
              {showResult && (
                <div className={`mt-4 p-4 rounded-xl ${
                  selectedAnswer === questions[currentQuestion].correct
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}>
                  {selectedAnswer === questions[currentQuestion].correct ? (
                    <p>🎉 Correct!</p>
                  ) : (
                    <p>
                      The correct answer is <strong>
                        {questions[currentQuestion].type === 'name' 
                          ? questions[currentQuestion].correct
                          : `${questions[currentQuestion].correct} - ${wetlandStatusDescriptions[questions[currentQuestion].correct]?.split(' - ')[0]}`
                        }
                      </strong>
                    </p>
                  )}
                </div>
              )}
              
              {/* Next button */}
              {showResult && (
                <button
                  onClick={nextQuestion}
                  className="mt-4 w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* RESULTS */}
        {mode === 'results' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">
              {score >= questions.length * 0.8 ? '🏆' : score >= questions.length * 0.6 ? '🌟' : '🌱'}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            
            <p className="text-xl text-gray-600 mb-6">
              You scored <span className="font-bold text-green-600">{score}</span> out of <span className="font-bold">{questions.length}</span>
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div 
                className={`h-4 rounded-full transition-all ${
                  score >= questions.length * 0.8 ? 'bg-green-500' :
                  score >= questions.length * 0.6 ? 'bg-yellow-500' :
                  'bg-orange-500'
                }`}
                style={{ width: `${(score / questions.length) * 100}%` }}
              />
            </div>
            
            <p className="text-gray-600 mb-8">
              {score >= questions.length * 0.8 
                ? 'Excellent! You really know your Virginia plants! 🌿' 
                : score >= questions.length * 0.6 
                ? 'Good job! Keep practicing to improve! 📚'
                : 'Keep studying! Try the flashcards to learn more. 💪'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setMode('menu')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-12 text-center text-sm text-gray-500">
        <p>🌿 Learn Virginia's native plants and wetland indicators</p>
        <p className="mt-1">Data sources: USDA PLANTS Database, Virginia DCR</p>
      </footer>
    </main>
  );
}

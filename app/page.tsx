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

// Clean icon components
const LeafIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 2-4 3-6 3 0 7 3 12 6 15 3-3 6-8 6-15-2 0-4.5-1-6-3z" />
  </svg>
);

const CardIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>
);

const TargetIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ChevronLeft = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const STORAGE_KEY = 'va-plants-progress';

export default function Home() {
  const [mode, setMode] = useState<GameMode>('menu');
  const [category, setCategory] = useState('all');
  const [quizType, setQuizType] = useState<QuizType>('mixed');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  
  // Load persisted progress on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.knownCards && Array.isArray(parsed.knownCards)) {
          setKnownCards(new Set(parsed.knownCards));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsHydrated(true);
  }, []);
  
  // Persist progress on change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        knownCards: Array.from(knownCards),
      }));
    } catch {
      // Ignore localStorage errors
    }
  }, [knownCards, isHydrated]);
  
  const filteredPlants = category === 'all' 
    ? plants 
    : plants.filter(p => p.category === category);
  
  // Fix index bounds when category changes
  useEffect(() => {
    if (currentIndex >= filteredPlants.length) {
      setCurrentIndex(Math.max(0, filteredPlants.length - 1));
    }
    setIsFlipped(false);
  }, [category, filteredPlants.length, currentIndex]);
  
  // Keyboard navigation for flashcards
  useEffect(() => {
    if (mode !== 'flashcard') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevCard();
      } else if (e.key === 'ArrowRight') {
        nextCard();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(f => !f);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, filteredPlants.length, currentIndex]);
  
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };
  
  const generateQuiz = useCallback(() => {
    const shuffledPlants = shuffle(filteredPlants).slice(0, 10);
    const allStatuses = ['OBL', 'FACW', 'FAC', 'FACU', 'UPL'];
    
    const newQuestions: QuizQuestion[] = shuffledPlants.map(plant => {
      const isNameQuestion = quizType === 'name' || (quizType === 'mixed' && Math.random() > 0.5);
      
      if (isNameQuestion) {
        const otherPlants = shuffle(plants.filter(p => p.id !== plant.id)).slice(0, 3);
        const options = shuffle([plant.scientificName, ...otherPlants.map(p => p.scientificName)]);
        return { plant, type: 'name' as const, options, correct: plant.scientificName };
      } else {
        // Fixed: ensure we get exactly 3 OTHER statuses
        const otherStatuses = shuffle(allStatuses.filter(s => s !== plant.wetlandStatus)).slice(0, 3);
        const options = shuffle([plant.wetlandStatus, ...otherStatuses]);
        return { plant, type: 'wetland' as const, options, correct: plant.wetlandStatus };
      }
    });
    
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [filteredPlants, quizType]);
  
  const startQuiz = () => {
    generateQuiz();
    setMode('quiz');
  };
  
  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === questions[currentQuestion].correct) {
      setScore(s => s + 1);
    }
  };
  
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setMode('results');
    }
  };
  
  const nextCard = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => (i + 1) % filteredPlants.length), 150);
  }, [filteredPlants.length]);
  
  const prevCard = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((i) => (i - 1 + filteredPlants.length) % filteredPlants.length), 150);
  }, [filteredPlants.length]);
  
  const toggleKnown = () => {
    const plant = filteredPlants[currentIndex];
    setKnownCards(prev => {
      const next = new Set(prev);
      if (next.has(plant.id)) {
        next.delete(plant.id);
      } else {
        next.add(plant.id);
      }
      return next;
    });
  };
  
  const currentPlant = filteredPlants[currentIndex];
  
  const getStatusBadgeClass = (status: string) => {
    const classes: Record<string, string> = {
      'OBL': 'badge-obl',
      'FACW': 'badge-facw', 
      'FAC': 'badge-fac',
      'FACU': 'badge-facu',
      'UPL': 'badge-upl',
    };
    return classes[status] || 'bg-gray-500 text-white';
  };
  
  const getCategoryEmoji = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat?.emoji || '🌿';
  };

  // Don't render until hydrated to avoid flash
  if (!isHydrated) {
    return (
      <main className="min-h-screen p-5 md:p-8 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-5 md:p-8">
      {/* Header */}
      <header className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <LeafIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">VA Plants</h1>
              <p className="text-sm text-gray-500">Virginia Native Species</p>
            </div>
          </div>
          {mode !== 'menu' && (
            <button
              onClick={() => setMode('menu')}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Menu
            </button>
          )}
        </div>
      </header>
      
      <div className="max-w-2xl mx-auto">
        
        {/* MENU */}
        {mode === 'menu' && (
          <div className="space-y-5 animate-fade-in">
            {/* Category Selection */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                      category === cat.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                {filteredPlants.length} plants available
              </p>
            </section>
            
            {/* Game Modes */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Flashcards */}
              <button
                onClick={() => { setCurrentIndex(0); setIsFlipped(false); setMode('flashcard'); }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-left card-hover group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                  <CardIcon className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Flashcards</h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                  Learn plant names, wetland status, and characteristics
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                  Start Learning
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
              
              {/* Quiz */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <TargetIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Quiz</h3>
                <p className="text-sm text-gray-500 mt-1.5">
                  Test your knowledge
                </p>
                
                <div className="mt-4 space-y-2">
                  {(['name', 'wetland', 'mixed'] as QuizType[]).map(type => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        quizType === type 
                          ? 'border-emerald-600 bg-emerald-600' 
                          : 'border-gray-300 group-hover:border-gray-400'
                      }`}>
                        {quizType === type && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <input
                        type="radio"
                        name="quizType"
                        value={type}
                        checked={quizType === type}
                        onChange={() => setQuizType(type)}
                        className="sr-only"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {type === 'name' ? 'Scientific Names' : type === 'wetland' ? 'Wetland Status' : 'Mixed'}
                      </span>
                    </label>
                  ))}
                </div>
                
                <button
                  onClick={startQuiz}
                  className="mt-5 w-full py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Start Quiz
                </button>
              </div>
            </div>
            
            {/* Progress */}
            <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Progress</h3>
                {knownCards.size > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Reset all progress?')) {
                        setKnownCards(new Set());
                      }
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">{knownCards.size}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Mastered</div>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full progress-bar"
                      style={{ width: `${(knownCards.size / plants.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500">{plants.length}</div>
              </div>
            </section>
            
            {/* Wetland Status Legend */}
            <section className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-5">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Wetland Indicator Status</h3>
              <div className="grid gap-2">
                {Object.entries(wetlandStatusDescriptions).map(([code, desc]) => (
                  <div key={code} className="flex items-center gap-3">
                    <span className={`font-mono text-xs font-semibold px-2 py-1 rounded ${getStatusBadgeClass(code)}`}>
                      {code}
                    </span>
                    <span className="text-sm text-gray-600">{desc.split(' - ')[1]}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
        
        {/* FLASHCARD MODE */}
        {mode === 'flashcard' && currentPlant && (
          <div className="space-y-5 animate-fade-in">
            {/* Progress & Hints */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 tabular-nums">{currentIndex + 1} / {filteredPlants.length}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs hidden sm:inline">← → or tap to flip</span>
                {knownCards.has(currentPlant.id) && (
                  <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                    <CheckIcon className="w-4 h-4" />
                    Mastered
                  </span>
                )}
              </div>
            </div>
            
            {/* Card */}
            <div 
              className={`flip-card ${isFlipped ? 'flipped' : ''}`}
              style={{ minHeight: '420px' }}
            >
              <div className="flip-card-inner relative w-full h-full">
                {/* Front */}
                <div 
                  className="flip-card-front absolute inset-0 bg-white rounded-2xl shadow-lg p-6 flex flex-col cursor-pointer"
                  onClick={() => setIsFlipped(true)}
                >
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden mb-5 relative">
                    {!imageLoaded[currentPlant.id] && (
                      <div className="absolute inset-0 img-loading" />
                    )}
                    <img 
                      src={currentPlant.imageUrl} 
                      alt={currentPlant.commonName}
                      className={`max-h-56 object-contain transition-opacity duration-300 ${
                        imageLoaded[currentPlant.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(prev => ({ ...prev, [currentPlant.id]: true }))}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=🌿';
                        setImageLoaded(prev => ({ ...prev, [currentPlant.id]: true }));
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-gray-900 font-medium text-lg">What is this plant?</p>
                    <p className="text-gray-400 text-sm mt-2">Tap to reveal</p>
                  </div>
                </div>
                
                {/* Back */}
                <div className="flip-card-back absolute inset-0 bg-white rounded-2xl shadow-lg flex flex-col">
                  <div 
                    className="flex-1 p-6 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{currentPlant.commonName}</h2>
                        <p className="text-lg italic text-gray-500 mt-1">{currentPlant.scientificName}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(currentPlant.wetlandStatus)}`}>
                          {currentPlant.wetlandStatus}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize flex items-center gap-1">
                          <span>{getCategoryEmoji(currentPlant.category)}</span>
                          {currentPlant.category}
                        </span>
                        {currentPlant.native && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                            Native
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">{currentPlant.description}</p>
                      
                      <div className="bg-emerald-50 rounded-xl p-4">
                        <p className="text-sm text-emerald-800">
                          <span className="font-medium">Habitat:</span> {currentPlant.habitat}
                        </p>
                      </div>
                      
                      {currentPlant.funFact && (
                        <div className="bg-amber-50 rounded-xl p-4">
                          <p className="text-sm text-amber-800">
                            <span className="font-medium">Fun Fact:</span> {currentPlant.funFact}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tap to flip back indicator */}
                  <div 
                    className="p-3 text-center border-t border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setIsFlipped(false)}
                  >
                    <p className="text-gray-400 text-xs">Tap here to flip back</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={prevCard}
                className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={toggleKnown}
                className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                  knownCards.has(currentPlant.id)
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                }`}
              >
                {knownCards.has(currentPlant.id) ? '✓ Mastered' : 'Mark as Known'}
              </button>
              
              <button
                onClick={nextCard}
                className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors"
                aria-label="Next card"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
        
        {/* QUIZ MODE */}
        {mode === 'quiz' && questions.length > 0 && (
          <div className="space-y-5 animate-fade-in">
            {/* Progress */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 tabular-nums">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="font-medium text-emerald-600 tabular-nums">
                {score}/{currentQuestion + (showResult ? 1 : 0)}
              </span>
            </div>
            
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full progress-bar"
                style={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
              />
            </div>
            
            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-center mb-5 relative bg-gray-50 rounded-xl p-4">
                {!imageLoaded[questions[currentQuestion].plant.id] && (
                  <div className="absolute inset-0 img-loading rounded-xl" />
                )}
                <img 
                  src={questions[currentQuestion].plant.imageUrl}
                  alt="Plant"
                  className={`max-h-40 sm:max-h-44 rounded-xl object-contain transition-opacity duration-300 ${
                    imageLoaded[questions[currentQuestion].plant.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(prev => ({ ...prev, [questions[currentQuestion].plant.id]: true }))}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=🌿';
                    setImageLoaded(prev => ({ ...prev, [questions[currentQuestion].plant.id]: true }));
                  }}
                />
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {questions[currentQuestion].plant.commonName}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {questions[currentQuestion].type === 'name' 
                    ? 'What is the scientific name?' 
                    : 'What is the wetland indicator status?'}
                </p>
              </div>
              
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, i) => {
                  const isCorrect = option === questions[currentQuestion].correct;
                  const isSelected = option === selectedAnswer;
                  
                  let buttonClass = 'w-full p-4 rounded-xl text-left font-medium text-sm transition-all ';
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += 'bg-emerald-500 text-white';
                    } else if (isSelected && !isCorrect) {
                      buttonClass += 'bg-red-500 text-white';
                    } else {
                      buttonClass += 'bg-gray-50 text-gray-400';
                    }
                  } else {
                    buttonClass += 'bg-gray-50 hover:bg-gray-100 text-gray-700';
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
                    </button>
                  );
                })}
              </div>
              
              {showResult && (
                <>
                  <div className={`mt-4 p-4 rounded-xl text-sm ${
                    selectedAnswer === questions[currentQuestion].correct
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-red-50 text-red-800'
                  }`}>
                    {selectedAnswer === questions[currentQuestion].correct ? (
                      <p className="font-medium">Correct!</p>
                    ) : (
                      <p>
                        The answer is <strong>{questions[currentQuestion].correct}</strong>
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={nextQuestion}
                    className="mt-4 w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* RESULTS */}
        {mode === 'results' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">
                {score >= questions.length * 0.8 ? '🏆' : score >= questions.length * 0.6 ? '⭐' : '🌱'}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete</h2>
            
            <p className="text-gray-600 mb-6">
              You scored <span className="font-bold text-emerald-600">{score}</span> out of <span className="font-bold">{questions.length}</span>
            </p>
            
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
              <div 
                className={`h-full rounded-full progress-bar ${
                  score >= questions.length * 0.8 ? 'bg-emerald-500' :
                  score >= questions.length * 0.6 ? 'bg-amber-500' : 'bg-orange-500'
                }`}
                style={{ width: `${(score / questions.length) * 100}%` }}
              />
            </div>
            
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
              {score >= questions.length * 0.8 
                ? 'Excellent! You really know your Virginia plants!' 
                : score >= questions.length * 0.6 
                ? 'Good job! Keep practicing to improve.'
                : 'Keep studying! Try the flashcards to learn more.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={startQuiz}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => setMode('menu')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="max-w-2xl mx-auto mt-12 text-center">
        <p className="text-xs text-gray-400">
          Data: USDA PLANTS Database, Virginia DCR
        </p>
      </footer>
    </main>
  );
}

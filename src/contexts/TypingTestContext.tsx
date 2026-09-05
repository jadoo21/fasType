import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';

interface TypingTestState {
  text: string;
  typedText: string;
  currentIndex: number;
  errors: number;
  startTime: number | null;
  endTime: number | null;
  isCompleted: boolean;
  isStarted: boolean;
  wpm: number;
  accuracy: number;
  duration: number;
  mode: 'words' | 'quotes' | 'code';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TypingTestContextType extends TypingTestState {
  startTest: () => void;
  resetTest: () => void;
  handleKeyPress: (key: string) => void;
  setDuration: (duration: number) => void;
  setMode: (mode: 'words' | 'quotes' | 'code') => void;
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  getCharacterClass: (index: number) => string;
  completeTest: () => void;
}

const TypingTestContext = createContext<TypingTestContextType | undefined>(undefined);

// Sample texts for typing tests
const sampleTexts = {
  words: {
    easy: [
      'the quick brown fox jumps over the lazy dog',
      'a journey of a thousand miles begins with a single step',
      'practice makes perfect when you focus on improvement',
      'the best way to predict the future is to create it',
    ],
    medium: [
      'programming requires patience and attention to detail',
      'every expert was once a beginner who refused to give up',
      'the art of typing fast is built on consistent daily practice',
      'mechanical keyboards provide tactile feedback that enhances speed',
    ],
    hard: [
      'the quick brown fox jumps over the lazy dog near the river bank',
      'programming in multiple languages requires understanding different paradigms',
      'consistency and deliberate practice are the keys to mastery',
      'the synergy between human cognition and mechanical precision creates fluidity',
    ],
  },
  quotes: {
    easy: [
      'the only way to do great work is to love what you do',
      'success is not final failure is not fatal it is the courage to continue that counts',
    ],
    medium: [
      'in the middle of difficulty lies opportunity',
      'the greatest glory in living lies not in never falling but in rising every time we fall',
    ],
    hard: [
      'the purpose of life is not to be happy it is to be useful to be honorable to be compassionate',
      'it is during our darkest moments that we must focus to see the light',
    ],
  },
  code: {
    easy: [
      'const greeting = "Hello World";',
      'function add(a, b) { return a + b; }',
    ],
    medium: [
      'const fibonacci = (n) => n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);',
      'async function fetchData(url) { const res = await fetch(url); return res.json(); }',
    ],
    hard: [
      'const debounce = (fn, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => fn(...args), delay); }; };',
      'class EventEmitter { constructor() { this.events = {}; } on(event, listener) { if (!this.events[event]) this.events[event] = []; this.events[event].push(listener); } emit(event, ...args) { if (this.events[event]) this.events[event].forEach(listener => listener(...args)); } }',
    ],
  },
};

interface TypingTestProviderProps {
  children: ReactNode;
}

export const TypingTestProvider = ({ children }: TypingTestProviderProps) => {
  const [state, setState] = useState<TypingTestState>({
    text: '',
    typedText: '',
    currentIndex: 0,
    errors: 0,
    startTime: null,
    endTime: null,
    isCompleted: false,
    isStarted: false,
    wpm: 0,
    accuracy: 100,
    duration: 30,
    mode: 'words',
    difficulty: 'medium',
  });

  const getRandomText = useCallback(() => {
    const texts = sampleTexts[state.mode][state.difficulty];
    return texts[Math.floor(Math.random() * texts.length)];
  }, [state.mode, state.difficulty]);

  useEffect(() => {
    if (!state.isStarted) {
      setState(prev => ({
        ...prev,
        text: getRandomText(),
        typedText: '',
        currentIndex: 0,
        errors: 0,
        startTime: null,
        endTime: null,
        isCompleted: false,
        wpm: 0,
        accuracy: 100,
      }));
    }
  }, [state.isStarted, getRandomText]);

  useEffect(() => {
    if (state.isStarted && !state.isCompleted && state.startTime) {
      const startTimeMs = state.startTime;
      const timer = setInterval(() => {
        const elapsed = (Date.now() - startTimeMs) / 1000;
        if (elapsed >= state.duration) {
          completeTest();
        } else {
          // Calculate live WPM
          const minutes = elapsed / 60;
          const wordsTyped = state.currentIndex / 5;
          const currentWpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;
          setState(prev => ({ ...prev, wpm: currentWpm }));
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.isStarted, state.isCompleted, state.startTime, state.duration, state.currentIndex]);

  const startTest = () => {
    setState(prev => ({
      ...prev,
      isStarted: true,
      startTime: Date.now(),
    }));
  };

  const resetTest = () => {
    setState(prev => ({
      ...prev,
      text: getRandomText(),
      typedText: '',
      currentIndex: 0,
      errors: 0,
      startTime: null,
      endTime: null,
      isCompleted: false,
      isStarted: false,
      wpm: 0,
      accuracy: 100,
    }));
  };

  const handleKeyPress = (key: string) => {
    if (!state.isStarted || state.isCompleted) return;

    // Ignore modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(key)) {
      return;
    }

    // Handle backspace
    if (key === 'Backspace') {
      if (state.currentIndex > 0) {
        setState(prev => ({
          ...prev,
          currentIndex: prev.currentIndex - 1,
          typedText: prev.typedText.slice(0, -1),
        }));
      }
      return;
    }

    // Only process single character keys
    if (key.length !== 1) return;

    const expectedChar = state.text[state.currentIndex];
    const isCorrect = key === expectedChar;

    setState(prev => {
      const newIndex = prev.currentIndex + 1;
      const newTypedText = prev.typedText + key;
      const newErrors = isCorrect ? prev.errors : prev.errors + 1;
      const totalTyped = newIndex;
      const correctTyped = totalTyped - newErrors;
      const newAccuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;

      // Check if test is complete
      if (newIndex >= prev.text.length) {
        return {
          ...prev,
          currentIndex: newIndex,
          typedText: newTypedText,
          errors: newErrors,
          accuracy: newAccuracy,
          isCompleted: true,
          endTime: Date.now(),
        };
      }

      return {
        ...prev,
        currentIndex: newIndex,
        typedText: newTypedText,
        errors: newErrors,
        accuracy: newAccuracy,
      };
    });
  };

  const setDuration = (duration: number) => {
    setState(prev => ({ ...prev, duration }));
  };

  const setMode = (mode: 'words' | 'quotes' | 'code') => {
    setState(prev => ({ ...prev, mode, isStarted: false, text: '' }));
  };

  const setDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setState(prev => ({ ...prev, difficulty, isStarted: false, text: '' }));
  };

  const getCharacterClass = (index: number) => {
    if (index < state.currentIndex) {
      // Already typed
      const typedChar = state.typedText[index];
      const expectedChar = state.text[index];
      return typedChar === expectedChar ? 'text-typing-correct font-medium' : 'text-typing-incorrect bg-typing-incorrect-bg/90 rounded px-0.5 line-through font-medium';
    } else if (index === state.currentIndex) {
      // Current character
      return 'relative inline-block border-l-2 border-typing-caret caret-blink pl-0.5 text-primary font-medium';
    } else {
      // Untyped
      return 'text-typing-untyped';
    }
  };

  const completeTest = () => {
    setState(prev => ({
      ...prev,
      isCompleted: true,
      endTime: Date.now(),
    }));
  };

  return (
    <TypingTestContext.Provider value={{
      ...state,
      startTest,
      resetTest,
      handleKeyPress,
      setDuration,
      setMode,
      setDifficulty,
      getCharacterClass,
      completeTest,
    }}>
      {children}
    </TypingTestContext.Provider>
  );
};

export const useTypingTest = () => {
  const context = useContext(TypingTestContext);
  if (context === undefined) {
    throw new Error('useTypingTest must be used within a TypingTestProvider');
  }
  return context;
};
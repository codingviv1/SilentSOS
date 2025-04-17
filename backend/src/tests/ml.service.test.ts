import { mlService } from '../services/ml.service';

describe('MLService', () => {
  describe('analyzeSentiment', () => {
    it('should correctly analyze positive sentiment', () => {
      const text = 'I am feeling happy and excited about my day!';
      const result = mlService['analyzeSentiment'](text);
      
      expect(result.sentiment).toBe('positive');
      expect(result.score).toBeGreaterThan(0);
      expect(result.magnitude).toBeGreaterThan(0);
    });

    it('should correctly analyze negative sentiment', () => {
      const text = 'I am feeling sad and anxious about my situation';
      const result = mlService['analyzeSentiment'](text);
      
      expect(result.sentiment).toBe('negative');
      expect(result.score).toBeLessThan(0);
      expect(result.magnitude).toBeGreaterThan(0);
    });

    it('should correctly analyze neutral sentiment', () => {
      const text = 'Today was an ordinary day';
      const result = mlService['analyzeSentiment'](text);
      
      expect(result.sentiment).toBe('neutral');
      expect(Math.abs(result.score)).toBeLessThan(0.2);
    });
  });

  describe('calculateMoodScore', () => {
    it('should return neutral score for empty array', () => {
      const score = mlService['calculateMoodScore']([]);
      expect(score).toBe(50);
    });

    it('should calculate correct score for happy moods', () => {
      const moods = [
        { mood: 'happy', intensity: 8 },
        { mood: 'happy', intensity: 9 }
      ];
      const score = mlService['calculateMoodScore'](moods);
      expect(score).toBeGreaterThan(80);
    });

    it('should calculate correct score for mixed moods', () => {
      const moods = [
        { mood: 'happy', intensity: 8 },
        { mood: 'sad', intensity: 6 }
      ];
      const score = mlService['calculateMoodScore'](moods);
      expect(score).toBeGreaterThan(40);
      expect(score).toBeLessThan(80);
    });
  });

  describe('calculateJournalScore', () => {
    it('should return neutral score for empty array', () => {
      const score = mlService['calculateJournalScore']([]);
      expect(score).toBe(50);
    });

    it('should calculate correct score for positive entries', () => {
      const journals = [
        { content: 'I am feeling happy and excited about my day!' },
        { content: 'Everything is going great!' }
      ];
      const score = mlService['calculateJournalScore'](journals);
      expect(score).toBeGreaterThan(70);
    });

    it('should calculate correct score for negative entries', () => {
      const journals = [
        { content: 'I am feeling sad and anxious' },
        { content: 'Everything is going wrong' }
      ];
      const score = mlService['calculateJournalScore'](journals);
      expect(score).toBeLessThan(30);
    });
  });

  describe('generateRecommendations', () => {
    it('should generate appropriate recommendations for low scores', () => {
      const recommendations = mlService['generateRecommendations'](25, 20, 30);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations).toContain('Consider reaching out to a mental health professional');
    });

    it('should generate appropriate recommendations for moderate scores', () => {
      const recommendations = mlService['generateRecommendations'](55, 50, 60);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations).toContain('Try journaling more frequently');
    });

    it('should generate appropriate recommendations for high scores', () => {
      const recommendations = mlService['generateRecommendations'](80, 85, 75);
      expect(recommendations.length).toBe(0);
    });
  });
}); 
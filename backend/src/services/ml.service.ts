import { Journal } from '../models/journal.model';
import { Mood } from '../models/mood.model';

interface SentimentAnalysis {
  score: number;
  magnitude: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface MentalHealthScore {
  overallScore: number;
  moodScore: number;
  journalScore: number;
  recommendations: string[];
}

export class MLService {
  // Simple sentiment analysis based on keywords
  private analyzeSentiment(text: string): SentimentAnalysis {
    const positiveWords = ['happy', 'joy', 'excited', 'good', 'great', 'love', 'hope'];
    const negativeWords = ['sad', 'angry', 'anxious', 'bad', 'worried', 'fear', 'hate'];

    let positiveCount = 0;
    let negativeCount = 0;
    const words = text.toLowerCase().split(/\s+/);

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });

    const total = positiveCount + negativeCount;
    const score = total === 0 ? 0 : (positiveCount - negativeCount) / total;
    const magnitude = total / words.length;

    return {
      score,
      magnitude,
      sentiment: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral'
    };
  }

  // Calculate mental health score based on mood and journal entries
  async calculateMentalHealthScore(userId: string): Promise<MentalHealthScore> {
    try {
      // Get recent mood entries (last 7 days)
      const recentMoods = await Mood.find({
        userId,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });

      // Get recent journal entries (last 7 days)
      const recentJournals = await Journal.find({
        userId,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      });

      // Calculate mood score (0-100)
      const moodScore = this.calculateMoodScore(recentMoods);

      // Calculate journal score (0-100)
      const journalScore = this.calculateJournalScore(recentJournals);

      // Calculate overall score (weighted average)
      const overallScore = (moodScore * 0.6) + (journalScore * 0.4);

      // Generate recommendations
      const recommendations = this.generateRecommendations(overallScore, moodScore, journalScore);

      return {
        overallScore,
        moodScore,
        journalScore,
        recommendations
      };
    } catch (error) {
      console.error('Error calculating mental health score:', error);
      throw error;
    }
  }

  private calculateMoodScore(moods: any[]): number {
    if (moods.length === 0) return 50; // Neutral score if no data

    const moodWeights = {
      'happy': 100,
      'neutral': 50,
      'sad': 25,
      'anxious': 25,
      'angry': 0
    };

    const totalScore = moods.reduce((sum, mood) => {
      return sum + (moodWeights[mood.mood] * (mood.intensity / 10));
    }, 0);

    return totalScore / moods.length;
  }

  private calculateJournalScore(journals: any[]): number {
    if (journals.length === 0) return 50; // Neutral score if no data

    const totalScore = journals.reduce((sum, journal) => {
      const sentiment = this.analyzeSentiment(journal.content);
      return sum + ((sentiment.score + 1) * 50); // Convert -1 to 1 range to 0 to 100
    }, 0);

    return totalScore / journals.length;
  }

  private generateRecommendations(
    overallScore: number,
    moodScore: number,
    journalScore: number
  ): string[] {
    const recommendations: string[] = [];

    if (overallScore < 30) {
      recommendations.push(
        'Consider reaching out to a mental health professional',
        'Try practicing mindfulness exercises daily',
        'Maintain a regular sleep schedule'
      );
    } else if (overallScore < 60) {
      recommendations.push(
        'Try journaling more frequently',
        'Engage in physical activity',
        'Connect with friends or family'
      );
    }

    if (moodScore < 40) {
      recommendations.push(
        'Track your mood more frequently to identify patterns',
        'Try mood-boosting activities like exercise or hobbies'
      );
    }

    if (journalScore < 40) {
      recommendations.push(
        'Write about positive experiences',
        'Practice gratitude journaling'
      );
    }

    return recommendations;
  }
}

export const mlService = new MLService(); 
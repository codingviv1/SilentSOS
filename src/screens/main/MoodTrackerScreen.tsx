import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text, Slider } from 'react-native-paper';
import { format } from 'date-fns';

const MoodTrackerScreen = () => {
  const [moodRating, setMoodRating] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);

  const handleSubmit = () => {
    // TODO: Implement mood tracking submission
    console.log('Mood tracking submitted:', {
      moodRating,
      energyLevel,
      stressLevel,
      timestamp: new Date(),
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>How are you feeling today?</Title>
          <Text style={styles.date}>{format(new Date(), 'MMMM d, yyyy')}</Text>
          
          <View style={styles.sliderContainer}>
            <Text>Mood Rating</Text>
            <Slider
              value={moodRating}
              onValueChange={setMoodRating}
              minimumValue={1}
              maximumValue={10}
              step={1}
            />
            <Text style={styles.sliderValue}>{moodRating}/10</Text>
          </View>

          <View style={styles.sliderContainer}>
            <Text>Energy Level</Text>
            <Slider
              value={energyLevel}
              onValueChange={setEnergyLevel}
              minimumValue={1}
              maximumValue={10}
              step={1}
            />
            <Text style={styles.sliderValue}>{energyLevel}/10</Text>
          </View>

          <View style={styles.sliderContainer}>
            <Text>Stress Level</Text>
            <Slider
              value={stressLevel}
              onValueChange={setStressLevel}
              minimumValue={1}
              maximumValue={10}
              step={1}
            />
            <Text style={styles.sliderValue}>{stressLevel}/10</Text>
          </View>

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recent Mood History</Title>
          <Text>• Yesterday: Mood 7/10, Energy 6/10, Stress 4/10</Text>
          <Text>• 2 days ago: Mood 8/10, Energy 7/10, Stress 3/10</Text>
          <Text>• 3 days ago: Mood 6/10, Energy 5/10, Stress 5/10</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  date: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  sliderContainer: {
    marginVertical: 10,
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    marginTop: 20,
  },
});

export default MoodTrackerScreen; 
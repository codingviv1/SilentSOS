import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, TextInput, Button, Text } from 'react-native-paper';
import { format } from 'date-fns';

const JournalScreen = () => {
  const [entry, setEntry] = useState('');
  const [sentiment, setSentiment] = useState('neutral');

  const handleSubmit = () => {
    // TODO: Implement journal entry submission and sentiment analysis
    console.log('Journal entry submitted:', {
      entry,
      sentiment,
      timestamp: new Date(),
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Journal Entry</Title>
          <Text style={styles.date}>{format(new Date(), 'MMMM d, yyyy')}</Text>
          
          <TextInput
            label="How are you feeling today?"
            value={entry}
            onChangeText={setEntry}
            multiline
            numberOfLines={10}
            style={styles.input}
          />

          <View style={styles.sentimentContainer}>
            <Text>Current Sentiment: {sentiment}</Text>
          </View>

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Save Entry
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recent Entries</Title>
          <Text>• Yesterday: "Feeling good about my progress"</Text>
          <Text>• 2 days ago: "Had a challenging day but managed well"</Text>
          <Text>• 3 days ago: "Great day with friends"</Text>
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
  input: {
    marginBottom: 20,
  },
  sentimentContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
  },
});

export default JournalScreen; 
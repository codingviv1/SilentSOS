import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Text } from 'react-native-paper';

const DashboardScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Mental Health Score</Title>
          <Paragraph style={styles.score}>85/100</Paragraph>
          <Text>Your mental health is in good condition</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recent Activities</Title>
          <Paragraph>• Journal entry: 2 hours ago</Paragraph>
          <Paragraph>• Mood check: 4 hours ago</Paragraph>
          <Paragraph>• Screen time: 6 hours today</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recommendations</Title>
          <Paragraph>• Take a 10-minute break</Paragraph>
          <Paragraph>• Practice deep breathing</Paragraph>
          <Paragraph>• Go for a short walk</Paragraph>
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
  score: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default DashboardScreen; 
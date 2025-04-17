import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text, Avatar } from 'react-native-paper';

const ProfileScreen = () => {
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout pressed');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.profileHeader}>
          <Avatar.Text size={80} label="JD" />
          <Title style={styles.name}>John Doe</Title>
          <Text style={styles.email}>john.doe@example.com</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Account Settings</Title>
          <Button mode="text" onPress={() => {}} style={styles.settingButton}>
            Edit Profile
          </Button>
          <Button mode="text" onPress={() => {}} style={styles.settingButton}>
            Notification Settings
          </Button>
          <Button mode="text" onPress={() => {}} style={styles.settingButton}>
            Privacy Settings
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>App Settings</Title>
          <Button mode="text" onPress={() => {}} style={styles.settingButton}>
            Data Collection Preferences
          </Button>
          <Button mode="text" onPress={() => {}} style={styles.settingButton}>
            Help & Support
          </Button>
          <Button mode="text" onPress={() => {}} style={styles.settingButton}>
            About SilentSOS
          </Button>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        buttonColor="#ff4444"
      >
        Logout
      </Button>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  name: {
    marginTop: 10,
    fontSize: 24,
  },
  email: {
    color: '#666',
    marginTop: 5,
  },
  settingButton: {
    marginVertical: 5,
  },
  logoutButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default ProfileScreen; 
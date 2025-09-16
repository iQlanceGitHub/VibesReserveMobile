import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import Header from "../../../../components/Header";
import RequestCard from "../../../../components/RequestCard";
import styles from "./styles";

interface HostHomeScreenProps {
  navigation?: any;
}
const mockRequests = [
  {
    id: "1",
    name: "Mike Hussey",
    category: "DJ Nights",
    location: "New York, USA",
    date: "Aug 03 to 06",
    time: "10:00 PM",
    people: "4 Person",
    price: "$2025.00",
  },
  {
    id: "2",
    name: "David Miler",
    category: "Event",
    location: "New York, USA",
    date: "Aug 03 to 06",
    time: "10:00 PM",
    people: "4 Person",
    price: "$2025.00",
  },
  {
    id: "3",
    name: "orda sajadi",
    category: "DJ Nights",
    location: "New York, USA",
    date: "Aug 03 to 06",
    time: "10:00 PM",
    people: "4 Person",
    price: "$2025.00",
  },
  {
    id: "4",
    name: "Kayla Wood",
    category: "DJ Nights",
    location: "New York, USA",
    date: "Aug 03 to 06",
    time: "10:00 PM",
    people: "4 Person",
    price: "$2025.00",
  },
];

const HostHomeScreen: React.FC<HostHomeScreenProps> = ({ navigation }) => {
  const [requests, setRequests] = useState(mockRequests);

  const handleAccept = (requestId: string) => {
    Alert.alert(
      "Accept Request",
      "Are you sure you want to accept this booking request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Accept",
          onPress: () => {
            setRequests((prev) => prev.filter((req) => req.id !== requestId));
            console.log("Accepted request:", requestId);
          },
        },
      ]
    );
  };

  const handleReject = (requestId: string) => {
    Alert.alert(
      "Reject Request",
      "Are you sure you want to reject this booking request?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setRequests((prev) => prev.filter((req) => req.id !== requestId));
            console.log("Rejected request:", requestId);
          },
        },
      ]
    );
  };

  const handleAddPress = () => {
    navigation?.navigate("AddClubEventDetailScreen");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient
        colors={[colors.hostGradientStart, colors.hostGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <Header userName="John" onAddPress={handleAddPress} />

          <View style={styles.contentContainer}>
            <Text style={styles.sectionTitle}>View Request</Text>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {requests.length > 0 ? (
                requests.map((request, index) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onAccept={() => handleAccept(request.id)}
                    onReject={() => handleReject(request.id)}
                    isLastItem={index === requests.length - 1}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No pending requests</Text>
                  <Text style={styles.emptySubtext}>
                    New booking requests will appear here
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default HostHomeScreen;

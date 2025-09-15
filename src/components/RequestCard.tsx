import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import LocationFavourite from "../assets/svg/locationFavourite";
import ClockIcon from "../assets/svg/clockIcon";
import ProfileIcon from "../assets/svg/profileIcon";
import PeopleIcon from "../assets/svg/peopleIcon";
import styles from "./RequestCardStyles";

interface RequestCardProps {
  request: {
    id: string;
    name: string;
    category: string;
    location: string;
    date: string;
    time: string;
    people: string;
    price: string;
  };
  onAccept: () => void;
  onReject: () => void;
  isLastItem?: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onAccept,
  onReject,
  isLastItem = false,
}) => {
  return (
    <View
      style={[styles.cardContainer, isLastItem && styles.lastCardContainer]}
    >
      <View style={styles.profileContainer}>
        <View style={styles.profileImageContainer}>
          <ProfileIcon />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{request.category}</Text>
          </View>
        </View>

        <Text style={styles.nameText}>{request.name}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <LocationFavourite />
            <Text style={styles.detailText}>{request.location}</Text>
          </View>

          <View style={styles.detailItem}>
            <ClockIcon />
            <Text style={styles.detailText}>
              {request.date} - {request.time}
            </Text>
          </View>

          <View style={styles.peoplePriceRow}>
            <View style={styles.peopleContainer}>
              <PeopleIcon />
              <Text style={styles.detailText}>{request.people}</Text>
            </View>
            <Text style={styles.priceText}>{request.price}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
            <Text style={styles.rejectButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RequestCard;

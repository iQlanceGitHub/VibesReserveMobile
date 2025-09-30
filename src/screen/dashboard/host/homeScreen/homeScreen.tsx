import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
  RefreshControl,
  Modal,
  TouchableOpacity,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors } from "../../../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import Header from "../../../../components/Header";
import RequestCard from "../../../../components/RequestCard";
import CloseIcon from "../../../../assets/svg/closeIcon";
import styles from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../../utilis/toastUtils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import CustomAlert from "../../../../components/CustomAlert";
import {
  onBookingrequest,
  bookingrequestData,
  bookingrequestError,
  onAcceptreject,
  acceptrejectData,
  acceptrejectError,
  onGetProfileDetail,
  getProfileDetailData,
  getProfileDetailError,
} from "../../../../redux/auth/actions";

interface HostHomeScreenProps {
  navigation?: any;
}

const HostHomeScreen: React.FC<HostHomeScreenProps> = ({ navigation }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [UserName, setUserName] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [profileDetail, setProfileDetail] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Custom Alert states
  const [showInactiveAlert, setShowInactiveAlert] = useState(false);
  const [showProfileUpdateAlert, setShowProfileUpdateAlert] = useState(false);

  // Get safe area insets for Android 15 compatibility
  const insets = useSafeAreaInsets();

  const dispatch = useDispatch();
  const bookingrequest = useSelector((state: any) => state.auth.bookingrequest);
  const bookingrequestErr = useSelector(
    (state: any) => state.auth.bookingrequestErr
  );
  const acceptreject = useSelector((state: any) => state.auth.acceptreject);
  const acceptrejectErr = useSelector(
    (state: any) => state.auth.acceptrejectErr
  );
  const getProfileDetail = useSelector((state: any) => state.auth.getProfileDetail);
  const getProfileDetailErr = useSelector(
    (state: any) => state.auth.getProfileDetailErr
  );

  const handleAccept = (requestId: string) => {
    setSelectedRequestId(requestId);
    setShowAcceptModal(true);
  };

  const handleAcceptConfirm = () => {
    console.log("Accepting request:", selectedRequestId);
    dispatch(
      onAcceptreject({
        bookingId: selectedRequestId,
        action: "accept",
      })
    );
    setShowAcceptModal(false);
  };

  const handleAcceptCancel = () => {
    setShowAcceptModal(false);
  };

  const handleReject = (requestId: string) => {
    setSelectedRequestId(requestId);
    setCustomReason("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (!customReason.trim()) {
      showToast("error", "Please provide a reason for rejection");
      return;
    }

    console.log(
      "Rejecting request:",
      selectedRequestId,
      "Reason:",
      customReason
    );
    dispatch(
      onAcceptreject({
        bookingId: selectedRequestId,
        action: "reject",
        reason: customReason,
      })
    );

    setShowRejectModal(false);
    setCustomReason("");
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setCustomReason("");
  };

  const handleAddPress = () => {
    // Check if profile is inactive


    // Check if business profile is not updated
    const needsProfileUpdate = (profileDetail && profileDetail.businesspofileUpdate === "No") ||
      (!profileDetail && userData && userData.businesspofileUpdate === "No");

    if (needsProfileUpdate) {
      setShowProfileUpdateAlert(true);
      return;
    }

    const isInactive = (profileDetail && profileDetail.status === "inactive") ||
      (!profileDetail && userData && userData.status === "inactive");

    if (isInactive) {
      setShowInactiveAlert(true);
      return;
    }

    // If all checks pass, navigate to add event screen
    navigation?.navigate("AddClubEventDetailScreen");
  };

  const getUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user !== null) {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.firstName);
        setUserData(parsedUser);
        console.log("User retrieved:", parsedUser);
        return parsedUser;
      }
    } catch (e) {
      console.error("Failed to fetch the user.", e);
    }
  };

  const fetchProfileDetail = () => {
    dispatch(onGetProfileDetail({}));
  };

  // Alert handlers
  const handleInactiveAlertClose = () => {
    setShowInactiveAlert(false);
  };

  const handleProfileUpdateAlertClose = () => {
    setShowProfileUpdateAlert(false);
  };

  const handleUpdateProfilePress = () => {
    setShowProfileUpdateAlert(false);
    navigation?.navigate("HostEditProfileScreen");
  };

  const fetchBookingRequests = (page: number = 1) => {
    setLoading(true);
    setCurrentPage(page);
    dispatch(
      onBookingrequest({
        page: page,
        limit: 10,
      })
    );
  };

  const refreshRequests = () => {
    fetchBookingRequests(1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookingRequests(1);
  };

  // Transform API data to match RequestCard format
  const transformBookingData = (apiData: any[]) => {
    return apiData.map((item) => {
      // Format date
      const startDate = new Date(item.eventId.startDate);
      const endDate = new Date(item.bookingEndDate);
      const formattedDate = `${startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} to ${endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`;

      // Format time
      const formatTime = (timeString: string) => {
        if (!timeString) return "10:00 PM";
        // Convert 24-hour format to 12-hour format
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };
      const formattedTime = formatTime(item.eventId.openingTime);

      // Format price
      const formattedPrice = `$${item.totalAmount.toFixed(2)}`;

      return {
        id: item._id,
        _id: item._id,
        name: item.userId.fullName,
        category: item.eventId.name,
        location: "New York, USA", // You might want to get this from event data
        date: formattedDate,
        time: formattedTime,
        people: `${item.members} Person${item.members > 1 ? "s" : ""}`,
        price: formattedPrice,
        // Additional data from API
        originalData: item,
      };
    });
  };

  // Handle booking request API response
  useEffect(() => {
    if (
      bookingrequest?.status === true ||
      bookingrequest?.status === "true" ||
      bookingrequest?.status === 1 ||
      bookingrequest?.status === "1"
    ) {
      console.log("Booking requests fetched:", bookingrequest);
      const transformedData = transformBookingData(bookingrequest?.data || []);
      console.log("Transformed data:", transformedData);
      setRequests(transformedData);
      setLoading(false);
      setRefreshing(false);
      dispatch(bookingrequestData(""));
    }

    if (bookingrequestErr) {
      console.log("Booking request error:", bookingrequestErr);
      setLoading(false);
      setRefreshing(false);
      showToast("error", "Failed to fetch booking requests. Please try again.");
      dispatch(bookingrequestError(""));
    }
  }, [bookingrequest, bookingrequestErr, dispatch]);

  // Handle accept/reject API response
  useEffect(() => {
    if (
      acceptreject?.status === true ||
      acceptreject?.status === "true" ||
      acceptreject?.status === 1 ||
      acceptreject?.status === "1"
    ) {
      console.log("Accept/Reject response:", acceptreject);

      // Show success toast based on action
      if (acceptreject?.message?.toLowerCase().includes("reject")) {
        showToast("success", "Booking rejected successfully");
      } else if (acceptreject?.message?.toLowerCase().includes("accept")) {
        showToast("success", "Booking accepted successfully");
      } else {
        showToast(
          "success",
          acceptreject?.message || "Action completed successfully"
        );
      }

      // Refresh the booking requests list
      refreshRequests();
      dispatch(acceptrejectData(""));
    }

    if (acceptrejectErr) {
      console.log("Accept/Reject error:", acceptrejectErr);
      showToast(
        "error",
        acceptrejectErr?.message ||
        "Failed to process request. Please try again."
      );
      dispatch(acceptrejectError(""));
    }
  }, [acceptreject, acceptrejectErr, dispatch]);

  // Handle profile detail API response
  useEffect(() => {
    if (
      getProfileDetail?.status === true ||
      getProfileDetail?.status === "true" ||
      getProfileDetail?.status === 1 ||
      getProfileDetail?.status === "1"
    ) {
      console.log("Profile detail response:", getProfileDetail);
      console.log("Business profile update status:", getProfileDetail?.data?.businesspofileUpdate);
      console.log("User status:", getProfileDetail?.data?.status);
      setProfileDetail(getProfileDetail?.data);
      dispatch(getProfileDetailData(""));
    }

    if (getProfileDetailErr) {
      console.log("Profile detail error:", getProfileDetailErr);
      showToast("error", "Failed to fetch profile details. Please try again.");
      dispatch(getProfileDetailError(""));
    }
  }, [getProfileDetail, getProfileDetailErr, dispatch]);

  useEffect(() => {
    getUser();
    fetchProfileDetail();
    fetchBookingRequests();
  }, []);

  // Refresh profile details when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("Screen focused - refreshing profile details");
      fetchProfileDetail();
      fetchBookingRequests();
    }, [])
  );

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
        // Enhanced StatusBar configuration for Android 15
        {...(Platform.OS === "android" && {
          statusBarTranslucent: true,
          statusBarBackgroundColor: "transparent",
        })}
      />
      <LinearGradient
        colors={[colors.hostGradientStart, colors.hostGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradientContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.safeArea}>
          <Header userName={UserName} onAddPress={handleAddPress} />

          {/* Business Profile Completion Container - Show when businesspofileUpdate is "No" (Priority 1) */}
          {((profileDetail && profileDetail.businesspofileUpdate === "No") || 
            (!profileDetail && userData && userData.businesspofileUpdate === "No")) && (
            <View style={styles.businessProfileContainer}>
              <View style={styles.businessProfileContent}>
                <Text style={styles.businessProfileTitle}>
                  Please complete your business profile for activating business profile
                </Text>
                <TouchableOpacity 
                  style={styles.completeProfileButton}
                  onPress={() => {
                    // Navigate to profile completion screen
                    navigation?.navigate("HostEditProfileScreen");
                  }}
                >
                  <Text style={styles.completeProfileButtonText}>Complete Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Profile Under Review Container - Show when status is inactive AND businesspofileUpdate is "Yes" (Priority 2) */}
          {((profileDetail && profileDetail.status === "inactive" && profileDetail.businesspofileUpdate === "Yes") || 
            (!profileDetail && userData && userData.status === "inactive" && userData.businesspofileUpdate === "Yes")) && (
            <View style={styles.businessProfileContainer}>
              <View style={styles.businessProfileContent}>
                <Text style={styles.businessProfileTitle}>
                  Thank you for updating your profile. Now your profile is under review. So once your profile is active you can access further.
                </Text>
              </View>
            </View>
          )}

          {/* Only show main content if profile is active */}
          {((profileDetail && profileDetail.status === "active") ||
            (!profileDetail && userData && userData.status === "active")) && (
              <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>View Request</Text>

                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContent}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      colors={[colors.violate]} // Android
                      tintColor={colors.violate} // iOS
                      title="Pull to refresh"
                      titleColor={colors.white}
                    />
                  }
                >
                  {loading ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>Loading requests...</Text>
                    </View>
                  ) : requests.length > 0 ? (
                    requests.map((request, index) => (
                      <RequestCard
                        key={request._id || request.id}
                        request={request}
                        onAccept={() => handleAccept(request._id || request.id)}
                        onReject={() => handleReject(request._id || request.id)}
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
            )}
        </View>
      </LinearGradient>

      {/* Custom Rejection Modal */}
      <Modal
        visible={showRejectModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleRejectCancel}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Reject Booking Request</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleRejectCancel}
              >
                <CloseIcon size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Please provide a reason for rejection:
            </Text>

            <TextInput
              style={styles.reasonTextInput}
              placeholder="Enter reason for rejection..."
              placeholderTextColor={colors.textColor}
              value={customReason}
              onChangeText={setCustomReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Show Done button when keyboard is visible */}
            {isKeyboardVisible && (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => Keyboard.dismiss()}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Hide buttons when keyboard is visible */}
            {!isKeyboardVisible && (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleRejectCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={handleRejectConfirm}
                >
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Custom Accept Modal */}
      <Modal
        visible={showAcceptModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleAcceptCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Accept Booking Request</Text>
            <Text style={styles.modalSubtitle}>
              Are you sure you want to accept this booking request?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleAcceptCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={handleAcceptConfirm}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Alert for Inactive Status */}
      <CustomAlert
        visible={showInactiveAlert}
        title="Profile Under Review"
        message="Thank you for updating your profile. Now your profile is under review. So once your profile is active you can access further."
        primaryButtonText="Okay"
        onPrimaryPress={handleInactiveAlertClose}
        showSecondaryButton={false}
      />

      {/* Custom Alert for Profile Update Required */}
      <CustomAlert
        visible={showProfileUpdateAlert}
        title="Complete Your Profile"
        message="Please complete your business profile to create events and access all features."
        primaryButtonText="Update Profile"
        secondaryButtonText="Cancel"
        onPrimaryPress={handleUpdateProfilePress}
        onSecondaryPress={handleProfileUpdateAlertClose}
        showSecondaryButton={true}
      />
    </View>
  );
};

export default HostHomeScreen;

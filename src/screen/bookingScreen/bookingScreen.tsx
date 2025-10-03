import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { colors } from "../../utilis/colors";
import LinearGradient from "react-native-linear-gradient";
import styles from "./styles";
import ClockIcon from "../../assets/svg/clockIcon";
import LocationFavourite from "../../assets/svg/locationFavourite";
import { getBookingList, clearBookingList } from "../../redux/auth/actions";
import moment from "moment";

interface BookingScreenProps {
  navigation?: any;
}

const tabs = [
  { id: "upcoming", title: "Upcoming", value: "pending" },
  { id: "completed", title: "Completed", value: "confirmed" },
  { id: "cancelled", title: "Cancelled", value: "cancelled" },
];

const BookingCard: React.FC<{
  booking: any;
  onCancel: () => void;
  onLeaveReview?: () => void;
}> = ({ booking, onCancel, onLeaveReview }) => {
  const getButtonText = () => {
    switch (booking.status) {
      case "completed":
        return "Leave Review";
      case "cancelled":
        return "Book Again";
      default:
        return "Cancel";
    }
  };

  const handleButtonPress = () => {
    if (booking.status === "completed" && onLeaveReview) {
      onLeaveReview();
    } else {
      onCancel();
    }
  };

  return (
    <View style={styles.bookingCard}>
      <View style={styles.cardTopSection}>
        <Image source={{uri: booking?.eventId?.photos?.[0]}} style={styles.bookingImage} />
        <View style={styles.bookingContent}>
          <View style={styles.bookingHeader}>
            { booking.boothType &&
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{booking.boothType ? booking.boothType.name : ''}</Text>
            </View>
}
            <Text style={styles.priceText}>${booking?.totalAmount}</Text>
          </View>

          <Text style={styles.eventName}>{booking?.eventId?.name}</Text>

          <View style={styles.detailsRow}>
            <LocationFavourite size={14} color={colors.violate} />
            <Text style={styles.detailText} numberOfLines={2} ellipsizeMode="tail">{booking?.eventId?.address}</Text>
          </View>

          <View style={styles.detailsRow}>
            <ClockIcon size={14} color={colors.violate} />
            <Text style={styles.detailText}>
              {moment(booking?.bookingStartDate).format("MMM DD")} to {moment(booking?.bookingEndDate).format("MMM DD")} - {moment(booking?.bookingStartDate).format("hh:mm A")}
            </Text>
          </View>
        </View>
      </View>

      {booking.status !== "cancelled" && (
        <>
          <View style={styles.separatorLine} />

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleButtonPress}
          >
            <Text style={styles.cancelButtonText}>{getButtonText()}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const BookingScreen: React.FC<BookingScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastPageData, setLastPageData] = useState<any[]>([]);
  const isLoadingMoreRef = useRef(false);
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Redux state
  const dispatch = useDispatch();
  const { bookingList, bookingListErr, loader } = useSelector((state: any) => state.auth);

  // Call API when component mounts and when tab changes
  useEffect(() => {
    resetPaginationAndFetch();
  }, [selectedTab]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
    };
  }, []);

  // Reset pagination and fetch first page
  const resetPaginationAndFetch = () => {
    setCurrentPage(1);
    setHasMoreData(true);
    setLastPageData([]);
    dispatch(clearBookingList()); // Clear existing data
    fetchBookingList(1, true);
  };

  const fetchBookingList = (page: number = 1, isRefresh: boolean = false) => {
    const selectedTabData = tabs.find(tab => tab.id === selectedTab);
    const status = selectedTabData?.value || 'pending';
    
    dispatch(getBookingList({ 
      status: status,
      page: page,
      limit: 5
    }));
  };

  // Load more data for pagination
  const loadMore = () => {
    console.log('loadMore called - loadingMore:', loadingMore, 'hasMoreData:', hasMoreData, 'loader:', loader, 'bookingListErr:', bookingListErr, 'isLoadingMoreRef:', isLoadingMoreRef.current);
    
    // Clear any existing timeout
    if (loadMoreTimeoutRef.current) {
      clearTimeout(loadMoreTimeoutRef.current);
    }
    
    // Debounce the load more call
    loadMoreTimeoutRef.current = setTimeout(() => {
      if (!loadingMore && !isLoadingMoreRef.current && hasMoreData && !loader && !bookingListErr) {
        console.log('Loading more data for page:', currentPage + 1);
        isLoadingMoreRef.current = true;
        setLoadingMore(true);
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchBookingList(nextPage, false);
      } else {
        console.log('Load more blocked - conditions not met');
      }
    }, 300); // 300ms debounce
  };

  // Retry loading more data
  const retryLoadMore = () => {
    if (!loadingMore && !loader) {
      setLoadingMore(true);
      setHasMoreData(true);
      fetchBookingList(currentPage, false);
    }
  };

  // Handle API response and update pagination state
  useEffect(() => {
    if (bookingList && Array.isArray(bookingList)) {      
      // Calculate how many new items were added in this API call
      const newItemsCount = bookingList.length - lastPageData.length;
      
      // Update last page data
      setLastPageData([...bookingList]);
      
      // If the last API call returned fewer items than the limit (5), there's no more data
      const hasMore = newItemsCount >= 5;
          
      setHasMoreData(hasMore);
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
    }
  }, [bookingList]);

  // Handle API errors
  useEffect(() => {
    if (bookingListErr) {
      setLoadingMore(false);
      isLoadingMoreRef.current = false;
      setHasMoreData(false); // Stop trying to load more on error
      console.log("Booking list error:", bookingListErr);
    }
  }, [bookingListErr]);

  const handleTabPress = (tabId: string) => {
    setSelectedTab(tabId);
  };

  const handleCancelBooking = (bookingId: string) => {};

  const handleLeaveReview = (bookingId: string) => {
    navigation?.navigate("LeaveReviewScreen");
  };

  const onRefresh = () => {
    setRefreshing(true);
    resetPaginationAndFetch();
    // Reset refreshing state after a short delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getBookingsForTab = () => {
    // Use Redux booking list data
    return bookingList || [];
  };

  const currentBookings = getBookingsForTab();

  // Render booking item
  const renderBookingItem = ({ item: booking }: { item: any }) => (
    <BookingCard
      key={booking._id}
      booking={booking}
      onCancel={() => handleCancelBooking(booking._id)}
      onLeaveReview={() => handleLeaveReview(booking._id)}
    />
  );

  // Render footer for loading more and end of list indicators
  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={colors.violate} />
          <Text style={styles.loadingMoreText}>Loading more...</Text>
        </View>
      );
    }

    if (!hasMoreData && currentBookings.length > 0 && !bookingListErr) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.endOfListText}>No more bookings to load</Text>
        </View>
      );
    }

    if (bookingListErr && currentBookings.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerErrorText}>Failed to load more bookings</Text>
          <TouchableOpacity 
            style={styles.footerRetryButton}
            onPress={retryLoadMore}
          >
            <Text style={styles.footerRetryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  // Render empty state
  const renderEmpty = () => {
    if (loader) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color={colors.violate} />
          <Text style={styles.emptyStateText}>Loading bookings...</Text>
        </View>
      );
    }

    if (bookingListErr) {
      return (
        <View style={styles.errorStateContainer}>
          <Text style={styles.errorStateText}>
            Error loading bookings: {bookingListErr?.message || "Something went wrong"}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => resetPaginationAndFetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentBookings.length === 0) {
      return (
        <View style={styles.noBookingsContainer}>
          <Text style={styles.noBookingsText}>No bookings found</Text>
          <Text style={styles.noBookingsSubText}>
            {selectedTab === "upcoming" 
              ? "You don't have any upcoming bookings" 
              : selectedTab === "completed"
              ? "You don't have any completed bookings"
              : "You don't have any cancelled bookings"
            }
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "ios" ? "transparent" : "transparent"}
        translucent={true}
      />
      <LinearGradient
        colors={[colors.gradient_dark_purple, colors.gradient_light_purple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.statusBar}></View>
            <Text style={styles.title}>Bookings</Text>
          </View>

          <View style={styles.tabsSection}>
            <View style={styles.tabsContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tab,
                    selectedTab === tab.id
                      ? styles.selectedTab
                      : styles.unselectedTab,
                  ]}
                  onPress={() => handleTabPress(tab.id)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === tab.id
                        ? styles.selectedTabText
                        : styles.unselectedTabText,
                    ]}
                  >
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <FlatList
            data={currentBookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item._id}
            style={styles.bookingsContainer}
            contentContainerStyle={styles.bookingsContent}
            showsVerticalScrollIndicator={false}
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
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={5}
            updateCellsBatchingPeriod={50}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default BookingScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  CustomeTextInput,
  DatePickerInput,
} from "../../../../components/textinput";
import { Buttons } from "../../../../components/buttons";
import { colors } from "../../../../utilis/colors";
import DetailsInput from "../../../../components/DetailsInput";
import CustomDropdown from "../../../../components/CustomDropdown";
import addClubEventDetailStyle from "./addClubEventDetailStyle";
import TimeIcon from "../../../../assets/svg/timeIcon";
import CalendarIcon from "../../../../assets/svg/calendarIcon";
import ArrowDownIcon from "../../../../assets/svg/arrowDownIcon";
import PlusIcon from "../../../../assets/svg/plusIcon";
import GalleryIcon from "../../../../assets/svg/galleryIcon";
import BackIcon from "../../../../assets/svg/backIcon";
import LinearGradient from "react-native-linear-gradient";

interface BoothType {
  id: string;
  name: string;
}

interface Facility {
  id: string;
  name: string;
  selected: boolean;
}

interface AddClubDetailScreenProps {
  navigation?: any;
}

const AddClubDetailScreen: React.FC<AddClubDetailScreenProps> = ({
  navigation,
}) => {
  const [fee, setFee] = useState("");
  const [type, setType] = useState("Club");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [boothName, setBoothName] = useState("");
  const [boothType, setBoothType] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [boothPrice, setBoothPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [address, setAddress] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<"start" | "end">(
    "start"
  );
  const [boothImages, setBoothImages] = useState<string[]>([]);
  const [uploadPhotos, setUploadPhotos] = useState<string[]>([]);

  const types: BoothType[] = [
    { id: "1", name: "Club" },
    { id: "2", name: "Event" },
  ];

  const boothTypes: BoothType[] = [
    { id: "1", name: "VIP Booth" },
    { id: "2", name: "Standard Booth" },
    { id: "3", name: "Premium Booth" },
    { id: "4", name: "Luxury Booth" },
  ];

  const ticketTypes: BoothType[] = [
    { id: "1", name: "General" },
    { id: "2", name: "VIP" },
    { id: "3", name: "Early Bird" },
    { id: "4", name: "Late Entry" },
  ];

  const facilities: Facility[] = [
    { id: "1", name: "Parking", selected: false },
    { id: "2", name: "Private Seating", selected: false },
    { id: "3", name: "Food Menu", selected: false },
    { id: "4", name: "Live Music", selected: false },
    { id: "5", name: "Wi-Fi", selected: false },
    { id: "6", name: "VIP Area", selected: false },
    { id: "7", name: "Dance Floor", selected: false },
    { id: "8", name: "Smoking Zone", selected: false },
    { id: "9", name: "Bar", selected: false },
    { id: "10", name: "Outdoor Seating", selected: false },
  ];

  const [facilitiesList, setFacilitiesList] = useState<Facility[]>(facilities);

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      if (timePickerMode === "start") {
        setStartTime(timeString);
      } else {
        setEndTime(timeString);
      }
    }
  };
  const showTimePickerModal = (mode: "start" | "end") => {
    setTimePickerMode(mode);
    setShowTimePicker(true);
  };
  const toggleFacility = (id: string) => {
    setFacilitiesList((prev) =>
      prev.map((facility) =>
        facility.id === id
          ? { ...facility, selected: !facility.selected }
          : facility
      )
    );
  };

  const handleBoothImageUpload = () => {
    if (boothImages.length < 3) {
      Alert.alert("Image Upload", "Image picker would open here");
    }
  };

  const handlePhotoUpload = () => {
    if (uploadPhotos.length < 3) {
      Alert.alert("Photo Upload", "Image picker would open here");
    }
  };

  const handleSave = () => {
    Alert.alert("Success", "Club details saved successfully!", [
      {
        text: "OK",
        onPress: () => {
          navigation?.goBack();
        },
      },
    ]);
  };

  const handleBack = () => {
    navigation?.goBack();
  };

  return (
    <View style={addClubEventDetailStyle.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <LinearGradient
        colors={[colors.hostGradientStart, colors.hostGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={addClubEventDetailStyle.gradientContainer}
      >
        <SafeAreaView style={addClubEventDetailStyle.safeArea}>
          <View style={addClubEventDetailStyle.header}>
            <TouchableOpacity onPress={handleBack}>
              <BackIcon />
            </TouchableOpacity>
            <Text style={addClubEventDetailStyle.headerTitle}>Add Details</Text>
            <View style={addClubEventDetailStyle.headerRight} />
          </View>

          <ScrollView
            style={addClubEventDetailStyle.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={addClubEventDetailStyle.scrollContent}
          >
            <CustomDropdown
              label="Type"
              placeholder="Select type"
              options={types}
              selectedValue={type}
              onSelect={setType}
            />

            <View style={addClubEventDetailStyle.formElement}>
              <CustomeTextInput
                label="Name"
                placeholder="Enter name"
                value={name}
                onChangeText={setName}
                error={false}
                message=""
                leftImage=""
                kType="default"
              />
            </View>

            <DetailsInput
              label="Details"
              placeholder="Enter here"
              value={details}
              onChangeText={setDetails}
              error={false}
              message=""
              required={false}
            />
            <View style={addClubEventDetailStyle.formElement}>
              <CustomeTextInput
                label="Entry Fee"
                placeholder="Enter fee"
                value={entryFee}
                onChangeText={setEntryFee}
                error={false}
                message=""
                leftImage=""
                kType="numeric"
              />
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <DatePickerInput
                label="Start Date"
                placeholder="Select date"
                value={startDate}
                onChangeText={setStartDate}
                error={false}
                message=""
                leftImage=""
                style={addClubEventDetailStyle.datePickerWrapper}
              />
              <View style={addClubEventDetailStyle.datePickerRightIcon}>
                <CalendarIcon />
              </View>
            </View>
            <View style={addClubEventDetailStyle.formElement}>
              <DatePickerInput
                label="End Date"
                placeholder="Select date"
                value={endDate}
                onChangeText={setEndDate}
                error={false}
                message=""
                leftImage=""
                style={addClubEventDetailStyle.datePickerWrapper}
              />
              <View style={addClubEventDetailStyle.datePickerRightIcon}>
                <CalendarIcon />
              </View>
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.label}>Start Time</Text>
              <TouchableOpacity
                style={addClubEventDetailStyle.timeInputButton}
                onPress={() => showTimePickerModal("start")}
              >
                <Text style={addClubEventDetailStyle.timeInputText}>
                  {startTime || "Select time"}
                </Text>
                <TimeIcon />
              </TouchableOpacity>
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.label}>End Time</Text>
              <TouchableOpacity
                style={addClubEventDetailStyle.timeInputButton}
                onPress={() => showTimePickerModal("end")}
              >
                <Text style={addClubEventDetailStyle.timeInputText}>
                  {endTime || "Select time"}
                </Text>
                <TimeIcon />
              </TouchableOpacity>
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <CustomeTextInput
                label="Address"
                placeholder="Enter address"
                value={address}
                onChangeText={setAddress}
                error={false}
                message=""
                leftImage=""
                kType="default"
                multiline={true}
              />
            </View>

            {type === "Club" && (
              <>
                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Booth Name"
                    placeholder="Enter booth name"
                    value={boothName}
                    onChangeText={setBoothName}
                    error={false}
                    message=""
                    leftImage=""
                    kType="default"
                  />
                </View>

                <CustomDropdown
                  label="Booth Type"
                  placeholder="Select booth type"
                  options={boothTypes}
                  selectedValue={boothType}
                  onSelect={setBoothType}
                />

                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Booth Price"
                    placeholder="Enter booth price"
                    value={boothPrice}
                    onChangeText={setBoothPrice}
                    error={false}
                    message=""
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Capacity"
                    placeholder="Enter capacity"
                    value={capacity}
                    onChangeText={setCapacity}
                    error={false}
                    message=""
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Discounted Price"
                    placeholder="Enter discounted price"
                    value={discountedPrice}
                    onChangeText={setDiscountedPrice}
                    error={false}
                    message=""
                    leftImage=""
                    kType="numeric"
                  />
                </View>
              </>
            )}

            {type === "Event" && (
              <>
                <CustomDropdown
                  label="Ticket Type"
                  placeholder="Select ticket type"
                  options={ticketTypes}
                  selectedValue={ticketType}
                  onSelect={setTicketType}
                />

                <View style={addClubEventDetailStyle.formElement}>
                  <CustomeTextInput
                    label="Ticket Price"
                    placeholder="Enter ticket price"
                    value={ticketPrice}
                    onChangeText={setTicketPrice}
                    error={false}
                    message=""
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <View style={addClubEventDetailStyle.capacityFormElement}>
                  <CustomeTextInput
                    label="Capacity"
                    placeholder="Enter capacity"
                    value={capacity}
                    onChangeText={setCapacity}
                    error={false}
                    message=""
                    leftImage=""
                    kType="numeric"
                  />
                </View>

                <TouchableOpacity
                  style={addClubEventDetailStyle.addNewTicketButton}
                >
                  <PlusIcon />
                  <Text style={addClubEventDetailStyle.addNewTicketText}>
                    Add New Ticket
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {type === "Club" && (
              <View style={addClubEventDetailStyle.imageSection}>
                <Text style={addClubEventDetailStyle.sectionLabel}>
                  Booth Image
                </Text>
                <View style={addClubEventDetailStyle.imageContainer}>
                  <View style={addClubEventDetailStyle.imageBoxesContainer}>
                    {[1, 2, 3].map((index) => (
                      <TouchableOpacity
                        key={index}
                        style={addClubEventDetailStyle.imageUploadBox}
                        onPress={handleBoothImageUpload}
                      >
                        <GalleryIcon />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={addClubEventDetailStyle.addNewBoothButton}
                  >
                    <PlusIcon />
                    <Text style={addClubEventDetailStyle.addNewBoothText}>
                      Add New Booth
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.sectionLabel}>
                Upload Photos
              </Text>
              <View style={addClubEventDetailStyle.uploadPhotosRow}>
                {[1, 2, 3].map((index) => (
                  <TouchableOpacity
                    key={index}
                    style={addClubEventDetailStyle.imageUploadBox}
                    onPress={handlePhotoUpload}
                  >
                    <GalleryIcon />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <Text style={addClubEventDetailStyle.sectionLabel}>
                Facilities
              </Text>
              <View style={addClubEventDetailStyle.facilitiesGrid}>
                {facilitiesList.map((facility) => (
                  <TouchableOpacity
                    key={facility.id}
                    style={addClubEventDetailStyle.facilityCheckboxContainer}
                    onPress={() => toggleFacility(facility.id)}
                  >
                    <View
                      style={[
                        addClubEventDetailStyle.facilityCheckbox,
                        facility.selected &&
                          addClubEventDetailStyle.facilityCheckedBox,
                      ]}
                    >
                      {facility.selected && (
                        <Text style={addClubEventDetailStyle.facilityCheckmark}>
                          ✓
                        </Text>
                      )}
                    </View>
                    <Text style={addClubEventDetailStyle.facilityCheckboxText}>
                      {facility.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={addClubEventDetailStyle.formElement}>
              <Buttons
                title="Save"
                onPress={handleSave}
                style={addClubEventDetailStyle.saveButton}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

export default AddClubDetailScreen;

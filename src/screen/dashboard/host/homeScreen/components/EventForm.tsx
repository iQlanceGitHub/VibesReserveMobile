import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import { horizontalScale, verticalScale, fontScale } from '../../../../../utilis/appConstant';
import { CustomeTextInput } from '../../../../../components/textinput';
import CustomDropdown from '../../../../../components/CustomDropdown';
import ImageSelectionBottomSheet from '../../../../../components/ImageSelectionBottomSheet';
import PlusIcon from '../../../../../assets/svg/plusIcon';
import CloseIcon from "../../../../../assets/svg/closeIcon";
import GalleryIcon from '../../../../../assets/svg/galleryIcon';
// import TrashIcon from '../../../../../assets/svg/trashIcon';

interface EventData {
  id: string;
  ticketType: string;
  ticketPrice: string;
  capacity: string;
}

interface EventFormProps {
  event: EventData;
  eventIndex: number;
  onUpdate: (id: string, field: keyof EventData, value: string | string[]) => void;
  onRemove: (id: string) => void;
  onImagePicker: (type: 'camera' | 'gallery', imageType: "main" | "booth" | "event", boothIndex: number, eventIndex: number) => void;
  ticketTypes: Array<{ id: string; name: string }>;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  eventIndex,
  onUpdate,
  onRemove,
  onImagePicker,
  ticketTypes,
}) => {
  const [showImagePicker, setShowImagePicker] = React.useState(false);
  const styles = {
    eventContainer: {
      backgroundColor: colors.vilate20,
      borderRadius: horizontalScale(12),
      padding: horizontalScale(16),
      marginBottom: verticalScale(16),
      borderWidth: 1,
      borderColor: colors.violate,
    },
    eventHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: verticalScale(16),
    },
    eventTitle: {
      fontSize: fontScale(16),
      fontFamily: fonts.SemiBold,
      color: colors.white,
    },
    removeButton: {
      padding: horizontalScale(8),
    },
    inputRow: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginBottom: verticalScale(12),
    },
    inputHalf: {
      width: '48%' as any,
    },
    imageSection: {
      marginTop: verticalScale(12),
    },
    imageSectionTitle: {
      fontSize: fontScale(14),
      fontFamily: fonts.Medium,
      color: colors.white,
      marginBottom: verticalScale(8),
    },
    imageGrid: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: horizontalScale(8),
    },
    imageContainer: {
      width: horizontalScale(80),
      height: verticalScale(80),
      borderRadius: horizontalScale(8),
      backgroundColor: colors.unselectedBackground,
      borderWidth: 1,
      borderColor: colors.vilate20,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginBottom: verticalScale(8),
    },
    image: {
      width: '100%' as any,
      height: '100%' as any,
      borderRadius: horizontalScale(8),
    },
    addImageButton: {
      width: horizontalScale(80),
      height: verticalScale(80),
      borderRadius: horizontalScale(8),
      backgroundColor: colors.unselectedBackground,
      borderWidth: 1,
      borderColor: colors.vilate20,
      borderStyle: 'dashed' as const,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginBottom: verticalScale(8),
    },
    addImageText: {
      fontSize: fontScale(12),
      fontFamily: fonts.Regular,
      color: colors.textColor,
      textAlign: 'center' as const,
    },
    // Category Selection Styles
    categorySection: {
      marginBottom: verticalScale(12),
    },
    categoryLabel: {
      fontSize: fontScale(14),
      fontFamily: fonts.Medium,
      color: colors.white,
      marginBottom: verticalScale(8),
    },
    categoryScrollView: {
      maxHeight: verticalScale(50),
    },
    categoryContainer: {
      paddingRight: horizontalScale(16),
    },
    categoryButton: {
      backgroundColor: colors.transparent,
      paddingVertical: verticalScale(8),
      paddingHorizontal: horizontalScale(16),
      borderRadius: horizontalScale(20),
      borderWidth: 1,
      borderColor: colors.white,
      marginRight: horizontalScale(8),
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryButtonSelected: {
      backgroundColor: colors.violate,
      borderColor: colors.violate,
      shadowColor: colors.violate,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    categoryButtonText: {
      fontSize: fontScale(12),
      fontFamily: fonts.Medium,
      color: colors.textColor,
    },
    categoryButtonTextSelected: {
      color: colors.white,
      fontFamily: fonts.SemiBold,
    },
  };

  return (
    <View style={styles.eventContainer}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>Ticket {eventIndex + 1}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(event.id)}
        >
          <CloseIcon size={20} color={colors.red} />
        </TouchableOpacity>
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.categoryLabel}>Ticket Type*</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScrollView}
          contentContainerStyle={styles.categoryContainer}
        >
          {ticketTypes.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                event.ticketType === category.id && styles.categoryButtonSelected
              ]}
              onPress={() => onUpdate(event.id, 'ticketType', category.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryButtonText,
                event.ticketType === category.id && styles.categoryButtonTextSelected
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <CustomeTextInput
            label="Ticket Price*"
            placeholder="Enter price"
            value={event.ticketPrice}
            onChangeText={(text) => onUpdate(event.id, 'ticketPrice', text)}
            kType="numeric"
            error={false}
            message=""
            leftImage=""
          />
        </View>
        <View style={styles.inputHalf}>
          <CustomeTextInput
            label="Capacity*"
            placeholder="Enter capacity"
            value={event.capacity}
            onChangeText={(text) => onUpdate(event.id, 'capacity', text)}
            kType="numeric"
            error={false}
            message=""
            leftImage=""
          />
        </View>
      </View>

    </View>
  );
};

export default EventForm;

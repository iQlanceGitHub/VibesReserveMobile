import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import { horizontalScale, verticalScale, fontScale } from '../../../../../utilis/appConstant';
import { CustomeTextInput } from '../../../../../components/textinput';
import CustomDropdown from '../../../../../components/CustomDropdown';
import ImageSelectionBottomSheet from '../../../../../components/ImageSelectionBottomSheet';
import GalleryIcon from '../../../../../assets/svg/galleryIcon';
// import TrashIcon from '../../../../../assets/svg/trashIcon';

interface EventData {
  id: string;
  eventName: string;
  eventType: string;
  eventPrice: string;
  capacity: string;
}

interface EventFormProps {
  event: EventData;
  eventIndex: number;
  onUpdate: (id: string, field: keyof EventData, value: string | string[]) => void;
  onRemove: (id: string) => void;
  onImagePicker: (type: 'camera' | 'gallery', imageType: "main" | "booth" | "event", boothIndex: number, eventIndex: number) => void;
  eventTypes: Array<{ id: string; name: string }>;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  eventIndex,
  onUpdate,
  onRemove,
  onImagePicker,
  eventTypes,
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
  };

  return (
    <View style={styles.eventContainer}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>Event {eventIndex + 1}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(event.id)}
        >
          <GalleryIcon size={20} color={colors.red} />
        </TouchableOpacity>
      </View>

      <CustomeTextInput
        label="Event Name*"
        placeholder="Enter event name"
        value={event.eventName}
        onChangeText={(text) => onUpdate(event.id, 'eventName', text)}
        error={false}
        message=""
        leftImage=""
      />

      <CustomDropdown
        label="Event Type*"
        placeholder="Select event type"
        options={eventTypes}
        selectedValue={eventTypes.find(type => type.id === event.eventType)?.name || event.eventType}
        onSelect={(value: any) => onUpdate(event.id, 'eventType', value.id)}
        error={false}
        message=""
      />

      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <CustomeTextInput
            label="Event Price*"
            placeholder="Enter price"
            value={event.eventPrice}
            onChangeText={(text) => onUpdate(event.id, 'eventPrice', text)}
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

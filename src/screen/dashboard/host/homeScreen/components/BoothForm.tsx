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
import DeleteIconNew from '../../../../../assets/svg/deleteIconNew';
// import TrashIcon from '../../../../../assets/svg/trashIcon';

interface BoothData {
  id: string;
  boothName: string;
  boothType: string;
  boothPrice: string;
  capacity: string;
  discountedPrice: string;
  boothImages: string[];
}

interface BoothFormProps {
  booth: BoothData;
  boothIndex: number;
  onUpdate: (id: string, field: keyof BoothData, value: string | string[]) => void;
  onRemove: (id: string) => void;
  onImagePicker: (type: 'camera' | 'gallery', imageType: "main" | "booth" | "event", boothIndex: number, eventIndex: number) => void;
  onDeleteImage: (boothIndex: number, imageIndex: number) => void;
  boothTypes: Array<{ id: string; name: string }>;
}

const BoothForm: React.FC<BoothFormProps> = ({
  booth,
  boothIndex,
  onUpdate,
  onRemove,
  onImagePicker,
  onDeleteImage,
  boothTypes,
}) => {
  const [showImagePicker, setShowImagePicker] = React.useState(false);
  const styles = {
    boothContainer: {
      backgroundColor: colors.vilate20,
      borderRadius: horizontalScale(12),
      padding: horizontalScale(16),
      marginBottom: verticalScale(16),
      borderWidth: 1,
      borderColor: colors.violate,
    },
    boothHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: verticalScale(16),
    },
    boothTitle: {
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
      marginTop: verticalScale(10),
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
      position: 'relative' as const,
    },
    deleteButton: {
      position: 'absolute' as const,
      top: -8,
      right: -8,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 12,
      width: 24,
      height: 24,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      zIndex: 1,
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
      marginTop: verticalScale(10),
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
    <View style={styles.boothContainer}>
      <View style={styles.boothHeader}>
        <Text style={styles.boothTitle}>Booth {boothIndex + 1}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(booth.id)}
        >
          <CloseIcon size={20} color={colors.red} />
        </TouchableOpacity>
      </View>

      <CustomeTextInput
        label="Booth Name*"
        placeholder="Enter booth name"
        value={booth.boothName}
        onChangeText={(text) => onUpdate(booth.id, 'boothName', text)}
        error={false}
        message=""
        leftImage=""
      />

      <View style={styles.categorySection}>
        <Text style={styles.categoryLabel}>Booth Type*</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScrollView}
          contentContainerStyle={styles.categoryContainer}
        >
          {boothTypes.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                booth.boothType === category.id && styles.categoryButtonSelected
              ]}
              onPress={() => onUpdate(booth.id, 'boothType', category.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.categoryButtonText,
                booth.boothType === category.id && styles.categoryButtonTextSelected
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
            label="Booth Price*"
            placeholder="Enter price"
            value={booth.boothPrice}
            onChangeText={(text) => onUpdate(booth.id, 'boothPrice', text)}
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
            value={booth.capacity}
            onChangeText={(text) => onUpdate(booth.id, 'capacity', text)}
            kType="numeric"
            error={false}
            message=""
            leftImage=""
          />
        </View>
      </View>

      <CustomeTextInput
        label="Discounted Price"
        placeholder="Enter discounted price"
        value={booth.discountedPrice}
        onChangeText={(text) => onUpdate(booth.id, 'discountedPrice', text)}
        kType="numeric"
        error={false}
        message=""
        leftImage=""
      />

      <View style={styles.imageSection}>
        <Text style={styles.imageSectionTitle}>
          Booth Images* ({booth.boothImages.length}/3)
        </Text>
        <View style={styles.imageGrid}>
          {booth.boothImages.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDeleteImage(boothIndex, index)}
              >
                <DeleteIconNew width={20} height={20} />
              </TouchableOpacity>
            </View>
          ))}
          {booth.boothImages.length < 3 && (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={() => {
                onImagePicker('gallery', 'booth', boothIndex, 0);
              }}
            >
              <GalleryIcon size={24} color={colors.violate} />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ImageSelectionBottomSheet
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onCameraPress={() => onImagePicker('camera', 'booth', boothIndex, 0)}
        onGalleryPress={() => onImagePicker('gallery', 'booth', boothIndex, 0)}
      />
    </View>
  );
};

export default BoothForm;

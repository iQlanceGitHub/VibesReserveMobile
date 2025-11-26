import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { colors } from "../../../../../../utilis/colors";
import { fonts } from "../../../../../../utilis/fonts";
import {
  fontScale,
  horizontalScale,
  verticalScale,
} from "../../../../../../utilis/appConstant";
import LocationFavourite from "../../../../../../assets/svg/locationFavourite";
import ArrowRightIcon from "../../../../../../assets/svg/arrowRightIcon";

interface TableCardProps {
  table: {
    _id?: string;
    type: string;
    name: string;
    details?: string;
    entryFee: number;
    eventCapacity: number;
    address: string;
    coordinates?: {
      type: string;
      coordinates: number[];
    };
    photos: string[];
    floorLayout?: string;
  };
  onPress: () => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      {/* Table Image */}
      <View style={styles.imageContainer}>
        <Image
          source={
            table.photos?.[0]
              ? { uri: table.photos[0] }
              : {
                  uri: "https://via.placeholder.com/120x90/2D014D/8D34FF?text=Table",
                }
          }
          style={styles.tableImage}
          resizeMode="cover"
        />
        {/* Type Badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{table.type}</Text>
        </View>
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {/* Header Row with Name and Price */}
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text numberOfLines={1} style={styles.tableName}>
              {table.name || "Table"}
            </Text>
          </View>
          <Text style={styles.priceText}>${table.entryFee}</Text>
        </View>

        {/* Details */}
        {table.details && (
          <Text numberOfLines={2} style={styles.detailsText}>
            {table.details}
          </Text>
        )}

        {/* Capacity */}
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Capacity:</Text>
          <Text style={styles.detailValue}>{table.eventCapacity} guests</Text>
        </View>

        {/* Address */}
        <View style={styles.detailsRow}>
          <LocationFavourite size={14} color={colors.violate} />
          <Text style={styles.addressText} numberOfLines={1}>
            {table.address}
          </Text>
        </View>

        {/* Floor Layout Indicator */}
        {table.floorLayout && (
          <View style={styles.floorLayoutContainer}>
            <Text style={styles.floorLayoutText}>Floor Layout Available</Text>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
          <ArrowRightIcon size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    width: "100%",
    minHeight: Platform.OS === "ios" ? verticalScale(160) : verticalScale(170),
    borderRadius: horizontalScale(16),
    marginBottom: verticalScale(16),
    padding: horizontalScale(16),
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    shadowColor: colors.purpleBorder,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  imageContainer: {
    position: "relative",
    marginRight: horizontalScale(12),
    width: horizontalScale(120),
    height: verticalScale(120),
  },
  tableImage: {
    width: "100%",
    height: "100%",
    borderRadius: horizontalScale(12),
  },
  typeBadge: {
    position: "absolute",
    top: verticalScale(8),
    left: horizontalScale(8),
    backgroundColor: colors.violate,
    borderRadius: horizontalScale(8),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
  },
  typeText: {
    fontSize: fontScale(10),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: verticalScale(4),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(6),
  },
  nameContainer: {
    flex: 1,
    marginRight: horizontalScale(8),
  },
  tableName: {
    fontSize: fontScale(16),
    fontWeight: "700",
    fontFamily: fonts.bold,
    color: colors.white,
  },
  priceText: {
    fontSize: fontScale(18),
    fontWeight: "800",
    fontFamily: fonts.bold,
    color: colors.violate,
  },
  detailsText: {
    fontSize: fontScale(12),
    fontFamily: fonts.regular,
    color: colors.white,
    marginBottom: verticalScale(8),
    opacity: 0.8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(6),
  },
  detailLabel: {
    fontSize: fontScale(12),
    fontFamily: fonts.medium,
    color: colors.violate,
    marginRight: horizontalScale(4),
  },
  detailValue: {
    fontSize: fontScale(12),
    fontFamily: fonts.regular,
    color: colors.white,
  },
  addressText: {
    fontSize: fontScale(12),
    fontFamily: fonts.regular,
    color: colors.white,
    marginLeft: horizontalScale(6),
    flex: 1,
    opacity: 0.8,
  },
  floorLayoutContainer: {
    backgroundColor: colors.violate + "20",
    borderRadius: horizontalScale(8),
    paddingHorizontal: horizontalScale(8),
    paddingVertical: verticalScale(4),
    marginTop: verticalScale(4),
    alignSelf: "flex-start",
  },
  floorLayoutText: {
    fontSize: fontScale(10),
    fontFamily: fonts.medium,
    color: colors.violate,
  },
  actionButton: {
    position: "absolute",
    bottom: verticalScale(0),
    right: verticalScale(0),
    width: horizontalScale(32),
    height: verticalScale(32),
    borderRadius: horizontalScale(16),
    backgroundColor: colors.violate,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.violate,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default TableCard;


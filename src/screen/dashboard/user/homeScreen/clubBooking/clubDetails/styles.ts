import { Platform, StyleSheet } from 'react-native';
import { colors } from '../../../../../../utilis/colors';
import { fonts } from '../../../../../../utilis/fonts';
import { fontScale, horizontalScale, verticalScale } from '../../../../../../utilis/appConstant';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gradient_dark_purple,
  },
  headerContainer: {
    height: verticalScale(371),
    position: 'relative',
    marginTop: verticalScale(-60),
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topNavigation: {
    position: 'absolute',
    top: verticalScale(50),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    zIndex: 10,
  },
  backButton: {
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? verticalScale(-90) : verticalScale(-30),
  },
  rightIcons: {
    flexDirection: 'column',
  },
  iconButton: {
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  eventCard: {
    borderWidth: 1,
    borderColor: colors.violate,
    backgroundColor: colors.backgroundColor,
    borderRadius: verticalScale(16),
    padding: horizontalScale(20),
    marginHorizontal: horizontalScale(15),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  categoryTag: {
    backgroundColor: colors.vilate20,
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(4),
    borderRadius: verticalScale(12),
  },
  categoryText: {
    fontSize: fontScale(12),
    fontFamily: fonts.Medium,
    color: colors.white,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(4),
  },
  ratingText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  eventTitle: {
    fontSize: fontScale(20),
    fontFamily: fonts.Bold,
    color: colors.white,
    lineHeight: fontScale(26),
    marginBottom: verticalScale(12),
    fontWeight: '700',
  },
  eventDetails: {
    gap: verticalScale(8),
    marginBottom: verticalScale(16),
    //flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
  },
  detailText: {
    fontSize: fontScale(12),
    fontFamily: fonts.Medium,
    color: colors.white,
    fontWeight: '400',
  },
  aboutSection: {
    marginTop: verticalScale(8),
  },
  aboutTitle: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(8),
    fontWeight: '700',
  },
  aboutText: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.white,
    lineHeight: fontScale(16),
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingBottom: verticalScale(100), // Add space for bottom bar
    marginTop: verticalScale(-140), // Start scroll above the image
   
    //marginBottom: verticalScale(100),
  },
  section: {
    marginBottom: verticalScale(24),
    marginTop: verticalScale(20),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontFamily: fonts.Bold,
    color: colors.white,
    //marginBottom: verticalScale(16),
  },
  loungesContainer: {
    flexDirection: 'row',
    gap: horizontalScale(16),
  },
  loungeCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: verticalScale(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    width: horizontalScale(280), // Fixed width for horizontal scroll
    flexShrink: 0, // Prevent shrinking
  },
  ticketCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: verticalScale(12),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    width: horizontalScale(173), // Fixed width for horizontal scroll
    flexShrink: 0, // Prevent shrinking
  },
  loungeCardSelected: {
    borderColor: colors.violate,
    borderWidth: 2,
  },
  loungeImage: {
    width: '100%',
    height: verticalScale(120),
  },
  loungeContent: {
    padding: horizontalScale(16),
  },
  loungeName: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(4),
  },
  loungeTitle: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.textcolor,
    marginBottom: verticalScale(2),
  },
  loungeDetails: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.white,
    marginBottom: verticalScale(12),
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    marginBottom: verticalScale(12),
  },
  originalPrice: {
    fontSize: fontScale(14),
    fontFamily: fonts.Regular,
    color: colors.lightGray,
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  selectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.violate,
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(16),
    borderRadius: verticalScale(20),
    alignSelf: 'flex-start',
  },
  selectButtonSelected: {
    backgroundColor: colors.violate,
  },
  selectButtonText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Medium,
    color: colors.violate,
  },
  selectButtonTextSelected: {
    color: colors.white,
  },
  organizationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    //padding: horizontalScale(16),
    borderRadius: verticalScale(12),
    marginTop: verticalScale(12),
  
  },
  organizerAvatar: {
    width: horizontalScale(50),
    height: verticalScale(50),
    borderRadius: verticalScale(25),
    marginRight: horizontalScale(12),
    borderWidth: 2,
    borderColor: colors.violate,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: verticalScale(4),
  },
  organizerRole: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.lightGray,
  },
  contactIcons: {
    flexDirection: 'row',
    gap: horizontalScale(12),
  },
  contactButton: {
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    backgroundColor: colors.violate + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCard: {
    backgroundColor: colors.cardBackground,
    padding: horizontalScale(16),
    borderRadius: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    marginBottom: verticalScale(12),
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    marginBottom: verticalScale(8),
  },
  addressText: {
    fontSize: fontScale(12),
    fontFamily: fonts.Regular,
    color: colors.white,
    flex: 1,
    fontWeight: '400',
    lineHeight: fontScale(16),
  },
  mapButton: {
    alignSelf: 'flex-end',
  },
  mapButtonText: {
    fontSize: fontScale(14),
    fontFamily: fonts.Medium,
    color: colors.violate,
    textDecorationLine: 'underline',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(12),
    marginTop: verticalScale(18),
  },
  facilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.violate + '20',
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderRadius: verticalScale(20),
    borderWidth: 1,
    borderColor: colors.violate,
    gap: horizontalScale(6),
  },
  facilityText: {
    fontSize: fontScale(12),
    fontFamily: fonts.Medium,
    color: colors.white,
  },
  facilityButtonSelected: {
    backgroundColor: colors.violate,
    borderColor: colors.violate,
  },
  facilityTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: horizontalScale(20),
    paddingVertical: verticalScale(16),
    borderTopWidth: 1,
    borderRadius: verticalScale(60),
    shadowColor: colors.violate,
    shadowOffset: {
      width: 0,
      height: -4, // Negative value creates shadow on top
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10, // For Android
    marginBottom: Platform.OS === 'ios' ? verticalScale(0) : verticalScale(60),
  },
  priceSection: {
    flex: 1,
  },
  totalPriceLabel: {
    fontSize: fontScale(14),
    fontFamily: fonts.Regular,
    color: colors.textcolor,
    marginBottom: verticalScale(4),
  },
  totalPriceValue: {
    fontSize: fontScale(24),
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  bookNowButton: {
    backgroundColor: colors.violate,
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(32),
    borderRadius: verticalScale(25),
  },
  bookNowText: {
    fontSize: fontScale(16),
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  mapContainer: {
    height: verticalScale(200),
    borderRadius: verticalScale(12),
    overflow: 'hidden',
    marginTop: verticalScale(12),
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPin: {
    width: horizontalScale(40),
    height: verticalScale(40),
    borderRadius: verticalScale(20),
    backgroundColor: colors.violate,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  // Coming Soon Dialog Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
  },
  comingSoonDialog: {
    backgroundColor: colors.white,
    borderRadius: verticalScale(16),
    padding: verticalScale(24),
    width: '100%',
    maxWidth: horizontalScale(320),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dialogHeader: {
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  dialogTitle: {
    fontSize: fontScale(24),
    fontFamily: fonts.bold,
    color: colors.violate,
    textAlign: 'center',
  },
  dialogContent: {
    marginBottom: verticalScale(24),
  },
  dialogMessage: {
    fontSize: fontScale(16),
    fontFamily: fonts.regular,
    color: colors.black,
    textAlign: 'center',
    lineHeight: fontScale(22),
  },
  dialogActions: {
    alignItems: 'center',
  },
  dialogButton: {
    backgroundColor: colors.violate,
    paddingHorizontal: horizontalScale(32),
    paddingVertical: verticalScale(12),
    borderRadius: verticalScale(32),
    minWidth: horizontalScale(120),
  },
  dialogButtonText: {
    fontSize: fontScale(16),
    fontFamily: fonts.semiBold,
    color: colors.white,
    textAlign: 'center',

  },
});
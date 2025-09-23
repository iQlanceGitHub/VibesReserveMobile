import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../../../utilis/colors';
import { fonts } from '../../../../../utilis/fonts';
import { horizontalScale, verticalScale, fontScale } from '../../../../../utilis/appConstant';

interface TicketData {
  _id: string;
  ticketType: {
    _id: string;
    name: string;
  };
  ticketPrice: number;
  capacity: number;
  soldTickets?: number; // Optional field for sold tickets count
}

interface TicketDisplayProps {
  tickets: TicketData[];
  onTicketSelect?: (ticket: TicketData) => void;
  showSelectButton?: boolean;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({
  tickets,
  onTicketSelect,
  showSelectButton = true,
}) => {
  console.log('TicketDisplay rendered with tickets:', tickets);
  
  const getSoldTickets = (ticket: TicketData) => {
    return ticket.soldTickets || 0;
  };

  const getAvailableTickets = (ticket: TicketData) => {
    return ticket.capacity - getSoldTickets(ticket);
  };

  const isSoldOut = (ticket: TicketData) => {
    return getAvailableTickets(ticket) <= 0;
  };

  const renderTicketCard = (ticket: TicketData, index: number) => (
    <View key={ticket._id || index} style={styles.ticketCard}>
      <Text style={styles.ticketTypeValue}>{ticket.ticketType.name}</Text>
      <Text style={styles.capacityValue}>
        {getSoldTickets(ticket)}/{ticket.capacity}
      </Text>
      <Text style={styles.priceValue}>${ticket.ticketPrice}</Text>
      
      {showSelectButton && onTicketSelect && (
        <TouchableOpacity
          style={[
            styles.selectButton,
            isSoldOut(ticket) && styles.selectButtonDisabled
          ]}
          onPress={() => onTicketSelect(ticket)}
          disabled={isSoldOut(ticket)}
        >
          <Text style={[
            styles.selectButtonText,
            isSoldOut(ticket) && styles.selectButtonTextDisabled
          ]}>
            {isSoldOut(ticket) ? 'Sold Out' : 'Select'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (!tickets || tickets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tickets available</Text>
      </View>
    );
  }

  // Debug: Always show something
  console.log('Rendering tickets:', tickets.length);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tickets</Text>
      <View style={styles.ticketsGrid}>
        {tickets.map((ticket, index) => renderTicketCard(ticket, index))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: verticalScale(16),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontFamily: fonts.semiBold,
    color: colors.white,
    marginBottom: verticalScale(12),
  },
  ticketsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ticketCard: {
    width: '48%',
    backgroundColor: colors.vilate20,
    borderRadius: horizontalScale(12),
    padding: horizontalScale(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.violate20,
    alignItems: 'center',
  },
  ticketTypeValue: {
    fontSize: fontScale(16),
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  capacityValue: {
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    color: colors.white,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  priceValue: {
    fontSize: fontScale(20),
    fontFamily: fonts.bold,
    color: colors.white,
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  selectButton: {
    backgroundColor: colors.violate,
    borderRadius: horizontalScale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(24),
    alignItems: 'center',
    width: '100%',
  },
  selectButtonDisabled: {
    backgroundColor: colors.gray,
  },
  selectButtonText: {
    fontSize: fontScale(14),
    fontFamily: fonts.medium,
    color: colors.white,
  },
  selectButtonTextDisabled: {
    color: colors.textColor,
  },
  emptyContainer: {
    padding: verticalScale(20),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontScale(14),
    fontFamily: fonts.regular,
    color: colors.textColor,
  },
});

export default TicketDisplay;

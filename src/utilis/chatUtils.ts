// Utility functions for chat functionality

export const calculateTotalUnreadCount = (chatList: any[]): number => {
  console.log('🧮 calculateTotalUnreadCount called with:', chatList);
  
  if (!chatList || !Array.isArray(chatList)) {
    console.log('🧮 calculateTotalUnreadCount: Invalid chatList, returning 0');
    return 0;
  }
  
  const total = chatList.reduce((total, chat) => {
    const unreadCount = chat.unreadCount || 0;
    console.log('🧮 Chat unread count:', { name: chat.businessName || chat.fullName, unreadCount });
    return total + unreadCount;
  }, 0);
  
  console.log('🧮 calculateTotalUnreadCount result:', total);
  return total;
};

export const formatUnreadCount = (count: number): string => {
  if (count <= 0) return '';
  if (count > 99) return '99+';
  return count.toString();
};

// Utility functions for chat functionality

export const calculateTotalUnreadCount = (chatList: any[]): number => {
  
  if (!chatList || !Array.isArray(chatList)) {
    return 0;
  }
  
  const total = chatList.reduce((total, chat) => {
    const unreadCount = chat.unreadCount || 0;
    return total + unreadCount;
  }, 0);
  
  return total;
};

export const formatUnreadCount = (count: number): string => {
  if (count <= 0) return '';
  if (count > 99) return '99+';
  return count.toString();
};

// Function to trigger chat click action
export const triggerChatClick = (store: any) => {
  console.log('Triggering chat click action...');
  store.dispatch({ type: 'ON_CHAT_CLICK', payload: {} });
};

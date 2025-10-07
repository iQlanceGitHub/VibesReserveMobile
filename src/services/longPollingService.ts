import { store } from '../reduxSaga/configureStore';
import { onUpdateMessages, onGetChatList } from '../redux/auth/actions';
import { fetchGet } from '../redux/services';

class LongPollingService {
  private intervalId: NodeJS.Timeout | null = null;
  private isActive = false;
  private baseUrl = 'http://54.241.179.201/vr-api/';

  startPolling() {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('Starting long polling service...');
    
    // Poll every 6 seconds
    this.intervalId = setInterval(() => {
      this.pollForUpdates();
    }, 6000);
    
    // Initial poll
    this.pollForUpdates();
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
    console.log('Stopped long polling service...');
  }

  private async pollForUpdates() {
    try {
      const response = await fetchGet({
        url: `${this.baseUrl}user/chatlist`,
      });

      if (response.status === true || response.status === "true" || response.status === 1) {
        const currentState = store.getState();
        const currentChatList = currentState.auth.chatList || [];
        const newChatList = response.data || response.chats || [];
        
        // Check for new messages in each conversation
        newChatList.forEach((newChat: any) => {
          const existingChat = currentChatList.find((chat: any) => 
            chat.conversationId === newChat.conversationId || 
            chat.otherUserId === newChat.otherUserId ||
            chat._id === newChat._id
          );
          
          if (existingChat) {
            const existingMessages = existingChat.messages || [];
            const newMessages = newChat.messages || [];
            
            // Find new messages by comparing IDs and timestamps
            const newMessagesToAdd = newMessages.filter((newMsg: any) => 
              !existingMessages.some((existingMsg: any) => 
                existingMsg._id === newMsg._id || 
                (existingMsg.timestamp === newMsg.timestamp && existingMsg.message === newMsg.message)
              )
            );
            
            if (newMessagesToAdd.length > 0) {
              console.log(`Found ${newMessagesToAdd.length} new messages for conversation ${newChat.conversationId || newChat.otherUserId}`);
              
              store.dispatch(onUpdateMessages({
                conversationId: newChat.conversationId || newChat.otherUserId,
                newMessages: newMessagesToAdd
              }));
            }
          } else if (newChat.messages && newChat.messages.length > 0) {
            // New conversation with messages
            console.log(`New conversation found with ${newChat.messages.length} messages`);
            
            store.dispatch(onUpdateMessages({
              conversationId: newChat.conversationId || newChat.otherUserId,
              newMessages: newChat.messages
            }));
          }
        });

        // Update the entire chat list if there are structural changes
        if (newChatList.length !== currentChatList.length) {
          store.dispatch(onGetChatList());
        }
      }
    } catch (error) {
      console.log('Long polling error:', error);
    }
  }

  isPollingActive(): boolean {
    return this.isActive;
  }
}

// Export singleton instance
export const longPollingService = new LongPollingService();
export default longPollingService;

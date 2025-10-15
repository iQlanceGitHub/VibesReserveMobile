import { store } from '../reduxSaga/StoreProvider';
import { onUpdateMessages, onGetChatList, onGetConversation, getConversationData, getChatListData } from '../redux/auth/actions';
import { fetchGet, fetchPost } from '../redux/services';
import { AppState } from 'react-native';
import { base_url_client } from '../redux/apiConstant';

class LongPollingService {
  private intervalId: NodeJS.Timeout | null = null;
  private isActive = false;
  private baseUrl = base_url_client;
  private currentConversationId: string | null = null;
  private currentOtherUserId: string | null = null;
  private appStateSubscription: any = null;
  private lastPollTime = 0;

  startPolling() {
    if (this.isActive) {
    
      return;
    }
    
    this.isActive = true;
  
    
    // Poll every 10 seconds for background updates
    this.intervalId = setInterval(() => {
      this.pollForUpdates();
    }, 10000);
    
    
    // Initial poll
    this.pollForUpdates();
    
    // Listen for app state changes
    this.setupAppStateListener();
    
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
    
    // Remove app state listener
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  setCurrentConversation(conversationId: string | null, otherUserId: string | null = null) {
    this.currentConversationId = conversationId;
    this.currentOtherUserId = otherUserId;
  }

  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && this.isActive) {
        // App came to foreground, immediately poll for updates
        this.pollForUpdates();
      }
    });
  }

  private async pollForUpdates() {
    const now = Date.now();
    
    // Prevent too frequent polling (match 10s interval)
    if (now - this.lastPollTime < 10000) {
      return;
    }
    this.lastPollTime = now;

    try {
      // Check if store is available
      if (!store) {
        console.log('❌ Store not available, skipping poll...');
        return;
      }

      // Poll chat list for new conversations and updates
      const chatListResponse = await fetchGet({
        url: `${this.baseUrl}user/chatlist`,
      });

      

      // Debug: Log the actual chat list data to see unread counts
      const newChatList: any[] = chatListResponse.data || chatListResponse.chats || [];


      if (chatListResponse.status === true || chatListResponse.status === "true" || chatListResponse.status === 1) {
        const currentState = (store as any).getState();
        const currentChatList: any[] = currentState.auth?.chatList || [];
        const newChatList: any[] = chatListResponse.data || chatListResponse.chats || [];
        
        // Always dispatch the updated chat list to ensure state is updated
        
        (store as any).dispatch(getChatListData(newChatList));
        
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
              
              (store as any).dispatch(onUpdateMessages({
                conversationId: newChat.conversationId || newChat.otherUserId,
                newMessages: newMessagesToAdd
              }));
            }
          } else if (newChat.messages && newChat.messages.length > 0) {
            // New conversation with messages
            
            (store as any).dispatch(onUpdateMessages({
              conversationId: newChat.conversationId || newChat.otherUserId,
              newMessages: newChat.messages
            }));
          }
        });

        // Update the entire chat list if there are structural changes or unread counts changed
        const hasStructuralChanges = newChatList.length !== currentChatList.length;
        const hasUnreadCountChanges = newChatList.some((newChat: any) => {
          const existingChat = currentChatList.find((chat: any) => 
            chat.conversationId === newChat.conversationId || 
            chat.otherUserId === newChat.otherUserId ||
            chat._id === newChat._id
          );
          return existingChat && (existingChat.unreadCount || 0) !== (newChat.unreadCount || 0);
        });

        if (hasStructuralChanges || hasUnreadCountChanges) {
          // Dispatch directly to Redux instead of going through saga
          (store as any).dispatch(getChatListData(newChatList));
        }
      }

      // If we're currently viewing a specific conversation, also poll for its messages
      if (this.currentOtherUserId) {
        try {
          const conversationResponse = await fetchPost({
            url: `${this.baseUrl}user/conversation`,
            params: { otherUserId: this.currentOtherUserId }
          });

          if (conversationResponse.status === true || conversationResponse.status === "true" || conversationResponse.status === 1) {
            const conversationData = conversationResponse.data || conversationResponse.messages || [];
            if (conversationData && Array.isArray(conversationData)) {
              // Directly update the conversation data in Redux without going through saga
              (store as any).dispatch(getConversationData(conversationData));
            }
          }
        } catch (conversationError) {
        }
      }
    } catch (error) {
    
    }
  }

  isPollingActive(): boolean {
    return this.isActive;
  }
}

// Export singleton instance
export const longPollingService = new LongPollingService();
export default longPollingService;

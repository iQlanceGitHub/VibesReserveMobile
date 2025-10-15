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
      console.log('Long polling service is already active, skipping start...');
      return;
    }
    
    this.isActive = true;
    console.log('🚀 Starting long polling service...');
    console.log('📱 App state:', AppState.currentState);
    
    // Poll every 10 seconds for background updates
    this.intervalId = setInterval(() => {
      console.log('⏰ Interval triggered - calling pollForUpdates...');
      this.pollForUpdates();
    }, 10000);
    
    console.log('✅ Interval set with ID:', this.intervalId);
    
    // Initial poll
    console.log('🔄 Starting initial poll...');
    this.pollForUpdates();
    
    // Listen for app state changes
    this.setupAppStateListener();
    
    console.log('✅ Long polling service started successfully');
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
    console.log('Stopped long polling service...');
    
    // Remove app state listener
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  setCurrentConversation(conversationId: string | null, otherUserId: string | null = null) {
    this.currentConversationId = conversationId;
    this.currentOtherUserId = otherUserId;
    console.log('Current conversation set to:', conversationId, 'otherUserId:', otherUserId);
  }

  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      console.log('App state changed to:', nextAppState);
      if (nextAppState === 'active' && this.isActive) {
        // App came to foreground, immediately poll for updates
        console.log('App became active, polling for updates...');
        this.pollForUpdates();
      }
    });
  }

  private async pollForUpdates() {
    const now = Date.now();
    console.log('🔍 pollForUpdates called at:', new Date().toISOString());
    console.log('⏱️ Time since last poll:', now - this.lastPollTime, 'ms');
    
    // Prevent too frequent polling (match 10s interval)
    if (now - this.lastPollTime < 10000) {
      console.log('⏭️ Skipping poll - too frequent (less than 10s)');
      return;
    }
    this.lastPollTime = now;
    
    console.log('=== 🔄 Long Polling Update ===');
    console.log('📱 App state:', AppState.currentState);
    console.log('💬 Current conversation ID:', this.currentConversationId);
    console.log('👤 Current other user ID:', this.currentOtherUserId);

    try {
      // Check if store is available
      if (!store) {
        console.log('❌ Store not available, skipping poll...');
        return;
      }

      // Poll chat list for new conversations and updates
      console.log('🌐 Making API call to:', `${this.baseUrl}user/chatlist`);
      const chatListResponse = await fetchGet({
        url: `${this.baseUrl}user/chatlist`,
      });

      console.log('📡 API Response received:', {
        status: chatListResponse.status,
        dataLength: chatListResponse.data?.length || 0,
        hasData: !!chatListResponse.data
      });

      // Debug: Log the actual chat list data to see unread counts
      const newChatList: any[] = chatListResponse.data || chatListResponse.chats || [];
      console.log('📋 Chat list data:', newChatList.map(chat => ({
        id: chat._id || chat.conversationId,
        name: chat.businessName || chat.fullName,
        unreadCount: chat.unreadCount || 0,
        lastMessage: chat.lastMessage
      })));

      if (chatListResponse.status === true || chatListResponse.status === "true" || chatListResponse.status === 1) {
        const currentState = (store as any).getState();
        const currentChatList: any[] = currentState.auth?.chatList || [];
        const newChatList: any[] = chatListResponse.data || chatListResponse.chats || [];
        
        // Always dispatch the updated chat list to ensure state is updated
        console.log('🔄 Dispatching updated chat list directly:', newChatList);
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
              console.log(`Found ${newMessagesToAdd.length} new messages for conversation ${newChat.conversationId || newChat.otherUserId}`);
              
              (store as any).dispatch(onUpdateMessages({
                conversationId: newChat.conversationId || newChat.otherUserId,
                newMessages: newMessagesToAdd
              }));
            }
          } else if (newChat.messages && newChat.messages.length > 0) {
            // New conversation with messages
            console.log(`New conversation found with ${newChat.messages.length} messages`);
            
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
          console.log('🔄 Updating chat list due to structural or unread count changes');
          console.log('🔄 Dispatching getChatListData directly with:', newChatList);
          // Dispatch directly to Redux instead of going through saga
          (store as any).dispatch(getChatListData(newChatList));
        }
      }

      // If we're currently viewing a specific conversation, also poll for its messages
      if (this.currentOtherUserId) {
        try {
          console.log('Polling conversation for otherUserId:', this.currentOtherUserId);
          const conversationResponse = await fetchPost({
            url: `${this.baseUrl}user/conversation`,
            params: { otherUserId: this.currentOtherUserId }
          });

          if (conversationResponse.status === true || conversationResponse.status === "true" || conversationResponse.status === 1) {
            const conversationData = conversationResponse.data || conversationResponse.messages || [];
            if (conversationData && Array.isArray(conversationData)) {
              console.log('Found conversation data:', conversationData.length, 'messages');
              // Directly update the conversation data in Redux without going through saga
              (store as any).dispatch(getConversationData(conversationData));
            }
          }
        } catch (conversationError) {
          console.log('Error polling conversation:', conversationError);
        }
      }
    } catch (error) {
      console.log('❌ Long polling error:', error);
      console.log('🔍 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
  }

  isPollingActive(): boolean {
    return this.isActive;
  }
}

// Export singleton instance
export const longPollingService = new LongPollingService();
export default longPollingService;

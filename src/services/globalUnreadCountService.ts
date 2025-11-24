import { store } from '../reduxSaga/StoreProvider';
import { onGetChatList, getChatListData, getChatListError } from '../redux/auth/actions';
import { calculateTotalUnreadCount } from '../utilis/chatUtils';

class GlobalUnreadCountService {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;
  private readonly UPDATE_INTERVAL = 10000; // 10 seconds

  // Global unread count state
  private globalUnreadCount = 0;
  private listeners: Array<(count: number) => void> = [];

  constructor() {
    this.startService();
  }

  // Start the global service
  public startService() {
    if (this.isRunning) {
      console.log('Global unread count service is already running');
      return;
    }

    console.log('Starting global unread count service...');
    this.isRunning = true;
    
    // Initial update
    this.updateUnreadCount();
    
    // Set up interval for regular updates
    this.intervalId = setInterval(() => {
      this.updateUnreadCount();
    }, this.UPDATE_INTERVAL);
  }

  // Stop the global service
  public stopService() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Global unread count service stopped');
  }

  // Update unread count by fetching latest chat list
  private async updateUnreadCount() {
    try {
      console.log('Global service: Updating unread count...');
      
      // Dispatch action to get latest chat list
      store.dispatch(onGetChatList());
      
      // Wait a bit for the API call to complete
      setTimeout(() => {
        const currentState = store.getState();
        const chatList = currentState.auth?.chatList || [];
        const newUnreadCount = calculateTotalUnreadCount(chatList);
        
        if (newUnreadCount !== this.globalUnreadCount) {
          console.log(`Global service: Unread count updated from ${this.globalUnreadCount} to ${newUnreadCount}`);
          this.globalUnreadCount = newUnreadCount;
          this.notifyListeners();
        }
      }, 2000); // Wait 2 seconds for API call to complete
      
    } catch (error) {
      console.error('Global service: Error updating unread count:', error);
    }
  }

  // Get current unread count
  public getUnreadCount(): number {
    return this.globalUnreadCount;
  }

  // Subscribe to unread count changes
  public subscribe(listener: (count: number) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners of count changes
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.globalUnreadCount);
      } catch (error) {
        console.error('Global service: Error notifying listener:', error);
      }
    });
  }

  // Force update (useful for immediate updates)
  public forceUpdate() {
    console.log('Global service: Force update triggered');
    this.updateUnreadCount();
  }

  // Check if service is running
  public isServiceRunning(): boolean {
    return this.isRunning;
  }
}

// Create singleton instance
const globalUnreadCountService = new GlobalUnreadCountService();

export default globalUnreadCountService;

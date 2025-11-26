import AsyncStorage from '@react-native-async-storage/async-storage';

interface ModerationReport {
  id: string;
  contentType: 'message' | 'review' | 'profile' | 'user';
  contentId: string;
  reason: string;
  details?: string;
  reporterId: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedAt?: string;
  reviewedBy?: string;
  action?: 'removed' | 'warned' | 'suspended' | 'banned' | 'no_action';
}

interface BlockedUser {
  id: string;
  userId: string;
  blockedBy: string;
  reason: string;
  timestamp: string;
  status: 'active' | 'unblocked';
  userName?: string;
  userProfilePicture?: string;
}

class ModerationService {
  private static instance: ModerationService;
  private reports: ModerationReport[] = [];
  private blockedUsers: BlockedUser[] = [];

  private constructor() {
    this.loadData();
  }

  public static getInstance(): ModerationService {
    if (!ModerationService.instance) {
      ModerationService.instance = new ModerationService();
    }
    return ModerationService.instance;
  }

  private async loadData(): Promise<void> {
    try {
      const reportsData = await AsyncStorage.getItem('moderation_reports');
      if (reportsData) {
        this.reports = JSON.parse(reportsData);
      }

      const blockedData = await AsyncStorage.getItem('blocked_users');
      if (blockedData) {
        this.blockedUsers = JSON.parse(blockedData);
      }
    } catch (error) {
      console.error('Failed to load moderation data:', error);
    }
  }

  private async saveData(): Promise<void> {
    try {
      await AsyncStorage.setItem('moderation_reports', JSON.stringify(this.reports));
      await AsyncStorage.setItem('blocked_users', JSON.stringify(this.blockedUsers));
    } catch (error) {
      console.error('Failed to save moderation data:', error);
    }
  }

  // Report content for moderation
  public async reportContent(
    contentType: 'message' | 'review' | 'profile' | 'user',
    contentId: string,
    reason: string,
    details: string,
    reporterId: string
  ): Promise<ModerationReport> {
    const report: ModerationReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      contentType,
      contentId,
      reason,
      details,
      reporterId,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };

    this.reports.push(report);
    await this.saveData();

    // Simulate automatic review process (in real app, this would be handled by backend)
    this.scheduleAutomaticReview(report);

    return report;
  }

  // Block a user
  public async blockUser(
    userId: string,
    blockedBy: string,
    reason: string,
    userName?: string,
    userProfilePicture?: string
  ): Promise<BlockedUser> {
    const blockedUser: BlockedUser = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      blockedBy,
      reason,
      timestamp: new Date().toISOString(),
      status: 'active',
      userName,
      userProfilePicture,
    };

    this.blockedUsers.push(blockedUser);
    await this.saveData();

    return blockedUser;
  }

  // Unblock a user
  public async unblockUser(userId: string, unblockedBy: string): Promise<boolean> {
    const blockedUser = this.blockedUsers.find(
      (block) => block.userId === userId && block.status === 'active'
    );

    if (blockedUser) {
      blockedUser.status = 'unblocked';
      await this.saveData();
      return true;
    }

    return false;
  }

  // Get blocked users
  public getBlockedUsers(): BlockedUser[] {
    return this.blockedUsers.filter((block) => block.status === 'active');
  }

  // Check if user is blocked
  public isUserBlocked(userId: string): boolean {
    return this.blockedUsers.some(
      (block) => block.userId === userId && block.status === 'active'
    );
  }

  // Get blocked user information by userId
  public getBlockedUserInfo(userId: string): BlockedUser | null {
    return this.blockedUsers.find(
      (block) => block.userId === userId && block.status === 'active'
    ) || null;
  }

  // Get pending reports
  public getPendingReports(): ModerationReport[] {
    return this.reports.filter((report) => report.status === 'pending');
  }

  // Get reports by content type
  public getReportsByContentType(contentType: string): ModerationReport[] {
    return this.reports.filter((report) => report.contentType === contentType);
  }

  // Simulate automatic review process (24-hour response requirement)
  private scheduleAutomaticReview(report: ModerationReport): void {
    // In a real app, this would be handled by the backend
    // For demo purposes, we'll simulate a review after 1 minute
    setTimeout(() => {
      this.performAutomaticReview(report);
    }, 60000); // 1 minute for demo (should be 24 hours in production)
  }

  private async performAutomaticReview(report: ModerationReport): Promise<void> {
    try {
      // Simulate AI/content moderation logic
      const isViolation = this.checkForViolations(report);

      if (isViolation) {
        // Take action based on violation type
        const action = this.determineAction(report);
        await this.executeAction(report, action);
      } else {
        // No violation found
        report.status = 'dismissed';
        report.reviewedAt = new Date().toISOString();
        report.reviewedBy = 'system';
        report.action = 'no_action';
      }

      await this.saveData();
    } catch (error) {
      console.error('Failed to perform automatic review:', error);
    }
  }

  private checkForViolations(report: ModerationReport): boolean {
    // Simple keyword-based violation detection
    // In a real app, this would use AI/ML models
    const violationKeywords = [
      'harassment', 'hate', 'spam', 'inappropriate', 'violence',
      'threat', 'abuse', 'discrimination', 'offensive'
    ];

    const content = `${report.reason} ${report.details || ''}`.toLowerCase();
    return violationKeywords.some(keyword => content.includes(keyword));
  }

  private determineAction(report: ModerationReport): 'removed' | 'warned' | 'suspended' | 'banned' {
    // Simple action determination logic
    // In a real app, this would be more sophisticated
    const severityKeywords = {
      'banned': ['hate', 'violence', 'threat'],
      'suspended': ['harassment', 'abuse'],
      'warned': ['spam', 'inappropriate'],
      'removed': ['offensive', 'discrimination']
    };

    const content = `${report.reason} ${report.details || ''}`.toLowerCase();
    
    for (const [action, keywords] of Object.entries(severityKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        return action as any;
      }
    }

    return 'removed'; // Default action
  }

  private async executeAction(report: ModerationReport, action: string): Promise<void> {
    report.status = 'resolved';
    report.reviewedAt = new Date().toISOString();
    report.reviewedBy = 'system';
    report.action = action as any;

    // Log the action for audit purposes
    console.log(`Moderation Action: ${action} for report ${report.id}`);
    
    // In a real app, this would:
    // 1. Remove the content from the platform
    // 2. Notify the content creator
    // 3. Update user reputation scores
    // 4. Send notifications to moderators
    // 5. Update analytics and reporting
  }

  // Get moderation statistics
  public getModerationStats(): {
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    dismissedReports: number;
    blockedUsers: number;
  } {
    return {
      totalReports: this.reports.length,
      pendingReports: this.reports.filter(r => r.status === 'pending').length,
      resolvedReports: this.reports.filter(r => r.status === 'resolved').length,
      dismissedReports: this.reports.filter(r => r.status === 'dismissed').length,
      blockedUsers: this.blockedUsers.filter(b => b.status === 'active').length,
    };
  }

  // Clear all data (for testing purposes)
  public async clearAllData(): Promise<void> {
    this.reports = [];
    this.blockedUsers = [];
    await this.saveData();
  }
}

export default ModerationService;

import DeviceInfo from 'react-native-device-info';
import { Platform, Linking } from 'react-native';

interface VersionInfo {
  latest_version: string;
  min_version: string;
  force_update: boolean;
  update_message?: string;
}

class ForceUpdateService {
  private static instance: ForceUpdateService;
  private currentVersion: string = '1.0.0';
  private latestVersion: string = '1.0.0';
  private minVersion: string = '1.0.0';
  private forceUpdate: boolean = false;
  private updateMessage: string = '';
  private storeUrl: string = '';

  // Hard-coded version configuration - Update these values when you release a new version
  // ⚠️ IMPORTANT: 
  // - Update these values when you publish a new version to force users to update
  // - ONLY set force_update to true when you're CERTAIN the new version is live in BOTH stores
  // - If Android/iOS is still under review, DO NOT enable force_update
  private versionConfig: VersionInfo = {
    latest_version: '1.0.0',  // Update this to the latest version in store
    min_version: '1.0.0',     // Minimum version required
    force_update: false,       // ⚠️ ONLY set to true when new version is live in BOTH stores
    update_message: 'A new version of VibesReserve is available. Please update your app.',
  };

  private constructor() {
    this.getCurrentVersion();
    this.storeUrl = this.getDefaultStoreUrl();
  }

  public static getInstance(): ForceUpdateService {
    if (!ForceUpdateService.instance) {
      ForceUpdateService.instance = new ForceUpdateService();
    }
    return ForceUpdateService.instance;
  }

  private async getCurrentVersion(): Promise<void> {
    try {
      this.currentVersion = await DeviceInfo.getVersion();
      console.log('Current app version:', this.currentVersion);
    } catch (error) {
      console.error('Error getting current version:', error);
    }
  }

  public async checkForUpdate(): Promise<boolean> {
    try {
      console.log('Checking for app updates...');
      
      // Get current version
      const currentVersion = await DeviceInfo.getVersion();
      this.currentVersion = currentVersion;

      // Validate version configuration
      if (!this.isValidVersionConfig()) {
        console.log('Version configuration is not valid or not set. Skipping force update.');
        return false;
      }

      // Compare versions
      this.latestVersion = this.versionConfig.latest_version;
      this.minVersion = this.versionConfig.min_version;
      this.forceUpdate = this.versionConfig.force_update;
      this.updateMessage = this.versionConfig.update_message || '';

      // Check if current version is less than minimum version
      if (this.compareVersions(this.currentVersion, this.minVersion) < 0) {
        // Only force update if explicitly enabled
        // This prevents accidental force updates during app review
        if (this.versionConfig.force_update) {
          this.forceUpdate = true;
        } else {
          console.log('Version is out of date, but force_update is disabled. User can continue.');
          return false;
        }
      }

      // Only force update if explicitly set to true AND version config is valid
      if (!this.forceUpdate) {
        console.log('No force update required');
        return false;
      }

      console.log('Version check:', {
        current: this.currentVersion,
        latest: this.latestVersion,
        min: this.minVersion,
        forceUpdate: this.forceUpdate,
      });

      return this.forceUpdate;
    } catch (error) {
      console.error('Error checking for updates:', error);
      // Don't force update if there's an error - let users use the app
      return false;
    }
  }

  /**
   * Validate if version configuration is properly set
   * Returns false if config is invalid, preventing force update
   */
  private isValidVersionConfig(): boolean {
    // Check if version config exists and has valid values
    if (!this.versionConfig) {
      return false;
    }

    // Check if versions are not empty
    if (!this.versionConfig.latest_version || !this.versionConfig.min_version) {
      return false;
    }

    // Check if versions are valid format (contains at least one dot and numbers)
    const versionPattern = /^\d+\.\d+\.\d+$/;
    if (!versionPattern.test(this.versionConfig.latest_version) || 
        !versionPattern.test(this.versionConfig.min_version)) {
      return false;
    }

    // Only allow force update if explicitly set to true
    // This prevents accidental force updates
    if (!this.versionConfig.force_update) {
      // Also check if current version is less than min version
      // This is a safety check
      return true; // Allow version comparison
    }

    return true;
  }

  /**
   * Compare two version strings
   * Returns: -1 if v1 < v2, 0 if v1 == v2, 1 if v1 > v2
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    const maxLength = Math.max(parts1.length, parts2.length);

    for (let i = 0; i < maxLength; i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;

      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }

    return 0;
  }

  public isUpdateRequired(): boolean {
    return this.forceUpdate;
  }

  public getStoreUrl(): string {
    return this.storeUrl || this.getDefaultStoreUrl();
  }

  public getUpdateMessage(): string {
    return this.updateMessage || 'A new version of VibesReserve is available. Please update your app.';
  }

  public getLatestVersion(): string {
    return this.latestVersion;
  }

  public getCurrentAppVersion(): string {
    return this.currentVersion;
  }

  private getDefaultStoreUrl(): string {
    if (Platform.OS === 'ios') {
      // iOS App Store URL
      return 'https://apps.apple.com/us/app/vibe-reserve/id6754464237';
    } else {
      // Google Play Store URL
      return 'https://play.google.com/store/apps/details?id=com.app.VibesReserveMobile';
    }
  }

  public openStore(): void {
    const url = this.storeUrl || this.getDefaultStoreUrl();
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open store URL:', err);
    });
  }

  /**
   * Update the version configuration to enable force update
   * Call this method when you want to force users to update
   * @param latestVersion - Latest version available in store
   * @param minVersion - Minimum required version
   * @param forceUpdate - Set to true to force update
   * @param updateMessage - Optional custom message
   */
  public setVersionConfig(
    latestVersion: string,
    minVersion: string,
    forceUpdate: boolean = false,
    updateMessage?: string
  ): void {
    this.versionConfig.latest_version = latestVersion;
    this.versionConfig.min_version = minVersion;
    this.versionConfig.force_update = forceUpdate;
    if (updateMessage) {
      this.versionConfig.update_message = updateMessage;
    }
    console.log('Version config updated:', this.versionConfig);
  }
}

export default ForceUpdateService.getInstance();


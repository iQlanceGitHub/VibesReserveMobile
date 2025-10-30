//import UIKit
//import React
//import React_RCTAppDelegate
//import ReactAppDependencyProvider
//
//@main
//class AppDelegate: UIResponder, UIApplicationDelegate {
//  var window: UIWindow?
//
//  var reactNativeDelegate: ReactNativeDelegate?
//  var reactNativeFactory: RCTReactNativeFactory?
//
//  func application(
//    _ application: UIApplication,
//    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
//  ) -> Bool {
//    let delegate = ReactNativeDelegate()
//    let factory = RCTReactNativeFactory(delegate: delegate)
//    delegate.dependencyProvider = RCTAppDependencyProvider()
//
//    reactNativeDelegate = delegate
//    reactNativeFactory = factory
//
//    window = UIWindow(frame: UIScreen.main.bounds)
//
//    factory.startReactNative(
//      withModuleName: "VibesReserveMobile",
//      in: window,
//      launchOptions: launchOptions
//    )
//
//    return true
//  }
//}
//
//class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
//  override func sourceURL(for bridge: RCTBridge) -> URL? {
//    self.bundleURL()
//  }
//
//  override func bundleURL() -> URL? {
//#if DEBUG
//    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
//#else
//    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
//#endif
//  }
//}
import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import FirebaseMessaging
import UserNotifications
import GoogleSignIn

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
  
  // Override window property to force light mode
  override var window: UIWindow? {
    get {
      return super.window
    }
    set {
      super.window = newValue
      if #available(iOS 13.0, *) {
        super.window?.overrideUserInterfaceStyle = .light
      }
    }
  }
  
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    print("🚀 AppDelegate: didFinishLaunchingWithOptions called")
    NSLog("🚀 AppDelegate: didFinishLaunchingWithOptions called")
    
    // Force light mode - disable dark mode
    if #available(iOS 13.0, *) {
      window?.overrideUserInterfaceStyle = .light
    }
    
    self.moduleName = "VibesReserveMobile"
    self.dependencyProvider = RCTAppDependencyProvider()

    // Configure Firebase
    print("🔥 AppDelegate: Configuring Firebase...")
    NSLog("🔥 AppDelegate: Configuring Firebase...")
    FirebaseApp.configure()
    
    // Configure Firebase Messaging
    Messaging.messaging().delegate = self
    print("✅ AppDelegate: Firebase configured successfully")
    NSLog("✅ AppDelegate: Firebase configured successfully")
    
    // Configure Google Sign-In
    print("🔐 AppDelegate: Configuring Google Sign-In...")
    NSLog("🔐 AppDelegate: Configuring Google Sign-In...")
    if let path = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"),
       let plist = NSDictionary(contentsOfFile: path),
       let clientId = plist["CLIENT_ID"] as? String {
      GIDSignIn.sharedInstance.configuration = GIDConfiguration(clientID: clientId)
      print("✅ AppDelegate: Google Sign-In configured successfully")
      NSLog("✅ AppDelegate: Google Sign-In configured successfully")
    } else {
      print("❌ AppDelegate: Failed to configure Google Sign-In - GoogleService-Info.plist not found or invalid")
      NSLog("❌ AppDelegate: Failed to configure Google Sign-In - GoogleService-Info.plist not found or invalid")
    }
    
    // Configure push notifications
    print("🔔 AppDelegate: Starting push notification configuration...")
    NSLog("🔔 AppDelegate: Starting push notification configuration...")
    configurePushNotifications(application: application)
    
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    
    print("🏁 AppDelegate: didFinishLaunchingWithOptions completed")
    NSLog("🏁 AppDelegate: didFinishLaunchingWithOptions completed")
    
    // Ensure light mode is forced after window is created
    DispatchQueue.main.async {
      if #available(iOS 13.0, *) {
        self.window?.overrideUserInterfaceStyle = .light
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
          windowScene.windows.forEach { $0.overrideUserInterfaceStyle = .light }
        }
      }
    }
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  // MARK: - Push Notification Configuration
  private func configurePushNotifications(application: UIApplication) {
    print("🔧 Starting push notification configuration...")
    NSLog("🔧 Starting push notification configuration...")
    
    // Set UNUserNotificationCenter delegate
    UNUserNotificationCenter.current().delegate = self
    print("📱 Set UNUserNotificationCenter delegate")
    NSLog("📱 Set UNUserNotificationCenter delegate")
    
    // Check current authorization status first
    UNUserNotificationCenter.current().getNotificationSettings { settings in
      print("📱 Current notification settings: \(settings.authorizationStatus.rawValue)")
      NSLog("📱 Current notification settings: \(settings.authorizationStatus.rawValue)")
      
      DispatchQueue.main.async {
        // Request notification permissions FIRST
        self.requestNotificationPermission(application: application, currentSettings: settings)
      }
    }
  }
  
  private func requestNotificationPermission(application: UIApplication, currentSettings: UNNotificationSettings) {
    // Check if we already have permission
    if currentSettings.authorizationStatus == .authorized || currentSettings.authorizationStatus == .provisional {
      print("✅ Notification permission already granted")
      NSLog("✅ Notification permission already granted")
      application.registerForRemoteNotifications()
      return
    }
    
    let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
    
    UNUserNotificationCenter.current().requestAuthorization(options: authOptions) { granted, error in
      DispatchQueue.main.async {
        if let error = error {
          print("❌ Notification permission error: \(error.localizedDescription)")
          NSLog("❌ Notification permission error: \(error.localizedDescription)")
          return
        }
        
        if granted {
          print("✅ Notification permission GRANTED")
          NSLog("✅ Notification permission GRANTED")
          
          // ONLY AFTER permission is granted, register for remote notifications
          print("📱 Registering for remote notifications...")
          NSLog("📱 Registering for remote notifications...")
          application.registerForRemoteNotifications()
          
        } else {
          print("❌ Notification permission DENIED")
          NSLog("❌ Notification permission DENIED")
        }
        
        // Check final status
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
          self.checkAPNsRegistrationStatus(application: application)
        }
      }
    }
  }
  
  // MARK: - APNs Registration Status Check
  private func checkAPNsRegistrationStatus(application: UIApplication) {
    print("🔍 Checking APNs registration status...")
    
    // Check if the app is registered for remote notifications
    if application.isRegisteredForRemoteNotifications {
      print("✅ App is registered for remote notifications")
    } else {
      print("❌ App is NOT registered for remote notifications")
    }
    
    // Check notification settings again
    UNUserNotificationCenter.current().getNotificationSettings { settings in
      print("🔍 Final notification settings:")
      print("📱 Authorization status: \(settings.authorizationStatus.rawValue)")
      print("📱 Alert setting: \(settings.alertSetting.rawValue)")
      print("📱 Badge setting: \(settings.badgeSetting.rawValue)")
      print("📱 Sound setting: \(settings.soundSetting.rawValue)")
    }
  }
  
  // MARK: - UNUserNotificationCenterDelegate Methods
  
  // Handle notification when app is in foreground
  func userNotificationCenter(_ center: UNUserNotificationCenter, 
                            willPresent notification: UNNotification, 
                            withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    print("📱 Received notification in foreground: \(notification.request.content.userInfo)")
    NSLog("📱 Received notification in foreground: \(notification.request.content.userInfo)")
    
    // Always show notification even when app is in foreground
    // This is crucial for iOS foreground notification display
    completionHandler([.alert, .badge, .sound])
  }
  
  // Handle notification tap when app is in background or terminated
  func userNotificationCenter(_ center: UNUserNotificationCenter, 
                            didReceive response: UNNotificationResponse, 
                            withCompletionHandler completionHandler: @escaping () -> Void) {
    print("📱 User tapped notification: \(response.notification.request.content.userInfo)")
    
    completionHandler()
  }
  
  // MARK: - Firebase MessagingDelegate Methods
  
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    print("🔥 Firebase Messaging: FCM token received")
    NSLog("🔥 Firebase Messaging: FCM token received")
    
    if let fcmToken = fcmToken {
      print("📱 FCM Token: \(fcmToken)")
      NSLog("📱 FCM Token: \(fcmToken)")
    } else {
      print("❌ FCM Token is nil")
      NSLog("❌ FCM Token is nil")
    }
    
    // You can send this token to your server if needed
  }
  
  // MARK: - Remote Notification Registration
  
  // Called when APNs has assigned the device a unique token
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    print("🎉 SUCCESS: APNs device token received!")
    NSLog("🎉 SUCCESS: APNs device token received!")
    
    let tokenString = deviceToken.map { String(format: "%02.2hhx", $0) }.joined()
    print("📱 APNs device token: \(tokenString)")
    NSLog("📱 APNs device token: \(tokenString)")
    print("📱 APNs token length: \(deviceToken.count) bytes")
    NSLog("📱 APNs token length: \(deviceToken.count) bytes")
    
    // 🔥 CRITICAL: Set APNs token to Firebase Messaging
    Messaging.messaging().apnsToken = deviceToken
    print("✅ APNs token set to Firebase Messaging")
    NSLog("✅ APNs token set to Firebase Messaging")
    
    // Get FCM token now that we have APNs token
    Messaging.messaging().token { token, error in
      if let error = error {
        print("❌ Error getting FCM token: \(error.localizedDescription)")
        NSLog("❌ Error getting FCM token: \(error.localizedDescription)")
      } else if let token = token {
        print("🔥 FCM Token retrieved: \(token)")
        NSLog("🔥 FCM Token retrieved: \(token)")
      }
    }
  }
  
  // Called when APNs failed to register the device for push notifications
  override func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("❌ FAILED: APNs registration failed!")
    NSLog("❌ FAILED: APNs registration failed!")
    print("❌ Error: \(error.localizedDescription)")
    NSLog("❌ Error: \(error.localizedDescription)")
    
    // Try to get FCM token anyway (might work for development)
    Messaging.messaging().token { token, error in
      if let error = error {
        print("❌ FCM token also failed: \(error.localizedDescription)")
      } else if let token = token {
        print("⚠️ Got FCM token without APNs (development mode?): \(token)")
      }
    }
  }
  
  // Handle remote notification when app is in background
  override func application(_ application: UIApplication, 
                          didReceiveRemoteNotification userInfo: [AnyHashable: Any], 
                          fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    print("📱 Received remote notification in background: \(userInfo)")
    
    completionHandler(.newData)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }
  
  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
  
  // MARK: - URL Handling for Google Sign-In
  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    print("🔗 AppDelegate: Handling URL: \(url)")
    NSLog("🔗 AppDelegate: Handling URL: \(url)")
    
    // Handle Google Sign-In URL
    if GIDSignIn.sharedInstance.handle(url) {
      print("✅ AppDelegate: Google Sign-In URL handled successfully")
      NSLog("✅ AppDelegate: Google Sign-In URL handled successfully")
      return true
    }
    
    // Handle other URLs if needed
    return super.application(app, open: url, options: options)
  }
}
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

@main
class AppDelegate: RCTAppDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "VibesReserveMobile"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    Thread.sleep(forTimeInterval: 5.0)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
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
}

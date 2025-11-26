package com.app.VibesReserveMobile

import android.os.Build
import android.os.Bundle
import androidx.core.view.WindowCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.ReactRootView
import org.devio.rn.splashscreen.SplashScreen


class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "VibesReserveMobile"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use a custom delegate
   * to avoid feature flags issues
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      object : ReactActivityDelegate(this, mainComponentName) {
        override fun createRootView(): ReactRootView = ReactRootView(context)
      }

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)
    super.onCreate(savedInstanceState)
    
    // Enable edge-to-edge display for Android 15 compatibility
    // Android 15 is API level 35
    if (Build.VERSION.SDK_INT >= 35) {
      WindowCompat.setDecorFitsSystemWindows(window, false)
    }
  }
}

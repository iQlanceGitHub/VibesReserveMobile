# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep network-related classes
-keep class okhttp3.** { *; }
-keep class retrofit2.** { *; }
-keep class com.facebook.react.modules.network.** { *; }

# Keep React Native network classes
-keep class com.facebook.react.modules.network.NetworkingModule { *; }
-keep class com.facebook.react.modules.network.OkHttpClientProvider { *; }

# Keep your API classes
-keep class com.vibesreservemobile.** { *; }

# Keep all native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep all classes that might be used by reflection
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod

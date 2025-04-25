package com.testest

import com.adobe.marketing.mobile.CampaignClassic
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.ReactApplication

class MyFirebaseMessagingService : FirebaseMessagingService() {
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Send token to React Native
//        CampaignClassic.registerDevice(token, "akhiljain@adobe.com", null)
        val reactContext = (application as ReactApplication)
            .reactNativeHost
            .reactInstanceManager
            .currentReactContext as ReactApplicationContext?
        
        reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            ?.emit("FCMToken", token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        // Handle received messages here if needed
    }
} 
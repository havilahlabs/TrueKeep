package com.truekeep.app

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class NudgeWidgetBridgeModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "NudgeWidgetBridge"

  @ReactMethod
  fun writePayload(payload: ReadableMap) {
    val prefs = reactContext.getSharedPreferences(NudgeWidget.PREFS_NAME, Context.MODE_PRIVATE)
    prefs.edit().apply {
      payload.getString("title")?.let { putString("widget_title", it) }
      payload.getString("subtitle")?.let { putString("widget_subtitle", it) }
      payload.getString("deepLink")?.let { putString("widget_deepLink", it) }
      apply()
    }
  }

  @ReactMethod
  fun reloadTimelines() {
    val manager = AppWidgetManager.getInstance(reactContext)
    val ids = manager.getAppWidgetIds(
      ComponentName(reactContext, NudgeWidget::class.java),
    )
    for (id in ids) {
      NudgeWidget.updateWidget(reactContext, manager, id)
    }
  }
}

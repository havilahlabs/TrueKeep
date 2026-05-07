package com.truekeep.app

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews

class NudgeWidget : AppWidgetProvider() {

  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray,
  ) {
    for (id in appWidgetIds) {
      updateWidget(context, appWidgetManager, id)
    }
  }

  companion object {
    const val PREFS_NAME = "truekeep_widget"

    fun updateWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {
      val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      val title = prefs.getString("widget_title", "One thoughtful thing at a time")
        ?: "One thoughtful thing at a time"
      val subtitle = prefs.getString("widget_subtitle", "Add a person to get your first nudge.")
        ?: "Add a person to get your first nudge."
      val deepLink = prefs.getString("widget_deepLink", "truekeep://people")
        ?: "truekeep://people"

      val views = RemoteViews(context.packageName, R.layout.nudge_widget)
      views.setTextViewText(R.id.widget_title, title)
      views.setTextViewText(R.id.widget_subtitle, subtitle)

      val intent = Intent(Intent.ACTION_VIEW, Uri.parse(deepLink)).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
      }
      val pendingIntent = PendingIntent.getActivity(
        context,
        appWidgetId,
        intent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )
      views.setOnClickPendingIntent(R.id.widget_container, pendingIntent)

      appWidgetManager.updateAppWidget(appWidgetId, views)
    }
  }
}

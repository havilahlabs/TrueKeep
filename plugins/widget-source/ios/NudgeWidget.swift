import WidgetKit
import SwiftUI

private let appGroup = "group.com.truekeep.app"

// MARK: - Data model

struct WidgetPayload: Codable {
  var title: String
  var subtitle: String
  var deepLink: String
  var nudgeId: String?
}

// MARK: - Timeline provider

struct NudgeEntry: TimelineEntry {
  let date: Date
  let payload: WidgetPayload
}

struct NudgeProvider: TimelineProvider {
  func placeholder(in context: Context) -> NudgeEntry {
    NudgeEntry(date: .now, payload: emptyPayload())
  }

  func getSnapshot(in context: Context, completion: @escaping (NudgeEntry) -> Void) {
    completion(NudgeEntry(date: .now, payload: loadPayload()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<NudgeEntry>) -> Void) {
    let entry = NudgeEntry(date: .now, payload: loadPayload())
    let refresh = Calendar.current.date(byAdding: .hour, value: 1, to: .now) ?? .now
    completion(Timeline(entries: [entry], policy: .after(refresh)))
  }

  private func loadPayload() -> WidgetPayload {
    guard
      let defaults = UserDefaults(suiteName: appGroup),
      let data = defaults.data(forKey: "widget_payload"),
      let decoded = try? JSONDecoder().decode(WidgetPayload.self, from: data)
    else { return emptyPayload() }
    return decoded
  }

  private func emptyPayload() -> WidgetPayload {
    WidgetPayload(
      title: "One thoughtful thing at a time",
      subtitle: "Add a person to get your first nudge.",
      deepLink: "truekeep://people",
      nudgeId: nil
    )
  }
}

// MARK: - Views

struct NudgeWidgetEntryView: View {
  var entry: NudgeEntry
  @Environment(\.widgetFamily) var family

  var body: some View {
    Link(destination: URL(string: entry.payload.deepLink) ?? URL(string: "truekeep://")!) {
      VStack(alignment: .leading, spacing: 6) {
        Text(entry.payload.title)
          .font(.headline)
          .foregroundStyle(.primary)
          .lineLimit(family == .systemSmall ? 3 : 2)

        if family != .systemSmall {
          Text(entry.payload.subtitle)
            .font(.caption)
            .foregroundStyle(.secondary)
            .lineLimit(2)
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
      .padding()
    }
  }
}

// MARK: - Widget definition

struct NudgeWidget: Widget {
  let kind = "NudgeWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: NudgeProvider()) { entry in
      NudgeWidgetEntryView(entry: entry)
        .containerBackground(.background, for: .widget)
    }
    .configurationDisplayName("Truekeep")
    .description("Your next thoughtful action.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

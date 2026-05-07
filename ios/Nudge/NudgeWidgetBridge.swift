import Foundation
import WidgetKit

@objc(NudgeWidgetBridge)
class NudgeWidgetBridge: NSObject {
  private let appGroup = "group.com.truekeep.app"

  @objc(writePayload:)
  func writePayload(_ payload: NSDictionary) {
    guard let defaults = UserDefaults(suiteName: appGroup) else { return }
    guard
      let data = try? JSONSerialization.data(withJSONObject: payload, options: [])
    else { return }
    defaults.set(data, forKey: "widget_payload")
    defaults.synchronize()
  }

  @objc
  func reloadTimelines() {
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadAllTimelines()
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool { false }
}

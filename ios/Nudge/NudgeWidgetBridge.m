#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(NudgeWidgetBridge, NSObject)
RCT_EXTERN_METHOD(writePayload:(NSDictionary *)payload)
RCT_EXTERN_METHOD(reloadTimelines)
@end

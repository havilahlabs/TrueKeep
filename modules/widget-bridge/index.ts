import { NativeModules } from 'react-native';
import type { WidgetPayload } from '../../services/widgetAdapter';

const bridge: {
  writePayload?: (payload: WidgetPayload) => void;
  reloadTimelines?: () => void;
} = NativeModules.NudgeWidgetBridge ?? {};

export function writeWidgetPayload(payload: WidgetPayload): void {
  bridge.writePayload?.(payload);
}

export function reloadWidgetTimelines(): void {
  bridge.reloadTimelines?.();
}

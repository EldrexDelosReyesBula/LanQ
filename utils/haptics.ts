/**
 * Triggers a haptic feedback if available on the device.
 * Used for "Pro" feel on interactions.
 */
export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

export const triggerHaptic = (style: HapticStyle = 'light') => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    switch (style) {
      case 'selection':
        // Extremely short tick for UI selection (pickers, toggles)
        navigator.vibrate(5);
        break;
      case 'light':
        // Standard interaction
        navigator.vibrate(10);
        break;
      case 'medium':
        // Button presses
        navigator.vibrate(20);
        break;
      case 'heavy':
        // Major actions (long press)
        navigator.vibrate(40);
        break;
      case 'success':
        // Double tap feel
        navigator.vibrate([10, 30, 10]);
        break;
      case 'warning':
        // Stutter
        navigator.vibrate([30, 50, 10]);
        break;
      case 'error':
        // Triple buzz
        navigator.vibrate([50, 50, 50, 50, 50]);
        break;
    }
  }
};
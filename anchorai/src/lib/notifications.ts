// ============================================================
// AnchorAI — Caregiver Notification Service
// Handles multi-channel caregiver alerting:
//   1. Browser Notification API (desktop popup)
//   2. BroadcastChannel (cross-tab real-time)
//   3. localStorage (persistence)
// ============================================================

const BROADCAST_CHANNEL_NAME = 'anchorai_caregiver_alerts';

/**
 * Request permission for browser notifications.
 * Call this during onboarding or first visit.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

/**
 * Send a caregiver alert via all available channels.
 * This is the main function called during a crisis event.
 */
export function sendCaregiverNotification(
  caregiverName: string,
  userName: string,
  message: string
): void {
  // Channel 1: Browser desktop notification (visible even if tab is in background)
  sendBrowserNotification(caregiverName, userName, message);

  // Channel 2: BroadcastChannel for cross-tab real-time delivery
  broadcastAlert(caregiverName, userName, message);
}

/**
 * Channel 1: Browser Notification API
 * Shows a desktop popup notification — works even if the tab is in background
 */
function sendBrowserNotification(
  caregiverName: string,
  userName: string,
  message: string
): void {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  try {
    const notification = new Notification(`💜 AnchorAI Alert for ${caregiverName}`, {
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'anchorai-caregiver-alert',
      requireInteraction: true, // Keeps notification visible until dismissed
      silent: false,
    });

    // Click notification → open caregiver live dashboard
    notification.onclick = () => {
      window.focus();
      window.open('/caregiver/live', '_blank');
      notification.close();
    };
  } catch (err) {
    console.warn('[Notification] Failed to send:', err);
  }
}

/**
 * Channel 2: BroadcastChannel API
 * Sends alert to ALL open tabs on the same origin in real-time.
 * The caregiver dashboard page (/caregiver/live) listens for these.
 */
function broadcastAlert(
  caregiverName: string,
  userName: string,
  message: string
): void {
  if (typeof window === 'undefined') return;
  if (!('BroadcastChannel' in window)) return;

  try {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    channel.postMessage({
      type: 'CAREGIVER_ALERT',
      caregiverName,
      userName,
      message,
      timestamp: new Date().toISOString(),
    });
    channel.close();
  } catch (err) {
    console.warn('[BroadcastChannel] Failed:', err);
  }
}

/**
 * Listen for caregiver alerts on BroadcastChannel.
 * Used by the caregiver live dashboard to receive real-time alerts.
 */
export function listenForAlerts(
  callback: (alert: {
    type: string;
    caregiverName: string;
    userName: string;
    message: string;
    timestamp: string;
  }) => void
): () => void {
  if (typeof window === 'undefined') return () => {};
  if (!('BroadcastChannel' in window)) return () => {};

  const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  channel.onmessage = (event) => {
    if (event.data?.type === 'CAREGIVER_ALERT') {
      callback(event.data);
    }
  };

  // Return cleanup function
  return () => channel.close();
}

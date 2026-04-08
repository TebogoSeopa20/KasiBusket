// DevRIFT'S SPAZA SHOP SYSTEM - Notification Service

export type NotificationType = 'info' | 'success' | 'warning' | 'delivery';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: string;
}

export class NotificationService {
  private static notifications: Notification[] = [];
  private static listeners: ((notifications: Notification[]) => void)[] = [];

  static addNotification(type: NotificationType, title: string, message: string, icon?: string) {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      icon
    };

    this.notifications.unshift(notification);
    this.notifyListeners();

    // Show browser notification if permission granted
    this.showBrowserNotification(title, message, icon);

    // Play notification sound
    this.playNotificationSound(type);

    return notification.id;
  }

  private static showBrowserNotification(title: string, body: string, icon?: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || 'ðŸª',
        badge: 'ðŸª',
        tag: 'devrift-spaza',
        requireInteraction: true
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body, icon: icon || 'ðŸª' });
        }
      });
    }
  }

  private static playNotificationSound(type: NotificationType) {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = type === 'delivery' ? 800 : 600;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  static getNotifications(): Notification[] {
    return this.notifications;
  }

  static markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  static markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  static clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  static subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  static getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}

// Delivery-specific notifications
export class DeliveryNotifications {
  static notifyOrderConfirmed(orderId: string, estimatedTime: string) {
    NotificationService.addNotification(
      'success',
      'âœ… Order Confirmed',
      `Order #${orderId} confirmed. Estimated delivery: ${estimatedTime}`,
      'âœ…'
    );
  }

  static notifyDriverAssigned(driverName: string, vehicleType: string) {
    NotificationService.addNotification(
      'info',
      'ðŸšš Driver Assigned',
      `${driverName} is delivering your order using ${vehicleType}`,
      'ðŸšš'
    );
  }

  static notifyDriverEnRoute(driverName: string, distance: string) {
    NotificationService.addNotification(
      'delivery',
      'ðŸ“ Driver En Route',
      `${driverName} is ${distance} away from you`,
      'ðŸ“'
    );
  }

  static notifyDriverNearby(driverName: string) {
    NotificationService.addNotification(
      'warning',
      'âš ï¸ Driver Nearby',
      `${driverName} is approaching your location. Please prepare payment.`,
      'âš ï¸'
    );
  }

  static notifyDriverArrived(driverName: string) {
    NotificationService.addNotification(
      'delivery',
      'ðŸŽ‰ Driver Arrived!',
      `${driverName} has arrived at your location. Please collect your order.`,
      'ðŸŽ‰'
    );
  }

  static notifyDeliveryCompleted(orderId: string) {
    NotificationService.addNotification(
      'success',
      'âœ… Delivery Completed',
      `Order #${orderId} delivered successfully. Thank you for shopping!`,
      'âœ…'
    );
  }
}





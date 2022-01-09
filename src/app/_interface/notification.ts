export interface Notification {
  id: number;
  message: string;
  receivedDate: string;
  isRead: string;
  fromUserId: number;
  userId: number;
}

export interface NotificationList {
  items: Notification[];
  totalCount: number;
}
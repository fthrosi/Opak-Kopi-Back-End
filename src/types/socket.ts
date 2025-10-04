export interface NotificationData {
  id: number;
  type: string;
  title: string;
  message: string;
  data: Record<string, any>;
}
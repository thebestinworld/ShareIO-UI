export interface Reminder {
  id: number;
  message: string;
  time: string;
  pastDue: string;
}

export interface ReminderList {
  items: Reminder[];
  totalCount: number;
}
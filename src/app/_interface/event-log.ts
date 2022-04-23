export interface EventLog {
    id: number;
    timestamp: string;
    userName: string;
    event: string;
    eventMessage: string;
    dynamicContent: string;
}
  
export interface EventLogList {
    items: EventLog[];
    totalCount: number;
}
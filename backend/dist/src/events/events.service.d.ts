import { Observable } from 'rxjs';
export interface HrmsRealtimeEvent {
    type: 'ATTENDANCE_CHECKIN' | 'ATTENDANCE_CHECKOUT' | 'LEAVE_REQUEST' | 'LEAVE_PROCESSED' | 'OVERTIME_REQUEST' | 'OVERTIME_PROCESSED' | 'NOTIFICATION' | 'PAYROLL_UPDATED';
    payload: any;
    timestamp: string;
}
export declare class EventsService {
    private events$;
    emit(type: HrmsRealtimeEvent['type'], payload: any): void;
    getEventStream(): Observable<HrmsRealtimeEvent>;
}

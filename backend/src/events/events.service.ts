import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';

export interface HrmsRealtimeEvent {
  type:
    | 'ATTENDANCE_CHECKIN'
    | 'ATTENDANCE_CHECKOUT'
    | 'LEAVE_REQUEST'
    | 'LEAVE_PROCESSED'
    | 'OVERTIME_REQUEST'
    | 'OVERTIME_PROCESSED'
    | 'NOTIFICATION'
    | 'PAYROLL_UPDATED';
  payload: any;
  timestamp: string;
}

@Injectable()
export class EventsService {
  private events$ = new Subject<HrmsRealtimeEvent>();

  /**
   * Broadcast real-time event to all connected clients
   */
  emit(type: HrmsRealtimeEvent['type'], payload: any) {
    this.events$.next({
      type,
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Observable stream for SSE (Server-Sent Events)
   */
  getEventStream(): Observable<HrmsRealtimeEvent> {
    return this.events$.asObservable();
  }
}

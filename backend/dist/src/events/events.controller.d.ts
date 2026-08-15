import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    stream(): Observable<MessageEvent>;
}

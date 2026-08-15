import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { EventsService } from './events.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Real-time Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse('stream')
  @ApiOperation({ summary: 'Real-time Server-Sent Events stream' })
  stream(): Observable<MessageEvent> {
    return this.eventsService.getEventStream().pipe(
      map((event) => ({
        data: JSON.stringify(event),
      }) as MessageEvent),
    );
  }
}

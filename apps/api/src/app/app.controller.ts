import { Controller, Get, Param } from '@nestjs/common';
import { Attendee, AttendeeResponse } from 'src/models';


import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('attendees')
  public async getData(): Promise<Attendee[]> {
    return this.appService.getAttendeesList();
  }

  @Get('attendees/:id')
  public async getAttendeeById(@Param('id') id: string): Promise<AttendeeResponse> {
    return this.appService.getAttendee(id);
  }
}

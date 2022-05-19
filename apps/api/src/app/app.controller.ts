import { Controller, Get } from '@nestjs/common';
import { Attende } from 'src/models';


import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('attendees')
  public async getData(): Promise<Attende[]> {
    return this.appService.getAttendeesList();
  }
}

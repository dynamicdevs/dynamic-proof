import { Controller, Get } from '@nestjs/common';


import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('attendees')
  public async getData(): Promise<any> {
    return this.appService.getData();
  }
}

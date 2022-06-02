import { Controller, Get, Param } from '@nestjs/common';
import { Attendee, AttendeeResponse } from 'src/models';
import { CertificatesService } from './certificates.services';
@Controller('certificates')
export class CertificatesController {
  constructor(private certificateService: CertificatesService) {}

  @Get('attendees')
  public async getData(): Promise<Attendee[]> {
    return this.certificateService.getAttendeesList();
  }

  @Get('attendees/:id')
  public async getAttendeeById(
    @Param('id') id: string
  ): Promise<AttendeeResponse> {
    return this.certificateService.getAttendee(id);
  }
}

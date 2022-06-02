import { Controller, Get, Param } from '@nestjs/common';
import { AttendeeResponseDto } from 'src/dtos';
import { Attendee } from 'src/models';
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
  ): Promise<AttendeeResponseDto> {
    return this.certificateService.getAttendee(id);
  }
}

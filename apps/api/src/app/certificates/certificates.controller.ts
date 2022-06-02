import { Controller, Get, Param } from '@nestjs/common';
import { CertificateResponseDto } from 'src/dtos';
import { Certificate } from 'src/models';
import { CertificatesService } from './certificates.services';
@Controller('certificates')
export class CertificatesController {
  constructor(private certificateService: CertificatesService) {}

  @Get()
  public async getCertificatesList(): Promise<Certificate[]> {
    return this.certificateService.getCertificatesList();
  }

  @Get(':id')
  public async getCertificateById(
    @Param('id') id: string
  ): Promise<CertificateResponseDto> {
    return this.certificateService.getCertificateById(id);
  }
}

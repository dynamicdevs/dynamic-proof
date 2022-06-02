import { Inject } from '@nestjs/common';
import config from '@env';
import { ConfigType } from '@nestjs/config';
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';

export class SheetsLib {
  private serviceAccountEmail: string;
  private serviceAccountPrivateKey: string;
  private scopes: string[] = [];
  private spreadsheetId: string;
  private tokenGoogleApi: JWT;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>
  ) {
    this.serviceAccountEmail = this.configService.serviceAccountEmail;
    this.serviceAccountPrivateKey = decodeURI(
      this.configService.serviceAccountPrivateKey
    );
    this.spreadsheetId = this.configService.spreadsheetId;
    this.scopes = ['https://www.googleapis.com/auth/spreadsheets'];
    this.tokenGoogleApi = this.getToken();
  }

  public async getData() {
    const service = google.sheets({ version: 'v4', auth: this.tokenGoogleApi });

    const result = await service.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'A:Z',
    });
    return result.data;
  }

  public async setValues(
    range: string,
    majorDimension: string,
    values: string[]
  ) {
    const service = google.sheets({ version: 'v4', auth: this.tokenGoogleApi });
    const result = await service.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        majorDimension: majorDimension,
        values: [values],
      },
    });

    return result.data;
  }

  private getToken(): JWT {
    return new google.auth.JWT({
      email: this.serviceAccountEmail,
      key: this.serviceAccountPrivateKey,
      scopes: this.scopes,
    });
  }
}

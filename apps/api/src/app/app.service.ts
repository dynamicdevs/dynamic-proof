import { Inject, Injectable } from '@nestjs/common';
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import { ConfigType } from '@nestjs/config';
import config from '@env';

@Injectable()
export class AppService {

  private serviceAccountEmail: string;
  private serviceAccountPrivateKey: string;
  private scopes: string[] = [];
  private spreadsheetId: string;

  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    this.serviceAccountEmail = this.configService.serviceAccountEmail;
    this.serviceAccountPrivateKey = decodeURI(this.configService.serviceAccountPrivateKey);
    this.spreadsheetId = this.configService.spreadsheetId;
    this.scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  }

  public async getData(): Promise<any> {
    const tokenGoogleApi = this.getToken();
    console.log('tokenGoogleApi: ', tokenGoogleApi);

    let attendees: any[] = [];
    let response = await this.getValues(this.spreadsheetId, 'A:Z', tokenGoogleApi);
    console.log(response);

    let headers = response.values[0];

    for (let j = 1; j < response.values.length; j++) {
      let participant: any = {};
      let row = response.values[j];

      for(let i = 0; i < headers.length; i++) {
        participant[headers[i]] = row[i];
      }

      attendees.push(participant);
    }

    return attendees;
  }

  private async getValues(spreadsheetId: string, range: string, auth: JWT) {
    const service = google.sheets({version: 'v4', auth});
    // eslint-disable-next-line no-useless-catch
    try {
      const result = await service.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,

      });
      return result.data;
    } catch(err) {
      throw err;
    }
  }

  private getToken(): JWT {
    return  new google.auth.JWT({
      email: this.serviceAccountEmail,
      key: this.serviceAccountPrivateKey,
      scopes: this.scopes
    });
  }
}

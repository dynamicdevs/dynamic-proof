import { Injectable } from '@nestjs/common';
import { Message } from '@proof/api-interfaces';
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
@Injectable()
export class AppService {

  private SERVICE_ACCOUNT_EMAIL: string = "";
  private SERVICE_ACCOUNT_PRIVATE_KEY: string = "";
  private SCOPES: string[] = ["https://www.googleapis.com/auth/spreadsheets"];
  private SPREEDSHEET_ID = "";

  public async getData(): Promise<any> {
    const tokenGoogleApi = this.getToken();
    let attendees: any[] = [];
    let response = await this.getValues(this.SPREEDSHEET_ID, "A:Z", tokenGoogleApi);
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

  private async getValues(spreadsheetId, range, auth) {
    const service = google.sheets({version: 'v4', auth});
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
    const auth = new google.auth.JWT({
      email: this.SERVICE_ACCOUNT_EMAIL,
      key: this.SERVICE_ACCOUNT_PRIVATE_KEY,
      scopes: this.SCOPES
    });
    return auth;
  }
}

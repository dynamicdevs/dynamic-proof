import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JWT } from 'google-auth-library';
import { google } from 'googleapis';
import { ConfigType } from '@nestjs/config';
import config from '@env';
import { Attendee, AttendeeResponse } from 'src/models';
import { toCamelCaseFromText } from '@utils/text.utils';

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

  public async getAttendeesList(): Promise<Attendee[]> {
    const tokenGoogleApi = this.getToken();
    const response = await this.getValues(this.spreadsheetId, 'A:Z', tokenGoogleApi);
    if (!response.values[0]) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Empty headers in backend data format ',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return this.getAttendees(response.values);
  }

  public async getAttendee(attendeeId: string): Promise<AttendeeResponse> {
    const attendees = await this.getAttendeesList();
    const attendee = attendees.find(val => {
      return val.id === attendeeId;
    });
    if (!attendee) {
      throw new NotFoundException(`Attendee with id: ${attendeeId} not found`);
    }
    const { id, name, lastname, eventName, issueDate } = attendee;
    return {
      id,
      name,
      lastname,
      eventName,
      issueDate
    };
  }

  private async getValues(spreadsheetId: string, range: string, auth: JWT) {
    const service = google.sheets({version: 'v4', auth});
    const result = await service.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });
    return result.data;
  }

  private getAttendees(values: string[][]): Attendee[] {
    const attendees: Attendee[] = [];
    const keys = values[0].map(val => toCamelCaseFromText(val));

    for (let j = 1; j < values.length; j++) {
      const attendee: Partial<Attendee> = {};
      const row = values[j];

      for(let i = 0; i < keys.length; i++) {
        attendee[keys[i]] = row[i];
      }

      attendees.push(attendee as Attendee);
    }

    return attendees;
  }

  private getToken(): JWT {
    return  new google.auth.JWT({
      email: this.serviceAccountEmail,
      key: this.serviceAccountPrivateKey,
      scopes: this.scopes
    });
  }
}

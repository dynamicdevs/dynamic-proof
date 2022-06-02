import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Attendee } from 'src/models';
import { toCamelCaseFromText } from '@utils/text.utils';
import { SheetsLib } from '../lib/sheets.lib';
import { AttendeeResponseDto } from 'src/dtos';

@Injectable()
export class CertificatesService {
  constructor(private sheetsLib: SheetsLib) {}

  public async getAttendee(attendeeId: string): Promise<AttendeeResponseDto> {
    const attendees = await this.getAttendeesList();
    const attendee = attendees.find((val) => {
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
      issueDate,
    };
  }

  public async getAttendeesList(): Promise<Attendee[]> {
    const response = await this.sheetsLib.getData();
    if (!response.values[0]) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Empty headers in backend data format ',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return this.getAttendees(response.values);
  }

  private getAttendees(values: string[][]): Attendee[] {
    const attendees: Attendee[] = [];
    const keys = values[0].map((val) => toCamelCaseFromText(val));

    for (let j = 1; j < values.length; j++) {
      const attendee: Partial<Attendee> = {};
      const row = values[j];

      for (let i = 0; i < keys.length; i++) {
        attendee[keys[i]] = row[i];
      }

      attendees.push(attendee as Attendee);
    }

    return attendees;
  }
}

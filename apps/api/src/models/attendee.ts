export type Attendee = {
  id: string;
  name: string;
  lastname: string;
  eventName: string;
  eventCode: string;
  email: string;
  phoneNumber: string;
  country: string;
  issueDate: string;
  certificateUrl: string;
  observations: string;
}

export type AttendeeResponse = Pick<Attendee, 'id'
  | 'name' | 'lastname' | 'eventName' | 'issueDate'>;

import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

interface IEnvironment {
  serviceAccountEmail: string;
  serviceAccountPrivateKey: string;
  spreadsheetId: string;
};

export const environment: IEnvironment = {
  serviceAccountEmail: process.env.SERVICE_ACCOUNT_EMAIL,
  serviceAccountPrivateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
  spreadsheetId: process.env.SPREADSHEET_ID
};

export default registerAs('config', () => {
  return environment;
});

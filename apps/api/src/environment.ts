import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();

interface IEnvironment {
  serviceAccountEmail: string;
  serviceAccountPrivateKey: string;
  spreadsheetId: string;
  urlBase: string;
  websiteUrl: string;
  azureStorageConnection: string;
  containerName: string;
}

export const environment: IEnvironment = {
  serviceAccountEmail: process.env.SERVICE_ACCOUNT_EMAIL,
  serviceAccountPrivateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
  spreadsheetId: process.env.SPREADSHEET_ID,
  urlBase: process.env.STORAGE_URL_BASE,
  websiteUrl: process.env.WEBSITE_URL,
  azureStorageConnection: process.env.AZURE_STORAGE_CONNECTION,
  containerName: process.env.CONTAINER_NAME
};

export default registerAs('config', () => {
  return environment;
});

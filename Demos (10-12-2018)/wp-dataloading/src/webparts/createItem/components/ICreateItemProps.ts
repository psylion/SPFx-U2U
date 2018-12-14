import { SPHttpClient } from '@microsoft/sp-http';

export interface ICreateItemProps {
  listName: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}
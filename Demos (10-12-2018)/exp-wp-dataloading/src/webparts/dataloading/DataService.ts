import { IDataService, IDocument, IDocumentLibrary } from "./Interfaces";
import { SPHttpClient } from "@microsoft/sp-http";

export class DataService implements IDataService {
  private _spHttpClient: SPHttpClient;
  private _webAbsoluteUrl: string;

  constructor(webAbsoluteUrl: string, spHttpClient: SPHttpClient) {
    this._webAbsoluteUrl = webAbsoluteUrl;
    this._spHttpClient = spHttpClient;
  }

  public getDocumentLibraries(): Promise<IDocumentLibrary[]> {
    return this._spHttpClient.get(
      `${this._webAbsoluteUrl}/_api/web/lists?$filter=BaseTemplate eq 101&$select=Id,Title,RootFolder/ServerRelativeUrl&$expand=RootFolder`,
      SPHttpClient.configurations.v1)
      .then(response => response.json())
      .then(json => {
        return json.value.map(lib => {
          return {
            id: lib.Id,
            title: lib.Title,
            serverRelativeUrl: lib.RootFolder.ServerRelativeUrl
          }
        })
      });
  }

  public getDocuments(id: string): Promise<IDocument[]> {
    return this._spHttpClient.get(
      `${this._webAbsoluteUrl}/_api/web/lists('${id}')/RootFolder/Files?$select=Name,ServerRelativeUrl`,
      SPHttpClient.configurations.v1)
      .then(response => response.json())
      .then(json => {
        return json.value.map(file => {
          return {
            name: file.Name,
            serverRelativeUrl: file.ServerRelativeUrl
          }
        })
      })
  }


}
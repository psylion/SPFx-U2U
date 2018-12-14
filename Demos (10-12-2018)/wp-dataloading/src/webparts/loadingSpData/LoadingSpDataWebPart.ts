import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { SPHttpClient } from '@microsoft/sp-http';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './LoadingSpDataWebPart.module.scss';
import * as strings from 'LoadingSpDataWebPartStrings';

export interface ILoadingSpDataWebPartProps {
  title: string;
  query: string;
}

export interface ISearchItem {
  title?: string;
  path?: string;
  fileextension?: string;
}

export default class LoadingSpDataWebPart extends BaseClientSideWebPart<ILoadingSpDataWebPartProps> {
  private results: ISearchItem[] = [];
  private flds: string[] = ["title", "path", "fileextension"];
  private iconUrl: string = "https://spoprod-a.akamaihd.net/files/odsp-next-prod_ship-2017-04-07-sts_20170413.001/odsp-media/images/filetypes/16/";
  private unknown: string[] = ['aspx', 'null'];


  protected onInit<T>(): Promise<T> {
    this._getSearchResults().then(data => {
      this._processResults(data);
    });

    return Promise.resolve();
  }

  public render(): void {
    let itemsHtml = [`<li>No results found for '${this.properties.query}'</li>`];
    if (this.results.length) {
      itemsHtml = this.results.map(item => {
        return `
                  <li>
                      <a href="${item.path}" title="${item.title}">
                      <img src="${this.iconUrl}${!!item.fileextension && this.unknown.indexOf(item.fileextension) === -1 ? item.fileextension : 'code'}.png" alt="File extension"/> ${item.title}</a>
                  </li>`;
      });
    }

    this.domElement.innerHTML = `
          <div class="${styles.searchWp}">
              <h1>${this.properties.title}</h1>
              <ul>${itemsHtml.join('')}</ul>
          </div>
      `;
  }

  protected onPropertyPaneConfigurationComplete() {
    this._getSearchResults().then(data => {
      this._processResults(data);
    });
  }

  private _processResults(data): void {
    if (data !== null) {
      this.results = [];
      if (typeof data.PrimaryQueryResult !== 'undefined') {
        if (typeof data.PrimaryQueryResult.RelevantResults !== 'undefined') {
          if (typeof data.PrimaryQueryResult.RelevantResults.Table !== 'undefined') {
            if (typeof data.PrimaryQueryResult.RelevantResults.Table.Rows !== 'undefined') {
              const crntResults = data.PrimaryQueryResult.RelevantResults.Table.Rows;
              crntResults.forEach((result) => {
                // Create a temp value
                var val: ISearchItem = {};
                result.Cells.forEach((cell) => {
                  if (this.flds.indexOf(cell.Key.toLowerCase()) !== -1) {
                    // Add key and value to temp value
                    val[cell.Key.toLowerCase()] = cell.Value;
                  }
                });
                // Push this to the temp array
                this.results.push(val);
              });
            }
          }
        }
      }
    }
    this.render();
  }

  private _getSearchResults(): Promise<any> {
    // Check if the query field changed
    const searchUrl = `${this.context.pageContext.web.absoluteUrl}/_api/search/query?querytext='${this.properties.query}'&$select=${this.flds.join(',')}&clienttype='ContentSearchRegular'`;
    return this.context.spHttpClient.get(searchUrl, SPHttpClient.configurations.v1, { headers: { 'odata-version': '3.0' } }).then(response => { return response.json(); });
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('query', {
                  label: strings.QueryFieldLabel,
                  multiline: true
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

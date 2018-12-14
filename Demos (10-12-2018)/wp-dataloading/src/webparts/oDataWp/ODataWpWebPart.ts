import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ODataWpWebPart.module.scss';
import * as strings from 'ODataWpWebPartStrings';
import { HttpClient } from '@microsoft/sp-http';

export interface IODataWpWebPartProps {
  description: string;
}

export default class ODataWpWebPart extends BaseClientSideWebPart<IODataWpWebPartProps> {

  private items;

  protected onInit<T>(): Promise<T> {
    return new Promise((resolve, reject) => {
      this._getData().then(data => {
        this.items = data;
        resolve();
      });
    })
  }

  private _getData(): Promise<any> {
    // Check if the query field changed
    const serviceUrl = `https://services.odata.org/TripPinRESTierService/People`;
    
    return this.context.httpClient.get(serviceUrl, HttpClient.configurations.v1)
      .then(response => { return response.json(); });
  }

  public render(): void {
    const itemsMarkup = this.items.value.map(item => {
      return `<div>${item.LastName}, ${item.FirstName}</div>`;
    });

    this.domElement.innerHTML = `
      <div class="${styles.oDataWp}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">This is the information from the OData endpoint:</span>
              ${itemsMarkup.join('')}
            </div>
          </div>
        </div>
      </div>`;
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './DynamicDropDownOptionsWebPart.module.scss';
import * as strings from 'DynamicDropDownOptionsWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IDynamicDropDownOptionsWebPartProps {
  description: string;
  list: string;
}

export default class DynamicDropDownOptionsWebPart extends BaseClientSideWebPart<IDynamicDropDownOptionsWebPartProps> {
  private _listOptions : IPropertyPaneDropdownOption[] = [];

  protected onInit():Promise<void>{
    this.getDropDownOptionsAsync()
      .then((options : IPropertyPaneDropdownOption[]) => {
        this._listOptions = options;
      });

    return Promise.resolve();
  }
  
  protected getDropDownOptionsAsync(): Promise<IPropertyPaneDropdownOption[]> {
    return this.context.spHttpClient.get(
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .then((jsonData : any) =>{
          return jsonData.value.map((list: any) => { return { key: list.Id, text: list.Title }; });
        });
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.dynamicDropDownOptions }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description }">${escape(this.properties.description)}</p>
              <p class="${ styles.description }">${escape(this.properties.list)}</p>              
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
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
                }),
                PropertyPaneDropdown('list', {
                  label: "List",
                  options: this._listOptions
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './DataloadingWebPart.module.scss';
import * as strings from 'DataloadingWebPartStrings';
import { IDataService } from './Interfaces';
import { MockService } from './MockService';
import { DataService } from './DataService';

export interface IDataloadingWebPartProps {
  description: string;
  library: string;
}

export default class DataloadingWebPart extends BaseClientSideWebPart<IDataloadingWebPartProps> {
  private _listDropDownOptions: IPropertyPaneDropdownOption[];
  private _dataService: IDataService;

  protected onInit(): Promise<void> {
    switch (Environment.type) {
      case EnvironmentType.Local:
      case EnvironmentType.Test:
        this._dataService = new MockService();
        break;
      default:
        this._dataService = new DataService(this.context.pageContext.web.absoluteUrl, this.context.spHttpClient);
    }

    let promise =
      this._dataService
        .getDocumentLibraries()
        .then(libs => {
          this._listDropDownOptions = libs.map(lib => { return { key: lib.id, text: lib.title }; });
        });

    return promise;
  }

  public render(): void {
    if (this.properties.library) {
      this._dataService.getDocuments(this.properties.library)
        .then(documents => {
          this.domElement.innerHTML = `
          <div class="${ styles.dataloading}">
            <div class="${ styles.container}">
              <div class="${ styles.row}">
                <div class="${ styles.column}">
                  <ul>
                    ${documents.map(doc => `<li>${doc.name}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </div>
          </div>`;
        });
    }
    else {
      console.log(this.context.pageContext.legacyPageContext);

      this.domElement.innerHTML = `
      <div class="${ styles.dataloading}">
        <div class="${ styles.container}">
          <div class="${ styles.row}">
            <div class="${ styles.column}">
              <span class="${ styles.title}">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle}">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description}">${escape(this.properties.description)}</p>
              <p class="${ styles.description}">${escape(this.context.pageContext.user.displayName)}</p>
              <p class="${ styles.description}">${escape(this.context.pageContext.web.absoluteUrl)}</p>
              <a href="https://aka.ms/spfx" class="${ styles.button}">
                <span class="${ styles.label}">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
    }
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
                PropertyPaneDropdown('library',
                  {
                    label: 'Library',
                    options: this._listDropDownOptions
                  })
              ]
            }
          ]
        }
      ]
    };
  }
}

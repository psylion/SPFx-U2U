import {
  Version,
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './MockDataWebPart.module.scss';
import * as strings from 'MockDataWebPartStrings';

export interface IMockDataWebPartProps {
  title: string;
  query: string;
}

import { 
  ISearchItem, 
  ISearchService, 
  SearchService, 
  MockSearchService } from './SearchService';

export default class MockDataWebPart extends BaseClientSideWebPart<IMockDataWebPartProps> {
  private dataService: ISearchService = null;
  private results: ISearchItem[] = [];
  private loading: boolean = true;
  private flds: string[] = ["title", "path", "fileextension"];
  private iconUrl: string = "https://spoprod-a.akamaihd.net/files/odsp-next-prod_ship-2017-04-07-sts_20170413.001/odsp-media/images/filetypes/16/";
  private unknown: string[] = ['aspx', 'null'];

  protected onInit(): Promise<void> {
    // Set the dataservice
    if (Environment.type == EnvironmentType.SharePoint || Environment.type == EnvironmentType.ClassicSharePoint) {
      this.dataService = new SearchService(this.context, this.flds);
    }
    else {
      this.dataService = new MockSearchService();
    }

    // Load the data
    this.dataService.get(this.properties.query).then(data => {
      this.loading = false;
      this.results = data;
      this.render();
    });

    return Promise.resolve();
  }

  public render(): void {
    let itemsHtml = [''];

    // Check if web part is loading
    if (this.loading) {
      itemsHtml = ['<li>Loading results</li>'];
    } else {
      itemsHtml = [`<li>No results found for '${this.properties.query}'</li>`];
    }

    // Check if there are results to show
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
    this.dataService.get(this.properties.query).then(data => {
      this.loading = false;
      this.results = data;
      this.render();
    });
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === 'query') {
      this.loading = true;
    }
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
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

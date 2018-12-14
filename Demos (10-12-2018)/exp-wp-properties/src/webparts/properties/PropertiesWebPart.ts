import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PropertiesWebPart.module.scss';
import * as strings from 'PropertiesWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IPropertiesWebPartProps {
  description: string;
  nrOfItems: number;
  includeHidden: boolean;
  list: string;
}

export default class PropertiesWebPart extends BaseClientSideWebPart<IPropertiesWebPartProps> {
  private _listDropDownOptions: IPropertyPaneDropdownOption[];

  // constructor() {
  //   super();

  //   this._listDropDownOptions =
  //     [
  //       { key: '1', text: 'List 1' },
  //       { key: '2', text: 'List 2' },
  //       { key: '3', text: 'List 3' },
  //     ];

  //   this.properties.nrOfItems = 5;
  // }

  protected onInit(): Promise<void> {
    let promise = this.context.spHttpClient.get(
      `${this.context.pageContext.web.absoluteUrl}/_api/Web/lists?$select=Id,Title`,
      SPHttpClient.configurations.v1
    )
      .then((response: SPHttpClientResponse): Promise<{ value: { Id: string, Title: string }[] }> => response.json())
      .then(json => {
        this._listDropDownOptions = json.value.map(el => { return { key: el.Id, text: el.Title }; });
      });

      // this.context.propertyPane.refresh();

    return promise;
  }

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.properties}">
        <div class="${ styles.container}">
          <div class="${ styles.row}">
            <div class="${ styles.column}">
              <span class="${ styles.title}">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle}">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description}">${escape(this.properties.description)}</p>
              <p class="${ styles.description}">${this.properties.nrOfItems}</p>
              <p class="${ styles.description}">${this.properties.includeHidden}</p>
              <p class="${ styles.description}">${escape(this.properties.list)}</p>

              <a href="https://aka.ms/spfx" class="${ styles.button}">
                <span class="${ styles.label}">Learn more</span>
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
                })
              ]
            }
          ]
        },
        {
          header: {
            description: "U2U"
          },
          groups: [
            {
              groupName: "Other",
              groupFields: [
                PropertyPaneSlider('nrOfItems',
                  {
                    min: 0,
                    max: 25,
                    label: 'Nr of Items',
                    step: 5
                  }),
                PropertyPaneCheckbox('includeHidden',
                  {
                    text: 'Hidden'
                  }),
                PropertyPaneDropdown('list',
                  {
                    label: 'List',
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

import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './DynamicDataSourceWebPart.module.scss';
import * as strings from 'DynamicDataSourceWebPartStrings';
import { IDynamicDataCallables, IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';

export interface IDynamicDataSourceWebPartProps {
  list: string;
}

export default class DynamicDataSourceWebPart extends BaseClientSideWebPart<IDynamicDataSourceWebPartProps> implements IDynamicDataCallables {
  protected onInit(): Promise<void> {
    this.context.dynamicDataSourceManager.initializeSource(this);

    return Promise.resolve();
  }

  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [
      { id: 'list', title: 'List', description: 'The list' }
    ]
  }

  public getPropertyValue(propertyId: string): any {
    if (propertyId === 'list') {
      return this.properties.list;
    }
  }

  public onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath === "list") {
      this.context.dynamicDataSourceManager.notifyPropertyChanged('list');
    }
  }
  
  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.dynamicDataSource}">
        <div class="${ styles.container}">
          <div class="${ styles.row}">
            <div class="${ styles.column}">
              <span class="${ styles.title}">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle}">Customize SharePoint experiences using Web Parts.</p>
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
                PropertyPaneTextField('list', {
                  label: 'List'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

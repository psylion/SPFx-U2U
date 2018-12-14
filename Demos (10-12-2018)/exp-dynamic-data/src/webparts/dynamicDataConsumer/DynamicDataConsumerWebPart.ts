import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartPropertiesMetadata,
  PropertyPaneDynamicFieldSet,
  PropertyPaneDynamicField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './DynamicDataConsumerWebPart.module.scss';
import * as strings from 'DynamicDataConsumerWebPartStrings';
import { DynamicProperty } from '@microsoft/sp-component-base';

export interface IDynamicDataConsumerWebPartProps {
  list: DynamicProperty<string>;
}

export default class DynamicDataConsumerWebPart extends BaseClientSideWebPart<IDynamicDataConsumerWebPartProps> {

  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      'list': {
        dynamicPropertyType: 'string'
      }
    };
  }

  public render(): void {
    //get dynamic property values
    const list: string | undefined = this.properties.list.tryGetValue();

    this.domElement.innerHTML = `
      <div class="${ styles.dynamicDataConsumer}">
        <div class="${ styles.container}">
          <div class="${ styles.row}">
            <div class="${ styles.column}">
              <span class="${ styles.title}">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle}">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description}">${escape(list ? list : '')}</p>
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
                PropertyPaneDynamicFieldSet({
                  label: 'Select Name Source',
                  fields: [
                    PropertyPaneDynamicField('list', {
                      label: 'List source'
                    })
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

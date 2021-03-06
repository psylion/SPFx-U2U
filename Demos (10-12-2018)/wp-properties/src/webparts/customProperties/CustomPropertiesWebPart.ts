import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './CustomPropertiesWebPart.module.scss';
import * as strings from 'CustomPropertiesWebPartStrings';
import U2UTextField from './customField/customField';

export interface ICustomPropertiesWebPartProps {
  description: string;
  customField: string;
}

export default class CustomPropertiesWebPart extends BaseClientSideWebPart<ICustomPropertiesWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${styles.customProperties}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-lg10 ms-xl8 ms-xlPush2 ms-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
              <p class="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p class="ms-font-l ms-fontColor-white">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${styles.button}">
                <span class="${styles.label}">Learn more</span>
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
                U2UTextField('customField', {
                  key: 'U2UPassControl',
                  label: 'Custom field value',
                  description: 'Custom field description',
                  initialValue: this.properties.customField,
                  properties: this.properties,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this)
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

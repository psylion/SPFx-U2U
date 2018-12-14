import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './MdLoaderWebPart.module.scss';
import * as strings from 'MdLoaderWebPartStrings';

export interface IMdLoaderWebPartProps {
  description: string;
}

const markdownString: string = require<string>('./MyMDFile.md');

export default class MdLoaderWebPart extends BaseClientSideWebPart<IMdLoaderWebPartProps> {


  
  public render(): void {
    this.domElement.innerHTML = markdownString;
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

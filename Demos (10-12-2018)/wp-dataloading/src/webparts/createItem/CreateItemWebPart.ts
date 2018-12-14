import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'CreateItemWebPartStrings';
import CreateItem from './components/CreateItem';
import { ICreateItemProps } from './components/ICreateItemProps';

export interface ICreateItemWebPartProps {
  listname: string;
}

export default class CreateItemWebPart extends BaseClientSideWebPart<ICreateItemWebPartProps> {

  public render(): void {
    console.log('Locale:', this.context.pageContext.cultureInfo.currentCultureName);

    const element: React.ReactElement<ICreateItemProps> = React.createElement(
      CreateItem,
      {
        listName: this.properties.listname,
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
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
                PropertyPaneTextField('listname', {
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

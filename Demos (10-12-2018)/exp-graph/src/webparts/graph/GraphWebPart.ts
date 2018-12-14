import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'GraphWebPartStrings';
import Graph from './components/Graph';
import { IGraphProps } from './components/IGraphProps';
import { MSGraphClient } from '@microsoft/sp-http';

export interface IGraphWebPartProps {
  description: string;
}

export default class GraphWebPart extends BaseClientSideWebPart<IGraphWebPartProps> {

  protected _graphClient: MSGraphClient;

  protected onInit(): Promise<void> {
    let promise = new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      this.context.msGraphClientFactory
        .getClient()
        .then(client => {
          this._graphClient = client;
          resolve();
        })
        .catch(error => reject(error));
    });

    return promise;
  }

  public render(): void {
    const element: React.ReactElement<IGraphProps> = React.createElement(
      Graph,
      {
        description: this.properties.description,
        client: this._graphClient
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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

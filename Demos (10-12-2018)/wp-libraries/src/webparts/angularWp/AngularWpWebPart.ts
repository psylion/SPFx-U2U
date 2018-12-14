import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './AngularWpWebPart.module.scss';
import * as strings from 'AngularWpWebPartStrings';

export interface IAngularWpWebPartProps {
  description: string;
  hiddenLists: boolean;
}

// Loading the full framework
import * as angular from 'angular';
import ListController from "./controllers/ListController";

export default class AngularWpWebPart extends BaseClientSideWebPart<IAngularWpWebPartProps> {
  // Required for passing property params
  private $injector: angular.auto.IInjectorService;

  public render(): void {
    // Check if the web part has already rendered once
    if (this.renderedOnce === false) {
      this.domElement.innerHTML = `
                <div class="${styles.angularwp}">
                    <div class="${styles.container}" ng-controller="ListController as vm">
                        <div class="${styles.loading}" ng-show="vm.loading">
                            <div class="${styles.spinner}">
                                <div class="${styles.spinnerCircle} ${styles.spinnerLarge}"></div>
                                <div class="${styles.spinnerLabel}">Loading...</div>
                            </div>
                        </div>

                        <div ng-show="vm.loading === false">
                            <h1>All SharePoint lists of this site</h1>
                            <ul ng-repeat="list in vm.lists">
                                <li><a href={{list.path}} title={{list.title}}>{{list.title}}</a> (Hidden: {{list.hidden}})</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;

      const listApp: angular.IModule = angular.module('listApp', []);
      listApp.controller('ListController', ListController).value('context', this.context);

      this.$injector = angular.bootstrap(this.domElement, ['listApp']);
    }

    this.$injector.get('$rootScope').$broadcast('configurationChanged', {
      hiddenLists: this.properties.hiddenLists
    });
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
                PropertyPaneToggle('hiddenLists', {
                  label: 'Show hidden lists'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

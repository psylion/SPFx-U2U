import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './CascadingPropertiesWebPart.module.scss';
import * as strings from 'CascadingPropertiesWebPartStrings';
import { SPHttpClientResponse, SPHttpClient } from '@microsoft/sp-http';

export interface ICascadingPropertiesWebPartProps {
  description: string;
  listname: string;
  item: string;
}

export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
}

export default class CascadingPropertiesWebPart extends BaseClientSideWebPart<ICascadingPropertiesWebPartProps> {
  private _listOptions: IPropertyPaneDropdownOption[] = [];
  private _childOptions: IPropertyPaneDropdownOption[] = [];
  private _childDropdownDisabled: boolean = true;

  // Override onInit function
  protected onInit(): Promise<void> {
    // Check where the web part is running
    if (Environment.type === EnvironmentType.SharePoint || Environment.type === EnvironmentType.ClassicSharePoint) {
      this._GetListDataAsync()
        .then((response) => {
          this._listOptions = response.value.map((list: ISPList) => {
            // Map each of the lists to a dropdown option
            return {
              key: list.Id,
              text: list.Title
            };
          });
        });
    } else { // Test ot local
      this._listOptions = this.getDropDownOptions();
    }
    return Promise.resolve();
  }

  // Set options via a function
  private getDropDownOptions() {
    let options: IPropertyPaneDropdownOption[] = [];
    options.push({ key: '', text: '' });
    options.push({ key: 'List 1', text: 'List 1' });
    options.push({ key: 'List 2', text: 'List 2' });
    options.push({ key: 'List 3', text: 'List 3' });
    return options;
  }

  // Get all the lists from the current SharePoint site
  private _GetListDataAsync(): Promise<ISPLists> {
    return this.context.spHttpClient
      .get(
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists?$filter=Hidden eq false`,
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }

  private _GetItems(listName): Promise<IPropertyPaneDropdownOption[]> {
    return new Promise((resolve, reject) => {
      let options: IPropertyPaneDropdownOption[] = [];
      options.push({ key: ``, text: `` });
      options.push({ key: `${listName}-Item1`, text: `${listName} - Item 1` });
      options.push({ key: `${listName}-Item2`, text: `${listName} - Item 2` });
      options.push({ key: `${listName}-Item3`, text: `${listName} - Item 3` });
      resolve(options);
    });
  }

  // Check for changes in the listname property
  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    // always let the base class know
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    // Check if a new list was selected
    if (propertyPath === 'listname') {
      // get previously selected item
      const previousItem: string = this.properties.item;
      // Reset the property
      this.properties.item = null;
      // Push new item value
      super.onPropertyPaneFieldChanged('item', previousItem, this.properties.item);
      // Refresh property pane
      this.context.propertyPane.refresh();

      // Check if an option was selected
      if (newValue !== "") {
        this._GetItems(newValue).then(options => {
          this._childOptions = options;
          this._childDropdownDisabled = false;
          // Refresh property pane
          this.context.propertyPane.refresh();
        });
      } else {
        // Reset child dropdown
        this._childOptions = [];
        this._childDropdownDisabled = true;
        // Refresh property pane
        this.context.propertyPane.refresh();
      }
    }
  }

  public render(): void {
    let selectedListOption: IPropertyPaneDropdownOption = 
      this._listOptions.filter((el, idx, arr) => el.key === this.properties.listname)[0] || { key: '', text: '' };

    this.domElement.innerHTML = `
      <div class="${styles.cascadingProperties}">
        <div class="${styles.container}">
          <div class="ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}">
            <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
              <span class="ms-font-xl ms-fontColor-white">Cascading dropdown demo</span>
              <p class="ms-font-l ms-fontColor-white">Listname: ${escape(selectedListOption.key.toString())} (${escape(selectedListOption.text)})</p>
              <p class="ms-font-l ms-fontColor-white">Item: ${escape(this.properties.item)}</p>
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

  protected onPropertyPaneConfigurationStart(): void {
    if (this.properties.listname) {
      this._GetItems(this.properties.listname).then(options => {
        this._childOptions = options;
        this._childDropdownDisabled = !this.properties.listname;
        this.context.propertyPane.refresh();
      });
    }
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
            },
            {
              groupName: 'Cascading dropdown',
              groupFields: [
                PropertyPaneDropdown('listname', {
                  label: 'Listname',
                  options: this._listOptions
                }),
                PropertyPaneDropdown('item', {
                  label: 'Item',
                  options: this._childOptions,
                  disabled: this._childDropdownDisabled
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

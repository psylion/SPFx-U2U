import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './JQueryWpWebPart.module.scss';
import * as strings from 'JQueryWpWebPartStrings';

import * as $ from 'jquery';
require('cycle');

export interface IJQueryWpWebPartProps {
  description: string;
}

export default class JQueryWpWebPart extends BaseClientSideWebPart<IJQueryWpWebPartProps> {
  private _container;
  private _images = [
    "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/5M4EW814AO.jpg",
    "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/U3W2SHOLWQ.jpg",
    "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/FSPLFPQBCZ.jpg",
    "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/S059QDGBOG.jpg",
    "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/6U6EAPKKD7.jpg"
  ];

  public render(): void {
    if (this.renderedOnce === false) {
      const slides = this._images.map(img => {
        return `<img class="${styles.slide}" src="${img}" />`;
      });
      this.domElement.innerHTML = `
      <h1>jQuery slider</h1>
      <div class="${styles.sliderwp}">
          <div class="${styles.pager}"></div>
          ${slides.join('')}
      </div>`;
    }

    this._startCycle();
  }

  private _startCycle() {
    // On document ready
    $(() => {
      // Get the slide container
      this._container = $(`.${styles.sliderwp}`, this.domElement);
      // Start cycling the images
      this._container.cycle({
        pager: `.${styles.pager}`,
        slides: `.${styles.slide}`
      });
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

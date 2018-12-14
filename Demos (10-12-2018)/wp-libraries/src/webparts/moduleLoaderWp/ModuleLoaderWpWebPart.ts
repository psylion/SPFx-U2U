import { Version } from '@microsoft/sp-core-library';
import {
    BaseClientSideWebPart,
    IPropertyPaneConfiguration,
    PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ModuleLoaderWpWebPart.module.scss';
import * as strings from 'ModuleLoaderWpWebPartStrings';

import { SPComponentLoader } from '@microsoft/sp-loader';

export interface IModuleLoaderWpWebPartProps {
    description: string;
}

export default class ModuleLoaderWpWebPart extends BaseClientSideWebPart<IModuleLoaderWpWebPartProps> {

    private _container;
    private _images = [
        "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/5M4EW814AO.jpg",
        "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/U3W2SHOLWQ.jpg",
        "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/FSPLFPQBCZ.jpg",
        "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/S059QDGBOG.jpg",
        "https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/6U6EAPKKD7.jpg"
    ];

    private $local;


    public render(): void {
        if (this.renderedOnce === false) {
            const slides = this._images.map(img => {
                return `<img class="${styles.slide}" src="${img}" />`;
            });
            this.domElement.innerHTML = `
          <h1>jQuery slider (SPComponentLoader)</h1>
          <div class="${styles.sliderwp}">
              <div class="${styles.pager}"></div>
              ${slides.join('')}
          </div>`;

            // Load CSS file
            SPComponentLoader.loadCss("https://uazurestorage.blob.core.windows.net/uspfx/pager-style.css");

            // Load jQuery
            SPComponentLoader.loadScript('https://code.jquery.com/jquery-2.1.1.min.js', { globalExportsName: 'jQuery' }).then(($: any): void => {
                // Store jQuery in local variable
                this.$local = $;
                // Load cycle JS
                SPComponentLoader.loadScript('https://malsup.github.io/min/jquery.cycle2.min.js', { globalExportsName: 'jQuery' }).then((): void => {
                    // Start the slider
                    this._startCycle();
                });
            });
        } else {
            this._startCycle();
        }
    }

    private _startCycle() {
        // On document ready
        this.$local(() => {
            // Get the slide container
            this._container = this.$local(`.${styles.sliderwp}`, this.domElement);
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

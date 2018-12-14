import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'ColorPromptApplicationCustomizerStrings';

import * as $ from 'jquery';

const LOG_SOURCE: string = 'ColorPromptApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IColorPromptApplicationCustomizerProperties {
  // This is an example; replace with your own property
  defaultColor: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ColorPromptApplicationCustomizer
  extends BaseApplicationCustomizer<IColorPromptApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    let defColor: string = this.properties.defaultColor;
    if (!defColor) {
      defColor = 'red';
    }

    Dialog.prompt("What is your favorite color?", { defaultValue: defColor })
      .then(color => {
        $(document).ready(
          () => $(".ms-siteLogoAcronym").css("background-color", color)
        );
      });

    $(document).ready(
      () => $(".ms-siteLogo-actual").css("background-color", defColor)
    );

    return Promise.resolve();
  }
}

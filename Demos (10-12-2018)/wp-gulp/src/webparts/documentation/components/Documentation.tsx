import * as React from 'react';
import styles from './Documentation.module.scss';
import { IDocumentationProps } from './IDocumentationProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class Documentation extends React.Component<IDocumentationProps, {}> {
  public render(): React.ReactElement<IDocumentationProps> {
    return (
      <div className={styles.documentation}>
        <div className={styles.container}>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
            <div className="ms-Grid-col ms-lg10 ms-xl8 ms-xlPush2 ms-lgPush1">
              <span className="ms-font-xl ms-fontColor-white">Welcome to SharePoint!</span>
              <p className="ms-font-l ms-fontColor-white">Customize SharePoint experiences using Web Parts.</p>
              <p className="ms-font-l ms-fontColor-white">{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
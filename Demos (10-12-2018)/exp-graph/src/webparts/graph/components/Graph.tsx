import * as React from 'react';
import styles from './Graph.module.scss';
import { IGraphProps } from './IGraphProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export default class Graph extends React.Component<IGraphProps, {}> {
  public componentDidMount(){
    this.props.client.api('/me/messages')
      .get()
      .then((messages: {value: MicrosoftGraph.Message[]}) => {
        console.log(messages);
      });
  }

  public render(): React.ReactElement<IGraphProps> {
    return (
      <div className={ styles.graph }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

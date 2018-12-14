import * as React from 'react';
import styles from './Announcements.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

export interface IAnnouncementsProps {
  context: WebPartContext;
  description: string;
}

export interface IAnnouncementsState{
  announcements: IAnnouncement[];
}

export interface IAnnouncement {
  Id: number;
  Title?: string;
}

export default class Announcements extends React.Component<IAnnouncementsProps, IAnnouncementsState> {
  constructor(props: IAnnouncementsProps) {
    super(props);
    this.state = {
      announcements: []
    };
  }

  public componentDidMount():void{
    const url = `${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Announcements')/items?$select=Id,Title`;

    this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse): Promise<{ value: IAnnouncement[] }> => {
        return response.json();
    })
    .then((response: { value: IAnnouncement[] }): void => {
      this.setState({
          announcements: response.value
      });
    });
  }

  public render(): React.ReactElement<IAnnouncementsProps> {
    return (
      <div className={styles.announcements}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
              <p className={styles.description}>{escape(this.props.description)}</p>
              <ul>
                {this.state.announcements.map((a: IAnnouncement) => <li key={a.Id}>{a.Title}</li>)}
              </ul>
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

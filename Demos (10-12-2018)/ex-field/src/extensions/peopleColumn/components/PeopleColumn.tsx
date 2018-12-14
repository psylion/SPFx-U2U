import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import {
  Facepile,
  IFacepilePersona,
  OverflowButtonType
} from 'office-ui-fabric-react';

import styles from './PeopleColumn.module.scss';

export interface IPeopleColumnProps {
  peopleFieldValue: any;
}

const LOG_SOURCE: string = 'PeopleColumn';

export default class PeopleColumn extends React.Component<IPeopleColumnProps, {}> {

  private _persona:IFacepilePersona[] = [];

  constructor(props:IPeopleColumnProps){
    super(props);
    if(this.props.peopleFieldValue && this.props.peopleFieldValue.length > 0){
      this._persona = this.props.peopleFieldValue.map((val) => {
        return {
          personaName:val.title,
          imageUrl:val.picture
        };
      });
    }
    
  }

  @override
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: PeopleColumn mounted');
  }

  @override
  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: PeopleColumn unmounted');
  }

  @override
  public render(): React.ReactElement<{}> {
    console.log(this.props.peopleFieldValue);
    return (
      <div className={styles.cell}>
        <Facepile personas={this._persona} />
      </div>
    );
  }
}

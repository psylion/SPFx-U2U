import * as React from "react";
import { IEmployee } from "../interfaces";
import styles from './Employees.module.scss';
import {MarqueeSelection, DetailsList, SelectionMode, DetailsListLayoutMode, Selection} from 'office-ui-fabric-react';
//require('./styles.scss');
//import u2ustyles from './U2U.module.scss';

export interface IEmployeeListProps {
  employees: IEmployee[];
  onEmployeeSelected?: {(employee: IEmployee):void};
}

export default class EmployeeList extends React.Component<IEmployeeListProps, {}>{
  private _selection: Selection;

  constructor(props) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () => {
        const employee = this.getSelectedEmployee();
        this.onEmployeeSelected(employee);
      }
    });
  }

  private getSelectedEmployee(): IEmployee {
    const count = this._selection.getSelectedCount();
    let employee : IEmployee = null;

    if(count == 1){
      employee = this._selection.getSelection()[0] as IEmployee;
    }

    return employee;
  }

  private onEmployeeSelected(emp: IEmployee) : void{
   if(this.props.onEmployeeSelected){
     this.props.onEmployeeSelected(emp);
   }   
  }

  public render(): React.ReactElement<{}> {
    return (
      <MarqueeSelection selection={this._selection}>
          <DetailsList
            items={this.props.employees}
            compact={false}
            //columns={columns}
            selectionMode={SelectionMode.single}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            selection={this._selection}
          />
        </MarqueeSelection>
    );
  }
}
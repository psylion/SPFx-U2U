import * as React from "react";
import { IEmployee } from "../interfaces";
import styles from './Employees.module.scss';

export interface IEmployeeListProps {
  employees: IEmployee[];
  onEmployeeSelected?: {(employee: IEmployee):void};
}

export default class EmployeeList extends React.Component<IEmployeeListProps, {}>{
  constructor(props) {
    super(props);
  }

  private onEmployeeSelected(emp: IEmployee) : void{
   if(this.props.onEmployeeSelected){
     this.props.onEmployeeSelected(emp);
   }   
  }

  public render(): React.ReactElement<{}> {
    const ulStyle: React.CSSProperties = {
      listStyle: 'none'
    }

    return (
      <div className={styles.employeeList}>
        <ul style={ulStyle}>
          {this.props.employees.map(emp => {
            return (
              <li key={emp.EmployeeID}>
                <button onClick={() => this.onEmployeeSelected(emp)}>Click me</button>
                {emp.FirstName} {emp.LastName}</li>
              );
          })}
        </ul>
      </div>
    );
  }
}
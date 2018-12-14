import * as React from 'react';
import styles from './Employees.module.scss';
import EmployeeList from './EmployeeList';
import EmployeeDetails from './EmployeeDetails';
import { IEmployee } from '../interfaces';
import { HttpClient } from '@microsoft/sp-http';

export interface IEmployeesProps {
  httpClient: HttpClient;
}

export interface IEmployeesState {
  employees: IEmployee[];
  employee?: IEmployee;
}

export default class Employees extends React.Component<IEmployeesProps, IEmployeesState> {
  constructor(props) {
    super(props);

    this.state = {
      employees: []
    };
  }

  public componentDidMount(): void{
    // let employees: IEmployee[] = [
    //   { EmployeeID: 1, FirstName: 'Jan', LastName: 'Doe', Title: 'Manager'},
    //   { EmployeeID: 2, FirstName: 'Piet', LastName: 'Doe', Title: 'Manager' },
    //   { EmployeeID: 3, FirstName: 'Joris', LastName: 'Doe', Title: 'Manager' },
    //   { EmployeeID: 4, FirstName: 'Corneel', LastName: 'Doe', Title: 'Manager' },
    // ];

    // this.setState({employees});

    this.props.httpClient.get(
      `https://services.odata.org/V4/Northwind/Northwind.svc/Employees`,
      HttpClient.configurations.v1)
      .then(response => response.json())
      .then(json => {
        this.setState({employees: json.value});
      });
  }

  public render(): React.ReactElement<{}> {
    return (
      <div className={styles.employees}>
        <div className={styles.container}>
          <h1>Employees</h1>
          <EmployeeList employees={this.state.employees} onEmployeeSelected={emp => this.setState({employee: emp})} />
          <EmployeeDetails employee={this.state.employee} />
        </div>
      </div>
    );
  }
}

import * as React from 'react';
import { IEmployee } from '../interfaces/index';

export interface IEmployeeDetailsProps {
  employee?: IEmployee;
}

export default class EmployeeDetails extends React.Component<IEmployeeDetailsProps, {}>{
  public render(): React.ReactElement<IEmployeeDetailsProps> {
    return (
      <div>
        {
          (this.props.employee) ?
            (
              <div>
                <div>{this.props.employee.EmployeeID}</div>
                <div>{this.props.employee.FirstName}</div>
                <div>{this.props.employee.LastName}</div>
                <div>{this.props.employee.Title}</div>
                <div><img src={'data:image/bmp;base64,' + this.props.employee.Photo.substr(104)} /></div>
              </div>
            ) :
            (
              <div>No employee selected</div>
            )
        }
      </div>
    );
  }
}
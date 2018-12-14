import * as React from "react";
import * as ReactDom from 'react-dom';
import { TextField } from 'office-ui-fabric-react';
import { Label } from 'office-ui-fabric-react';

import {
    IPropertyPaneField,
    PropertyPaneFieldType
} from '@microsoft/sp-webpart-base';


/**************
 * Interfaces *
 **************/
// Public properties
export interface IU2UTextFieldProps {
    key:string;
    label?: string;
    description?: string;
    initialValue?: string;
    properties: any;

    /**
   * @function
   * Defines a onPropertyChange function to raise when the selected value changed.
   * Normally this function must be always defined with the 'this.onPropertyChange'
   * method of the web part object.
   */
    onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;
}

// Private properties
export interface IU2UTextFieldPropsInternal extends IU2UTextFieldProps {
    key: string;
    label: string;
    description: string;
    initialValue: string;
    properties: any;

    onPropertyChange(propertyPath: string, oldValue: any, newValue: any): void;

    targetProperty: string;
    onRender(elem: HTMLElement): void;
    onDispose(elem: HTMLElement): void;
}

// React component properties
export interface IU2UTextFieldHostProps extends IU2UTextFieldPropsInternal { }

// React component state
export interface IU2UTextFieldHostState {
    currentPassword: string;
}

/*****************************
 * U2UTextFieldBuilder class *
 *****************************/
class U2UTextFieldBuilder implements IPropertyPaneField<IU2UTextFieldPropsInternal> {
    // Properties defined by IPropertyPaneField
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    public targetProperty: string;
    public properties: IU2UTextFieldPropsInternal;

    // Custom properties
    private key: string = "mypass";
    private label: string;
    private description: string;
    private initialValue: string;
    private customProperties: any;
    private onPropertyChange: (propertyPath: string, oldValue: any, newValue: any) => void;

    public constructor(_targetProperty: string, _properties: IU2UTextFieldPropsInternal) {
        this.label = _properties.label;
        this.description = _properties.description;
        this.initialValue = _properties.initialValue;
        this.customProperties = _properties.properties;

        this.onPropertyChange = _properties.onPropertyChange;

        this.properties = _properties;
        this.properties.onRender = this.render;
        this.properties.onDispose = this.dispose;
    }

    /**
     * @function
     * Renders the picker field content
     */
    private render(elem: HTMLElement): void {
        const props: IU2UTextFieldHostProps = {
            key: this.key,
            label: typeof this.label === "undefined" ? null : this.label,
            description: typeof this.description === "undefined" ? null : this.description,
            initialValue: typeof this.initialValue === "undefined" ? null : this.initialValue,
            properties: this.properties,
            targetProperty: this.targetProperty,
            onRender: this.render,
            onDispose: this.dispose,
            onPropertyChange: this.onPropertyChange
        };

        // Construct the JSX properties
        const element: React.ReactElement<IU2UTextFieldProps> = React.createElement(U2UTextFieldHost, props);
        // Calls the REACT content generator
        ReactDom.render(element, elem);
    }

    /**
     * @function
     * Disposes the current object
     */
    private dispose(elem: HTMLElement): void { }
}

/*******************
 * React component *
 *******************/
export class U2UTextFieldHost extends React.Component<IU2UTextFieldHostProps, IU2UTextFieldHostState> {
    constructor(props: IU2UTextFieldHostProps) {
        super(props);

        this.state = {
            currentPassword: this.props.initialValue
        };

        this.onValueChanged = this.onValueChanged.bind(this);
        this.notifyAfterValidate = this.notifyAfterValidate.bind(this);
    }

    private onValueChanged(newValue: any): void {
        if (this.props.initialValue !== newValue) {
            this.setState({
                currentPassword: newValue
            });

            this.notifyAfterValidate(this.props.initialValue, newValue);
        }
    }

    private notifyAfterValidate(oldValue: string, newValue: string) {
        this.props.properties[this.props.targetProperty] = newValue;
        this.props.onPropertyChange(this.props.targetProperty, oldValue, newValue);
    }

    public render(): JSX.Element {
        return (
            <div style={{ marginBottom: '8px' }}>
                {
                    (() => {
                        if (this.props.label !== null) {
                            return <Label>{this.props.label}</Label>;
                        }
                    })()
                }
                <TextField key="mypass" type="password"
                    name="password"
                    value={this.state.currentPassword !== null ? this.state.currentPassword.toString() : ''}
                    onChanged={this.onValueChanged}
                    placeholder={this.props.description !== null ? this.props.description : ''} />
            </div>
        );
    }
}

/*************************
 * U2UTextField function *
 *************************/
export default function U2UTextField(targetProperty: string, properties: IU2UTextFieldProps): IPropertyPaneField<IU2UTextFieldPropsInternal> {
    var newProperties: IU2UTextFieldPropsInternal = {
        key: properties.key,
        label: properties.label,
        description: properties.description,
        initialValue: properties.initialValue,
        properties: properties.properties,
        targetProperty: targetProperty,
        onPropertyChange: properties.onPropertyChange,
        onDispose: null,
        onRender: null
    };

    // Calles the U2UTextFieldBuilder builder object
    // This object will simulate a PropertyFieldCustom to manage his rendering process
    return new U2UTextFieldBuilder(targetProperty, newProperties);
}
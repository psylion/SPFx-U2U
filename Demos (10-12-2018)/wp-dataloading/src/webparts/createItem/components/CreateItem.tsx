import * as React from 'react';
import styles from './CreateItem.module.scss';
import { ICreateItemProps } from './ICreateItemProps';
import { ICreateItemState } from './ICreateItemState';
import { IListItem } from './IListItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';

import * as strings from 'CreateItemWebPartStrings';

export default class ReactCrud extends React.Component<ICreateItemProps, ICreateItemState> {
    private listItemEntityTypeName: string = undefined;

    /**
     * Constructor
     * @param props 
     * @param state 
     */
    constructor(props: ICreateItemProps, state: ICreateItemState) {
        super(props);

        this.state = {
            status: this.listNotConfigured(this.props) ? 'Please configure list in Web Part properties' : 'Ready',
            items: []
        };
    }

    /**
     * Check if component received new properties
     * @param nextProps 
     */
    public componentWillReceiveProps(nextProps: ICreateItemProps): void {
        this.listItemEntityTypeName = undefined;
        this.setState({
            status: this.listNotConfigured(nextProps) ? 'Please configure list in Web Part properties' : 'Ready',
            items: []
        });
    }

    /**
     * HTML to get rendered by React
     */
    public render(): React.ReactElement<ICreateItemProps> {
        const items: JSX.Element[] = this.state.items.map((item: IListItem, i: number): JSX.Element => {
            return (
                <li>{item.Title} ({item.Id}) </li>
            );
        });

        const disabled: string = this.listNotConfigured(this.props) ? styles.disabled : '';

        return (
            <div className={styles.reactCrud}>
                <div className={styles.container}>
                    <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                        <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
                            <span className='ms-font-xl ms-fontColor-white'>
                                {strings.WebPartTitle}
                            </span>
                        </div>
                    </div>
                    <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                        <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
                            <a href="#" className={`${styles.button} ${disabled}`} onClick={() => this.createItem()}>
                                <span className={styles.label}>Create item</span>
                            </a>&nbsp;
              <a href="#" className={`${styles.button} ${disabled}`} onClick={() => this.readItem()}>
                                <span className={styles.label}>Read item</span>
                            </a>
                        </div>
                    </div>
                    <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                        <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
                            <a href="#" className={`${styles.button} ${disabled}`} onClick={() => this.readItems()}>
                                <span className={styles.label}>Read all items</span>
                            </a>
                        </div>
                    </div>
                    <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                        <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
                            <a href="#" className={`${styles.button} ${disabled}`} onClick={() => this.updateItem()}>
                                <span className={styles.label}>Update item</span>
                            </a>&nbsp;
              <a href="#" className={`${styles.button} ${disabled}`} onClick={() => this.deleteItem()}>
                                <span className={styles.label}>Delete item</span>
                            </a>
                        </div>
                    </div>
                    <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                        <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
                            {this.state.status}
                            <ul>
                                {items}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Create a new item in the list
     */
    private createItem(): void {
        this.setState({
            status: 'Creating item...',
            items: []
        });

        this.getListItemEntityTypeName()
            .then((listItemEntityTypeName: string): Promise<SPHttpClientResponse> => {
                const body: string = JSON.stringify({
                    '__metadata': {
                        'type': listItemEntityTypeName
                    },
                    'Title': `Item ${new Date()}`
                });
                return this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items`,
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            'Accept': 'application/json;odata=nometadata',
                            'Content-type': 'application/json;odata=verbose',
                            'odata-version': ''
                        },
                        body: body
                    });
            })
            .then((response: SPHttpClientResponse): Promise<IListItem> => {
                return response.json();
            })
            .then((item: IListItem): void => {
                this.setState({
                    status: `Item '${item.Title}' (ID: ${item.Id}) successfully created`,
                    items: []
                });
            }, (error: any): void => {
                this.setState({
                    status: 'Error while creating the item: ' + error,
                    items: []
                });
            });
    }

    /**
     * Read the latest created item from the list
     */
    private readItem(): void {
        this.setState({
            status: 'Loading latest items...',
            items: []
        });
        this.getLatestItemId()
            .then((itemId: number): Promise<SPHttpClientResponse> => {
                if (itemId === -1) {
                    throw new Error('No items found in the list');
                }

                this.setState({
                    status: `Loading information about item ID: ${itemId}...`,
                    items: []
                });
                return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${itemId})?$select=Title,Id`,
                    SPHttpClient.configurations.v1);
            })
            .then((response: SPHttpClientResponse): Promise<IListItem> => {
                return response.json();
            })
            .then((item: IListItem): void => {
                this.setState({
                    status: `Item ID: ${item.Id}, Title: ${item.Title}`,
                    items: []
                });
            }, (error: any): void => {
                this.setState({
                    status: 'Loading latest item failed with error: ' + error,
                    items: []
                });
            });
    }

    /**
     * Read all items from the list
     */
    private readItems(): void {
        this.setState({
            status: 'Loading all items...',
            items: []
        });

        this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$select=Title,Id`, SPHttpClient.configurations.v1)
            .then((response: SPHttpClientResponse): Promise<{ value: IListItem[] }> => {
                return response.json();
            })
            .then((response: { value: IListItem[] }): void => {
                this.setState({
                    status: `Successfully loaded ${response.value.length} items`,
                    items: response.value
                });
            }, (error: any): void => {
                this.setState({
                    status: 'Loading all items failed with error: ' + error,
                    items: []
                });
            });
    }

    /**
     * Get the lastest item ID created
     */
    private getLatestItemId(): Promise<number> {
        return new Promise<number>((resolve: (itemId: number) => void, reject: (error: any) => void): void => {
            this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$orderby=Id desc&$top=1&$select=id`, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse): Promise<{ value: { Id: number }[] }> => {
                    return response.json();
                }, (error: any): void => {
                    reject(error);
                })
                .then((response: { value: { Id: number }[] }): void => {
                    if (response.value.length === 0) {
                        resolve(-1);
                    } else {
                        resolve(response.value[0].Id);
                    }
                });
        });
    }

    /**
     * Update the latest item
     */
    private updateItem(): void {
        this.setState({
            status: 'Loading latest items...',
            items: []
        });

        let latestItemId: number = undefined;
        let etag: string = undefined;
        let listItemEntityTypeName: string = undefined;

        this.getListItemEntityTypeName()
            .then((listItemType: string): Promise<number> => {
                listItemEntityTypeName = listItemType;
                return this.getLatestItemId();
            })
            .then((itemId: number): Promise<SPHttpClientResponse> => {
                if (itemId === -1) {
                    throw new Error('No items found in the list');
                }

                latestItemId = itemId;
                this.setState({
                    status: `Loading information about item ID: ${latestItemId}...`,
                    items: []
                });
                return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${latestItemId})?$select=Id`, SPHttpClient.configurations.v1);
            })
            .then((response: SPHttpClientResponse): Promise<IListItem> => {
                etag = response.headers.get('ETag');
                return response.json();
            })
            .then((item: IListItem): Promise<SPHttpClientResponse> => {
                this.setState({
                    status: `Updating item with ID: ${latestItemId}...`,
                    items: []
                });

                const body: string = JSON.stringify({
                    '__metadata': {
                        'type': listItemEntityTypeName
                    },
                    'Title': `Item ${new Date()}`
                });

                return this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${item.Id})`,
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            'Accept': 'application/json;odata=nometadata',
                            'Content-type': 'application/json;odata=verbose',
                            'IF-MATCH': etag,
                            'X-HTTP-Method': 'MERGE',
                            'odata-version': ''
                        },
                        body: body
                    });
            })
            .then((response: SPHttpClientResponse): void => {
                this.setState({
                    status: `Item with ID: ${latestItemId} successfully updated`,
                    items: []
                });
            }, (error: any): void => {
                this.setState({
                    status: `Error updating item: ${error}`,
                    items: []
                });
            });
    }


    /**
     * Delete the latest item
     */
    private deleteItem(): void {
        if (!window.confirm('Are you sure you want to delete the latest item?')) {
            return;
        }

        this.setState({
            status: 'Loading latest items...',
            items: []
        });
        let latestItemId: number = undefined;
        let etag: string = undefined;
        this.getLatestItemId()
            .then((itemId: number): Promise<SPHttpClientResponse> => {
                if (itemId === -1) {
                    throw new Error('No items found in the list');
                }

                latestItemId = itemId;
                this.setState({
                    status: `Loading information about item ID: ${latestItemId}...`,
                    items: []
                });
                return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${latestItemId})?$select=Id`,
                    SPHttpClient.configurations.v1);
            })
            .then((response: SPHttpClientResponse): Promise<IListItem> => {
                etag = response.headers.get('ETag');
                return response.json();
            })
            .then((item: IListItem): Promise<SPHttpClientResponse> => {
                this.setState({
                    status: `Deleting item with ID: ${latestItemId}...`,
                    items: []
                });
                return this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${item.Id})`,
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            'Accept': 'application/json;odata=nometadata',
                            'Content-type': 'application/json;odata=verbose',
                            'IF-MATCH': etag,
                            'X-HTTP-Method': 'DELETE'
                        }
                    });
            })
            .then((response: SPHttpClientResponse): void => {
                this.setState({
                    status: `Item with ID: ${latestItemId} successfully deleted`,
                    items: []
                });
            }, (error: any): void => {
                this.setState({
                    status: `Error deleting item: ${error}`,
                    items: []
                });
            });
    }

    /**
     * Check if list is configured
     * @param props ICreateItemProps
     */
    private listNotConfigured(props: ICreateItemProps): boolean {
        return props.listName === undefined ||
            props.listName === null ||
            props.listName.length === 0;
    }

    /**
     * Get the list item entity name to create and update items
     */
    private getListItemEntityTypeName(): Promise<string> {
        return new Promise<string>((resolve: (listItemEntityTypeName: string) => void, reject: (error: any) => void): void => {
            if (this.listItemEntityTypeName) {
                resolve(this.listItemEntityTypeName);
                return;
            }

            this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')?$select=ListItemEntityTypeFullName`, SPHttpClient.configurations.v1)
                .then((response: SPHttpClientResponse): Promise<{ ListItemEntityTypeFullName: string }> => {
                    return response.json();
                }, (error: any): void => {
                    reject(error);
                })
                .then((response: { ListItemEntityTypeFullName: string }): void => {
                    this.listItemEntityTypeName = response.ListItemEntityTypeFullName;
                    resolve(this.listItemEntityTypeName);
                });
        });
    }
}
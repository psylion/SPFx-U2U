import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISearchItem {
  title?: string;
  path?: string;
  fileextension?: string;
}

export interface ISearchService {
  get(query: string): Promise<ISearchItem[]>;
}

export class SearchService implements ISearchService {
  constructor(public context : WebPartContext, public flds) { }

  public get(query: string): Promise<ISearchItem[]> {
    return this._getSearchResults(query).then(data => {
      return this._processResults(data);
    });
  }

  private _getSearchResults(query: string): Promise<any> {
    // Check if the query field changed
    const searchUrl = `${this.context.pageContext.web.absoluteUrl}/_api/search/query?querytext='${query}'&$select=${this.flds.join(',')}&clienttype='ContentSearchRegular'`;
    return this.context.spHttpClient.get(searchUrl, SPHttpClient.configurations.v1, {
      headers: {
        'odata-version': '3.0'
      }
    }).then(response => { return response.json(); });
  }

  private _processResults(data): ISearchItem[] {
    let results: ISearchItem[] = [];

    if (data !== null) {
      if (typeof data.PrimaryQueryResult !== 'undefined') {
        if (typeof data.PrimaryQueryResult.RelevantResults !== 'undefined') {
          if (typeof data.PrimaryQueryResult.RelevantResults.Table !== 'undefined') {
            if (typeof data.PrimaryQueryResult.RelevantResults.Table.Rows !== 'undefined') {
              const crntResults = data.PrimaryQueryResult.RelevantResults.Table.Rows;
              crntResults.forEach((result) => {
                // Create a temp value
                let val: ISearchItem = {};
                result.Cells.forEach((cell) => {
                  if (this.flds.indexOf(cell.Key.toLowerCase()) !== -1) {
                    // Add key and value to temp value
                    val[cell.Key.toLowerCase()] = cell.Value;
                  }
                });
                // Push this to the temp array
                results.push(val);
              });
            }
          }
        }
      }
    }

    return results;
  }
}

export class MockSearchService implements ISearchService {
  private results = [];

  constructor() { }

  public get(query: string): Promise<ISearchItem[]> {
    return Promise.resolve<ISearchItem[]>(
      [
        {
          title: "Sample item 1",
          path: "https://www.u2u.be",
          fileextension: "aspx"
        },
        {
          title: "Sample item 2",
          path: "https://www.u2u.be",
          fileextension: "docx"
        },
        {
          title: "Sample item 3",
          path: "https://www.u2u.be",
          fileextension: "xlsx"
        },
        {
          title: "Sample item 4",
          path: "https://www.u2u.be",
          fileextension: "pptx"
        },
        {
          title: "Sample item 5",
          path: "https://www.u2u.be",
          fileextension: null
        }
      ]);
  }
}
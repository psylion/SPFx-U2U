import { IDataService, IDocumentLibrary, IDocument } from "./Interfaces";

export class MockService implements IDataService{
  public getDocumentLibraries(): Promise<IDocumentLibrary[]> {
    const arr = [
      { id: "1", title: 'List 1', serverRelativeUrl: ''},
      { id: "2", title: 'List 2', serverRelativeUrl: ''},
      { id: "3", title: 'List 3', serverRelativeUrl: ''},
    ];

    return Promise.resolve(arr);
  }

  public getDocuments(id: string) : Promise<IDocument[]>{
    const arr = [
      { name: "file 1", serverRelativeUrl: ''},
      { name: "file 2", serverRelativeUrl: ''},
      { name: "file 3", serverRelativeUrl: ''},
    ];

    return Promise.resolve(arr);
  }
}
export interface IDocumentLibrary{
  id: string;
  title: string;
  serverRelativeUrl: string;
}

export interface IDocument{
  name: string;
  serverRelativeUrl: string;
}

export interface IDataService{
  getDocumentLibraries() :  Promise<IDocumentLibrary[]>;
  getDocuments(id: string) : Promise<IDocument[]>;
}
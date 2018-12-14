declare interface ICreateItemStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  WebPartTitle: string;
}

declare module 'CreateItemWebPartStrings' {
  const strings: ICreateItemStrings;
  export = strings;
}

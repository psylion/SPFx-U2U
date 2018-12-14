declare interface IMockDataWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleFieldLabel: string;
  QueryFieldLabel: string;
}

declare module 'MockDataWebPartStrings' {
  const strings: IMockDataWebPartStrings;
  export = strings;
}

declare interface IU2UButtonsCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'U2UButtonsCommandSetStrings' {
  const strings: IU2UButtonsCommandSetStrings;
  export = strings;
}

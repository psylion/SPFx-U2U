import { MSGraphClient } from "@microsoft/sp-http";

export interface IGraphProps {
  description: string;
  client: MSGraphClient;
}

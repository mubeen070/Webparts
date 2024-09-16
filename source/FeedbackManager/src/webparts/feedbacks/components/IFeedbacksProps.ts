import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IFeedbacksProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: WebPartContext;
  listName: string; // Add this property
}

import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import {
  PropertyFieldDateTimePicker,
  DateConvention,
  TimeConvention,
} from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";

import * as strings from "FeedbackManagerWebPartStrings";
import FeedbackManager from "./components/FeedbackManager";
import { IFeedbackManagerProps } from "./components/IFeedbackManagerProps";
import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";

export interface IFeedbackManagerWebPartProps {
  notificationMessage: string;
  welcome: string;
  toggle: boolean;
  dropdown: string;
  startDate: IDateTimeFieldValue;
  endDate: IDateTimeFieldValue;
  backgroundImage: string;
}

export default class FeedbackManagerWebPart extends BaseClientSideWebPart<IFeedbackManagerWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<IFeedbackManagerProps> =
      React.createElement(FeedbackManager, {
        notificationMessage: this.properties.notificationMessage,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        toggle: this.properties.toggle ?? false,
        dropdown: this.properties.dropdown ?? "",
        startDate: this.properties.startDate?.value,
        endDate: this.properties.endDate?.value,
        welcome: this.properties.welcome,
        backgroundImage: this.properties.backgroundImage,
      });

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then((message) => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office":
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook":
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams":
            case "TeamsModern":
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentTeams
                : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(
      this.context.isServedFromLocalhost
        ? strings.AppLocalEnvironmentSharePoint
        : strings.AppSharePointEnvironment
    );
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        "--bodyText",
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty("--link", semanticColors.link || null);
      this.domElement.style.setProperty(
        "--linkHovered",
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField("notificationMessage", {
                  label: "Notification Message",
                  multiline: true,
                  disabled: false,
                }),
                PropertyPaneTextField("welcome", {
                  label: "Welcome Message",
                  multiline: true,
                }),
                PropertyPaneToggle("toggle", {
                  label: "Notification Toggle",
                  onText: "On",
                  offText: "Off",
                }),
                PropertyPaneDropdown("dropdown", {
                  label: "Notification Type",
                  options: [
                    { key: "Red", text: "Alert" },
                    { key: "Orange", text: "Warning" },
                    { key: "Green", text: "Okay" },
                  ],
                  selectedKey: "Green",
                }),
                PropertyFieldDateTimePicker("startDate", {
                  label: "Start Date",
                  initialDate: this.properties.startDate,
                  dateConvention: DateConvention.DateTime,
                  timeConvention: TimeConvention.Hours12,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: "startDateFieldId",
                }),
                PropertyFieldDateTimePicker("endDate", {
                  label: "End Date",
                  initialDate: this.properties.endDate,
                  dateConvention: DateConvention.DateTime,
                  timeConvention: TimeConvention.Hours12,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  key: "endDateFieldId",
                }),
                PropertyPaneTextField("backgroundImage", {
                  label: "Background Image Url",
                  value:
                    "https://www.pixelstalk.net/wp-content/uploads/2016/06/Light-blue-wallpaper-hd-quality.jpg",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

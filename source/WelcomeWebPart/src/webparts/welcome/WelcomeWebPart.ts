import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import {
  DateConvention,
  PropertyFieldDateTimePicker,
  IDateTimeFieldValue,
  TimeConvention,
} from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";
import * as strings from "WelcomeWebPartStrings";
import Welcome from "./components/Welcome";
import { IWelcomeProps } from "./components/IWelcomeProps";

export interface IWelcomeWebPartProps {
  notificationMessage: string;
  welcome: string;
  dropdown: string;
  startDate: IDateTimeFieldValue;
  endDate: IDateTimeFieldValue;
  backgroundImage: string;
  unanet: string;
  adp: string;
  helpdesk: string;
  hr: string;
  benefits: string;
  training: string;
}

export default class WelcomeWebPart extends BaseClientSideWebPart<IWelcomeWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<IWelcomeProps> = React.createElement(
      Welcome,
      {
        notificationMessage: this.properties.notificationMessage,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        dropdown: this.properties.dropdown,
        startDate: this.properties.startDate?.value,
        endDate: this.properties.endDate?.value,
        welcome: this.properties.welcome,
        backgroundImage: this.properties.backgroundImage,
        unanet: this.properties.unanet,
        adp: this.properties.adp,
        techSupport: this.properties.helpdesk,
        employDirectory: this.properties.hr,
        benefits: this.properties.benefits,
        training: this.properties.training,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return this._getEnvironmentMessage().then((message) => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) {
      // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app
        .getContext()
        .then((context) => {
          let environmentMessage: string = "";
          switch (context.app.host.name) {
            case "Office": // running in Office
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOffice
                : strings.AppOfficeEnvironment;
              break;
            case "Outlook": // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost
                ? strings.AppLocalEnvironmentOutlook
                : strings.AppOutlookEnvironment;
              break;
            case "Teams": // running in Teams
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

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: IDateTimeFieldValue,
    newValue: IDateTimeFieldValue
  ): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    if (propertyPath === "startDate" || propertyPath === "endDate") {
      this.properties[propertyPath] = newValue;
      this.render(); // Re-render the web part after updating the dates
    }
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
                  resizable: false,
                  disabled: false,
                }),
                PropertyPaneTextField("welcome", {
                  label: "Welcome Message",
                  multiline: true,
                  resizable: false,
                }),
                PropertyPaneDropdown("dropdown", {
                  label: "Select notification type",
                  selectedKey: "#5286ff",
                  options: [
                    { key: "Red", text: "Alert" },
                    { key: "Orange", text: "Warning" },
                    { key: "#5286ff", text: "Information" },
                  ],
                }),
                PropertyFieldDateTimePicker("startDate", {
                  label: "Start Date",
                  initialDate: this.properties.startDate || new Date(),
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  dateConvention: DateConvention.DateTime,
                  timeConvention: TimeConvention.Hours12,
                  key: "startDatePicker",
                }),
                PropertyFieldDateTimePicker("endDate", {
                  label: "End Date",
                  initialDate: this.properties.endDate || new Date(),
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  dateConvention: DateConvention.DateTime,
                  timeConvention: TimeConvention.Hours12,
                  key: "endDatePicker",
                }),
                PropertyPaneTextField("backgroundImage", {
                  label: "Background Image Url",
                }),
                PropertyPaneTextField("unanet", {
                  label: "Unanet",
                  disabled: false,
                }),
                PropertyPaneTextField("adp", {
                  label: "Adp",
                  disabled: false,
                }),
                PropertyPaneTextField("techSupport", {
                  label: "Tech Support",
                  disabled: false,
                }),
                PropertyPaneTextField("employDirectory", {
                  label: "Employ Directory",
                  disabled: false,
                }),
                PropertyPaneTextField("benefits", {
                  label: "Benefits",
                  disabled: false,
                }),
                PropertyPaneTextField("training", {
                  label: "Training",
                  disabled: false,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}

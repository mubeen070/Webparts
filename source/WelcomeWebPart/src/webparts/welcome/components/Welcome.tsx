import * as React from "react";
import styles from "./Welcome.module.scss";
import type { IWelcomeProps } from "./IWelcomeProps";
import { escape } from "@microsoft/sp-lodash-subset";

interface IWelcomeManagerState {
  shouldDisplayDiv: boolean;
}

export default class FeedbackManager extends React.Component<
  IWelcomeProps,
  IWelcomeManagerState
> {
  private intervalId: number | undefined;

  constructor(props: IWelcomeProps) {
    super(props);

    // Initialize state
    this.state = {
      shouldDisplayDiv: false,
    };
  }

  componentDidMount(): void {
    // Set up interval to check date and time conditions periodically
    this.intervalId = window.setInterval(() => {
      this.checkDisplayConditions();
    }, 1000);
  }

  componentWillUnmount(): void {
    // Clear the interval to prevent memory leaks
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  // Method to check if the current date and time is between the start date and end date
  private isCurrentDateTimeBetweenDates(): boolean {
    const { startDate, endDate } = this.props;
    const currentDateTime = new Date(); // Current date and time

    if (startDate && endDate) {
      return currentDateTime >= startDate && currentDateTime <= endDate;
    }

    return false;
  }

  // Method to check if start date is before or equal to end date
  private isStartDateBeforeEndDate(): boolean {
    const { startDate, endDate } = this.props;

    if (startDate && endDate) {
      return startDate <= endDate;
    }

    return true; // If one of the dates is undefined, assume the condition is true
  }

  // Method to check all conditions and update the visibility of the div
  private checkDisplayConditions(): void {
    const { toggle } = this.props;

    const shouldDisplayDiv =
      toggle &&
      this.isCurrentDateTimeBetweenDates() &&
      this.isStartDateBeforeEndDate();

    this.setState({ shouldDisplayDiv });
  }

  public render(): React.ReactElement<IWelcomeProps> {
    const {
      notificationMessage,
      userDisplayName,
      dropdown,
      welcome,
      backgroundImage,
    } = this.props;

    // Ensure dropdown is defined and has a valid value
    const safeDropdown = dropdown || "No selection";

    // Determine the background color based on dropdown value
    const backgroundColor = safeDropdown.toLowerCase();

    const divStyle = {
      backgroundImage: "url(" + escape(backgroundImage) + ")",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: "100%",
      height: "100%",
    };

    return (
      <section>
        {this.state.shouldDisplayDiv && (
          <div
            className={styles.notificationWarring}
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: backgroundColor,
              color: "white",
            }}
          >
            <span>Notification :</span> <br />
            {escape(notificationMessage)}
          </div>
        )}

        <div className={styles.welcome} style={divStyle}>
          <div className={styles.mainWelcomeTitle}>
            Welcome,{" "}
            <div className={styles.mainEmployeeTitle}>
              {escape(userDisplayName)}!
            </div>
          </div>

          <div className={styles.welcomeMessage}>{escape(welcome)}</div>

          <div>
            <ul className={styles.mainImportantlogoes}>
              <li>
                <div>
                  <img alt="" src={require("../assets/unanet.png")} />
                </div>
                <div>
                  <a href="https://intact-tech.unanet.biz/subcontractor">
                    Unanet
                  </a>
                </div>
              </li>
              <li>
                <div>
                  <img alt="" src={require("../assets/adp.png")} />
                </div>
                <div>
                  <a href="https://online.adp.com/signin/v1/?APPID=WFNPortal&productId=80e309c3-7085-bae1-e053-3505430b5495">
                    ADP
                  </a>
                </div>
              </li>
              <li>
                <div>
                  <img alt="" src={require("../assets/helpdesk.png")} />
                </div>
                <div>
                  <a href="">Helpdesk</a>
                </div>
              </li>
              <li>
                <div>
                  <img alt="" src={require("../assets/hr.png")} />
                </div>
                <div>
                  <a href="">HR</a>
                </div>
              </li>
              <li>
                <div>
                  <img alt="" src={require("../assets/benifits.png")} />
                </div>
                <div>
                  <a href="https://intacttech.sharepoint.com/sites/PeopleOperations/SitePages/Standard-Benefits-Offered.aspx">
                    Benifits
                  </a>
                </div>
              </li>
              <li>
                <div>
                  <img alt="" src={require("../assets/training.png")} />
                </div>
                <div>
                  <a href="">Training</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

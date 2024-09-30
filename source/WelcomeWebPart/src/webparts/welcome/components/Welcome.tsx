/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import styles from "./Welcome.module.scss";
import type { IWelcomeProps } from "./IWelcomeProps";
import { escape } from "@microsoft/sp-lodash-subset";

interface IFeedbackManagerState {
  shouldDisplayDiv: boolean;
}

export default class FeedbackManager extends React.Component<
  IWelcomeProps,
  IFeedbackManagerState
> {
  private intervalId: number | undefined;

  constructor(props: IWelcomeProps) {
    super(props);
    this.state = {
      shouldDisplayDiv: false,
    };
  }

  componentDidMount(): void {
    const { startDate, endDate } = this.props;

    // Ensure startDate and endDate are Date objects

    const parsedStartDate =
      typeof startDate === "string" ? new Date(startDate) : startDate;
    const parsedEndDate =
      typeof endDate === "string" ? new Date(endDate) : endDate;

    console.log(parsedStartDate);
    console.log(parsedEndDate);

    this.setState({
      shouldDisplayDiv: this.isCurrentDateTimeBetweenDates(),
    });

    this.intervalId = window.setInterval(() => {
      this.checkDisplayConditions();
    }, 1000);
  }

  // UNSAFE_componentWillUpdate(): void {
  //   this.checkDisplayConditions();
  // }

  componentWillUnmount(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  private isCurrentDateTimeBetweenDates(): boolean {
    const { startDate, endDate } = this.props;
    const currentDateTime = new Date();

    if (startDate && endDate) {
      const parsedStartDate =
        typeof startDate === "string" ? new Date(startDate) : startDate;
      const parsedEndDate =
        typeof endDate === "string" ? new Date(endDate) : endDate;

      return (
        currentDateTime >= parsedStartDate && currentDateTime <= parsedEndDate
      );
    }

    return false;
  }

  private checkDisplayConditions(): void {
    const shouldDisplayDiv = this.isCurrentDateTimeBetweenDates();

    // Only update the state if the value has changed
    if (this.state.shouldDisplayDiv !== shouldDisplayDiv) {
      this.setState({ shouldDisplayDiv });
    }
  }

  public render(): React.ReactElement<IWelcomeProps> {
    const {
      notificationMessage,
      userDisplayName,
      dropdown,
      welcome,
      backgroundImage,
      unanet,
      adp,
      employDirectory,
      techSupport,
      training,
      benefits,
    } = this.props;

    const safeDropdown = dropdown || "No selection";
    const backgroundColor = safeDropdown.toLowerCase();
    const divStyle = {
      backgroundImage: "url(" + escape(backgroundImage) + ")",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: "100%",
      height: "100%",
    };

    // Extract first name from userDisplayName
    const firstName = userDisplayName ? userDisplayName.split(" ")[0] : "";

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
            <span>Notification : </span>
            {escape(notificationMessage)}
          </div>
        )}
        <div className={styles.welcome} style={divStyle}>
          <div className={styles.mainWelcomeTitle}>
            Welcome,{" "}
            <div className={styles.mainEmployeeTitle}>{escape(firstName)}!</div>
          </div>

          <div className={styles.welcomeMessage}>{escape(welcome)}</div>

          <div>
            <ul className={styles.mainImportantlogoes}>
              <li>
                <div>
                  <img alt="" src={require("../assets/unanet.png")} />
                </div>
                <div>
                  <a href={escape(unanet)}>Unanet</a>
                </div>
              </li>
              <li>
                <div>
                  <img alt="" src={require("../assets/adp.png")} />
                </div>
                <div>
                  <a href={escape(adp)}>ADP</a>
                </div>
              </li>
              <li>
                <div>
                  <img alt="" src={require("../assets/helpdesk.png")} />
                </div>
                <div>
                  <a href={escape(techSupport)}>Tech Support</a>
                </div>
              </li>
              <li>
                <div>
                  <img alt="" src={require("../assets/hr.png")} />
                </div>
                <div>
                  <a href={escape(employDirectory)}>Employ Directory</a>
                </div>
              </li>
              <li>
                <div>
                  <img alt="" src={require("../assets/benifits.png")} />
                </div>
                <div>
                  <a href={escape(benefits)}>Benefits</a>
                </div>
              </li>
              <li>
                <div>
                  <img alt="" src={require("../assets/training.png")} />
                </div>
                <div>
                  <a href={escape(training)}>Training</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    );
  }
}

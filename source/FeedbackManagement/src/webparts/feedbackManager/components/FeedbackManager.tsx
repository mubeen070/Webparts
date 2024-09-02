import * as React from "react";
import styles from "./FeedbackManager.module.scss";
import type { IFeedbackManagerProps } from "./IFeedbackManagerProps";
import { escape } from "@microsoft/sp-lodash-subset";
import {
  DateTimePicker,
  DateConvention,
  TimeConvention,
} from "@pnp/spfx-controls-react/lib/DateTimePicker";

interface IFeedbackManagerState {
  startDate: Date | undefined;
  endDate: Date | undefined;
  shouldDisplayDiv: boolean;
  currentTime: Date;
}

export default class FeedbackManager extends React.Component<
  IFeedbackManagerProps,
  IFeedbackManagerState
> {
  private intervalId: number | undefined; 

  constructor(props: IFeedbackManagerProps) {
    super(props);

    // Initialize state with default dates and current time
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      shouldDisplayDiv: false,
      currentTime: new Date(), // Set initial current time
    };

    // Bind event handlers
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  componentDidMount(): void {
    // Set up intervals for checking date and time conditions and updating the clock
    this.intervalId = window.setInterval(() => {
      this.checkDisplayConditions();
      this.updateClock();
    }, 1000);
  }

  componentWillUnmount(): void {
    // Clear the interval to prevent memory leaks
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  
  private updateClock(): void {
    this.setState({ currentTime: new Date() });
  }

  // Handler for start date change
  private handleStartDateChange(date: Date | undefined): void {
    this.setState(
      { startDate: date || undefined },
      this.checkDisplayConditions
    );
  }

  // Handler for end date change
  private handleEndDateChange(date: Date | undefined): void {
    this.setState({ endDate: date || undefined }, this.checkDisplayConditions);
  }

  // Method to check if the current date and time is between the start date and end date
  private isCurrentDateTimeBetweenDates(): boolean {
    const { startDate, endDate } = this.state;
    const currentDateTime = new Date(); // Current date and time

    if (startDate && endDate) {
      return currentDateTime >= startDate && currentDateTime <= endDate;
    }

    return false;
  }

  // Method to check if start date is before or equal to end date
  private isStartDateBeforeEndDate(): boolean {
    const { startDate, endDate } = this.state;

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

  public render(): React.ReactElement<IFeedbackManagerProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      toggle,
      dropdown,
    } = this.props;

    // Ensure dropdown is defined and has a valid value
    const safeDropdown = dropdown || "No selection";

    // Convert date to a readable format
    const formattedStartDate = this.state.startDate
      ? this.state.startDate.toLocaleString()
      : "Not set";
    const formattedEndDate = this.state.endDate
      ? this.state.endDate.toLocaleString()
      : "Not set";

    // Determine the background color based on dropdown value
    const backgroundColor = safeDropdown.toLowerCase();

    // Format current time for display
    const formattedCurrentTime = this.state.currentTime.toLocaleTimeString();

    return (
      <section
        className={`${styles.feedbackManager} ${
          hasTeamsContext ? styles.teams : ""
        }`}
      >
        <div className={styles.welcome}>
          <img
            alt=""
            src={
              isDarkTheme
                ? require("../assets/welcome-dark.png")
                : require("../assets/welcome-light.png")
            }
            className={styles.welcomeImage}
          />
          <h2>Well done Mate, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>
            Web part property value (Description):{" "}
            <strong>{escape(description)}</strong>
          </div>
          <div>
            Web part property value (Toggle):{" "}
            <strong>{toggle ? "On" : "Off"}</strong>
          </div>
          <div>
            Web part property value (Dropdown):{" "}
            <strong>{escape(safeDropdown)}</strong>
          </div>
        </div>

        <div>
          <DateTimePicker
            label="Start Time - 12h"
            dateConvention={DateConvention.DateTime}
            timeConvention={TimeConvention.Hours12}
            value={this.state.startDate}
            minDate={new Date()}
            onChange={this.handleStartDateChange}
          />
          <DateTimePicker
            label="End Time - 12h"
            dateConvention={DateConvention.DateTime}
            timeConvention={TimeConvention.Hours12}
            value={this.state.endDate}
            onChange={this.handleEndDateChange}
          />
        </div>

        <div>
          <p>Start Date: {formattedStartDate}</p>
          <p>End Date: {formattedEndDate}</p>
          <p>Current Time: {formattedCurrentTime}</p>{" "}
          {/* Display the live clock */}
        </div>

        {this.state.shouldDisplayDiv && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: backgroundColor,
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <p>
              This is some random text that can be enabled or disabled using the
              toggle button.
            </p>
          </div>
        )}
      </section>
    );
  }
}

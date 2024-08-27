import * as React from 'react';
import styles from './FeedbackManager.module.scss';
import type { IFeedbackManagerProps } from './IFeedbackManagerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react/lib/DateTimePicker';

interface IFeedbackManagerState {
  startDate: Date | undefined;
  endDate: Date | undefined;
  isEndDateValid: boolean; // New state to track date comparison
}

export default class FeedbackManager extends React.Component<IFeedbackManagerProps, IFeedbackManagerState> {
  constructor(props: IFeedbackManagerProps) {
    super(props);

    // Initialize state with default dates and valid date state
    this.state = {
      startDate: new Date(), // Default to current date and time
      endDate: new Date(),   // Default to current date and time
      isEndDateValid: true   // Default to true
    };

    // Bind event handlers
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  // Handler for start date change
  private handleStartDateChange(date: Date | undefined): void {
    this.setState({ startDate: date || undefined }, this.validateDates);
  }

  // Handler for end date change
  private handleEndDateChange(date: Date | undefined): void {
    this.setState({ endDate: date || undefined }, this.validateDates);
  }

  // Method to validate if end date is after start date
  private validateDates(): void {
    const { startDate, endDate } = this.state;
    if (startDate && endDate) {
      // Compare the two dates
      const isValid = endDate.getTime() >= startDate.getTime();
      this.setState({ isEndDateValid: isValid });
    } else {
      // If either date is not set, consider the date range valid
      this.setState({ isEndDateValid: true });
    }
  }

  public render(): React.ReactElement<IFeedbackManagerProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      toggle,
      dropdown
    } = this.props;

    // Debugging: Console log to check values
    console.log('Toggle Value:', toggle);
    console.log('Dropdown Value:', dropdown);

    // Ensure dropdown is defined and has a valid value
    const safeDropdown = dropdown || 'No selection';

    console.log('Start Date:', this.state.startDate);
    console.log('End Date:', this.state.endDate);

    // Convert date to a readable format
    const formattedStartDate = this.state.startDate ? this.state.startDate.toLocaleString() : 'Not set';
    const formattedEndDate = this.state.endDate ? this.state.endDate.toLocaleString() : 'Not set';

    return (
      <section className={`${styles.feedbackManager} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img 
            alt="" 
            src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} 
            className={styles.welcomeImage} 
          />
          <h2>Well done Mate, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value (Description): <strong>{escape(description)}</strong></div>
          <div>Web part property value (Toggle): <strong>{toggle ? 'On' : 'Off'}</strong></div>
          <div>Web part property value (Dropdown): <strong>{escape(safeDropdown)}</strong></div>
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
          {!this.state.isEndDateValid && <p style={{ color: 'red' }}>End date must be after the start date.</p>}
        </div>
      </section>
    );
  }
}

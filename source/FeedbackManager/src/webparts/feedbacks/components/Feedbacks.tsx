import * as React from "react";
import { TextField, PrimaryButton } from "@fluentui/react";
import { spfi, SPFx } from "@pnp/sp";  // Import necessary modules
import "@pnp/sp/webs";  // Import webs
import "@pnp/sp/lists";  // Import lists
import "@pnp/sp/items";  // Import items
import { IFeedbacksProps } from "./IFeedbacksProps";
import styles from "./Feedbacks.module.scss"; // Import the SCSS module

export interface IFeedbacksState {
  feedback: string;
  
}

export default class Feedbacks extends React.Component<IFeedbacksProps, IFeedbacksState> {
  private sp: ReturnType<typeof spfi>;

  constructor(props: IFeedbacksProps) {
    super(props);

    // Initialize state
    this.state = {
      feedback: ""
    };

    // Initialize PnPjs with the SPFx context
    this.sp = spfi().using(SPFx(this.props.context)); 

    // Bind event handlers
    this.handleFeedbackChange = this.handleFeedbackChange.bind(this);
    this.addListItem = this.addListItem.bind(this);
  }


  private handleFeedbackChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string): void {
    this.setState({ feedback: newValue || "" });
  }

 
  private async addListItem(): Promise<void> {
    const { feedback } = this.state;
    const { userDisplayName, listName } = this.props;  

    if (!feedback.trim()) {
      alert("Please enter your feedback before submitting.");
      return;
    }

    try {
      
      const item = await this.sp.web.lists.getById(listName).items.add({
        Title: userDisplayName,  
        Comments: feedback       
      });

      console.log(item);  
      alert("Feedback submitted successfully!");
      this.setState({ feedback: "" });  

    } catch (error) {
      console.error("Error adding list item:", error);
      alert("Oops! Something went wrong while submitting your feedback. Please try again later.");
    }
  }

  public render(): React.ReactElement<IFeedbacksProps> {
    const { feedback } = this.state;

  
    const isSubmitDisabled = !feedback.trim();

    return (
      <div className={styles.container}>
       <TextField
          className={styles.textField}
          label="Your Feedback"
          multiline
          rows={6}
          value={feedback}
          resizable={false}
          onChange={this.handleFeedbackChange}
        />
        <PrimaryButton
          className={styles.primaryButton}
          text="Submit"
          onClick={this.addListItem}
          disabled={isSubmitDisabled} // Disable button if feedback is empty
          
        />
      </div>
    );
  }
}

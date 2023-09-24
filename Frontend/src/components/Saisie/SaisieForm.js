import React, { Component } from "react";
import FormSaiseOperator from "./FormSaiseOperator";
import FormSaisiPlanning from "./FormSaisiePlanning";

export class SaisieForm extends Component {
  state = {
    step: 1,
    operators: [""],
    shift: "",
    tl: "JN",
  };

  // Proceed to next step
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  };

  // Go back to prev step
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
    });
  };

  // Handle fields change
  handleChange = (input) => (e) => {
    this.setState({ [input]: e.target.value });
  };

  // Handle Operators list change
  handleChangeOperators = (newOperators) => {
    this.setState({ operators: newOperators });
  };

  // Handle Planning Fields Change
  handleChangePlanning = (fieldName) => (e) => {
    const { planningFields } = this.state;
    this.setState({
      planningFields: {
        ...planningFields,
        [fieldName]: e.target.value,
      },
    });
  };

  handlePlanningList = (newPL) => {
    this.setState({ planningList: newPL });
  };

  render() {
    const { step } = this.state;
    const { tl, shift, operators, planningFields, planningList } = this.state;
    const values = { tl, shift, operators, planningFields, planningList };

    switch (step) {
      case 1:
        return (
          <FormSaiseOperator
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            handleChangeOperators={this.handleChangeOperators}
            values={values}
          />
        );
      case 2:
        return (
          <FormSaisiPlanning
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChangePlanning}
            values={values}
            handlePlanning={this.handlePlanningList}
          />
        );

      default:
        console.log("This is a multi-step form built with React.");
    }
  }
}

export default SaisieForm;

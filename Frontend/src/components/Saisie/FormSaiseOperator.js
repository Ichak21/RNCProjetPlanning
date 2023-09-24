import { Button, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";
import React, { Component } from "react";
import SaiseOperatorsList from "./SaisieOperatorsList";
import "../../styles/FormSaiseOperator.css";
import { toast } from "react-toastify";

export class FormSaiseOperator extends Component {
  greenRadioStyle = {
    color: "green",
  };
  continue = (e) => {
    e.preventDefault();
    const operators = this.props.values.operators;
    const shift = this.props.values.shift;
    if (shift.length !== 0) {
      if (operators.length <= 0) {
        toast.warning("Vous n'avez pas sélectionné d'opérateur !", {
          autoClose: 1000,
        });
      }
      this.props.nextStep();
    } else {
      toast.error("Veuillez saisir un horaire !", {
        autoClose: 2000,
      });
    }
  };

  handleNewOperators = (newOperators) => {
    // Faites ce que vous voulez avec newOperators dans le composant parent
    //console.log(newOperators);
    this.props.handleChangeOperators(newOperators);
  };

  render() {
    const { values, handleChange } = this.props;
    return (
      <div className="saisie-op-main">
        <div className="saisie-list-op-shift">
          <SaiseOperatorsList
            handleNewOperators={this.handleNewOperators}
            values={values}
          />

          <div className="saisie-shift-and-continue">
            <p className="text-explication-saisieOne">
              Veuillez sélectionner l'équipe ainsi que les opérateurs qui
              figureront dans le planning, puis cliquer sur continuer pour
              accéder à l'étape suivante.
            </p>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              onChange={handleChange("shift")}
              value={values.shift}
              name="radio-buttons-group"
              className="shift-selection-radio"
              row={true}
            >
              <FormControlLabel
                value="1"
                control={<Radio style={this.greenRadioStyle} />}
                label="Mat"
              />
              <FormControlLabel
                value="2"
                control={<Radio style={this.greenRadioStyle} />}
                label="AM"
              />
            </RadioGroup>

            <Button color="primary" variant="contained" onClick={this.continue}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default FormSaiseOperator;

import { React, useRef } from "react";
import "../../styles/SupportPage.css";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SupportPage() {
  const supportForm = useRef();

  const sendSupportEmail = (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ -]+$/;
    const isValidName = nameRegex.test(e.target[0].value);

    const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    const isValidEmail = emailRegex.test(e.target[1].value);

    const subjectRegex = /^[\w\d\s!@#$%^&*()_+-=<>?:"{}|,./;'\\[\]`~]+$/;
    const isValidSubject = subjectRegex.test(e.target[2].value);

    const messageRegex = /^[\w\d\s!@#$%^&*()_+-=<>?:"{}|,./;'\\[\]`~]+$/;
    const isValidMessage = messageRegex.test(e.target[3].value);

    if (isValidName && isValidEmail && isValidSubject && isValidMessage) {
      emailjs
        .sendForm(
          "service_xgrvdsp",
          "template_v1joqud",
          supportForm.current,
          "y9YE02ncNeaAKZN9z"
        )
        .then(
          (result) => {
            console.log(result.text);
          },
          (error) => {
            console.log(error.text);
          }
        );
      toast.success("Votre message a été envoyé ! 🚀", {
        autoClose: 2000,
      });
      e.target.reset();
    } else {
      toast.error("Veuillez saisir correctement tous les champs", {
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <form
        ref={supportForm}
        className="support-form"
        onSubmit={sendSupportEmail}
      >
        <h1>
          Contactez-<span>nous</span>
        </h1>
        <div className="support-main-container">
          <div className="support-name-email-container">
            <input
              type="text"
              className="support-input"
              placeholder="Votre nom"
              name="user_name"
              required
            />
            <input
              type="email"
              className="support-input"
              placeholder="Votre adresse email"
              name="user_email"
              required
            />
          </div>
          <div className="support-subject-container">
            <input
              type="text"
              className="support-input"
              placeholder="Sujet du message"
              name="support_subject"
              required
            />
          </div>
          <div className="support-message-container">
            <textarea
              className="support-textarea"
              placeholder="Votre message"
              rows="10"
              cols="30"
              name="support_message"
              required
            ></textarea>
          </div>
          <div className="support-submit-container">
            <button data-testid="envoyer-support" className="support-button">
              Envoyer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SupportPage;

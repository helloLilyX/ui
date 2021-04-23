import React from "react";

const SupportForm = props => {
    const {
        showModal,
        hideModal,
        feedbackType,
        feedbackTypes,
        feedbackEntry,
        setFeedbackType,
        setFeedbackEntry,
        meta,
        endpoint,
    } = props;

    const handleFormSubmit = e => {
        e.preventDefault();
        sendRequest();
    };

    const sendRequest = () => {
        const location = document.URL;

        const body = {
            data: {
                type: "support",
                meta,
                attributes: {
                    isFeedback: feedbackType === "suggestion",
                    location,
                    message: feedbackEntry,
                }
            }
        };

        fetch(endpoint, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin",
            body: JSON.stringify(body),
        })
            .then(response => {
                if (response.ok) {
                    // Clear the state
                    setFeedbackType("");
                    setFeedbackEntry("");
                } else {
                    throw new Error();
                }
            })
            .catch(error => {
                const message = `
                Something went wrong. Please click the OK button and resubmit the form. 
                If this problem persists, please contact the ORIS helpdesk at (614) 688-8288
                or orhelpdesk@osu.edu.
                `;
                alert(message);
                console.log(error);
                showModal();
            });

        // Don't wait on the form to post, close the modal and provide alert message
        hideModal();
        const message = feedbackTypes.filter(type =>
            type.name === feedbackType
        );
        alert(message[0].messages.submit);
    };

    return (
        <form id="feedback" onSubmit={handleFormSubmit}>
            <fieldset className="form-group feedback-chooser">
                <legend className="sr-only">How can we help?</legend>
                <div className="custom-controls-stacked">
                    { /* Generate radio button options per feedback type */}
                    {feedbackTypes.map(type => {
                        return (
                            <div className="custom-control custom-radio" key={type.name}>
                                <input
                                    type="radio"
                                    name="feedback-type"
                                    className="custom-control-input"
                                    id={type.name}
                                    value={type.name}
                                    onClick={e => setFeedbackType(e.target.value)}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor={type.name}>
                                    {type.labels.choice}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </fieldset>
            {/* Display feedback instructions & textarea if feedbackType state exists **/}
            {feedbackType && feedbackTypes.map(type => {
                // Generate instructions, field label, and invalid 
                // message for current feedbackType
                return (feedbackType === type.name &&
                    <div
                        key={type.name + "-entry"}
                        role="group"
                        aria-labelledby="feedback-instructions"
                        className="form-group is-required feedback-form"
                    >
                        <div id="feedback-instructions">{type.instructions}</div>
                        <label htmlFor={feedbackType + "-feedback-entry"}>
                            {type.labels.textarea + " (required)"}
                        </label>
                        <textarea
                            id={feedbackType + "-feedback-entry"}
                            name={feedbackType}
                            className="form-control"
                            rows="4"
                            value={feedbackEntry}
                            onChange={e => {
                                setFeedbackEntry(e.target.value);
                                e.target.setCustomValidity("");
                            }}
                            onInvalid={e => {
                                const invalidMsg = type.messages.invalid;
                                e.target.setCustomValidity(invalidMsg);
                            }}
                            required></textarea>
                    </div>);
            })}
        </form>
    );
};

export default SupportForm;
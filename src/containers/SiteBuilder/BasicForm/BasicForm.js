import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'
import axios from 'axios'

const BasicForm = props => {
    const [state, setState] = useState('')
    const onSubmit = (values, form) => {
        let html = `
        <html>
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title></title>
        </head>
        <body>
            <h1>Hello!</h1>
            </br>
            <div  style='background: #151515;color: #FFF;'>You have recieved a message from a contact form on your website on Websiter.dev:</div>
            </br>
            <table><tbody>
            </body>
        </html>`

        for (let field in values) {
            const original = props.refinedProperties.fields.find(
                item => item.name === field
            )
            html += `<tr><td>${original.label}:</td><td>${
                values[field]
            }</td></tr>`
        }

        html += '</tbody></table>'
        if (html.length < 5000) {
            axios
                .post('/api/sendmail', {
                    html,
                    to: props.refinedProperties.sendTo,
                })
                .then(response => {
                    if (response.data.success)
                        setState('Your message has been sent.')
                    else
                        setState(
                            'Your message has not been sent. Please try again.'
                        )
                })
                .catch(err => {
                    setState(
                        'Your message has not been sent. Please try again.'
                    )
                })
        }
    }
    const required = value => (value ? undefined : 'Required')
    const mustBeNumber = value =>
        isNaN(value) ? 'Must be a number' : undefined
    const minValue = min => value =>
        isNaN(value) || value >= min
            ? undefined
            : `Should be greater than ${min}`
    const composeValidators = (...validators) => value =>
        validators.reduce(
            (error, validator) => error || validator(value),
            undefined
        )

    return (
        <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, form, submitting, pristine, values }) => (
                <form
                    onSubmit={handleSubmit}
                    className={props.refinedProperties.formClass}
                >
                    {props.refinedProperties.fields &&
                        props.refinedProperties.fields.map((field, index) => (
                            <Field
                                key={index}
                                name={field.name}
                                validate={field.required ? required : null}
                            >
                                {({ input, meta }) => (
                                    <div className={field.containerClass}>
                                        <label className={field.labelClass}>
                                            {field.label}
                                        </label>

                                        {field.type === 'input' ? (
                                            <input
                                                {...input}
                                                {...field.inputAttrs}
                                                className={field.inputClass}
                                            />
                                        ) : field.type === 'textarea' ? (
                                            <textarea
                                                {...input}
                                                {...field.inputAttrs}
                                                className={field.inputClass}
                                            />
                                        ) : null}
                                        {meta.error && meta.touched && (
                                            <span
                                                className={
                                                    field.validationClass
                                                }
                                            >
                                                {meta.error}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </Field>
                        ))}

                    <div
                        className={
                            props.refinedProperties.submitButtonContainerClass
                        }
                    >
                        <button
                            type="submit"
                            disabled={submitting}
                            className={
                                props.refinedProperties.submitButtonClass
                            }
                        >
                            Submit
                        </button>
                    </div>
                    <div className={props.refinedProperties.resultClass}>
                        {state}
                    </div>
                </form>
            )}
        />
    )
}

export default BasicForm

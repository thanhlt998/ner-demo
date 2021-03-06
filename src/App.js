import logo from "./logo.svg";
import "./App.css";
import React, { Component, Fragment } from "react";
import axios from "axios";

const apiPath = "http://bb9cca16d91a.ngrok.io";
class App extends Component {
    state = {
        textInput: "",
        sentence: null,
        spans: null,
        active_span: null,
        html: null,
        data: null,
    };

    render_sentence = () => {
        const {
            sentence,
            active_span,
        } = this.state;

        if (!active_span) {
            return (
                <p>
                    {sentence.join(' ')}
                </p>
            )
        }

        const {span} = active_span;
        const s_i = span[0];
        const e_i = span[1];
        // console.log(sentence, s_i);

        return (
            <p>
                {sentence.slice(0, s_i).join(" ")}{" "}
                <span className='bg-success'><span className='h5'>{sentence.slice(s_i, e_i).join(" ")}</span></span>{" "}
                {sentence.slice(e_i, sentence.length).join(" ")}
            </p>
        );
    };

    onSubmit = async (e) => {
        e.preventDefault();
        const {textInput} = this.state;
        if (textInput) {
            const response = await axios.post(
                `${apiPath}/ner`,
                {text: textInput},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }                
            )
            const {data: {sentence, spans, html }} = response;
            this.setState({
                sentence, spans, active_span: null, html,
            })
        }
    }

    render() {
        const { spans, sentence, active_span, html } = this.state;
        return (
            <div className="container mt-5">
                <div className="row">
                    <p className='text-center w-100'><h1>NER Demo</h1></p>
                </div>
                <div className="row">
                    <form style={{ width: "100%" }} onSubmit={this.onSubmit.bind(this)}>
                        <div className="form-group">
                            <label for="exampleFormControlTextarea1">
                                Input Text
                            </label>
                            <textarea
                                className="form-control"
                                name="text"
                                rows="3"
                                onChange={e => this.setState({textInput: e.target.value})}
                            ></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">
                            Submit
                        </button>
                    </form>
                </div>
                {sentence && (
                    <Fragment>
                        <div className="row mt-5">
                            <h3>Output:</h3>
                            {this.render_sentence()}
                        </div>
                        <div className="row my-5">
                            <div className="col">
                                {Object.entries(spans).map(([label, values], i) => {
                                    return (
                                        <Fragment>
                                            {i !== 0 && <hr />}
                                            <div className="row">
                                                <div className="col-2">{label}:</div>
                                                <div className="col-8">
                                                    {values.map(([s_i, e_i], i) => (
                                                        <Fragment>
                                                            {i === 0 ? "" : " | "}
                                                            <span
                                                                className={`text-span${active_span &&
                                                                    active_span.label === label && JSON.stringify( active_span.span) === JSON.stringify([
                                                                            s_i,
                                                                            e_i,
                                                                        ])
                                                                        ? " span-selected"
                                                                        : ""
                                                                }`}
                                                                onClick={() =>
                                                                    this.setState({
                                                                        active_span: {
                                                                            label,
                                                                            span: [
                                                                                s_i,
                                                                                e_i,
                                                                            ],
                                                                        },
                                                                    })
                                                                }
                                                            >
                                                                {sentence
                                                                    .slice(s_i, e_i)
                                                                    .join(" ")}
                                                            </span>
                                                        </Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        </Fragment>
                                    );
                                })}
                            </div>
                        </div>
                        <div className='row my-5'>
                            <div dangerouslySetInnerHTML={{__html: html}} />
                        </div>
                    </Fragment>
                )}
            </div>
        );
    }
}

export default App;

"use strict";

import React from "react";
import Words from "./data/words.json";
import "./styles/WordsSpace.css";
import _ from 'lodash';
import { Jumbotron,  Button, Form, FormGroup, Input, Label, Spinner, Badge } from "reactstrap";

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            words: Words.words,
            matchingWords: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const characters = data.get("characters");
        const count = characters.length;

        const words = this.state.words;

        const filterWords = _.filter(words, word => {
            const wordHash = _.countBy(word);
            const charactersHash = _.countBy(characters);

            const matchingFilter = _.size(_.filter(wordHash, (value, key) => !(!charactersHash[key] || value > charactersHash[key]))) === _.size(wordHash);

            return word.length <= count && matchingFilter;
        }).sort((a, b) => a.length - b.length || // sort by length, if equal then
            a.localeCompare(b));
        this.setState({
            matchingWords: filterWords
        });
    }

    render() {
        return (
            <div>
                <div className="d-flex justify-content-center">
                    <Jumbotron>
                        <h1 className="display-3">Wordspace world!</h1>
                        <p className="lead">This is a simple hero unit, a simple web app to find all possible outcomes of the list of provided characters for wordspace game.</p>
                        <hr className="my-2" />
                        <p>Lets get started, please enter the list of characters you see on the game and I will tell you all possible answers.</p>

                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="exampleEmail">Characters</Label>
                                <Input type="text" name="characters" placeholder="Enter Characters..." required />
                            </FormGroup>
                            <Button color="warning">FIND WORDS...</Button>
                        </Form>
                    </Jumbotron>
                </div>
                <div className="flex-row bd-highlight mb-3">
                    { this.state.isLoading ? <Spinner color="warning" /> : "" }
                    {
                        this.state.matchingWords.map((item, key) =>
                            <Badge className="p-2 bd-highlight badgecard" color="success" key={key}>{ item.toUpperCase() }</Badge>)
                    }
                </div>
            </div>

        );
    }
}

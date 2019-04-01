import React, { Component } from 'react';
import fetch from 'isomorphic-unfetch';
import csv from 'csvtojson';
const withRequest = url => WrappedComponent => {
    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                data: null
            };
        }
        async initialize() {
            console.log(this.props);
            try {
                const response = await fetch(`${url}${'20181230'}.csv`);
                this.setState({
                    data: response
                });
            } catch (e) {
                console.log(e);
            }
        }
        componentDidMount() {
            this.initialize();
        }
        // componentDidUpdate(prevProps) {
        //     if (prevProps.url.params.id !== this.props.url.params.id) {
        //         this.initialize();
        //     }
        // }
        render() {
            return <WrappedComponent {...this.props} data={this.state.data} />;
        }
    };
};

export default withRequest;

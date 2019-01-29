import * as React from 'react';
import {Component} from "react";
import {client} from "./api/client";
import {ApolloProvider} from "react-apollo";
import {applyMiddleware, createStore} from "redux";
import rootReducer from "./store/reducers";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import {composeWithDevTools} from "redux-devtools-extension";
import Root from "./screens/Root";


const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk)
));



class App extends Component {
    public render() {
        return (
            <Provider store={store}>
                <ApolloProvider client={client}>
                    <Root />
                </ApolloProvider>
            </Provider>
        );
    }
}

export default App;

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./containers/App";
import configureStore from "./store/configureStore";

import '../styles/main.scss';

const store = configureStore(undefined);

Raven.config('https://4fe1e8c312f74523abb5363481c9b162@sentry.io/248851').install();
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("main")
);

import * as React from "react";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";

const theme = createMuiTheme({
    palette: {
        primary: {main: '#444349', contrastText: '#ECDC00'},
        secondary: {main: '#ECDC00'}
    },
    typography: {
        useNextVariants: true,
    },
});

function withRoot<P>(Component: React.ComponentType<P>) {
    function WithRoot(props: P) {
        return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <Component {...props} />
            </MuiThemeProvider>
        );
    }

    return WithRoot;
}

export default withRoot;


import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const Spinner = () => <div style={{
    display: 'flex',
    flex: '1 1 0',
    alignItems: 'center',
    justifyContent: 'center',
}}>
    <CircularProgress color="secondary" />
</div>;

export default Spinner

import * as React from "react";
import Typography from "@material-ui/core/Typography/Typography";
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button/Button";

const styles = (theme: Theme) => (createStyles({
    container: {
        display: 'flex',
        flex: '1 1 0',
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 150,
        margin: theme.spacing.unit,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    }
}));

interface Props extends WithStyles<typeof styles> {
    onClickCreate: () => void,
    onClickJoin: () => void
}

const WelcomeView = (props: Props) => {
    return (
        <div className={props.classes.container}>
           <Typography variant={"title"} color={"secondary"}>You're not part of any room</Typography>
           <Typography variant={"subtitle1"} color={"secondary"}>Create a room or join someone else's room</Typography>
           <div className={props.classes.row}>
                <Button variant="contained" color="primary" onClick={props.onClickCreate} className={props.classes.button}>Create room</Button>
                <Button variant="contained" color="primary" onClick={props.onClickJoin} className={props.classes.button}>Join room</Button>
           </div>
        </div>
    )
};

export default withStyles(styles)(WelcomeView)

import * as React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon/Icon";
import {useState} from "react";


const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

export enum eventVariant {
    SUCCESS = "success",
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
}

const styles = (theme: Theme) => (createStyles({
    container: {
        marginBottom: theme.spacing.unit * 10,
        maxWidth: '30%'
    },
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
        marginRight: theme.spacing.unit,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    close: {
        padding: theme.spacing.unit / 2,
    },
}));

interface InputProps extends WithStyles<typeof styles> {
    open: boolean
    message: string
    variant: eventVariant
}

const CustomizedSnackbar = (props: InputProps) => {
    const [open, SetOpen] = useState(true);
    if (!props.message){
        return <></>
    }
    const Icon = variantIcon[props.variant];
    const handleClose = () => SetOpen(false);
    return <Snackbar
        className={props.classes.container}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        open={props.open}
        autoHideDuration={3000}
        onClose={handleClose}
    >
        <SnackbarContent
            className={props.classes[props.variant]}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={props.classes.message}>
                <Icon className={props.classes.icon}/>
                    {props.message}
                </span>
            }
        />
    </Snackbar>
        ;
};
export default withStyles(styles)(CustomizedSnackbar);

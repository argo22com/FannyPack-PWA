import * as React from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Button from "@material-ui/core/Button/Button";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

interface Props {
    open: boolean,
    title: string,
    text: string,
    confirmAction: () => void,
    onClose: ()=>void,
}

const ActionConfirm = (props: Props) => {

    const handleClick = (agree: boolean) => () => {
        if (agree){
            props.confirmAction()
        }
        props.onClose();
    };

    return (
        <Dialog
            open={props.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant={"contained"} onClick={handleClick(false)} color="primary" autoFocus>
                    Cancel
                </Button>
                <Button onClick={handleClick(true)} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    )
};

export default ActionConfirm;

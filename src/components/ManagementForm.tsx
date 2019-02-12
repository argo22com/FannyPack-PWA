import * as React from "react";
import {useRef} from "react";
import {menuItems} from "./MainMenu";
import TextField from "@material-ui/core/TextField/TextField";
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Button from "@material-ui/core/Button/Button";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import MultiSelection from "./MultiSelection";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Input from "@material-ui/core/Input/Input";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Select from "@material-ui/core/Select/Select";
import Typography from "@material-ui/core/Typography/Typography";
import {RoomBasicFragment, UserBasicFragment} from "../generated-models/generated-types";

const styles = (theme: Theme) => (createStyles({
    container: {
        backgroundColor: theme.palette.secondary.light,
    },
    textField: {
        marginBottom: theme.spacing.unit,
        marginTop: theme.spacing.unit,
    },
    flex_col: {
        display: 'flex',
        flexDirection: 'column',
    }
}));

interface Props extends WithStyles<typeof styles> {
    header: menuItems,
    open: boolean,
    submitAction: (values: formValues) => void,
    cancelAction: () => void,
    allUsers: UserBasicFragment[],
    freeUsers: UserBasicFragment[],
    roomsToJoin: RoomBasicFragment[],
    fullscreen: boolean,
}

export interface formValues {
    name: string,
    roomId: string,
    type: menuItems,
    users?: UserBasicFragment[],
    password?: string,
    room: RoomBasicFragment,
}

const ManagementForm = (props: Props) => {
    const [values, setValues] = React.useState<formValues>({
        name: '',
        roomId: '',
        type: menuItems.defualt,
        users: [],
        password: '',
        room: {
            id: '',
            name: '',
            __typename: "RoomNode"
        }
    });

    const childRef = useRef(null);

    const {classes, header, open, submitAction, cancelAction} = props;

    function handleDone() {
        let toSend: formValues;
        console.log("handluju done", values);
        if (values.type === menuItems.defualt) {
            handleClose();
            return;
        }

        if (values.type === menuItems.logout) {
            toSend = {
                ...values,
            };
            console.log('logout payload', toSend);
            submitAction(toSend);
            return
        }

        if (values.type !== menuItems.joinRoom) {

            // @ts-ignore
            const selected = childRef.current.getSelected();
            toSend = {
                ...values,
                users: selected,
                type: props.header,
            };

        } else {

            toSend = {
                ...values,
                type: props.header,
            };
        }
        submitAction(toSend)

    }

    function handleClose() {
        cancelAction()
    }

    const handleChange = (param: string, type: menuItems) => (event: any, val?: any) => {
        if (param === "type"){
            console.log('nastavuju log');
            setValues({...values, type: type});
            return
        }
        if (param === "room") {
            const room = props.roomsToJoin.find(room => room.id === val.key);
            if (!room) {
                return
            }
            setValues({...values, room: room, type: type, name: room.name});
        } else {
            setValues({...values, [param]: event.target.value, type: type});
        }
    };

    const addRoom = () => (
        <div className={classes.flex_col}>
            <TextField
                id="standard-name"
                autoFocus
                label="Name"
                className={classes.textField}
                value={values.name}
                onChange={handleChange('name', menuItems.addRoom)}
                margin="normal"
            />
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password" className={classes.textField}
                   onChange={handleChange('password', menuItems.addRoom)}
                   autoComplete="current-password"/>
            <MultiSelection
                innerRef={childRef}
                users={props.allUsers}
                label={'Add Users'}
                single={false}
            />
        </div>
    );

    const addUser = () => (
        <div className={classes.flex_col}>
            <MultiSelection
                innerRef={childRef}
                users={props.freeUsers}
                label={'Add Users'}
                single={false}
            />
        </div>
    );

    const joinRoom = () => {
        return(
        <div className={classes.flex_col}>
            <InputLabel htmlFor="room-helper">Room</InputLabel>
            <Select
                value={values.room}
                onChange={handleChange('room', menuItems.joinRoom)}
                input={<Input name="room" id="room-helper" />}
                renderValue={(room: any) => (
                    <Typography>{room.name}</Typography>
                )}
                className={classes.textField}

            >
                {props.roomsToJoin.map((room) => (
                    <MenuItem key={room.id}>
                        <em>{room.name}</em>
                    </MenuItem>
                ))}
            </Select>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password"
                   onChange={handleChange('password', menuItems.joinRoom)}
                   autoComplete="current-password"/>
        </div>
    );
    };

    const logout = () => {
        return <>You will be logged out now</>
    };

    const renderForm = () => {
        switch (header) {
            case menuItems.addRoom:
                return addRoom();
            case menuItems.addUser:
                if (values.type !== menuItems.addUser) {
                    handleChange('type', menuItems.addUser)(null);
                }
                return addUser();
            case menuItems.joinRoom:
                return joinRoom();
            case menuItems.logout:
                if (values.type !== menuItems.logout) {
                    handleChange('type', menuItems.logout)(null);
                }
                return logout();
            default:
                return <></>
        }
    };

    return (
        <Dialog fullScreen={props.fullscreen} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{header}</DialogTitle>
            <DialogContent>
                {renderForm()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleDone} variant="contained" color="secondary">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    )
};


export default withStyles(styles)(ManagementForm)

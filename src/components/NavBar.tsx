import * as React from 'react';
import {ReactNode, useState} from 'react';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Typography from "@material-ui/core/Typography/Typography";
import {Theme, WithStyles} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import Fab from "@material-ui/core/Fab/Fab";
import AddIcon from '@material-ui/icons/AddOutlined';
import CloseIcon from '@material-ui/icons/Close';
import PlaceIcon from '@material-ui/icons/PlaceOutlined';
import FaceIcon from '@material-ui/icons/AssignmentIndOutlined';
import IconButton from "@material-ui/core/IconButton/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Menu from "@material-ui/core/Menu/Menu";
import Chip from "@material-ui/core/Chip/Chip";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Paper from "@material-ui/core/Paper/Paper";
import {RoomBasicFragment} from "../generated-models/generated-types";

interface Props extends WithStyles<typeof styles> {
    loggedUser: string | null,
    children: ReactNode,
    name: String,
    rooms: RoomBasicFragment[],
    currentRoomId: string | null,
    addPaymentOnClick: ()=>void,
    paymentCardActive: boolean,
    mainMenuOnClick: ()=>void,
    onRoomChange: (room: RoomBasicFragment)=>void,
}

const styles = (theme: Theme) => (createStyles({
    roomBar: {
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    appBar: {
        top: 0,
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    fab: {
        margin: theme.spacing.unit,
    },
    center: {
        minWidth: 100,
        textAlign: "center",
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    chip: {
        margin: theme.spacing.unit,
        width: 'fit-content',
    },
    menuButton: {
        position: 'fixed',
        right: 0,
        margin: theme.spacing.unit,
    },
    appName: {
        margin: theme.spacing.unit,
    },
    contentCanvas: {
        padding: theme.spacing.unit,
        backgroundColor: theme.palette.primary.light,
        display: 'flex',
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: 1,
    },
    menu: {
        maxHeight: '50%',
        overflow: 'auto',
    }
}));

const NavBar = (props: Props): (JSX.Element | null) => {
    //
    // if (!props.rooms[0]){
    //     console.log(props.rooms);
    //     return <h3>Loading NAVBAR</h3>
    // }

    const [anchorEl, setAnchorEl] = useState(null);
    const [room, setRoom] = useState(props.currentRoomId);

    const handleRoomsMenuOpen = (event: any) => {
        setAnchorEl(event.currentTarget)
    };

    const handleMenuClose = (event: any) => {
        let selectedRoomName = event.target.textContent;

        if (selectedRoomName === '') {
            selectedRoomName = room
        }
        const selectedRoom: (RoomBasicFragment|undefined) = props.rooms.find(r => r.name===selectedRoomName);
        if (!selectedRoom) {
            return
        }
        console.log("SELECTED ROOM ", selectedRoom );
        props.onRoomChange(selectedRoom);
        setRoom(selectedRoomName);
        setAnchorEl(null);
    };

    const renderRoomsMenu = () => (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            transformOrigin={{vertical: 'top', horizontal: 'right'}}
            open={isMenuOpen}
            onClose={handleMenuClose}
            className={classes.menu}
        >
            {props.rooms.map((room: RoomBasicFragment, index: number) => (
                <div key={index} className={classes.center}>
                    <MenuItem onClick={handleMenuClose}>{room.name}</MenuItem>
                </div>
            ))}
        </Menu>
    );

    const {name, classes, mainMenuOnClick} = props;
    const isMenuOpen = Boolean(anchorEl);
    const currentRoom = props.currentRoomId && props.rooms.length > 0 ? props.rooms.find(n => n.id === props.currentRoomId) : null;
    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <AppBar position={"static"} color={"primary"} className={classes.appBar}>
                <Typography variant={"h6"} color={"inherit"} className={classes.appName}>
                    {name}
                </Typography>
                {props.rooms.length > 0 &&
                    <Chip
                        avatar={<Avatar><PlaceIcon/></Avatar>}
                        label={currentRoom ? currentRoom.name : 'Select room'}
                        className={classes.chip}
                        color={"secondary"}
                        onClick={handleRoomsMenuOpen}
                    />
                }
                <Chip
                    avatar={<Avatar><FaceIcon/></Avatar>}
                    label={props.loggedUser}
                    className={classes.chip}
                    color={"secondary"}
                />
            </AppBar>
            <Paper elevation={1} className={classes.contentCanvas} square={true}>
                {props.children}
            </Paper>
            <AppBar position={"static"} color={"primary"} className={classes.roomBar}>
                <Fab
                    variant={"extended"}
                    color="secondary"
                    aria-label="Add"
                    className={classes.fab}
                    onClick={props.addPaymentOnClick}
                >
                    { props.paymentCardActive ?
                        <CloseIcon className={classes.extendedIcon} />
                        :
                        <AddIcon className={classes.extendedIcon}/>
                    }
                    Payment
                </Fab>
                <IconButton className={classes.menuButton} aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                            aria-haspopup="true"
                            onClick={mainMenuOnClick}
                            color="inherit">
                    <MenuIcon/>
                </IconButton>
            </AppBar>
            {renderRoomsMenu()}
        </div>
    )
};

export default withStyles(styles)(NavBar);

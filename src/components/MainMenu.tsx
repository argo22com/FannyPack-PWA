import * as React from 'react';
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer/SwipeableDrawer";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import ListItem from "@material-ui/core/ListItem/ListItem";
import List from "@material-ui/core/List/List";
import Divider from "@material-ui/core/Divider/Divider";
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import ListSubheader from "@material-ui/core/ListSubheader/ListSubheader";
import Typography from "@material-ui/core/Typography/Typography";


const styles = (theme: Theme) => (createStyles({
    list: {
        width: 250,
    },
    container: {
        backgroundColor: theme.palette.secondary.light,
    },
    menuItem: {
        color: theme.palette.primary.light
    },
    avatar: {
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.primary.main,
    }
}));

export enum menuItems {
    defualt = 'default',
    addRoom = 'Add Room',
    addUser = 'Add User',
    joinRoom = 'Join Room',
    logout = 'Logout',
}

interface Props extends WithStyles<typeof styles>{
    open: boolean,
    toggle: (open:boolean)=>()=>void,
    onClick: (clickedItem: menuItems)=>void,
    loggedUser: string,
    balance: string,
}

const MainMenu = (props: Props) => {

    const handleClick = (event: any) => {
        const content = event.target.textContent;
        if (content !== 'Rooms'){
            props.onClick(content);
        }
    };

    const sideList = (
        <div className={props.classes.list}>
            <Divider />
            <ListSubheader>{`Rooms`}</ListSubheader>
            <List>
                {['Join Room', 'Add Room', 'Add User', 'Delete Room'].map((text) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text}/>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Logout'].map((text) => (
                    <ListItem button key={text}>
                        <ListItemText
                            primary={text}
                            classes={{
                                primary: props.classes.menuItem
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return(
        <div id={"menu"}>
            <SwipeableDrawer
                anchor="right"
                open={props.open}
                onClose={props.toggle(false)}
                onOpen={props.toggle(true)}
                classes={{
                    paper: props.classes.container,
                }}

            >
                <div className={props.classes.avatar}>
                    <Typography variant={"h4"} align={"center"} color={"secondary"} style={{textAlign: 'center'}}>{props.loggedUser}</Typography>
                </div>
                <div
                    tabIndex={0}
                    role="button"
                    onClick={handleClick}
                    onKeyDown={props.toggle(false)}
                >
                    {sideList}
                </div>
            </SwipeableDrawer>
        </div>
    )
};


export default withStyles(styles)(MainMenu)

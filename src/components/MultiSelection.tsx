import {Room_getRooms_users} from "../generated-models/generated-types";
import * as React from "react";
import {forwardRef, useImperativeMethods, useState} from "react";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Chip from "@material-ui/core/Chip/Chip";
import Input from "@material-ui/core/Input/Input";
import Select from "@material-ui/core/Select/Select";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme) => (createStyles({
    chip: {
        margin: theme.spacing.unit / 4,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    option: {
        fontWeight: theme.typography.fontWeightRegular
    },
    optionSelected: {
        fontWeight: theme.typography.fontWeightMedium
    },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface Props extends WithStyles<typeof styles> {
    users: (Room_getRooms_users[]),
    label: string,
    single: boolean,
}

const Selection = forwardRef((props: Props, ref) => {
        const [selectedUsers, setSelectedUsers] = useState<Room_getRooms_users[]>([]);
        const [selectedUsernames, setSelectedUsersnames] = useState<string[]>([]);
        const [singleUser, setSingleUser] = useState<Room_getRooms_users>(props.users[0]);

        useImperativeMethods(ref, () => ({
            getSelected() {
                return props.single? singleUser : selectedUsers
            }
        }));

        const {users, classes} = props;

        const getStyles = (user: Room_getRooms_users) => {
            const found = selectedUsers.find(entry => entry.username === user.username);
            return found ? classes.optionSelected : classes.option
        };

        const updateSelectedUsers = (usernames: string[]) => {
            let userObjs: Room_getRooms_users[] = [];
            usernames.forEach((username: string) => {
                const userObj = users.find((user) => (user.username === username));

                if (!userObj) {
                    throw Error("Cannot find user with name " + username);
                }
                userObjs.push(userObj);
            });
            setSelectedUsers(userObjs);
        };

        const handleChange = (name: string) => (event: any) => {
            switch (name) {
                case 'users': {
                    const username = event.target.value;
                    if (username.length === 0) {
                        setSelectedUsersnames([]);
                        setSelectedUsers([]);
                        break;
                    }
                    setSelectedUsersnames(username);
                    updateSelectedUsers(username);
                    break;
                }
                case 'singleUser': {
                    const username = event.target.value;
                    const user = users.find((user) => (user.username === username));
                    if (!user) {
                        throw Error("Cannot find user with name " + username);
                    }
                    setSingleUser(user);
                    break;
                }
            }
        };

        const renderSingleSelection = () => (
            <>
                <InputLabel htmlFor="select-chip">Who paid?</InputLabel>
                <Select
                    value={singleUser}
                    onChange={handleChange('singleUser')}
                    input={<Input id="select-chip"/>}
                    renderValue={() =>
                        <Chip key={singleUser.id} label={singleUser.username} className={classes.chip}/>
                    }
                    MenuProps={MenuProps}
                >
                    {users.map((user: Room_getRooms_users) => (
                        <MenuItem key={user.id} value={user.username} className={getStyles(user)}>
                            {user.username}
                        </MenuItem>
                    ))}
                </Select>
            </>
        );

        const renderMultipleSelection = () => (
            <>
                <InputLabel htmlFor="select-multiple-chip">{props.label}</InputLabel>
                <Select
                    multiple={!props.single}
                    value={selectedUsernames}
                    onChange={handleChange('users')}
                    input={<Input id="select-multiple-chip"/>}
                    renderValue={(users: string[]) => (
                        <div className={classes.chips}>
                            {users.map((user) => (
                                <Chip key={user} label={user} className={classes.chip}/>
                            ))}
                        </div>
                    )}
                    MenuProps={MenuProps}
                >
                    {users.map((user: Room_getRooms_users) => (
                        <MenuItem key={user.id} value={user.username} className={getStyles(user)}>
                            {user.username}
                        </MenuItem>
                    ))}
                </Select>
            </>
        );

        return props.single ? renderSingleSelection() : renderMultipleSelection()
    }
);

export default withStyles(styles)(Selection)

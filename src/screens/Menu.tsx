import RootState from "../store/rootState";
import {connect} from "react-redux";
import * as React from "react";
import {FunctionComponent} from "react";
import MainMenu, {menuItems} from "../components/MainMenu";
import {actionOpenManagementForm, actionOpenMenu, actionSetManagementFormType} from "../store/actions/uiActions";
import ManagementForm, {formValues} from "../components/ManagementForm";
import {Room_getRooms, Room_getRooms_users} from "../generated-models/generated-types";
import {actionFireMenuEvent} from "../store/actions";
import {agentType} from "../models/CustomTypes";

interface StateToProps {
    loggedUser: string,
    matrix: object,
    allUsers: Room_getRooms_users[],
    usersInRoom: Room_getRooms_users[],
    menuOpened: boolean,
    managementFormOpened: boolean,
    managementFormType: menuItems,
    allRooms: Room_getRooms[],
    agent: agentType,
}

interface DispatchToProps {
    openMenu: typeof actionOpenMenu,
    openManagementForm: typeof actionOpenManagementForm,
    setManagementFormType: typeof actionSetManagementFormType,
    menuAction: typeof actionFireMenuEvent,
}

interface Props extends StateToProps, DispatchToProps {}

const Menu: FunctionComponent<Props> = (props:Props) => {

    if (!props.allUsers.length) {
        return <>Loading Menu</>
    }

    const handleOpenMenu = (toggle:boolean) => () => {
        props.openMenu(toggle);
    };

    const handleClick = (item: menuItems) => {
        console.log(item);
        props.setManagementFormType(item);
        props.openManagementForm(!props.managementFormOpened);
        props.openMenu(false);
    };

    const handleSubmit = (values: formValues) => {
        props.openManagementForm(false);
        props.menuAction(values);
    };

    const handleCancel = () => {
        props.openManagementForm(false);
    };

    const getFreeUsers = () => {
        return resultFilter(props.allUsers, props.usersInRoom);
    };

    const getRoomsToJoin = () => {
        const loggedUser = props.allUsers.find((user) => user.username === props.loggedUser);
        if (!loggedUser) {
            return []
        }

        if (loggedUser.rooms.length === 0 ) {
            return props.allRooms
        }

        const availableRooms = props.allRooms.filter(firstArrayItem =>
            !loggedUser.rooms.some(
                secondArrayItem => firstArrayItem.id === secondArrayItem.id
            )
        );

        return availableRooms
    };

    const resultFilter = (firstArray: Room_getRooms_users[], secondArray: Room_getRooms_users[]) => {
        if (!secondArray.length){
            return []
        }
        return firstArray.filter(firstArrayItem =>
            !secondArray.some(
                secondArrayItem => firstArrayItem.username === secondArrayItem.username
            )
        );
    };

    return (
        <>
            <MainMenu open={props.menuOpened} toggle={handleOpenMenu} onClick={handleClick} balance={'350'} loggedUser={props.loggedUser}/>
            <ManagementForm
                open={props.managementFormOpened}
                header={props.managementFormType}
                submitAction={handleSubmit}
                cancelAction={handleCancel}
                allUsers={props.allUsers}
                freeUsers={getFreeUsers()}
                roomsToJoin={getRoomsToJoin()}
                fullscreen={props.agent===agentType.ANDROID}
            />
        </>
    );
};

const mapStateToProps = (state: RootState): StateToProps => ({
    matrix: state.matrix,
    allUsers: state.allUsers,
    usersInRoom: state.usersInRoom,
    menuOpened: state.mainMenuOpened,
    managementFormOpened: state.managementFormOpened,
    managementFormType: state.managementFormType,
    allRooms: state.rooms,
    loggedUser: state.loggedUser,
    agent: state.userAgent,
});

const mapDispatchToProps:DispatchToProps = ({
    openMenu: actionOpenMenu,
    openManagementForm: actionOpenManagementForm,
    menuAction: actionFireMenuEvent,
    setManagementFormType: actionSetManagementFormType,
});

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(Menu);

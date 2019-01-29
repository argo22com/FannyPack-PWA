import * as React from "react";
import {FunctionComponent, ReactNode} from "react";
import RootState from "../store/rootState";
import {connect} from "react-redux";
import {Room_getRooms, Room_getRooms_users} from "../generated-models/generated-types";
import NavBar from "../components/NavBar";
import {actionAddPaymentButtonClick, actionOpenMenu} from "../store/actions/uiActions";
import {actionSetCurrentRoom} from "../store/actions";

interface StateToProps {
    rooms: Room_getRooms[],
    paymentWindowOpened: boolean,
    menuOpened: boolean,
    currentRoom: Room_getRooms,
    loggedUser: string,
    allUsers: Room_getRooms_users[],
}

interface DispatchToProps {
    openPaymentWindow: typeof actionAddPaymentButtonClick,
    openMenu: typeof actionOpenMenu,
    changeRoom: typeof actionSetCurrentRoom,
}

interface Props extends StateToProps, DispatchToProps{
    children: ReactNode
}

const Layout: FunctionComponent<Props> = (props: Props) => {

    const handleAddPaymentClick = () => {
        props.openPaymentWindow(!props.paymentWindowOpened);
    };

    const handleOpenMenu = () => {
        props.openMenu(true);
    };

    const handleRoomChange = (room: Room_getRooms) => {
        props.changeRoom(room);
    };

    const getAvailableRooms = () => {
        if (!props.allUsers.length) {
            return []
        }
        const currentUser = props.allUsers.find((user)=>user.username===props.loggedUser);
        if (!currentUser) {
            return []
        }
        else return currentUser.rooms
    };

    return(
        <NavBar
            rooms={getAvailableRooms()}
            currentRoom={props.currentRoom}
            name={"FANNYP."}
            addPaymentOnClick={handleAddPaymentClick}
            paymentCardActive={props.paymentWindowOpened}
            mainMenuOnClick={handleOpenMenu}
            onRoomChange={handleRoomChange}
            loggedUser={props.loggedUser}
        >
            {props.children}
        </NavBar>
    );
};


const mapStateToProps = (state: RootState): StateToProps => ({
    rooms: state.rooms,
    paymentWindowOpened: state.paymentWindowOpened,
    menuOpened: state.mainMenuOpened,
    currentRoom: state.currentRoom,
    loggedUser: state.loggedUser,
    allUsers: state.allUsers,
});


const mapDispatchToProps: DispatchToProps = {
    openPaymentWindow: actionAddPaymentButtonClick,
    openMenu: actionOpenMenu,
    changeRoom: actionSetCurrentRoom,
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

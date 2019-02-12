import * as React from "react";
import {FunctionComponent, ReactNode} from "react";
import RootState from "../store/rootState";
import {connect} from "react-redux";
import NavBar from "../components/NavBar";
import {actionAddPaymentButtonClick, actionOpenMenu} from "../store/actions/uiActions";
import {actionSetCurrentRoom} from "../store/actions";
import {MeQuery, RoomBasicFragment} from "../generated-models/generated-types";
import {QueryResult} from "react-apollo";
import {withMeGraphql} from "../models/withMe";

interface StateToProps {
    paymentWindowOpened: boolean,
    menuOpened: boolean,
    currentRoomId: string | null,
}

interface DispatchToProps {
    openPaymentWindow: typeof actionAddPaymentButtonClick,
    openMenu: typeof actionOpenMenu,
    changeRoom: typeof actionSetCurrentRoom,
}

interface Props extends StateToProps, DispatchToProps {
    children: ReactNode,
    me: MeQuery & QueryResult,
}

const Layout: FunctionComponent<Props> = (props: Props) => {

    const handleAddPaymentClick = () => {
        props.openPaymentWindow(!props.paymentWindowOpened);
    };

    const handleOpenMenu = () => {
        props.openMenu(true);
    };

    const handleRoomChange = (room: RoomBasicFragment) => {
        props.changeRoom(room.id);
    };

    const getAvailableRooms = () => {
        if (!props.me.me) {
            return []
        }
        return props.me.me.rooms.edges.map(e => e.node);
    };

    return (
        <NavBar
            rooms={getAvailableRooms()}
            currentRoomId={props.currentRoomId}
            name={"FANNYP."}
            addPaymentOnClick={handleAddPaymentClick}
            paymentCardActive={props.paymentWindowOpened}
            mainMenuOnClick={handleOpenMenu}
            onRoomChange={handleRoomChange}
            loggedUser={props.me.me ? props.me.me.username : 'Loading...'}
        >
            {props.children}
        </NavBar>
    );
};


const mapStateToProps = (state: RootState): StateToProps => ({
    paymentWindowOpened: state.paymentWindowOpened,
    menuOpened: state.mainMenuOpened,
    currentRoomId: state.currentRoomId,
});


const mapDispatchToProps: DispatchToProps = {
    openPaymentWindow: actionAddPaymentButtonClick,
    openMenu: actionOpenMenu,
    changeRoom: actionSetCurrentRoom,
};

export default connect(mapStateToProps, mapDispatchToProps)(withMeGraphql()(Layout));

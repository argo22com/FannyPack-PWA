import * as React from 'react';
import {connect} from "react-redux";
import {actionInit} from "../store/actions";
import Graph from "./Graph";
import Layout from "./Layout";
import withRoot from "../ui/theme";
import AddPayment from "./AddPayment";
import Menu from "./Menu";
import RoomInfo from "./RoomInfo";
import LoginScreen from "./LoginScreen";
import RootState from "../store/rootState";
import EventHandler from "./EventHandler";
import Spinner from "../components/Spinner";
import WelcomeScreen from "./WelcomeScreen";

interface DispatchToProps {
    action: any,
}

interface StateToProps {
    isLogged: boolean,
    loggedUser: string | null,
    currentRoomId: string | null,
}

interface Props extends DispatchToProps, StateToProps {
}

const Root = (props: Props) => {
    const isLogged = () => {
        const logged = localStorage.getItem("token");
        if (!logged) {
            console.log("not logged in")
        } else {
            props.action();
        }
        return logged;
    };

    const userIsNew = () => {
        return false; // TODO: implement
    };

    if (isLogged() && !props.isLogged) {
        console.log(props, isLogged());
        return <Spinner/>
    }

    if (isLogged() && props.isLogged) {
        if (userIsNew()) {
            return (
                <div>
                    <Layout>
                        <WelcomeScreen/>
                        <Menu/>
                    </Layout>
                    <EventHandler/>
                </div>
            )
        } else {
            return (
                <div>
                    <Layout>
                        <Graph id={props.currentRoomId}/>
                        <RoomInfo/>
                        <AddPayment/>
                        <Menu/>
                    </Layout>
                    <EventHandler/>
                </div>
            );
        }
    } else {
        return (
            <>
                <LoginScreen/>
                <EventHandler/>
            </>
        )
    }
};

const mapDispatchToProps: DispatchToProps = {
    action: actionInit,
};

const mapStateToProps = (state: RootState): StateToProps => ({
    isLogged: state.isLogged,
    loggedUser: state.loggedUser,
    currentRoomId: state.currentRoomId,
});


export default connect(mapStateToProps, mapDispatchToProps)(withRoot(Root));

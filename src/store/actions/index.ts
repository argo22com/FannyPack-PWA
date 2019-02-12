import {Dispatch} from "redux";
import {client} from "../../api/client";
import {Transaction} from "../../components/Payment";
import {
    addPaymentMutation,
    addUserToRoomMutation,
    createRoomMutation,
    removePaymentMutation
} from "../../models/Mutations";
import RootState from "../rootState";
import {formValues} from "../../components/ManagementForm";
import {menuItems} from "../../components/MainMenu";
import {actionUserLogonStatus, actionVerifyAuthToken} from "./loginActions";
import {eventVariant} from "../../components/SnackBar";
import {eventProps} from "../../screens/EventHandler";
import {MeQuery, RoomBasicFragment} from "../../generated-models/generated-types";
import {meQuery} from "../../models/Queries";

export enum ActionTypes {
    SET_INITIALIZED = "SET_INITIALIZED",
    SET_ACTIVE_ROOM = "SET_ACTIVE_ROOM",
    SET_LOGGED_USER = "SET_LOGGED_USER",
    SET_IS_LOGGED = "SET_IS_LOGGED",
    SET_EVENT_PROPS = "SET_EVENT_PROPS",
    SET_EVENT_OPEN = "SET_EVENT_OPEN",
    CLICK_BUTTON_PAYMENT = 'ADD_PAYMENT_BUTTON_CLICKED',
    CLICK_MAIN_MENU = 'CLICK_MAIN_MENU',
    OPEN_MANAGEMENT_FORM = 'OPEN_MANAGEMENT_FORM',
    SET_MANAGEMENT_FORM_TYPE = 'SET_MANAGEMENT_FORM_TYPE',
    SET_USER_AGENT = "SET_USER_AGENT",
}

export const actionInit = () => async (dispatch: Dispatch, getState: () => RootState) => {
    actionVerifyAuthToken()(dispatch);
    if (!getState().initialized) {
        const me = await client.query<MeQuery>({query: meQuery});
        if (me.data.me && me.data.me.rooms.edges.length > 0) {
            console.log("user", me.data.me);
            actionSetCurrentRoom(me.data.me.rooms.edges[0].node.id)(dispatch);
        }
        dispatch({type: ActionTypes.SET_INITIALIZED, initialized: true});
    }
};

export const actionSetCurrentRoom = (roomId: RoomBasicFragment['id']) => (dispatch: Dispatch) => {
    dispatch({type: ActionTypes.SET_ACTIVE_ROOM, currentRoomId: roomId});
};

export const actionSendPayment = (transaction: Transaction) => async (dispatch: Dispatch, getState: () => RootState) => {

    const {currentRoomId} = getState();

    let response: any;
    let variables = {
        drawee: transaction.drawee.username,
        pledger: transaction.pledger.username,
        amount: transaction.amount,
        name: transaction.name,
        roomId: currentRoomId,
    };
    try {
        response = await client.mutate({
            mutation: addPaymentMutation,
            variables: variables,
        })
    } catch (error) {
        await actionResend(error, actionSendPayment(transaction))(dispatch, getState);
        return
    }

    actionSendEvent("Payment sent", eventVariant.SUCCESS)(dispatch);
};

export const actionRemovePayment = (id: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const {currentRoomId} = getState();

    let response;
    try {
        response = await client.mutate({
            mutation: removePaymentMutation,
            variables: {
                id: id
            },
        })
    } catch (error) {
        console.log(error);
        return
    }
    actionSendEvent("Payment deleted", eventVariant.SUCCESS)(dispatch);
};

/**
 * action sets random delay between 10ms - 30ms, waits that amount of time and then resends payment mutation
 * @param error
 * @param action
 */
const actionResend = (error: any, action: any) => async (dispatch: Dispatch, getState: () => RootState) => {
    if (!error.graphQLErrors[0]) {
        console.log("NETWORK ERROR: ", error);
        actionSendEvent("Not connected to internet", eventVariant.ERROR)(dispatch);
        return;
    }

    switch (error.graphQLErrors[0].message) {
        case 'Room is protected by password':
            actionSendEvent("Room is protected by password", eventVariant.ERROR)(dispatch);
            console.log('throwuju');
            throw new Error('Menu event error');
        case 'incorrect password':
            actionSendEvent("Incorrect password", eventVariant.ERROR)(dispatch);
            throw new Error('Menu event error');
        case 'Incorrect password':
            actionSendEvent("Incorrect password", eventVariant.ERROR)(dispatch);
            throw new Error('Menu event error');
        case "database is locked":
            let delay = Math.floor(Math.random() * 30) + 10;
            setTimeout(() => action(dispatch, getState), delay);
            return;
        default:
            actionSendEvent("Something went wrong", eventVariant.ERROR)(dispatch);
            throw new Error('Menu event error');
    }
};


const actionJoinRoom = (room: RoomBasicFragment, password: string | undefined) => async (dispatch: Dispatch, getState: () => RootState) => {
    let response: any;
    let variables = {
        roomId: room.id,
        username: getState().loggedUser,
        secret: password,
    };
    try {
        response = await client.mutate({
            mutation: addUserToRoomMutation,
            variables: variables,
        })
    } catch (error) {
        console.log("catchuju error - join room", error);
        await actionResend(error, actionJoinRoom(room, password))(dispatch, getState);
        return
    }

    actionSendEvent(room.name + " joined", eventVariant.SUCCESS)(dispatch);
};

export const actionFireMenuEvent = (payload: formValues) => async (dispatch: Dispatch, getState: () => RootState) => {
    const type = payload.type;
    try {
        switch (type) {
            case menuItems.addRoom: {
                const newRoom = await actionCreateRoom(payload.name, payload.password)(dispatch, getState);
                const users = payload.users!;
                for (const user of users) {
                    await actionAddUserToRoom(newRoom.id, user.username, payload.password)(dispatch, getState);
                }
                break;
            }
            case menuItems.addUser: {
                const users = payload.users!;
                for (const user of users) {
                    const id = getState().currentRoomId;
                    await actionAddUserToRoom(id, user.username, payload.password)(dispatch, getState);
                }
                break;
            }
            case menuItems.joinRoom: {
                await actionJoinRoom(payload.room, payload.password)(dispatch, getState);
                break;
            }
            case menuItems.logout: {
                console.log('logoutuju');
                actionUserLogonStatus(false)(dispatch);
                return;
            }
        }
    } catch (error) {
        console.log('menu event failure');
        return
    }
    const {currentRoomId} = getState();
    await actionSetCurrentRoom(currentRoomId)(dispatch);
};


export const actionCreateRoom = (name: string, password: string | undefined) => async (dispatch: Dispatch, getState: () => RootState) => {
    console.log('vytvarim novou roomu');
    let response: any;
    let variables = {
        name: name,
        secret: password
    };

    try {
        response = await client.mutate({
            mutation: createRoomMutation,
            variables: variables
        })
    } catch (error) {
        console.log(error);
        return
    }
    const newRoom = response.data.createRoom.room;
    dispatch({type: ActionTypes.SET_ACTIVE_ROOM, currentRoom: newRoom});
    console.log('nastavuju novou roomu na ', newRoom);
    actionSendEvent("Room " + name + " created", eventVariant.SUCCESS)(dispatch);
    return newRoom;
};

export const actionAddUserToRoom = (roomId: string, username: string, password?: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    let response: any;
    let variables = {
        roomId: roomId,
        username: username,
        secret: password,
    };
    try {
        response = await client.mutate({
            mutation: addUserToRoomMutation,
            variables: variables,
        })
    } catch (error) {
        console.log(error);
        actionResend(error, actionAddUserToRoom(roomId, username, password))(dispatch, getState);
        return
    }
    actionSendEvent("User " + username + " was added to room", eventVariant.SUCCESS)(dispatch);
};

export const actionSendEvent = (message: string, variant: eventVariant) => (dispatch: Dispatch) => {
    const eventProps: eventProps = {
        variant: variant,
        message: message,
    };
    dispatch({type: ActionTypes.SET_EVENT_PROPS, eventProps: eventProps});
    dispatch({type: ActionTypes.SET_EVENT_OPEN, eventOpen: true});

    setTimeout(() => dispatch({type: ActionTypes.SET_EVENT_OPEN, eventOpen: false}), 3000)
};


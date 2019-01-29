import {Dispatch} from "redux";
import {Room_getRooms} from "../../generated-models/generated-types";
import {client} from "../../api/client";
import {
    getMatrixQuery,
    getPaymentsQuery,
    getRoomsQuery,
    getUsersInRoomQuery,
    getUsersQuery
} from "../../models/Queries";
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

export enum ActionTypes {
    SET_INITIALIZED = "SET_INITIALIZED",
    SET_ALL_USERS = "SET_ALL_USERS",
    SET_ROOMS = "SET_ROOMS",
    SET_ACTIVE_ROOM = "SET_ACTIVE_ROOM",
    SET_MATRIX = "SET_MATRIX",
    SET_USERS_IN_CURRENT_ROOM = 'SET_USERS_IN_CURRENT_ROOM',
    SET_ROOM_PAYMENTS = 'SET_ROOM_PAYMENTS',
    SET_ROOM_BIGGEST_PLEDGER = "SET_ROOM_BIGGEST_PLEDGER",
    SET_ROOM_TOTAL_SPENDINGS = "SET_ROOM_TOTAL_SPENDINGS",
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
        await actionGetRooms()(dispatch);
        await actionGetUsers()(dispatch);
        const user = getState().allUsers.find((user)=>user.username===getState().loggedUser);
        if (user && user.rooms.length > 0) {
            console.log("user", user);
            actionSetCurrentRoom(user.rooms[0])(dispatch);
        }
        dispatch({type: ActionTypes.SET_INITIALIZED, initialized: true});
    }
};

export const actionGetUsers = () => async (dispatch: Dispatch) => {
    let response: any;

    try {
        response = await client.query({
            query: getUsersQuery
        })
    } catch(error){
        actionSendEvent("Error fetching users", eventVariant.ERROR)(dispatch);
        console.log(error);
        return
    }

    response = response.data.users;

    dispatch({type: ActionTypes.SET_ALL_USERS, users: response});

    return response;
};

export const actionGetUsersInRoom = (room_id: string) => async (dispatch: Dispatch) => {
    let response: any;

    try {
        response = await client.query({
            query: getUsersInRoomQuery,
            variables : {
                roomId: room_id
            },
            fetchPolicy: "network-only"
        })
    } catch(error){
        actionSendEvent("Error fetching users in room", eventVariant.ERROR)(dispatch);
        console.log(error);
        return
    }

    response = response.data.users;

    dispatch({type: ActionTypes.SET_USERS_IN_CURRENT_ROOM, users: response});
};


export const actionGetRooms = () => async (dispatch: Dispatch) => {
    let response: any;

    try {
        response = await client.query({
            query: getRoomsQuery
        })
    } catch(error){
        actionSendEvent("Error fetching rooms", eventVariant.ERROR)(dispatch);
        console.log(error);
        return
    }

    response = response.data.getRooms;

    dispatch({type: ActionTypes.SET_ROOMS, rooms: response});

    return response;
};

export const actionSetCurrentRoom = (room: Room_getRooms) => (dispatch: Dispatch) => {
    dispatch({type: ActionTypes.SET_ACTIVE_ROOM, currentRoom: room});
    actionUpdateState(room.id)(dispatch);
    actionGetPayments(room)(dispatch);
    actionGetUsersInRoom(room.id)(dispatch);
};

export const actionUpdateMatrix = (room: Room_getRooms) => async (dispatch: Dispatch) => {
    if (!room) {
        return
    }
    let response: any;
    try {
        response = await client.query({
            query: getMatrixQuery,
            variables: {
                roomId: room.id
            }
        })
    } catch(error){
        actionSendEvent("Error updating matrix", eventVariant.ERROR)(dispatch);
        return
    }
    const users = response.data.room.users;
    const jsonString = response.data.room.matrix;
    const matrix = JSON.parse(jsonString);

    const biggestPledger = response.data.room.biggestPledger;
    const totalBalance = response.data.room.totalBalance;


    dispatch({type: ActionTypes.SET_MATRIX, matrix: matrix});
    // dispatch({type: ActionTypes.SET_USERS_IN_CURRENT_ROOM, users: users});
    dispatch({type: ActionTypes.SET_ROOM_BIGGEST_PLEDGER, name: biggestPledger});
    dispatch({type: ActionTypes.SET_ROOM_TOTAL_SPENDINGS, amount: totalBalance});

};

export const actionUpdateState = (room: string) => async (dispatch: Dispatch) => {

    let response: any;
    try {
        response = await client.query({
            query: getMatrixQuery,
            variables: {
                roomId: room
            },
            fetchPolicy: "network-only"
        })
    } catch(error){
        actionSendEvent("Error updating state", eventVariant.ERROR)(dispatch);
        console.log(error);
        return
    }
    // const users = response.data.room.users;
    const jsonString = response.data.room.matrix;
    const matrix = JSON.parse(jsonString);

    const biggestPledger = response.data.room.biggestPledger;
    const totalBalance = response.data.room.totalBalance;
    const roomOBJ = response.data.room;

    dispatch({type: ActionTypes.SET_MATRIX, matrix: matrix});
    // dispatch({type: ActionTypes.SET_USERS_IN_CURRENT_ROOM, users: users});
    dispatch({type: ActionTypes.SET_ROOM_BIGGEST_PLEDGER, name: biggestPledger});
    dispatch({type: ActionTypes.SET_ROOM_TOTAL_SPENDINGS, amount: totalBalance});
};

export const actionGetPayments = (currentRoom: Room_getRooms) => async (dispatch: Dispatch) => {
    let response: any;
    try {
        response = await client.query({
            query: getPaymentsQuery,
            variables: {
                roomId: currentRoom.id
            },
            fetchPolicy: "network-only"
        })
    } catch(error){
        actionSendEvent("Error fetching payments", eventVariant.ERROR)(dispatch);
        console.log("get payments error", error);
        return
    }

    const payments = response.data.getPayments;
    dispatch({type: ActionTypes.SET_ROOM_PAYMENTS, payments: payments});
};

export const actionSendPayment = (transaction: Transaction) => async (dispatch: Dispatch, getState: () => RootState) => {

    const {currentRoom} = getState();

    let response: any;
    let variables = {
        drawee: transaction.drawee.username,
        pledger: transaction.pledger.username,
        amount: transaction.amount,
        name: transaction.name,
        roomId: currentRoom.id,
    };
    try {
        response = await client.mutate({
            mutation: addPaymentMutation,
            variables: variables,
            refetchQueries: [{
                query: getMatrixQuery,
                variables: {
                    roomId: variables.roomId
                }
            }]
        })
    } catch(error){
        await actionResend(error, actionSendPayment(transaction))(dispatch,getState);
        return
    }

    const jsonString = response.data.makePayment.matrix.matrix;
    const matrix = JSON.parse(jsonString);

    const biggestPledger = response.data.makePayment.matrix.biggestPledger;
    const totalBalance = response.data.makePayment.matrix.totalBalance;

    dispatch({type: ActionTypes.SET_MATRIX, matrix: matrix});
    dispatch({type: ActionTypes.SET_ROOM_BIGGEST_PLEDGER, name: biggestPledger});
    dispatch({type: ActionTypes.SET_ROOM_TOTAL_SPENDINGS, amount: totalBalance});

    actionGetPayments(currentRoom)(dispatch);
    actionSendEvent("Payment sent", eventVariant.SUCCESS)(dispatch);
};

export const actionRemovePayment = (id: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const {currentRoom} = getState();

    let response;
    try {
        response = await client.mutate({
            mutation: removePaymentMutation,
            variables: {
                id: id
            },
            refetchQueries: [{
                query: getPaymentsQuery,
                variables: {
                    roomId: currentRoom.id
                },
            }]
        })
    } catch(error){
        console.log(error);
        return
    }
    actionUpdateState(currentRoom.id)(dispatch);
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


const actionJoinRoom = (room: Room_getRooms, password: string | undefined) => async (dispatch: Dispatch, getState: () => RootState) => {
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
            refetchQueries: [{
                query: getMatrixQuery,
                variables: {
                    roomId: variables.roomId
                }
            }],
        })
    } catch(error){
        console.log("catchuju error - join room", error);
        await actionResend(error, actionJoinRoom(room,password))(dispatch,getState);
        return
    }

    await actionGetUsersInRoom(variables.roomId)(dispatch);
    actionSendEvent(room.name+" joined", eventVariant.SUCCESS)(dispatch);
};

export const actionFireMenuEvent = (payload: formValues)  => async (dispatch: Dispatch, getState: () => RootState) => {
    const type = payload.type;
    try{
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
                    const id = getState().currentRoom.id;
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
    const { currentRoom } = getState();
    await actionSetCurrentRoom(currentRoom)(dispatch);
    await actionGetUsers()(dispatch);
};


export const actionCreateRoom = (name: string, password: string|undefined) => async (dispatch: Dispatch, getState: () => RootState) => {
    const {rooms} = getState();
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
    } catch(error){
        console.log(error);
        return
    }
    const newRoom = response.data.createRoom.room;
    const updatedRooms = [
        ...rooms,
        newRoom,
    ];
    dispatch({type: ActionTypes.SET_ROOMS, rooms: updatedRooms});
    dispatch({type: ActionTypes.SET_ACTIVE_ROOM, currentRoom: newRoom });
    console.log('nastavuju novou roomu na ', newRoom);
    actionSendEvent("Room "+name+" created", eventVariant.SUCCESS)(dispatch);
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
            refetchQueries: [{
                query: getMatrixQuery,
                variables: {
                    roomId: variables.roomId
                }
            }],
        })
    } catch(error){
        console.log(error);
        actionResend(error, actionAddUserToRoom(roomId,username, password))(dispatch, getState);
        return
    }
   actionSendEvent("User "+username+" was added to room", eventVariant.SUCCESS)(dispatch);
   await actionGetUsersInRoom(roomId)(dispatch)
};

export const actionSendEvent = (message: string, variant: eventVariant) => (dispatch: Dispatch) => {
    const eventProps: eventProps = {
        variant: variant,
        message: message,
    };
    dispatch({type: ActionTypes.SET_EVENT_PROPS, eventProps: eventProps});
    dispatch({type: ActionTypes.SET_EVENT_OPEN, eventOpen: true});

    setTimeout(()=>dispatch({type: ActionTypes.SET_EVENT_OPEN, eventOpen: false}), 3000)
};


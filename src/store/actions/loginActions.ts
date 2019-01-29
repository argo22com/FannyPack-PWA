import {Dispatch} from "redux";
import {client} from "../../api/client";
import {actionSendEvent, ActionTypes} from "./index";
import {createUserMutation, getAuthTokenMutation, verifyAuthToken} from "../../models/Mutations";
import {eventVariant} from "../../components/SnackBar";
import {agentType} from "../../models/CustomTypes";

export const actionCreateUser = (username: string, password: string, email: string) => async (dispatch: Dispatch) => {

    const variables = {
        username: username,
        password: password,
        email: email,
    };

    let response: any;
    try {
        response = await client.mutate({
            mutation: createUserMutation,
            variables : variables,
        })
    } catch(error){
        actionSendEvent("Username is taken", eventVariant.ERROR)(dispatch);
        console.log(error);
        return
    }
    await actionGetAuthToken(username, password)(dispatch);
};

export const actionGetAuthToken = (username: string, password: string) => async (dispatch: Dispatch) => {

    const variables = {
        username: username,
        password: password,
    };

    let response: any;
    try {
        response = await client.mutate({
            mutation: getAuthTokenMutation,
            variables : variables,
        })
    } catch(error){
        actionSendEvent("Incorrect credentials", eventVariant.ERROR)(dispatch);
        console.log(error);
        return
    }

    response = response.data.tokenAuth.token;
    console.log("token", response);

    localStorage.setItem('token', response);

    actionUserLogonStatus(true)(dispatch);
    await actionSetLoggedUser(username)(dispatch);
};

export const actionVerifyAuthToken = () => async (dispatch: Dispatch) => {

    const variables = {
        token: localStorage.getItem('token'),

    };
    let response: any;
    try {
        response = await client.mutate({
            mutation: verifyAuthToken,
            variables : variables,
        })
    } catch(error){
        actionSendEvent("Invalid token", eventVariant.ERROR)(dispatch);
        actionUserLogonStatus(false)(dispatch);
        console.log(error);
        return
    }

    response = response.data.verifyToken.payload.username;
    await actionSetLoggedUser(response)(dispatch);
    actionResolveUserAgent()(dispatch)
};

export const actionSetLoggedUser = (username: string) => (dispatch: Dispatch) => {
    dispatch({type: ActionTypes.SET_LOGGED_USER, user: username});
    actionUserLogonStatus(true)(dispatch);
};

export const actionUserLogonStatus = (logged: boolean) => (dispatch: Dispatch) => {
    if (!logged) {
        localStorage.removeItem('token')
    }
    dispatch({type: ActionTypes.SET_IS_LOGGED, isLogged: logged })
};

export const actionResolveUserAgent = () => async (dispatch: Dispatch) => {
    const agent = window.navigator.userAgent;

    if (agent.includes("Android")){
        dispatch({type: ActionTypes.SET_USER_AGENT, userAgent: agentType.ANDROID});
        return
    }
    if (agent.includes("iPhone")){
        dispatch({type: ActionTypes.SET_USER_AGENT, userAgent: agentType.IPHONE});
        return
    }
    if (agent.includes("iPad")){
        dispatch({type: ActionTypes.SET_USER_AGENT, userAgent: agentType.IPHONE});
        return
    }
};

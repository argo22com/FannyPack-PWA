import RootState from "../rootState";
import {AnyAction} from "redux";
import {ActionTypes} from "../actions";

const defaultState = new RootState({});

const rootReducer = (state: RootState = defaultState, action: AnyAction): RootState => {
    switch (action.type) {
        case ActionTypes.SET_INITIALIZED:
            return state.set("initialized", action.initialized);
        case ActionTypes.SET_ROOMS:
            return state.set("rooms", action.rooms);
        case ActionTypes.SET_ALL_USERS:
            return state.set("allUsers", action.users);
        case ActionTypes.SET_ACTIVE_ROOM:
            return state.set("currentRoom", action.currentRoom);
        case ActionTypes.SET_MATRIX:
            return state.set("matrix", action.matrix);
        case ActionTypes.SET_USERS_IN_CURRENT_ROOM:
            return state.set("usersInRoom", action.users);
        case ActionTypes.SET_ROOM_PAYMENTS:
            return state.set("roomPayments", action.payments);
        case ActionTypes.SET_ROOM_BIGGEST_PLEDGER:
            return state.set("roomPledger", action.name);
        case ActionTypes.SET_ROOM_TOTAL_SPENDINGS:
            return state.set("roomSpending", action.amount);
        case ActionTypes.SET_LOGGED_USER:
            return state.set("loggedUser", action.user);
        case ActionTypes.SET_IS_LOGGED:
            return state.set("isLogged", action.isLogged);
        case ActionTypes.SET_EVENT_PROPS:
            return state.set("eventProps", action.eventProps);
        case ActionTypes.SET_EVENT_OPEN:
            return state.set("eventOpen", action.eventOpen);
        case ActionTypes.CLICK_BUTTON_PAYMENT:
            return state.set("paymentWindowOpened", action.open);
        case ActionTypes.CLICK_MAIN_MENU:
            return state.set("mainMenuOpened", action.open);
        case ActionTypes.OPEN_MANAGEMENT_FORM:
            return state.set("managementFormOpened", action.open);
        case ActionTypes.SET_MANAGEMENT_FORM_TYPE:
            return state.set("managementFormType", action.formType);
        case ActionTypes.SET_USER_AGENT:
            return state.set("userAgent", action.userAgent);
        default:
            return state
    }
}

export default rootReducer

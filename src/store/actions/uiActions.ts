import {Dispatch} from "redux";
import {ActionTypes} from "./index";
import {menuItems} from "../../components/MainMenu";


export const actionAddPaymentButtonClick = (open: boolean) => (dispatch: Dispatch) => {
    dispatch({type: ActionTypes.CLICK_BUTTON_PAYMENT, open: open});
};

export const actionOpenMenu = (open: boolean) => (dispatch: Dispatch) => {
    dispatch({type: ActionTypes.CLICK_MAIN_MENU, open: open});
};

export const actionOpenManagementForm = (open: boolean) => (dispatch: Dispatch) => {
    dispatch({type: ActionTypes.OPEN_MANAGEMENT_FORM, open: open});
};

export const actionSetManagementFormType = (type: menuItems) => (dispatch: Dispatch) => {
    dispatch({type: ActionTypes.SET_MANAGEMENT_FORM_TYPE, formType: type});
};

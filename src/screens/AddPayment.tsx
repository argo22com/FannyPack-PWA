import * as React from "react";
import {FunctionComponent} from "react";
import RootState from "../store/rootState";
import {actionSendPayment} from "../store/actions";
import {connect} from "react-redux";
import Payment, {Transaction} from "../components/Payment";
import {Room_getRooms, Room_getRooms_users} from "../generated-models/generated-types";
import {actionAddPaymentButtonClick} from "../store/actions/uiActions";
import {agentType} from "../models/CustomTypes";

interface DispatchToProps {
    sendPayment: typeof actionSendPayment,
    clickAction: typeof actionAddPaymentButtonClick,
    openPaymentWindow: typeof actionAddPaymentButtonClick,
}

interface StateToProps {
    users: Room_getRooms_users[],
    loggedUser: string,
    currentRoom: Room_getRooms,
    shouldRender: boolean,
    agent: agentType
}

interface Props extends DispatchToProps, StateToProps {}


const AddPayment: FunctionComponent<Props> = (props:Props): JSX.Element => {

    if (!props.users.length){
        return <>LOADING</>
    }

    const dispatchPayment = (transactions: Transaction[]) => {
        props.clickAction(false);
        transactions.forEach(async (transaction: Transaction) => {
            await props.sendPayment(transaction)
        });
    };

    const getLoggedUser = () => {
        const loggedUser = props.users.find(user=>user.username===props.loggedUser);
        if (!loggedUser){
            return props.users[0]
        } else {
            return loggedUser
        }
    };


    return <Payment
        fullscreen={props.agent===agentType.ANDROID}
        open={props.shouldRender}
        onClose={props.openPaymentWindow}
        users={props.users}
        logged_user={getLoggedUser()}
        paymentAction={dispatchPayment}
    />

};

const mapStateToProps = (state: RootState): StateToProps => ({
    users: state.usersInRoom,
    loggedUser: state.loggedUser,
    currentRoom: state.currentRoom,
    shouldRender: state.paymentWindowOpened,
    agent: state.userAgent,
});

const mapDispatchToProps: DispatchToProps = {
    sendPayment: actionSendPayment,
    clickAction: actionAddPaymentButtonClick,
    openPaymentWindow: actionAddPaymentButtonClick,
};

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(AddPayment);

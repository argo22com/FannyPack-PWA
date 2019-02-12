import * as React from "react";
import {FunctionComponent} from "react";
import RootState from "../store/rootState";
import {actionSendPayment} from "../store/actions";
import {connect} from "react-redux";
import Payment, {Transaction} from "../components/Payment";
import {actionAddPaymentButtonClick} from "../store/actions/uiActions";
import {agentType} from "../models/CustomTypes";
import {UserBasicFragment} from "../generated-models/generated-types";

interface DispatchToProps {
    sendPayment: typeof actionSendPayment,
    clickAction: typeof actionAddPaymentButtonClick,
    openPaymentWindow: typeof actionAddPaymentButtonClick,
}

interface StateToProps {
    loggedUser: string | null,
    currentRoomId: string | null,
    shouldRender: boolean,
    agent: agentType
}

interface Props extends DispatchToProps, StateToProps {
}


const AddPayment: FunctionComponent<Props> = (props: Props): JSX.Element => {

    const users: UserBasicFragment[] = [];

    if (!users.length) {
        return <>LOADING</>
    }

    const dispatchPayment = (transactions: Transaction[]) => {
        props.clickAction(false);
        transactions.forEach(async (transaction: Transaction) => {
            await props.sendPayment(transaction)
        });
    };

    const getLoggedUser = () => {
        const loggedUser = users.find(user => user.username === props.loggedUser);
        if (!loggedUser) {
            return users[0]
        } else {
            return loggedUser
        }
    };


    return <Payment
        fullscreen={props.agent === agentType.ANDROID}
        open={props.shouldRender}
        onClose={props.openPaymentWindow}
        users={users}
        logged_user={getLoggedUser()}
        paymentAction={dispatchPayment}
    />

};

const mapStateToProps = (state: RootState): StateToProps => ({
    loggedUser: state.loggedUser,
    currentRoomId: state.currentRoomId,
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

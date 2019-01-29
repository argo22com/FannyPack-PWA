import RootState from "../store/rootState";
import {connect} from "react-redux";
import * as React from "react";
import {FunctionComponent, useState} from "react";
import RoomDetailCard from "../components/RoomDetail";
import {getPayments_getPayments, Room_getRooms} from "../generated-models/generated-types";
import {actionGetPayments, actionRemovePayment} from "../store/actions";
import ActionConfirm from "../components/ActionConfirm";

interface StateToProps {
    currentRoom: Room_getRooms,
    payments: getPayments_getPayments[],
    biggestPledger: string,
    totalSpending: number,
}

interface DispatchToProps {
    removePaymentAction: typeof actionRemovePayment,
    refetchPayments: typeof actionGetPayments,
}

interface Props extends StateToProps, DispatchToProps {}

const RoomInfo: FunctionComponent<Props>| any = (props:Props) =>{

    const [open, setOpen] = useState(false);
    const [deleteId, setdeleteId] = useState("");

    const handleDeleteClick = (id: string) => {
        setdeleteId(id);
        setOpen(true);

    };

    const onClose = () => {
        setOpen(false);
    };

    const removePayment = async () => {
        await props.removePaymentAction(deleteId);
        props.refetchPayments(props.currentRoom)
    };

    return (
        <>
        <RoomDetailCard
            name={props.currentRoom.name}
            pledger={props.biggestPledger}
            totalMoney={props.totalSpending}
            payments={props.payments}
            onRemovePayment={handleDeleteClick}
        />
        <ActionConfirm
            open={open}
            title={"Are you sure?"}
            text={"this action is non reversible"}
            confirmAction={removePayment}
            onClose={onClose}
        />
        </>
    );
};

const mapStateToProps = (state: RootState): StateToProps => ({
    currentRoom: state.currentRoom,
    payments: state.roomPayments,
    biggestPledger: state.roomPledger,
    totalSpending: state.roomSpending,
});

const mapDispatchToProps: DispatchToProps = {
    removePaymentAction: actionRemovePayment,
    refetchPayments: actionGetPayments,
};

export default connect(mapStateToProps, mapDispatchToProps)(RoomInfo);

import RootState from "../store/rootState";
import {connect} from "react-redux";
import * as React from "react";
import {FunctionComponent, useState} from "react";
import RoomDetailCard from "../components/RoomDetail";
import {actionRemovePayment} from "../store/actions";
import ActionConfirm from "../components/ActionConfirm";
import {withMeGraphql} from "../models/withMe";
import {MeQuery} from "../generated-models/generated-types";
import {QueryProps} from "react-apollo";

interface StateToProps {
    currentRoomId: string | null,
}

interface DispatchToProps {
    removePaymentAction: typeof actionRemovePayment,
}

interface Props extends StateToProps, DispatchToProps {
    me: MeQuery | QueryProps
}

const RoomInfo: FunctionComponent<Props> | any = (props: Props) => {

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
    };

    return (
        <>
            {props.currentRoomId ? (
                <RoomDetailCard
                    id={props.currentRoomId}
                    onRemovePayment={handleDeleteClick}
                />
            ) : null}
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
    currentRoomId: state.currentRoomId,
});

const mapDispatchToProps: DispatchToProps = {
    removePaymentAction: actionRemovePayment,
};

export default connect(mapStateToProps, mapDispatchToProps)(withMeGraphql()(RoomInfo));

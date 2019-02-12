import * as React from 'react';
import {connect} from "react-redux";
import RootState from "../store/rootState";
import CustomizedSnackbar, {eventVariant} from "../components/SnackBar";

export interface eventProps{
    message: string
    variant: eventVariant,
}

interface StateToProps {
    eventOpen: boolean,
    eventProps: eventProps
}

interface Props extends StateToProps {
}

const EventHandler = (props: Props) =>
    <CustomizedSnackbar
        open={props.eventOpen}
        message={props.eventProps ? props.eventProps.message : ''}
        variant={props.eventProps ? props.eventProps.variant : eventVariant.INFO}
    />;


const mapStateToProps = (state: RootState): StateToProps => ({
    eventOpen: state.eventOpen,
    eventProps: state.eventProps,
});


export default connect(mapStateToProps)(EventHandler);

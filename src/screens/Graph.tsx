import * as React from 'react';
import DebtsGraph from "../components/DebtsGraph";
import {withRoomGraphql} from "../models/withRoom";
import {Omit} from "react-redux";
import {withMeGraphql} from "../models/withMe";
import {MeQuery, RoomQuery, RoomQueryVariables} from "../generated-models/generated-types";
import {QueryResult} from "react-apollo";

interface StateToProps {
    // matrix: object,
}

interface Props extends StateToProps {
    id: string,
    data: RoomQuery & QueryResult<RoomQuery, RoomQueryVariables>
    me: MeQuery & QueryResult
}

const Graph = (props: Props) => {
    if (!props.data || !props.data.room) {
        return null;
    }

    return (
        <div style={{display: 'flex', flex: '2 1 0'}}>
            <DebtsGraph room={props.data.room} height={'300'}/>
        </div>
    );
};

export default withRoomGraphql<Omit<Props, 'me'>>()(withMeGraphql<Props>()(Graph));

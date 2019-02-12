import {graphql} from "react-apollo";
import {roomQuery} from "./Queries";
import {RoomQuery, RoomQueryVariables} from "../generated-models/generated-types";
import {Omit} from "react-redux";

export const withRoomGraphql = <TProps>() => graphql<Omit<TProps & { id: string, data: RoomQuery }, 'data'>, RoomQuery, RoomQueryVariables>(
    roomQuery,
    {
        skip: props => !props.id,
        options: props => ({
            variables: {
                id: props.id,
            }
        })
    }
);

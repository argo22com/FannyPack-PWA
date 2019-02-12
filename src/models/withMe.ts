import {graphql} from "react-apollo";
import {meQuery} from "./Queries";
import {Omit} from "react-redux";
import {MeQuery} from "../generated-models/generated-types";


export const withMeGraphql = <TProps>() => graphql<Omit<TProps & { me: MeQuery }, 'me'>, MeQuery>(
    meQuery,
    {
        name: "me",
        options: {
            fetchPolicy: 'cache-first'
        }
    }
);

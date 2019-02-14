import gql from "graphql-tag";

export const addPaymentMutationGql = gql`
    mutation PaymentAdd($pledgerId: ID!, $name: String!, $roomId: ID!, $splits: [SplitInputType]!, $datetime: DateTime!) {
        paymentCreate (
            input: {
                pledgerId: $pledgerId,
                roomId: $roomId,
                name: $name,
                splits: $splits,
                datetime: $datetime
            }
        ) {
            payment {
                id
            }
        }
    }
`;

export const removePaymentMutationGql = gql`
    mutation PaymentRemove($id: ID!){
        paymentDelete(input: {id: $id}){
            success
        }
    }
`;

export const createRoomMutationGql = gql`
    mutation RoomCreate ($name: String!){
        roomCreate(input: {name: $name}) {
            room{
                id
                name
            }
        }
    }
`;


export const addUserToRoomMutationGql = gql`
    mutation RoomAddUser($roomId: ID!, $userId: ID!, $secret: String) {
        roomAddUser(input: {userId: $userId, roomId: $roomId, secret: $secret}){
            user{
                id
                username
            }
        }
    }
`;

export const createUserMutationGql = gql`
    mutation UserCreate($username: String!, $password: String!, $email: String!) {
        userCreate(input: {username: $username, password: $password, email: $email}){
            user{
                id
                username
            }
        }
    }
`;

export const getAuthTokenMutationGql = gql`
    mutation TokenGet($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password){
            token
        }
    }
`;

export const verifyAuthTokenGql = gql`
    mutation TokenVerify($token: String!) {
        verifyToken(token: $token){
            payload
        }
    }
`;

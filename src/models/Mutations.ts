import gql from "graphql-tag";

export const addPaymentMutation = gql`
    mutation addPayment($pledgerId: ID!, $name: String!, $roomId: ID!, $splits: [SplitInputType]!, $datetime: DateTime!) {
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

export const removePaymentMutation = gql`
    mutation deletePayment($id: ID!){
        paymentDelete(input: {id: $id}){
            success
        }
    }
`;

export const createRoomMutation = gql`
    mutation createRoom($name: String!){
        roomCreate(input: {name: $name}) {
            room {
                id
                name
            }
        }
    }
`;


export const addUserToRoomMutation = gql`
    mutation addUserToRoom($roomId: ID!, $userId: ID!, $secret: String) {
        roomAddUser(input: {userId: $userId, roomId: $roomId, secret: $secret}){
            user{
                id
                username
            }
        }
    }
`;

export const createUserMutation = gql`
    mutation createUser($username: String!, $password: String!, $email: String!) {
        userCreate(input: {username: $username, password: $password, email: $email}){
            user{
                id
                username
            }
        }
    }
`;

export const getAuthTokenMutation = gql`
    mutation tokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password){
            token
        }
    }
`;

export const verifyAuthToken = gql`
    mutation verifyToken($token: String!) {
        verifyToken(token: $token){
            payload
        }
    }
`;

import gql from "graphql-tag";

export const addPaymentMutation = gql`
    mutation addPayment($drawee: String!, $pledger: String!, $name: String!, $roomId: String!, $amount: Float!) {
      makePayment(
        drawee: $drawee,
        pledger: $pledger,
        roomId: $roomId,
        amount: $amount,
        name: $name,
      ) {
        matrix {
          matrix
          totalBalance
          biggestPledger
        }
        }
    }
`;

export const removePaymentMutation = gql`
    mutation deletePayment($id: String!){
      deletePayment(id: $id){
        message
      }
    }
`;

export const createRoomMutation = gql`
    mutation createRoom($name: String!){
       createRoom(name: $name) {
         room {
           id
           name
         }
       }
    }
`;


export const addUserToRoomMutation = gql`
    mutation addUserToRoom($roomId: String!, $username: String!, $secret: String) {
       addUserToRoom(username: $username, roomId: $roomId, secret: $secret){
        user{
           id
           username
           rooms{
             id
             name
           }    
        }  
   }
 }
`;

export const createUserMutation = gql`
    mutation createUser($username: String!, $password: String!, $email: String!) {
       createUser(username: $username, password: $password, email: $email){
        user{
           id
           username
           balance    
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

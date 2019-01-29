import gql from "graphql-tag";

export const getRoomsQuery = gql`
    query Room {
      getRooms {
        id
        name
        secret
      }
    }
`;

export const getUsersQuery = gql`
    query{
      users{
        id
        username
        rooms {
            id
            name
            secret
        }
      }
    }
`;

export const getUsersInRoomQuery = gql`
    query getUsersInRoom($roomId: String!){
        users(roomId: $roomId){
            id
            username
            balance
        }
    }
`;


export const getMatrixQuery = gql`
    query getMatrix($roomId: String!){
        room(roomId: $roomId){
            matrix
            totalBalance
            biggestPledger
        }
     }
`;

export const getPaymentsQuery = gql`
    query getPayments($roomId: String!){
      getPayments(roomId:$roomId){
        id
        drawee{
          username
        }
        pledger{
          username
        }
        amount
        date
        name
      }
}
`;

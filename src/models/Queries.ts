import gql from "graphql-tag";

const roomBasicFragment = gql`
    fragment RoomBasic on RoomNode {
        id
        name
    }
`;
export const meQuery = gql`
    query Me {
        me {
            id
            username
            email
            rooms {
                edges {
                    node {
                        ...RoomBasic
                    }
                }
            }
        }
    }
    ${roomBasicFragment}
`;

const userBasicFragment = gql`
    fragment UserBasic on UserNode {
        id
        username
    }
`;

const paymentFragment = gql`
    fragment Payment on PaymentNode {
        id
        date
        name
        amount
        pledger {
            ...UserBasic
        }
        splitSet {
            edges {
                node {
                    id
                    amount
                    user {
                        ...UserBasic
                    }
                }
            }
        }
    }
    ${userBasicFragment}
`

export const roomQuery = gql`
    query Room ($id: ID!) {
        room(id: $id) {
            id
            name
            paymentSet {
                edges {
                    node {
                        ...Payment
                    }
                }
            }
            userSet {
                edges {
                    node {
                        ...UserBasic
                    }
                }
            }
            balances {
                debts
                payments
                balance
                user {
                    ...UserBasic
                }
            }
            resolution {
                payer {
                    ...UserBasic
                }
                recipient {
                    ...UserBasic
                }
                amount
            }
            
        }
    }
    ${userBasicFragment}
    ${paymentFragment}
`;

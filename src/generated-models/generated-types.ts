/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface SplitInputType {
  userId: string,
  amount: number,
};

export interface addPaymentMutationVariables {
  pledgerId: string,
  name: string,
  roomId: string,
  splits: Array< SplitInputType | null >,
  datetime: string,
};

export interface addPaymentMutation {
  paymentCreate:  {
    __typename: "PaymentCreateMutationPayload",
    payment:  {
      __typename: "PaymentNode",
      // The ID of the object.
      id: string,
    } | null,
  } | null,
};

export interface deletePaymentMutationVariables {
  id: string,
};

export interface deletePaymentMutation {
  paymentDelete:  {
    __typename: "PaymentDeleteMutationPayload",
    success: boolean | null,
  } | null,
};

export interface createRoomMutationVariables {
  name: string,
};

export interface createRoomMutation {
  roomCreate:  {
    __typename: "RoomCreateMutationPayload",
    room:  {
      __typename: "RoomNode",
      // The ID of the object.
      id: string,
      name: string,
    } | null,
  } | null,
};

export interface addUserToRoomMutationVariables {
  roomId: string,
  userId: string,
  secret?: string | null,
};

export interface addUserToRoomMutation {
  roomAddUser:  {
    __typename: "RoomAddUserMutationPayload",
    user:  {
      __typename: "UserNode",
      // The ID of the object.
      id: string,
      // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
      username: string,
    } | null,
  } | null,
};

export interface createUserMutationVariables {
  username: string,
  password: string,
  email: string,
};

export interface createUserMutation {
  userCreate:  {
    __typename: "UserCreateMutationPayload",
    user:  {
      __typename: "UserNode",
      // The ID of the object.
      id: string,
      // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
      username: string,
    } | null,
  } | null,
};

export interface tokenAuthMutationVariables {
  username: string,
  password: string,
};

export interface tokenAuthMutation {
  tokenAuth:  {
    __typename: "ObtainJSONWebToken",
    token: string | null,
  } | null,
};

export interface verifyTokenMutationVariables {
  token: string,
};

export interface verifyTokenMutation {
  verifyToken:  {
    __typename: "Verify",
    payload: string | null,
  } | null,
};

export interface MeQuery {
  me:  {
    __typename: "UserNode",
    // The ID of the object.
    id: string,
    // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
    username: string,
    email: string,
    rooms:  {
      __typename: "RoomNodeConnection",
      edges:  Array< {
        __typename: "RoomNodeEdge",
        // The item at the end of the edge
        node:  {
          __typename: "RoomNode",
          // The ID of the object.
          id: string,
          name: string,
        } | null,
      } | null >,
    } | null,
  } | null,
};

export interface RoomQueryVariables {
  id: string,
};

export interface RoomQuery {
  // The ID of the object
  room:  {
    __typename: "RoomNode",
    // The ID of the object.
    id: string,
    name: string,
    paymentSet:  {
      __typename: "PaymentNodeConnection",
      edges:  Array< {
        __typename: "PaymentNodeEdge",
        // The item at the end of the edge
        node:  {
          __typename: "PaymentNode",
          // The ID of the object.
          id: string,
          date: string,
          name: string,
          amount: number,
          pledger:  {
            __typename: "UserNode",
            // The ID of the object.
            id: string,
            // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
            username: string,
          },
          splitSet:  {
            __typename: "SplitNodeConnection",
            edges:  Array< {
              __typename: "SplitNodeEdge",
              // The item at the end of the edge
              node:  {
                __typename: "SplitNode",
                // The ID of the object.
                id: string,
                amount: number,
                user:  {
                  __typename: "UserNode",
                  // The ID of the object.
                  id: string,
                  // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
                  username: string,
                },
              } | null,
            } | null >,
          } | null,
        } | null,
      } | null >,
    } | null,
    userSet:  {
      __typename: "UserNodeConnection",
      edges:  Array< {
        __typename: "UserNodeEdge",
        // The item at the end of the edge
        node:  {
          __typename: "UserNode",
          // The ID of the object.
          id: string,
          // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
          username: string,
        } | null,
      } | null >,
    } | null,
    balances:  Array< {
      __typename: "BalanceType",
      debts: number,
      payments: number,
      // Positive = how much the user owes to the room. Negative = user has to get this amount to be fine
      balance: number,
      user:  {
        __typename: "UserNode",
        // The ID of the object.
        id: string,
        // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
        username: string,
      },
    } | null >,
    resolution:  Array< {
      __typename: "ResolutionStepType",
      payer:  {
        __typename: "UserNode",
        // The ID of the object.
        id: string,
        // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
        username: string,
      },
      recipient:  {
        __typename: "UserNode",
        // The ID of the object.
        id: string,
        // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
        username: string,
      },
      amount: number,
    } | null >,
  } | null,
};

export interface RoomBasicFragment {
  __typename: "RoomNode",
  // The ID of the object.
  id: string,
  name: string,
};

export interface UserBasicFragment {
  __typename: "UserNode",
  // The ID of the object.
  id: string,
  // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
  username: string,
};

export interface PaymentFragment {
  __typename: "PaymentNode",
  // The ID of the object.
  id: string,
  date: string,
  name: string,
  amount: number,
  pledger:  {
    __typename: "UserNode",
    // The ID of the object.
    id: string,
    // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
    username: string,
  },
  splitSet:  {
    __typename: "SplitNodeConnection",
    edges:  Array< {
      __typename: "SplitNodeEdge",
      // The item at the end of the edge
      node:  {
        __typename: "SplitNode",
        // The ID of the object.
        id: string,
        amount: number,
        user:  {
          __typename: "UserNode",
          // The ID of the object.
          id: string,
          // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
          username: string,
        },
      } | null,
    } | null >,
  } | null,
};



/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getMatrix
// ====================================================

export interface getMatrix_room {
  __typename: "RoomType";
  matrix: string;
}

export interface getMatrix {
  room: getMatrix_room | null;
}

export interface getMatrixVariables {
  roomName: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getPayments
// ====================================================

export interface getPayments_getPayments_drawee {
  __typename: "UserType";
  username: string;  // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
}

export interface getPayments_getPayments_pledger {
  __typename: "UserType";
  username: string;  // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
}

export interface getPayments_getPayments {
  __typename: "PaymentType";
  id: any;
  drawee: getPayments_getPayments_drawee;
  pledger: getPayments_getPayments_pledger;
  amount: number;
  date: any;
  name: string;
}

export interface getPayments {
  getPayments: (getPayments_getPayments | null)[] | null;
}

export interface getPaymentsVariables {
  roomName: string;
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Room
// ====================================================

export interface Room_getRooms_users {
  __typename: "UserType";
  id: number,
  username: string;  // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
  rooms: Room_getRooms[],
  balance: number,
}

export interface Room_getRooms_balanceSet_user {
  __typename: "UserType";
  username: string;  // Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
}

export interface Room_getRooms_balanceSet_room {
  __typename: "RoomType";
  name: string;
}

export interface Room_getRooms_balanceSet {
  __typename: "BalanceType";
  user: Room_getRooms_balanceSet_user;
  balance: number;
  totalBalance: number;
  room: Room_getRooms_balanceSet_room;
}

export interface Room_getRooms {
  __typename: "RoomType";
  id: any;
  name: string;
  secret?: string;
}

export interface Room {
  getRooms: (Room_getRooms | null)[] | null;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================

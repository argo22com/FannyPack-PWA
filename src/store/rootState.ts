import {Record} from "immutable";
import {getPayments_getPayments, Room_getRooms, Room_getRooms_users} from "../generated-models/generated-types";
import {menuItems} from "../components/MainMenu";
import {eventProps} from "../screens/EventHandler";
import {agentType} from "../models/CustomTypes";

export interface IState {
    initialized: boolean,
    loggedUser: string,
    isLogged: boolean,
    allUsers: Room_getRooms_users[],
    currentRoom: Room_getRooms,
    matrix: object,
    rooms: Room_getRooms[],
    usersInRoom: Room_getRooms_users[],
    roomPayments: getPayments_getPayments[],
    roomPledger: string,
    roomSpending: number,
    eventProps: eventProps,
    eventOpen: boolean,
    paymentWindowOpened: boolean,
    mainMenuOpened: boolean,
    managementFormOpened: boolean,
    managementFormType: menuItems,
    userAgent: agentType
}

const RootStateRecord = Record({
    initialized: false,
    loggedUser: "",
    isLogged: false,
    allUsers: {},
    currentRoom: {},
    matrix: {},
    rooms: {},
    usersInRoom: {},
    roomPayments: {},
    roomPledger: "",
    roomSpending: 0,
    eventProps: {},
    eventOpen: false,
    paymentWindowOpened: false,
    mainMenuOpened: false,
    managementFormOpened: false,
    managementFormType: menuItems.addRoom,
    userAgent: agentType.DEFAULT,
});

export default class RootState extends RootStateRecord implements IState {

    readonly initialized: boolean;
    readonly loggedUser: string;
    readonly isLogged: boolean;
    readonly allUsers: Room_getRooms_users[];
    readonly rooms: Room_getRooms[];
    readonly currentRoom: Room_getRooms;
    readonly matrix: object;
    readonly usersInRoom: Room_getRooms_users[];
    readonly roomPayments: getPayments_getPayments[];
    readonly roomPledger: string;
    readonly roomSpending: number;
    readonly eventProps: eventProps;
    readonly eventOpen: boolean;
    readonly paymentWindowOpened: boolean;
    readonly mainMenuOpened: boolean;
    readonly managementFormOpened: boolean;
    readonly managementFormType: menuItems;
    readonly userAgent: agentType;

    constructor(props: Partial<IState>) {
        super(props);
    }

    // This following line is the magic. It overrides the "get" method of record
    // and lets typescript know the return type based on our IFruitParams interface
    get<T extends keyof IState>(value: T): IState[T] {
        // super.get() is mapped to the original get() function on Record
        return super.get(value);
    }
}

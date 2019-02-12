import {Record} from "immutable";
import {menuItems} from "../components/MainMenu";
import {eventProps} from "../screens/EventHandler";
import {agentType} from "../models/CustomTypes";

export interface IState {
    initialized: boolean,
    loggedUser: string | null,
    isLogged: boolean,
    currentRoomId: string | null,
    eventProps: eventProps | null,
    eventOpen: boolean,
    paymentWindowOpened: boolean,
    mainMenuOpened: boolean,
    managementFormOpened: boolean,
    managementFormType: menuItems,
    userAgent: agentType
}

const RootStateRecord = Record({
    initialized: false,
    loggedUser: null,
    isLogged: false,
    currentRoomId: null,
    eventProps: null,
    eventOpen: false,
    paymentWindowOpened: false,
    mainMenuOpened: false,
    managementFormOpened: false,
    managementFormType: menuItems.addRoom,
    userAgent: agentType.DEFAULT,
} as IState);

export default class RootState extends RootStateRecord implements IState {

    readonly initialized: boolean;
    readonly loggedUser: string | null;
    readonly isLogged: boolean;
    readonly currentRoomId: string | null;
    readonly eventProps: eventProps | null;
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

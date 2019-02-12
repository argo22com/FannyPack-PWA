import RootState from "../store/rootState";
import {connect} from "react-redux";
import * as React from "react";
import {FunctionComponent} from "react";
import MainMenu, {menuItems} from "../components/MainMenu";
import {actionOpenManagementForm, actionOpenMenu, actionSetManagementFormType} from "../store/actions/uiActions";
import ManagementForm, {formValues} from "../components/ManagementForm";
import {actionFireMenuEvent} from "../store/actions";
import {agentType} from "../models/CustomTypes";
import {MeQuery, RoomBasicFragment, UserBasicFragment} from "../generated-models/generated-types";
import {QueryResult} from "react-apollo";
import {withMeGraphql} from "../models/withMe";

interface StateToProps {
    loggedUser: string,
    menuOpened: boolean,
    managementFormOpened: boolean,
    managementFormType: menuItems,
    agent: agentType,
}

interface DispatchToProps {
    openMenu: typeof actionOpenMenu,
    openManagementForm: typeof actionOpenManagementForm,
    setManagementFormType: typeof actionSetManagementFormType,
    menuAction: typeof actionFireMenuEvent,
}

interface Props extends StateToProps, DispatchToProps {
    me: MeQuery & QueryResult,
}

const Menu: FunctionComponent<Props> = (props: Props) => {

    if (!props.me.me) {
        return <>Loading Menu</>
    }

    const handleOpenMenu = (toggle: boolean) => () => {
        props.openMenu(toggle);
    };

    const handleClick = (item: menuItems) => {
        console.log(item);
        props.setManagementFormType(item);
        props.openManagementForm(!props.managementFormOpened);
        props.openMenu(false);
    };

    const handleSubmit = (values: formValues) => {
        props.openManagementForm(false);
        props.menuAction(values);
    };

    const handleCancel = () => {
        props.openManagementForm(false);
    };

    const getFreeUsers = () => {
        return resultFilter([], []);
    };

    const getRoomsToJoin = () => {
        return [] as RoomBasicFragment[];
    };

    const resultFilter = (firstArray: UserBasicFragment[], secondArray: UserBasicFragment[]) => {
        if (!secondArray.length) {
            return []
        }
        return firstArray.filter(firstArrayItem =>
            !secondArray.some(
                secondArrayItem => firstArrayItem.username === secondArrayItem.username
            )
        );
    };

    return (
        <>
            <MainMenu open={props.menuOpened} toggle={handleOpenMenu} onClick={handleClick} balance={'350'}
                      loggedUser={props.loggedUser}/>
            <ManagementForm
                open={props.managementFormOpened}
                header={props.managementFormType}
                submitAction={handleSubmit}
                cancelAction={handleCancel}
                allUsers={[]}
                freeUsers={getFreeUsers()}
                roomsToJoin={getRoomsToJoin()}
                fullscreen={props.agent === agentType.ANDROID}
            />
        </>
    );
};

const mapStateToProps = (state: RootState): StateToProps => ({
    menuOpened: state.mainMenuOpened,
    managementFormOpened: state.managementFormOpened,
    managementFormType: state.managementFormType,
    loggedUser: state.loggedUser,
    agent: state.userAgent,
});

const mapDispatchToProps: DispatchToProps = ({
    openMenu: actionOpenMenu,
    openManagementForm: actionOpenManagementForm,
    menuAction: actionFireMenuEvent,
    setManagementFormType: actionSetManagementFormType,
});

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(withMeGraphql()(Menu));

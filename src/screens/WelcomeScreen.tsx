import {connect} from "react-redux";
import * as React from "react";
import {FunctionComponent} from "react";
import WelcomeView from "../components/WelcomeView";
import {actionOpenManagementForm, actionSetManagementFormType} from "../store/actions/uiActions";
import {menuItems} from "../components/MainMenu";

interface DispatchToProps {
    openManagementForm: typeof actionOpenManagementForm,
    setManagementFormType: typeof actionSetManagementFormType,
}

interface Props extends DispatchToProps {}

const WelcomeScreen: FunctionComponent<Props>| any = (props:Props) =>{

    const handleCreate = () => {
        props.openManagementForm(true);
        props.setManagementFormType(menuItems.addRoom);
    };

    const handleJoin = () => {
        props.openManagementForm(true);
        props.setManagementFormType(menuItems.joinRoom);
    };

    return (
        <WelcomeView onClickCreate={handleCreate} onClickJoin={handleJoin} />
    );
};

const mapDispatchToProps: DispatchToProps = {
    openManagementForm: actionOpenManagementForm,
    setManagementFormType: actionSetManagementFormType,
};

export default connect(null, mapDispatchToProps)(WelcomeScreen);

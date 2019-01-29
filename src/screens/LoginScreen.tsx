import {connect} from "react-redux";
import * as React from "react";
import {FunctionComponent} from "react";
import Login, {LoginForm} from "../components/Login";
import {actionCreateUser, actionGetAuthToken, actionSetLoggedUser} from "../store/actions/loginActions";

interface DispatchToProps {
    signInAction: typeof actionGetAuthToken,
    signUpAction: typeof actionCreateUser,
    setLoggedUser: typeof actionSetLoggedUser,
}

interface Props extends DispatchToProps {}

const LoginScreen: FunctionComponent<Props>| any = (props:Props) =>{

    const handleSignIn = (values: LoginForm) => {
        props.signInAction(values.username, values.password)
    };

    const handleSignUp = (values: LoginForm) => {
        props.signUpAction(values.username, values.password, values.email)
    };

    return (
        <Login onSignIn={handleSignIn} onSignUp={handleSignUp} />
    );
};

const mapDispatchToProps: DispatchToProps = {
    signInAction: actionGetAuthToken,
    signUpAction: actionCreateUser,
    setLoggedUser: actionSetLoggedUser,
};

export default connect(null, mapDispatchToProps)(LoginScreen);

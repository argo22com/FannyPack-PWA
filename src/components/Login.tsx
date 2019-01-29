import * as React from 'react';
import {useState} from 'react';
import Button from "@material-ui/core/Button/Button";
import Input from "@material-ui/core/Input/Input";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Typography from "@material-ui/core/Typography/Typography";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Paper from "@material-ui/core/Paper/Paper";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {Theme} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";

const styles = (theme: Theme) => (createStyles({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
}));

export interface LoginForm {
    email: string,
    username: string,
    password: string
}

interface Props extends WithStyles<typeof styles> {
    onSignIn: (values: LoginForm) => void,
    onSignUp: (values: LoginForm) => void,
}

const Login = (props: Props) => {
    const [exists, setExists] = useState(true);
    const [formValues, setFormValues] = useState<LoginForm>({
        email: "", username: "", password: ""
    });

    const {classes} = props;

    const handleRegister = () => {
        if (exists) {
            setExists(false);
            console.log("prepinam")
        } else {
            console.log("register");
            console.log("form: ", formValues);
            props.onSignUp(formValues);
        }

    };

    const handleSignIn = (e: any) => {
        e.preventDefault();
        console.log("signing in");
        props.onSignIn(formValues)
    };

    const handleChange = (name: string) => (e: any) => {
        setFormValues({
            ...formValues,
            [name]: e.target.value
        });
        console.log(formValues)
    };


    return (
        <main className={classes.main}>
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    {exists ? "Sign in" : "Sign up"}
                </Typography>
                <form className={classes.form}>
                    {!exists && <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <Input id="email" name="email" onChange={handleChange('email')} autoComplete="email" autoFocus/>
                    </FormControl>}
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input id="username" name="username" onChange={handleChange('username')} autoComplete="username"
                               autoFocus/>
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input name="password" type="password" id="password" onChange={handleChange('password')}
                               autoComplete="current-password"/>
                    </FormControl>
                    {exists && <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        onClick={handleSignIn}
                    >
                        Sign in
                    </Button>}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        className={classes.submit}
                        onClick={handleRegister}
                    >
                        Sign up
                    </Button>
                </form>
            </Paper>
        </main>
    );
};

export default withStyles(styles)(Login);

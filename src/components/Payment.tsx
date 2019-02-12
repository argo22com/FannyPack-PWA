import * as React from "react";
import {FunctionComponent, useRef, useState} from "react";
import withStyles, {WithStyles} from "@material-ui/core/styles/withStyles";
import {Theme} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Chip from "@material-ui/core/Chip/Chip";
import Input from "@material-ui/core/Input/Input";
import Select from "@material-ui/core/Select/Select";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import FormControl from "@material-ui/core/FormControl/FormControl";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import Button from "@material-ui/core/Button/Button";
import Selection from "./MultiSelection";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import {UserBasicFragment} from "../generated-models/generated-types";

export type Transaction = {
    name: string,
    drawee: UserBasicFragment,
    pledger: UserBasicFragment,
    amount: number,
}


const styles = (theme: Theme) => (createStyles({
    dialog: {
        padding: theme.spacing.unit,
        overflow: 'auto',
        margin: '0 auto',
        minWidth: '40%',
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
    },
    textField: {
        margin: theme.spacing.unit,
        maxWidth: 300,
    },
    label: {
        margin: theme.spacing.unit,
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
        maxWidth: 300,
    },
    option: {
        fontWeight: theme.typography.fontWeightRegular
    },
    optionSelected: {
        fontWeight: theme.typography.fontWeightMedium
    },
    pledgers: {
        maxWidth: 300,
        display: 'flex',
        flexFlow: 'row',
        flexWrap:  'wrap',
        justifyContent: 'space-evenly'
    },
    pledgerField: {
        margin: theme.spacing.unit,
        maxWidth: '30%',
    },
    title: {
        paddingBottom: 0,
        textAlign: 'center',
        color: theme.palette.primary.main,
    }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface Props extends WithStyles<typeof styles> {
    logged_user: UserBasicFragment,
    users: UserBasicFragment[],
    paymentAction: (transactions: Transaction[]) => void,
    open: boolean,
    fullscreen: boolean,
    onClose: (open: boolean) => void,
}

interface Payment {
    [userID: number]: number,
}

const Payment: FunctionComponent<Props> = (props: Props) => {

    if (!props) {
        return <>Loading PAYMENT</>
    }

    // state
    const [paymentName, setPaymentName] = useState('');
    const [amount, setAmount] = useState(0);
    const [selectedUsernames, setSelectedUsersnames] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<UserBasicFragment[]>([]);
    const [split, setSplit] = useState(false);
    const [payments, setPayments] = useState<Payment>([]);

    const {classes, users} = props;
    const childRef = useRef(null);


    const updatePayments = () => {
        const pledgers = selectedUsers;
        const noPledgers = pledgers.length;

        if (noPledgers === 0) return;

        let newPayments: Payment = [];
        pledgers.forEach((user) => {
            if (!split) {
                const figure = amount / noPledgers;
                newPayments[user.id] = parseFloat(figure.toFixed(2));
            } else {

            }
        });
        setPayments(newPayments);
    };

    const updateSelectedUsers = (usernames: string[]) => {

        let userObjs: UserBasicFragment[] = [];
        usernames.forEach((username: string) => {
            const userObj = users.find((user) => (user.username === username));

            if (!userObj) {
                throw Error("Cannot find user with name " + username);
            }
            userObjs.push(userObj);
        });

        setSelectedUsers(userObjs);
    };

    const checkClearToSend = () => {
        const name = paymentName.length > 0;
        const figure = amount > 0;
        const users = selectedUsers.length > 0;
        let sum = 0;
        for (let paymentId in payments) {
            sum += payments[paymentId]
        }
        const figures = Math.abs(sum - amount) < 0.1;

        return name && figure && users && figures
    };

    const handleChange = (name: string, val?: any) => (event: any) => {

        switch (name) {
            case 'name': {
                const name = event.target.value;
                setPaymentName(name);
                break;
            }
            case 'amount': {
                const amount = event.target.value;
                const figure = parseFloat(parseFloat(amount).toFixed(2));
                if (isNaN(figure)) {
                    break;
                }
                console.log('pohoda');
                setAmount(parseFloat(amount));
                break;
            }
            case 'paymentAmount': {
                const amount = event.target.value;
                const figure = parseFloat(parseFloat(amount).toFixed(2));
                console.log('figure payment', figure);
                if (isNaN(figure)) {
                    break;
                }
                let p = {
                    ...payments
                };
                p[val.id] = figure;
                setPayments(p);
                break;
            }
            case 'userPledger': {
                const username = event.target.value;
                if (username.length === 0) {
                    setSelectedUsersnames([]);
                    setSelectedUsers([]);
                    setPayments([]);
                    break;
                }
                setSelectedUsersnames(username);

                updateSelectedUsers(username);
                break;
            }
            case 'split': {
                setSplit(event.target.checked);
                updatePayments();
                break;
            }
        }
    };

    const sendPayment = () => {

        if(!checkClearToSend()){
            return;
        }

        // @ts-ignore
        const selected = childRef.current.getSelected();

        console.log(selected);

        let transactions: Transaction[] = [];
        for (const user of selectedUsers) {
            const transaction: Transaction = {
                name: paymentName,
                drawee: selected,
                pledger: user,
                amount: payments[user.id] * -1,
            };
            transactions.push(transaction);
        }

        props.paymentAction(transactions);
    };

    const getStyles = (user: UserBasicFragment) => {
        return (
            selectedUsernames.indexOf(user.username) === -1
                ? classes.option
                : classes.optionSelected
        );
    };

    const handleClose = () => {
        props.onClose(false);
    };

    return (
        <Dialog fullScreen={props.fullscreen} open={props.open} onClose={handleClose} style={{padding: 0}}>
            <DialogTitle id="simple-dialog-title" className={classes.title}>New payment</DialogTitle>
            <DialogContent className={classes.dialog}>
            <form className={classes.container} noValidate autoComplete="off">
                <FormControl>
                    <TextField
                        id="name"
                        label={'Payment name'}
                        value={paymentName}
                        onChange={handleChange('name')}
                        type='text'
                        className={classes.textField}
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Selection
                        innerRef={childRef}
                        users={users}
                        label={'Who paid'}
                        single={true}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        id="number"
                        label={'Amount'}
                        value={amount.toString()}
                        onChange={handleChange('amount')}
                        type='number'
                        className={classes.textField}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Kč</InputAdornment>,
                            min: "0",
                            step: "5"
                        }}
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="select-multiple-chip">Paid for</InputLabel>
                    <Select
                        multiple
                        value={selectedUsernames}
                        onChange={handleChange('userPledger')}
                        input={<Input id="select-multiple-chip"/>}
                        renderValue={(users: string[]) => (
                            <div className={classes.chips}>
                                {users.map((user) => (
                                    <Chip key={user} label={user} className={classes.chip}/>
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >
                        {users.map((user: UserBasicFragment) => (
                            <MenuItem key={user.id} value={user.username} className={getStyles(user)}>
                                {user.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={split}
                                onChange={handleChange('split')}
                                value="split"
                                color="secondary"
                            />
                        }
                        label="Evenly"
                        className={classes.formControl}
                    />
                    <div className={classes.pledgers}>
                        {
                            selectedUsers.map((user: UserBasicFragment) => (
                            <TextField
                                key={user.id}
                                id="number"
                                label={user.username}
                                value={payments[user.id] || ''}
                                onChange={handleChange('paymentAmount', user)}
                                type='number'
                                className={classes.pledgerField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Kč</InputAdornment>,
                                }}
                                disabled={split}
                            />
                            ))
                        }
                    </div>
                </FormGroup>
                <Button variant="contained" color="secondary" className={classes.formControl}
                        onClick={sendPayment}>
                    Add payment
                </Button>
                {props.fullscreen &&
                <Button variant="text" color="primary" className={classes.formControl}
                        onClick={handleClose}>
                    Cancel
                </Button>}
            </form>
            </DialogContent>
        </Dialog>
    )
};


export default withStyles(styles)(Payment)

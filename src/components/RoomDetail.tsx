import * as React from "react";
import {FunctionComponent, useState} from "react";
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card/Card";
import Typography from "@material-ui/core/Typography/Typography";
import PledgerIcon from "@material-ui/icons/LocalAtmOutlined";
import PaymentIcon from "@material-ui/icons/PaymentOutlined";
import Grid from "@material-ui/core/Grid/Grid";
import IconButton from "@material-ui/core/IconButton/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Avatar from "@material-ui/core/Avatar/Avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import ListItem from "@material-ui/core/ListItem/ListItem";
import List from "@material-ui/core/List/List";
import DeleteIcon from '@material-ui/icons/Delete';
import ShowMoreIcon from '@material-ui/icons/KeyboardArrowUp';
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import CenteredMessage from "./CenteredMessage";
import {withRoomGraphql} from "../models/withRoom";
import {MeQuery, PaymentFragment, RoomQuery, RoomQueryVariables} from "../generated-models/generated-types";
import {QueryResult} from "react-apollo";
import {withMeGraphql} from "../models/withMe";
import {Omit} from "react-redux";


const styles = (theme: Theme) => (createStyles({
    root: {
        padding: theme.spacing.unit,
        display: 'flex',
        flex: '1 1 0',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    card: {
        padding: theme.spacing.unit,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.light
    },
    wide_card: {
        padding: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.light,
        overflow: 'auto',
    },
    icon: {
        fontSize: 32,
        marginRight: theme.spacing.unit,
        color: theme.palette.primary.main,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    extendedIcon: {
        '&:hover': {
            cursor: 'pointer',
        },
        color: theme.palette.primary.main,
        justifyContent: 'center'
    },
    fab: {
        margin: theme.spacing.unit,
    },
    avatar: {
        color: theme.palette.secondary.main,
        backgroundColor: theme.palette.primary.main,
    },
    list_item: {
        width: '100%'
    }
}));

interface Props extends WithStyles<typeof styles> {
    id: string,
    onRemovePayment: (id: string) => void,
    data: RoomQuery & QueryResult<RoomQuery, RoomQueryVariables>
    me: MeQuery & QueryResult
}

const RoomDetailCard: FunctionComponent<Props> = (props: Props) => {
    const [open, setOpen] = useState(false);

    if (!props.data.room) {
        return null; // TODO: spinner
    }

    const {classes, data: {room}} = props;

    if (room.paymentSet.edges.length === 0) {
        return <CenteredMessage text={"Click bellow to add payment"}/>
    }

    const handleDelete = (payment: PaymentFragment) => (event: any) => {
        props.onRemovePayment(payment.id)
    };

    const handleClose = () => {
        setOpen(false)
    };

    const renderAllPayments = () => {
        setOpen(true)
    };

    const renderList = (list: PaymentFragment[], fullInfo: boolean) =>
        <List dense={true} disablePadding={true}>
            {list.map(payment => {
                    // TODO: use payment
                    const info = fullInfo ? `${Math.abs(1)} Kč for ${payment.pledger.username}`
                        : '';
                    const timestamp = new Date(Date.parse(payment.date)).toLocaleDateString();
                    return (
                        <ListItem key={payment.id} className={classes.list_item}>
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    Č {/* TODO: use user */}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={payment.name}
                                secondary={
                                    <React.Fragment>
                                        <Typography component="span" color="textPrimary" noWrap>
                                            {info}
                                        </Typography>
                                        {timestamp}
                                    </React.Fragment>}
                            />
                            <ListItemSecondaryAction>
                                <IconButton aria-label="Delete" onClick={handleDelete(payment)} disableRipple={true}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )
                }
            )}
        </List>;

    const renderPayments = () => {
        if (props.data.room.paymentSet.edges.length === 0) {
            return (<>No payments yet</>)
        }
        return renderList(props.data.room.paymentSet.edges.map(e => e.node), false);
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={8} direction={"row"} justify={"space-between"} alignItems={"flex-end"}
                  wrap={"nowrap"}>
                <Grid item>
                    <Grid container spacing={8} direction={"column"}>
                        <Grid item xs>
                            <Card className={classes.card}>
                                <PaymentIcon className={classes.icon}/>
                                <Typography variant={"subtitle2"} color={"primary"}>
                                    {props.me.me ? props.me.me.username : 'Loading...'}
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs>
                            <Card className={classes.card}>
                                <PledgerIcon className={classes.icon}/>
                                <Typography variant={"subtitle2"} color={"primary"}>
                                    {/*{totalMoney.toFixed(2)} TODO: use money */}
                                    1337
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container alignItems={"flex-end"}>
                        <Grid item xs style={{flexGrow: 2}}>
                            <Card className={classes.wide_card}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <ShowMoreIcon className={classes.extendedIcon} onClick={renderAllPayments}/>
                                </div>
                                {renderPayments()}
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent style={{padding: 0}}>
                    {renderList(props.data.room.paymentSet.edges.map(e => e.node), true)}
                </DialogContent>
            </Dialog>
        </div>
    )
};

export default withStyles(styles)(withRoomGraphql<Omit<Props, 'me'>>()(withMeGraphql<Props>()(RoomDetailCard)))

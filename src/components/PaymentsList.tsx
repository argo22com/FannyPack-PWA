import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardContent from "@material-ui/core/CardContent/CardContent";
import List from "@material-ui/core/List/List";
import {getPayments_getPayments} from "../generated-models/generated-types";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Typography from "@material-ui/core/Typography/Typography";
import Card from "@material-ui/core/Card/Card";
import * as React from "react";
import {Theme, WithStyles} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import {FunctionComponent} from "react";


const styles = (theme: Theme) => (createStyles({
    card: {
        margin: theme.spacing.unit,
    },
}));

interface Props extends WithStyles<typeof styles>{
    payments: getPayments_getPayments[],
}

const PaymentsList: FunctionComponent<Props> = (props: Props) => {

    if (!props.payments[0]){
        return <>LOADING</>
    }

    const { classes, payments } = props;

    return (
        <Card className={classes.card}>
        <CardHeader title={"Payments"}/>
        <CardContent>
            <List dense={true}>
                {payments.map((payment: getPayments_getPayments) => (
                    <ListItem key={payment.id}>
                        <ListItemText
                            primary={
                                <Typography component="span" color="primary">
                                    {payment.name} - {payment.date}
                                </Typography>
                            }
                            secondary={
                                <Typography component="span" color={"primary"}>
                                    {payment.drawee.username} paid {payment.amount} for {payment.pledger.username}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </CardContent>
    </Card>
    )
};

export default withStyles(styles)(PaymentsList)

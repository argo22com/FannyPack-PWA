import * as React from 'react';
import RootState from "../store/rootState";
import {connect} from "react-redux";
import MatrixGraph from "../components/MatrixGraph";

interface StateToProps {
    matrix: object,
}

interface Props extends StateToProps {}

const Graph = (props:Props) => {

    return (
        <div style={{display: 'flex', flex: '2 1 0'}} >
            <MatrixGraph matrix={props.matrix} height={'300'}/>
        </div>
    );
};

const mapStateToProps = (state: RootState): StateToProps => ({
    matrix: state.matrix,
});

export default connect(mapStateToProps)(Graph);

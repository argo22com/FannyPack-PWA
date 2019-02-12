import * as React from 'react';
import Graph from 'react-graph-vis';
import {RoomQuery} from "../generated-models/generated-types";

function hashCode(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;

    return h;
}


type Node = {
    id: number,
    label: string,
    value: number,
}

type Edge = {
    from: number,
    to: number,
    label?: string,
    value?: number,
}

type Graph = {
    nodes: Node[],
    edges: Edge[],
}

interface Props {
    room: RoomQuery['room'],
    height: string,
}

const DebtsGraph = (props: Props) => {

    const {room: {balances, resolution}} = props;

    const nodes: Node[] = balances.map(b => ({
        id: hashCode(b.user.id),
        label: b.user.username,
        value: b.balance
    }));


    const edges: Edge[] = resolution.map(b => ({
        from: hashCode(b.payer.id),
        to: hashCode(b.recipient.id),
        value: b.amount,
        label: b.amount.toFixed(1),
    }));


    const graph = {
        nodes: nodes,
        edges: edges,
    };

    const options = {
        // autoResize: true,
        height: props.height,
        layout: {
            hierarchical: false
        },
        edges: {
            color: {
                color: '#4BBDA6',
                highlight: '#4BBDA6',
            },
            font: {
                color: '#FFFFFF'
            }
        },
        nodes: {
            color: {
                border: '#444349',
                background: '#ECDC00',
                highlight: '#ECDC00',
            },
            shape: 'circle',
            font: {
                color: '#444349'
            },
            margin: 10,
        },
        interaction: {
            zoomView: false,
            selectable: false,
            dragView: false,
        },
    };

    return (
        <Graph graph={graph} options={options}/>
    );
};

export default DebtsGraph

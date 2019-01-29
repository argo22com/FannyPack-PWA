import * as React from 'react';
import Graph from 'react-graph-vis';

function hashCode(s: string) {
    let h = 0;
    for(let i = 0; i < s.length; i++)
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
    matrix: object,
    height: string,
}

const MatrixGraph = (props: Props) => {

        const users = Object.keys(props.matrix);

        let nodes: Node[] = [];
        let edges: Edge[] = [];

        users.map((user)=> {

            const user_edges = Object.keys(props.matrix[user]);

            user_edges.map((edge: string) => {
                const debt = props.matrix[user][edge];
                if (debt < 0) {
                    const edge_entry = {
                        from: hashCode(user),
                        to: hashCode(edge),
                        label: debt.toFixed(1),
                        value: debt * -1,
                    };
                    edges.push(edge_entry)
                }
            });

            const user_values = Object.values(props.matrix[user]);

            const user_state = user_values.reduce((a, b) => {
                // @ts-ignore
                return (a + b);
            }, 0);

            const node = {
                id: hashCode(user),
                label: user,
                value: user_state * -1
            };
            nodes.push(node);
        });

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

        return(
            <Graph graph={graph} options={options} />
        );
};

export default MatrixGraph

import { useRef, useState } from "react";
import { layouts } from "./layouts";
import CytoscapeComponent from "react-cytoscapejs";

interface INode {
  id: string;
  label: string;
}
export function Graph() {
  const cyRef = useRef<cytoscape.Core | undefined>();
  const [layout, setLayout] = useState(layouts.klay);
  const [isCreatingNode, setIsCreatingNode] = useState(layouts.klay);
  const [node, setNode] = useState<INode>();

  const defaultGraph = [
    {
      data: { id: "1", label: "Node 1" },
      position: { x: 600, y: 150 },
    },

    {
      data: { id: "66", label: "Node 88" },
      position: { x: 1000, y: 150 },
    },

    { data: { id: "2", label: "Node 2" }, position: { x: 500, y: 300 } },
    {
      data: { id: "3", label: "Node 3" },
      position: { x: 100, y: 200 },
    },
    {
      data: { id: "4", label: "Node 4" },
      position: { x: 300, y: 100 },
    },
    {
      data: { id: "5", label: "Node 5" },
      position: { x: 400, y: 50 },
    },
    {
      data: { id: "6", label: "Node 6" },
      position: { x: 400, y: 200 },
    },
    {
      data: {
        source: "1",
        target: "2",
        label: "Edge from Node1 to Node2",
      },
    },
    {
      data: {
        source: "3",
        target: "4",
        label: "Edge from Node3 to Node4",
      },
    },
    {
      data: {
        source: "4",
        target: "5",
        label: "Edge from Node4 to Node5",
      },
    },
    {
      data: {
        source: "6",
        target: "2",
        label: "Edge from Node5 to Node2",
      },
    },
    {
      data: {
        source: "1",
        target: "3",
        label: "Edge from Node5 to Node2",
      },
    },
    {
      data: {
        source: "1",
        target: "4",
        label: "Edge from Node1 to Node4",
      },
    },
    {
      data: {
        source: "2",
        target: "5",
        label: "Edge from Node5 to Node2",
      },
    },
    {
      data: {
        source: "3",
        target: "6",
        label: "Edge from Node3 to Node6",
      },
    },
    {
      data: {
        source: "2",
        target: "4",
        label: "Edge from Node2 to Node4",
      },
    },
    {
      data: {
        source: "5",
        target: "6",
        label: "Edge from Node5 to Node6",
      },
    },
    {
      data: {
        source: "2",
        target: "3",
        label: "Edge from Node2 to Node3",
      },
    },
    {
      data: {
        source: "6",
        target: "1",
        label: "Edge from Node6 to Node1",
      },
    },
    {
      data: {
        source: "5",
        target: "3",
        label: "Edge from Node5 to Node3",
      },
    },
    {
      data: {
        source: "5",
        target: "1",
        label: "Edge from Node5 to Node1",
      },
    },
    {
      data: {
        source: "6",
        target: "4",
        label: "Edge from Node6 to Node4",
      },
    },
  ];
  const [elements, setElements] = useState(defaultGraph);
  const containerStyle = {
    width: "1200px",
    height: "700px",
    border: "1px solid black",
  };

  return (
    <div className="wrapper">
      <div className="buttonContainer">
        <button onClick={() => setLayout(layouts.random)}>Random layout</button>
        <button onClick={() => setLayout(layouts.grid)}>Grid layout</button>
        <button onClick={() => setLayout(layouts.circle)}>Circle layout</button>
        <button onClick={() => setLayout(layouts.circle)}>Create Node</button>
      </div>
      <div className="mainContainer">
        <CytoscapeComponent
          elements={elements}
          style={containerStyle}
          layout={layout}
          stylesheet={[
            {
              selector: "node",
              style: {
                width: 20,
                height: 20,
                shape: "ellipse",
                "text-wrap": "wrap",
                "text-max-width": "200px",
                label: function (node: any) {
                  const nodeAtribute = node.data();
                  let labelFinal = "";
                  Object.keys(nodeAtribute).map(function (key, index) {
                    labelFinal += ` ${key} = ${nodeAtribute[key]} `;
                  });

                  return labelFinal;
                },
              },
            },
            {
              selector: "node#0",
              style: {
                "background-color": "red",
                color: "red",
              },
            },
          ]}
          cy={(cy) => {
            cy.on("tap", function (event) {
              console.log("🚀 ~ file: App.tsx ~ line 191 ~ event", event);
              // target holds a reference to the originator
              // of the event (core or element)
              var evtTarget = event.target;

              if (evtTarget === cy) {
                console.log("tap on background");
              } else {
                var node = event.target;
                let data = node._private.data;

                if (event.target.nodeKey !== null) setNode(data);
                console.log("tapped " + data);
              }
            });
          }}
        />
        <div>
          <h1>Data</h1>
          <div className="subtitle">
            <h2>Node ID</h2>
            <h3>{node?.id}</h3>
          </div>
          <div className="subtitle">
            <h2>Node Label</h2>
            <h3>{node?.label}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

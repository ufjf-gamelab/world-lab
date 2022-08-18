import { useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { layouts } from "./layouts";

function App() {
  const cyRef = useRef<cytoscape.Core | undefined>();
  const [layout, setLayout] = useState(layouts.klay);

  const defaultGraph = [
    {
      data: { id: "1", label: "Node 1" },
      position: { x: 600, y: 150 },
    },
    {
      data: { id: "0", label: "Churn" },
      position: { x: 600, y: 150 },
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
  const containerStyle = {
    width: "1200px",
    height: "700px",
    border: "1px solid black",
  };
  const [elements, setElements] = useState(defaultGraph);
  console.log("elemnt", elements);
  console.log(layouts.random);
  return (
    <div className="container">
      <div className="buttonContainer">
        <button onClick={() => setLayout(layouts.random)}>Random layout</button>
        <button onClick={() => setLayout(layouts.grid)}>Grid layout</button>
        <button onClick={() => setLayout(layouts.circle)}>Circle layout</button>
      </div>
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
                console.log("node", JSON.stringify(node.data()));
                const nodeAtribute = node.data();
                let labelFinal = "";
                Object.keys(nodeAtribute).map(function (key, index) {
                  labelFinal += ` ${key} = ${nodeAtribute[key]} `;
                });

                console.log("atributeDepois", nodeAtribute);
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
          console.log(cy);
          cyRef.current = cy;
          cy.on("tap", "node", function (evt) {
            var node = evt.target;
            let data = node.data();
            console.log("tapped " + JSON.stringify(data));
          });
        }}
      />
    </div>
  );
}

export default App;

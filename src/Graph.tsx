import { useEffect, useId, useRef, useState } from "react";
import { layouts } from "./layouts";
import CytoscapeComponent from "react-cytoscapejs";
import useLocalStorage from "./hooks/useLocalStorage";

interface INode {
  id: string;
  label: string;
}
interface IClickedPosition {
  x: number;
  y: number;
}
export function Graph() {
  const cyRef = useRef<cytoscape.Core | undefined>();
  const [layout, setLayout] = useState(layouts.klay);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [isFirstNodeSelected, setIsFirstNodeSelected] = useState(false);
  const [primaryNode, setPrimaryNode] = useState<INode | null>(null);
  const [numberOfNodes, setNumberOfNodes] = useState<number>(6);
  const [secondaryNode, setSecondaryNode] = useState<INode | null>(null);
  const [clickedPosition, setClickedPosition] = useState<IClickedPosition>();
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

  useEffect(() => {
    const localElements = JSON.parse(window.localStorage.getItem("elements")!);
    setElements(localElements);
  }, []);

  useEffect(() => {
    if (clickedPosition && isCreatingNode) {
      const newId = numberOfNodes + 1;
      setElements((oldState) => [
        ...oldState,
        {
          data: { id: newId.toString(), label: "Teste" },
          position: { x: clickedPosition.x, y: clickedPosition.y },
        },
      ]);

      window.localStorage.setItem("elements", JSON.stringify(elements));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPosition]);

  useEffect(() => {
    if (secondaryNode) {
      setElements((oldState) => [
        ...oldState,
        {
          data: {
            source: primaryNode ? primaryNode?.id : "",
            target: secondaryNode ? secondaryNode?.id : "",
            label: "Edge from Node1 to Node2",
          },
        },
      ]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondaryNode]);

  const containerStyle = {
    width: "1200px",
    height: "700px",
    border: "1px solid black",
  };

  const deleteNode = (selectedNode: any) => {
    const newElements = elements.filter((node) => {
      if (node.data.id !== selectedNode.id) {
        console.log("node.data.id", node.data.id);
        return true;
      } else {
        return false;
      }
    });
    console.log(
      "🚀 ~ file: Graph.tsx ~ line 220 ~ newElements ~ newElements",
      newElements
    );

    setElements(newElements);
  };
  return (
    <div className="wrapper">
      <div className="buttonContainer">
        <button onClick={() => setLayout(layouts.random)}>Random layout</button>
        <button onClick={() => setElements(defaultGraph)}>Reset Nodes</button>
        <button onClick={() => setLayout(layouts.grid)}>Grid layout</button>
        <button onClick={() => setLayout(layouts.circle)}>Circle layout</button>
        <button onClick={() => setIsCreatingNode(!isCreatingNode)}>
          Create Node
        </button>
        <h4>creating node = {isCreatingNode ? "true" : "false"}</h4>
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
                    return (labelFinal += ` ${key} = ${nodeAtribute[key]} `);
                  });

                  return labelFinal;
                },
              },
            },
            {
              selector: "node#1",
              style: {
                "background-color": "red",
                color: "red",
              },
            },
          ]}
          cy={(cy) => {
            cy.on("tap", function (event) {
              setNumberOfNodes(cy.nodes().length);
              var evtTarget = event.target;
              // cy.$("#j").neighborhood((ele: any) => {
              //   return ele.isNode();
              // });

              // console.log(je.connectedNodes());

              if (evtTarget === cy) {
                if (isCreatingNode) setClickedPosition(event.position);
              } else {
                var node = event.target;
                let clickedNodedata = node._private.data;

                if (node._private.nodeKey !== null && !isFirstNodeSelected) {
                  setPrimaryNode(clickedNodedata);
                  console.log("entrei IF1", !isFirstNodeSelected);
                  setIsFirstNodeSelected(true);
                } else if (
                  node._private.nodeKey !== null &&
                  !isFirstNodeSelected
                ) {
                  setSecondaryNode(clickedNodedata);
                }
              }
            });
          }}
        />
        <div>
          <h1>Data</h1>
          <button onClick={() => deleteNode(primaryNode)}>Delete Node</button>
          <div className="subtitle">
            <h2>Node ID</h2>
            <h3>{primaryNode?.id}</h3>
          </div>
          <div className="subtitle">
            <h2>Node Label</h2>
            <h3>{primaryNode?.label}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

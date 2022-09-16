import { useEffect, useId, useRef, useState } from "react";
import { layouts } from "./layouts";
import { GrEdit } from "react-icons/gr";
import CytoscapeComponent from "react-cytoscapejs";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

interface INode {
  id: string;
  label: string;
  difficulty: number;
  isVisited: boolean;
  newAttributes?: {
    attribute: string;
    value: string;
  }[];
}

interface IAttribute {
  attribute: string;
  value: string;
}
interface IEdge {
  target: string;
  source: string;
  label: number;
}

interface IClickedPosition {
  x: number;
  y: number;
}
type FormValues = {
  label: string;
  difficulty: number;
  isVisited: boolean;
  newAttributes: {
    attribute: string;
    value: string;
  }[];
};

export function Graph() {
  const cyRef = useRef<cytoscape.Core | undefined>();
  const [layout, setLayout] = useState(layouts.klay);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [isNodeSelected, setIsNodeSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [primaryNode, setPrimaryNode] = useState<INode | null>(null);
  const [relationship, setRelationship] = useState<INode[] | []>([]);
  const [numberOfNodes, setNumberOfNodes] = useState<number>(7);
  const [secondaryNode, setSecondaryNode] = useState<INode | null>(null);
  const [clickedPosition, setClickedPosition] = useState<IClickedPosition>();
  const [numberOfAtributes, setNumberOfAtributes] = useState<any>({});
  const [selectedEdge, setSelectedEdge] = useState<IEdge | null>(null);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      newAttributes: [{ attribute: "", value: "" }],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    name: "newAttributes",
    control,
  });

  const onSubmit: SubmitHandler<FormValues> = (nodeData: FormValues) => {
    console.log("nodeData", nodeData);

    nodeData.newAttributes.map((value) => {});
    const data = {
      label: nodeData.label,
      difficulty: nodeData.difficulty,
      isVisited: nodeData.isVisited,
      newAttributes: [...nodeData.newAttributes],
    };

    console.log("data", data);
    cyRef.current?.$(`#${primaryNode?.id}`).data(data);
    console.log("primaryNode?.id", primaryNode);
  };

  const defaultGraph = [
    {
      data: { id: "1", label: "Node 1", difficulty: 5, isVisited: false },
      position: { x: 600, y: 150 },
    },

    {
      data: { id: "66", label: "Node 88", difficulty: 5, isVisited: false },
      position: { x: 1000, y: 150 },
    },

    {
      data: { id: "2", label: "Node 2", difficulty: 5, isVisited: false },
      position: { x: 500, y: 300 },
    },
    {
      data: { id: "3", label: "Node 3", difficulty: 5, isVisited: false },
      position: { x: 100, y: 200 },
    },
    {
      data: { id: "4", label: "Node 4", difficulty: 5, isVisited: false },
      position: { x: 300, y: 100 },
    },
    {
      data: { id: "5", label: "Node 5", difficulty: 5, isVisited: false },
      position: { x: 400, y: 50 },
    },
    {
      data: { id: "6", label: "Node 6", difficulty: 5, isVisited: false },
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
    window.localStorage.setItem("elements", JSON.stringify(elements));
    const localElements = JSON.parse(window.localStorage.getItem("elements")!);
    setElements(localElements);
  }, []);

  useEffect(() => {
    if (clickedPosition && isCreatingNode) {
      const newId = numberOfNodes + 1;
      setElements((oldState) => [
        ...oldState,
        {
          data: {
            id: newId.toString(),
            label: "Teste",
            difficulty: 5,
            isVisited: false,
          },
          position: { x: clickedPosition.x, y: clickedPosition.y },
        },
      ]);

      setNumberOfNodes(newId + 1);
      window.localStorage.setItem("elements", JSON.stringify(elements));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPosition]);
  useEffect(() => {
    if (relationship.length === 2) {
      setElements((oldState) => [
        ...oldState,
        {
          data: {
            source: relationship[0] ? relationship[0]?.id : "",
            target: relationship[1] ? relationship[1]?.id : "",
            label: `Edge from ${relationship[0]?.id} to ${relationship[1]?.id}`,
          },
        },
      ]);
      setRelationship([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationship]);

  const createRelationship = (node: INode) => {
    if (relationship.length < 2) {
      setRelationship([...relationship, node]);
    }
  };
  const containerStyle = {
    width: "1200px",
    height: "700px",
    border: "1px solid black",
  };

  const deleteNode = (selectedNode: any) => {
    if (selectedNode === undefined) return;
    cyRef.current?.remove(`#${selectedNode?.id}`);
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
                  // let labelFinal = "";
                  // Object.keys(nodeAtribute).map(function (key, index) {
                  //   return (labelFinal += ` ${key} = ${nodeAtribute[key]} `);
                  // });
                  // return labelFinal;
                  return `id = ${nodeAtribute.id}`;
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
            cyRef.current = cy;
            setNumberOfNodes(cy.nodes().length + 1);
            cy.on("tap", "node", function (event) {
              var node = event.target;
              let clickedElement = node._private.data;
              if (node._private.nodeKey === null) {
                setSelectedEdge(clickedElement);
                setPrimaryNode(null);
                setIsNodeSelected(false);
              } else if (node._private.nodeKey !== null) {
                setPrimaryNode(clickedElement);
                console.log(clickedElement);
                createRelationship(clickedElement);
                setSelectedEdge(null);
                setIsNodeSelected(true);
              }
            });
            cy.on("tap", function (event) {
              var evtTarget = event.target;

              //clicked on canvas
              if (evtTarget === cy) {
                if (isCreatingNode) setClickedPosition(event.position);
                setPrimaryNode(null);
                //clicked on node or edge
              } else {
                var node = event.target;
                let clickedElement = node._private.data;
                if (node._private.nodeKey === null) {
                  setSelectedEdge(clickedElement);
                  setPrimaryNode(null);
                  setIsNodeSelected(false);
                }
              }
            });
          }}
        />
        <div className="container">
          <>
            <div className="header">
              <h1>Data</h1>

              <GrEdit onClick={() => setIsEditing(!isEditing)} />
              <button onClick={() => deleteNode(primaryNode)}>
                Delete Node
              </button>
            </div>
            {!isEditing && (
              <>
                <div className="subtitle">
                  <h2>Node ID</h2>
                  <h3>{primaryNode?.id}</h3>
                </div>
                <div className="subtitle">
                  <h2>Node Label</h2>
                  <h3>{primaryNode?.label}</h3>
                </div>
                <div className="subtitle">
                  <h2>Difficulty</h2>
                  <h3>{primaryNode?.difficulty}</h3>
                </div>
                <div className="subtitle">
                  <h2>Visited</h2>
                  <h3>{primaryNode?.isVisited ? "true" : "false"}</h3>
                </div>

                {primaryNode?.newAttributes?.map((a: IAttribute) => {
                  return (
                    <div className="subtitle">
                      <h2>{a.attribute}</h2>
                      <h3>{a.value}</h3>
                    </div>
                  );
                })}
              </>
            )}
          </>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <input
                {...register("label")}
                defaultValue={primaryNode?.label}
                placeholder="Label"
              />

              <input
                type="number"
                {...register("difficulty", {
                  valueAsNumber: true,
                  required: true,
                })}
                defaultValue={primaryNode?.difficulty}
              />

              <input
                type="checkbox"
                {...register("isVisited")} // send value to hook form
              />
              {/* {primaryNode?.newAttributes?.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section className={"section"} key={field.id}>
                      <input
                        {...register("label")}
                        defaultValue={primaryNode?.label}
                        placeholder="Label"
                      />
                    </section>
                  </div>
                );
              })} */}
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section className={"section"} key={field.id}>
                      <input
                        placeholder="attribute"
                        {...register(
                          `newAttributes.${index}.attribute` as const,
                          {
                            required: true,
                          }
                        )}
                        className={
                          errors?.newAttributes?.[index]?.attribute
                            ? "error"
                            : ""
                        }
                        defaultValue={field.attribute}
                      />
                      <input
                        placeholder="name"
                        {...register(`newAttributes.${index}.value` as const, {
                          required: true,
                        })}
                        className={
                          errors?.newAttributes?.[index]?.value ? "error" : ""
                        }
                        defaultValue={field.value}
                      />

                      <button type="button" onClick={() => remove(index)}>
                        DELETE
                      </button>
                    </section>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  append({
                    attribute: "",
                    value: "tee",
                  })
                }
              >
                APPEND
              </button>
              <input type="submit" />
            </div>
          </form>

          {!isEditing && (
            <>
              <div className="header">
                <h1>Edge Data</h1>
              </div>
              <div className="subtitle">
                <h2>Source</h2>
                <h3>{selectedEdge?.source}</h3>
              </div>
              <div className="subtitle">
                <h2>Target</h2>
                <h3>{selectedEdge?.target}</h3>
              </div>

              <div className="subtitle">
                <h2>Label</h2>
                <h3>{selectedEdge?.label}</h3>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

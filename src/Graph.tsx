import { useEffect, useId, useRef, useState } from "react";
import { layouts } from "./layouts";
import { graphStyles } from "./graphConst";
import { GrEdit } from "react-icons/gr";
import CytoscapeComponent from "react-cytoscapejs";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Modal from "react-modal";
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
  id?: string;
  target: string;
  source: string;
  weight: number;
  tentativas: number;
  falhas: number;
  label?: string;
}

interface IClickedPosition {
  x: number;
  y: number;
}
type FormValues = {
  label: string;
  difficulty: number;
  isVisited: boolean;
  tentativas?: string;
  weight?: number;
  falhas?: string;
  newAttributes: {
    attribute: string;
    value: string;
  }[];
};

export function Graph() {
  const cyRef = useRef<cytoscape.Core | undefined>();
  const [layout, setLayout] = useState(layouts.klay);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [monteCarlo, setMonteCarlo] = useState(false);
  const [primaryNode, setPrimaryNode] = useState<INode | null>(null);
  const [relationship, setRelationship] = useState<INode[] | []>([]);
  const [numberOfNodes, setNumberOfNodes] = useState<number>(7);
  const [clickedPosition, setClickedPosition] = useState<IClickedPosition>();
  const [selectedEdge, setSelectedEdge] = useState<IEdge | null>(null);

  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

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

    cyRef.current?.$(`#${primaryNode?.id}`).data(data);
    closeModal();
  };
  const onSubmitEdge: SubmitHandler<FormValues> = (edgeData: FormValues) => {
    edgeData.newAttributes.map((value) => {});
    const data = {
      label: edgeData.label,
      weight: edgeData.weight,
      tentativas: edgeData.tentativas,
      falhas: edgeData.falhas,
      newAttributes: [...edgeData.newAttributes],
    };

    cyRef.current?.$(`#${selectedEdge?.id}`).data(data);
    closeModal();
  };

  const defaultGraph = [
    {
      data: { id: "1", label: "Node 1", difficulty: 5, isVisited: false },
      position: { x: 600, y: 150 },
    },
    {
      data: { id: "2", label: "Node 2", difficulty: 5, isVisited: false },
      position: { x: 550, y: 300 },
    },
    {
      data: { id: "3", label: "Node 3", difficulty: 5, isVisited: false },
      position: { x: 650, y: 300 },
    },
    {
      data: { id: "4", label: "Node 4", difficulty: 5, isVisited: false },
      position: { x: 750, y: 300 },
    },
    {
      data: { id: "5", label: "Node 5", difficulty: 5, isVisited: false },
      position: { x: 830, y: 300 },
    },
    {
      data: { id: "6", label: "Node 6", difficulty: 5, isVisited: false },
      position: { x: 570, y: 440 },
    },
    {
      data: { id: "7", label: "Node 7", difficulty: 5, isVisited: false },
      position: { x: 700, y: 440 },
    },
    {
      data: { id: "8", label: "Node 8", difficulty: 5, isVisited: false },
      position: { x: 800, y: 440 },
    },
    {
      data: { id: "9", label: "Node 8", difficulty: 5, isVisited: false },
      position: { x: 550, y: 570 },
    },
    {
      data: { id: "10", label: "Node 10", difficulty: 5, isVisited: false },
      position: { x: 740, y: 600 },
    },
    {
      data: {
        source: "1",
        target: "2",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "1",
        target: "3",
        tentativas: 0,
        falhas: 0,
        weight: 30,
      },
    },
    {
      data: {
        source: "1",
        target: "4",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "1",
        target: "5",
        tentativas: 0,
        falhas: 0,
        weight: 5,
      },
    },
    {
      data: {
        source: "2",
        target: "3",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "2",
        target: "6",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "3",
        target: "7",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "4",
        target: "5",
        tentativas: 0,
        falhas: 0,
        weight: 5,
      },
    },
    {
      data: {
        source: "6",
        target: "9",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "7",
        target: "10",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "5",
        target: "8",
        tentativas: 0,
        falhas: 0,
        weight: 20,
      },
    },
    {
      data: {
        source: "4",
        target: "8",
        tentativas: 0,
        falhas: 0,
        weight: 2,
      },
    },
    {
      data: {
        source: "8",
        target: "10",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "9",
        target: "10",
        tentativas: 0,
        falhas: 0,
        weight: 15,
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
            tentativas: 0,
            falhas: 0,
            weight: 15,
          },
        },
      ]);
      setRelationship([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationship]);

  useEffect(() => {
    if (monteCarlo) {
      for (let i = 0; i < 30; i++) {
        customSearchNeighbour();
      }
      setMonteCarlo(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monteCarlo]);

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

  const searchDijkstra = () => {
    if (cyRef.current) {
      const rm = (ele: any) => ele.removeClass("highlighted");
      cyRef.current.elements().forEach(rm);

      var dijkstra = cyRef.current.elements().dijkstra({
        root: "#1",
        weight: function (edge: any) {
          return edge._private.data.weight;
        },
      });
      var pathToJ = dijkstra.pathTo(cyRef.current.$("#7"));

      var i = 0;
      var highlightNextEle = function () {
        if (i < pathToJ.length) {
          pathToJ[i].addClass("highlighted");

          i++;
          setTimeout(highlightNextEle, 1000);
        }
      };

      // kick off first highlight
      highlightNextEle();
    }
  };

  const customSearch = () => {
    if (cyRef.current === undefined) return "";
    const rm = (ele: any) => ele.removeClass("highlighted");
    cyRef.current.elements().forEach(rm);

    let nodesSearch = [];
    let edgesSearch = [];
    var col = cyRef.current.collection();
    col.merge("#1");
    let nodes = cyRef.current.nodes().map(function (ele, i, eles) {
      let edges = ele.connectedEdges();
      if (i > 0) {
        let oldNodeID = eles[i - 1].id();
        console.log(`entrei OLd node`, oldNodeID, i);
        edges = ele.connectedEdges().filter(`edge[source != "${oldNodeID}"]`);
      }

      const randomEdge = edges[Math.floor(Math.random() * edges.length)];
      const randomEdgeDifficulty = randomEdge.data("weight");
      const randomEdgeTarget = randomEdge.data("target");
      var highlightNextEle = function () {
        ele.addClass("highlighted");
        randomEdge.addClass("highlighted");
        setTimeout(highlightNextEle, 1000);
      };

      for (let i = 0; i < 3; i++) {
        const randomNumber = Math.floor(Math.random() * 30);
        if (randomNumber > randomEdgeDifficulty) {
          // highlightNextEle();
          col.merge(`#${randomEdgeTarget}`);
          col.merge(randomEdge);
          return randomEdge;
        }
      }

      return false;
    });
    console.log("col", col);
    col.addClass("highlighted");
  };

  const challengeEdgeDifficulty = (
    col: any,
    randomEdge: any,
    nodeIDArray: string[]
  ) => {
    let randomEdgeDifficulty = randomEdge.data("weight");
    let randomEdgeTarget = randomEdge.data("target");

    let randomEdgeID = randomEdge.data("id");
    let randomEdgeTentativas = parseInt(randomEdge.data("tentativas"));
    let randomEdgeFalhas = parseInt(randomEdge.data("falhas"));

    for (let i = 0; i < 3; i++) {
      const randomNumber = Math.floor(Math.random() * 30);
      cyRef.current
        ?.$(`#${randomEdgeID}`)
        .data({ tentativas: randomEdgeTentativas + 1 });
      if (randomNumber > randomEdgeDifficulty) {
        col.merge(randomEdge);
        cyRef.current?.$(`#${randomEdgeID}`);
        console.log(
          "🚀 ~ file: Graph.tsx ~ line 448 ~ Graph ~ randomEdgeTarget",
          randomEdgeTarget
        );
        col.merge(`#${randomEdgeTarget}`);
        nodeIDArray.push(randomEdgeTarget);
        return randomEdgeTarget;
      }
    }
    cyRef.current?.$(`#${randomEdgeID}`).data({ falhas: randomEdgeFalhas + 1 });
    return "fail";
  };

  const resetStyles = () => {
    if (cyRef.current === undefined) return "";
    cyRef.current.elements().removeClass("highlighted");
  };

  const customSearchNeighbour = () => {
    if (cyRef.current === undefined) return "";
    resetStyles();
    let nodeIDArray: string[] = [];
    let col = cyRef.current.collection();

    col.merge("#1");
    nodeIDArray.push("1");
    let inicialEdges = cyRef.current
      .$(`#1`)
      .neighborhood()
      .filter(function (ele) {
        return ele.isEdge();
      });
    let randomEdge =
      inicialEdges[Math.floor(Math.random() * inicialEdges.length)];

    let nextNode = challengeEdgeDifficulty(col, randomEdge, nodeIDArray);

    while (nextNode !== "fail" && nextNode !== "10") {
      inicialEdges = cyRef.current
        .$(`#${nextNode}`)
        .neighborhood()
        .filter(function (ele) {
          return ele.isEdge();
        })
        .filter(function (ele) {
          const nodeTarget = ele.data(`target`);
          const nodeAlreadyInCollection = nodeIDArray.includes(nodeTarget);
          return !nodeAlreadyInCollection;
        });
      randomEdge =
        inicialEdges[Math.floor(Math.random() * inicialEdges.length)];

      nextNode = challengeEdgeDifficulty(col, randomEdge, nodeIDArray);
    }

    col.addClass("highlighted");
  };
  return (
    <div className="wrapper">
      <div className="buttonContainer">
        <button onClick={() => customSearchNeighbour()}>Custom search</button>
        <button onClick={() => setMonteCarlo(true)}>
          Custom search 30 vezes
        </button>
        <button onClick={() => searchDijkstra()}>Dijkstra</button>
        <button onClick={() => resetStyles()}>Reset styles</button>
        <button onClick={() => setElements(defaultGraph)}>Reset Nodes</button>
        <button onClick={() => setLayout(layouts.grid)}>Grid layout</button>
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
            graphStyles.nodeLabel,
            graphStyles.firstNode,
            graphStyles.edgeTentativas,
            graphStyles.customPath,
          ]}
          cy={(cy) => {
            cyRef.current = cy;

            window.localStorage.setItem("elements", JSON.stringify(elements));
            cy.on("tap", "node", function (event) {
              var node = event.target;
              let clickedElement = node._private.data;
              if (node._private.nodeKey === null) {
                setSelectedEdge(clickedElement);
                setPrimaryNode(null);
              } else if (node._private.nodeKey !== null) {
                setPrimaryNode(clickedElement);

                createRelationship(clickedElement);
                setSelectedEdge(null);
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
                }
              }
            });
          }}
        />
        <div className="container">
          <>
            <div className="header">
              <h1>Data</h1>

              <GrEdit
                onClick={() => {
                  primaryNode || (selectedEdge && openModal());
                }}
              />
              <button onClick={() => deleteNode(primaryNode)}>
                Delete Node
              </button>
            </div>

            {primaryNode && (
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

          {selectedEdge && (
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
                <h2>Weight</h2>
                <h3>{selectedEdge?.weight}</h3>
              </div>
              <div className="subtitle">
                <h2>tentativas</h2>
                <h3>{selectedEdge?.tentativas}</h3>
              </div>
              <div className="subtitle">
                <h2>Falhas</h2>
                <h3>{selectedEdge?.falhas}</h3>
              </div>
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={() => console.log("entrei")}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Example Modal"
      >
        {primaryNode && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="formContainer">
              <div className="formInput">
                <h3>Label</h3>
                <input
                  {...register("label")}
                  defaultValue={primaryNode?.label}
                  placeholder="Label"
                />
              </div>

              <div className="formInput">
                <h3>Difficulty</h3>
                <input
                  type="number"
                  {...register("difficulty", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  defaultValue={primaryNode?.difficulty}
                  value={primaryNode?.difficulty}
                />
              </div>
              <div className="formInput">
                <h3>isVisited</h3>
                <input
                  type="checkbox"
                  {...register("isVisited")} // send value to hook form
                />
              </div>
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section className={"section"} key={field.id}>
                      <input
                        placeholder="attribute"
                        {...register(
                          `newAttributes.${index}.attribute` as const,
                          {}
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
                        {...register(
                          `newAttributes.${index}.value` as const,
                          {}
                        )}
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
                    value: "",
                  })
                }
              >
                APPEND
              </button>
              <input type="submit" />
            </div>
          </form>
        )}

        {selectedEdge && (
          <form onSubmit={handleSubmit(onSubmitEdge)}>
            <div className="formContainer">
              <div className="formInput">
                <h3>Label</h3>
                <input
                  {...register("label")}
                  defaultValue={selectedEdge?.label}
                  placeholder="Label"
                />
              </div>

              <div className="formInput">
                <h3>Weight</h3>
                <input
                  type="number"
                  {...register("weight", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  defaultValue={selectedEdge?.weight}
                />
              </div>
              <div className="formInput">
                <h3>tentativas</h3>
                <input
                  type="number"
                  {...register("tentativas")}
                  defaultValue={selectedEdge?.tentativas}
                />
              </div>
              <div className="formInput">
                <h3>falhas</h3>
                <input
                  type="number"
                  {...register("falhas")} // send value to hook form
                  defaultValue={selectedEdge?.falhas}
                />
              </div>
              {fields.map((field, index) => {
                return (
                  <div key={field.id}>
                    <section className={"section"} key={field.id}>
                      <input
                        placeholder="attribute"
                        {...register(
                          `newAttributes.${index}.attribute` as const,
                          {}
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
                        {...register(
                          `newAttributes.${index}.value` as const,
                          {}
                        )}
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
                    value: "",
                  })
                }
              >
                APPEND
              </button>
              <input type="submit" />
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

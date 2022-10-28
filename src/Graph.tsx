import { useEffect, useId, useRef, useState } from "react";
import { layouts } from "./layouts";
import { graphConsts } from "./graphConst";
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
  const cyRef = useRef<cytoscape.Core>();
  const [layout, setLayout] = useState(layouts.klay);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [isInitialNodes, setisInitialNodes] = useState(true);
  const [monteCarlo, setMonteCarlo] = useState(false);
  const [primaryNode, setPrimaryNode] = useState<INode>();
  const [relationship, setRelationship] = useState<INode[] | []>([]);
  const [clickedPosition, setClickedPosition] = useState<IClickedPosition>();
  const [selectedEdge, setSelectedEdge] = useState<IEdge>();

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

  const [elements, setElements] = useState<any>(graphConsts.defaultGraph);

  useEffect(() => {
    const localElements = JSON.parse(window.localStorage.getItem("elements")!);
    console.log("localEleemnets firstLoad", localElements);
    setElements(localElements);
    setisInitialNodes(false);
  }, []);

  useEffect(() => {
    if (!isInitialNodes) {
      console.log("alterei cyref");
      window.localStorage.setItem("elements", JSON.stringify(elements));
    }
  }, [elements, cyRef]);

  useEffect(() => {
    if (clickedPosition && isCreatingNode) {
      const newId = cyRef.current?.elements().length;
      cyRef.current?.add({
        group: "nodes",
        data: {
          id: newId?.toString(),
          label: `Node${newId}`,
          difficulty: 5,
          isVisited: false,
        },
        position: { x: clickedPosition.x, y: clickedPosition.y },
      });

      const newNodes = cyRef.current?.elements().jsons();
      setElements(newNodes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPosition]);

  useEffect(() => {
    if (relationship.length === 2) {
      cyRef.current!.add({
        data: {
          source: relationship[0] ? relationship[0]?.id : "",
          target: relationship[1] ? relationship[1]?.id : "",
          tentativas: 0,
          falhas: 0,
          weight: 15,
        },
      });
      const newNodes = cyRef.current?.elements().jsons();
      setElements(newNodes);

      setRelationship([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationship]);

  useEffect(() => {
    if (monteCarlo) {
      for (let i = 0; i < 30; i++) {
        customSearchNeighbour();
      }
      const newNodes = cyRef.current?.elements().jsons();
      setElements(newNodes);
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
    borderRadius: "17px",
  };

  const deleteElement = (selectedNode: any) => {
    if (selectedNode === undefined) return;
    cyRef.current?.remove(`#${selectedNode?.id}`);
    const newNodes = cyRef.current?.elements().jsons();
    setElements(newNodes);
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
      var pathToJ = dijkstra.pathTo(cyRef.current.$("#10"));

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
    cyRef.current.elements().removeClass("tentativas");
    cyRef.current.elements().removeClass("tentativasColor");
  };

  const resetNodesAtributes = () => {
    if (cyRef.current === undefined) return "";
    resetStyles();
    cyRef.current.elements().data("tentativas", 0);
    cyRef.current.elements().data("falhas", 0);
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
          const nodeSource = ele.data(`target`);

          const nodeTargetAlreadyInCollection =
            nodeIDArray.includes(nodeTarget);
          const nodeSourceAlreadyInCollection =
            nodeIDArray.includes(nodeSource);
          if (nodeTargetAlreadyInCollection || nodeSourceAlreadyInCollection) {
            return false;
          }
          return true;
        });

      if (inicialEdges.length === 0) break;

      randomEdge =
        inicialEdges[Math.floor(Math.random() * inicialEdges.length)];

      nextNode = challengeEdgeDifficulty(col, randomEdge, nodeIDArray);
    }

    col.addClass("highlighted");
  };

  const showTentativasStyles = () => {
    cyRef.current?.elements().addClass("tentativas");
  };
  const showTentativasColorStyles = () => {
    cyRef.current
      ?.elements()
      .filter(function (ele) {
        return ele.isEdge();
      })
      .addClass("tentativasColor");
  };
  return (
    <div className="wrapper">
      <div className="buttonContainer">
        <button
          onClick={() => {
            customSearchNeighbour();
            const newNodes = cyRef.current?.elements().jsons();
            setElements(newNodes);
          }}
        >
          Custom search
        </button>
        <button onClick={() => setMonteCarlo(true)}>Custom search 30x</button>
        <button onClick={() => searchDijkstra()}>Dijkstra</button>
        <button onClick={() => showTentativasStyles()}>
          MostrarTentativas Width
        </button>
        <button onClick={() => showTentativasColorStyles()}>
          MostrarTentativas Color
        </button>
        <button onClick={() => resetStyles()}>Reset styles</button>
        <button onClick={() => resetNodesAtributes()}>
          Reset Node atributes
        </button>
        <button onClick={() => setIsCreatingNode(!isCreatingNode)}>
          Create Node
        </button>
        <h4>creating node = {isCreatingNode ? "true" : "false"}</h4>
        <button>
          <a
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(elements)
            )}`}
            download="filename.json"
          >
            {`Download Json`}
          </a>
        </button>
      </div>
      <div className="mainContainer">
        <CytoscapeComponent
          elements={[...elements]}
          style={containerStyle}
          layout={layout}
          stylesheet={[
            graphConsts.nodeLabel,
            graphConsts.firstNode,
            graphConsts.edgeTentativas,
            graphConsts.edgeTentativasColor,
            graphConsts.customPath,
          ]}
          cy={(cy) => {
            cyRef.current = cy;
            cy.on("drag ", function (evt) {
              const newNodes = cyRef.current?.elements().jsons();
              setElements(newNodes);
            });

            cy.on("tap", "node", function (event) {
              var node = event.target;
              console.log("cliquei tap1");
              let clickedElement = node._private.data;
              if (node._private.nodeKey === null) {
                setSelectedEdge(clickedElement);
                setPrimaryNode(undefined);
              } else if (node._private.nodeKey !== null) {
                setPrimaryNode(clickedElement);

                createRelationship(clickedElement);
                setSelectedEdge(undefined);
              }
            });

            cy.on("tap", "edge", function (event) {
              var node = event.target;
              let clickedElement = node._private.data;
              console.log("ClickedElement", clickedElement);

              setSelectedEdge(clickedElement);
              setPrimaryNode(undefined);
            });
            cy.on("tap", function (event) {
              var evtTarget = event.target;
              console.log("cliquei tap2");
              //clicked on canvas
              if (evtTarget === cy) {
                if (isCreatingNode) setClickedPosition(event.position);
                setPrimaryNode(undefined);
                setSelectedEdge(undefined);
                //clicked on node or edge
              }
            });
          }}
        />
        <div className="container">
          <>
            {(primaryNode || selectedEdge) && (
              <div className="header">
                <h1>Data</h1>

                <div
                  className="editButton"
                  onClick={() => {
                    primaryNode || (selectedEdge && openModal());
                  }}
                >
                  <h3>edit</h3>
                  <GrEdit />
                </div>
                <button
                  onClick={() => {
                    if (primaryNode) {
                      deleteElement(primaryNode);
                      setPrimaryNode(undefined);
                      return;
                    }
                    setSelectedEdge(undefined);

                    return deleteElement(selectedEdge);
                  }}
                >
                  {primaryNode && "Delete Node"}
                  {selectedEdge && "Delete Edge"}
                </button>
              </div>
            )}
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

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

interface ICustomSearchFormValues {
  firstNode: string;
  lastNode: string;
  numberOfRuns: number;
}

export function Graph() {
  const cyRef = useRef<cytoscape.Core>();
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [isCreatingRelationship, setIsCreatingRelationship] = useState(false);
  const [isInitialNodes, setisInitialNodes] = useState(true);
  const [primaryNode, setPrimaryNode] = useState<INode>();
  const [relationship, setRelationship] = useState<INode[] | []>([]);
  const [clickedPosition, setClickedPosition] = useState<IClickedPosition>();
  const [elements, setElements] = useState<any>(graphConsts.defaultGraph);
  const [selectedEdge, setSelectedEdge] = useState<IEdge>();
  const [modalFormIsOpen, setIsModalFormOpen] = useState(false);

  const { register: registerValue, handleSubmit: handleSubmitSearch } =
    useForm<ICustomSearchFormValues>();

  function openModal() {
    setIsModalFormOpen(true);
  }

  function closeModal() {
    setIsModalFormOpen(false);
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
  const onSubmitCustomSearch: SubmitHandler<ICustomSearchFormValues> = (
    data: ICustomSearchFormValues
  ) => {
    for (let i = 0; i < data.numberOfRuns; i++) {
      customSearchNeighbour(data.firstNode, data.lastNode);
    }
    const newNodes = cyRef.current?.elements().jsons();
    setElements(newNodes);
  };

  useEffect(() => {
    const localElements = JSON.parse(window.localStorage.getItem("elements")!);
    setElements(localElements);
    setisInitialNodes(false);
  }, []);

  useEffect(() => {
    if (!isInitialNodes) {
      window.localStorage.setItem("elements", JSON.stringify(elements));
    }
  }, [elements, cyRef]);

  useEffect(() => {
    if (clickedPosition && isCreatingNode) {
      let newId = cyRef.current
        ?.nodes()
        .max(function (ele: any) {
          return parseInt(ele.data("id"));
        })
        .ele.id();

      cyRef.current?.add({
        group: "nodes",
        data: {
          id: newId?.toString()! + 1,
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

  const createRelationship = () => {
    if (relationship.length === 2 && isCreatingRelationship) {
      cyRef.current!.add({
        data: {
          source: relationship[0] ? relationship[0]?.id : "",
          target: relationship[1] ? relationship[1]?.id : "",
          tentativas: 0,
          falhas: 0,
          weight: 5,
        },
      });
      const newNodes = cyRef.current?.elements().jsons();
      setElements(newNodes);

      setRelationship([]);
    }
  };
  const containerStyle = {
    width: "1200px",
    height: "700px",
    border: "1px solid black",
    borderRadius: "17px",
  };

  const deleteElement = (selectedNode: any) => {
    cyRef.current?.remove(`#${selectedNode?.id}`);
    const newNodes = cyRef.current?.elements().jsons();
    setElements(newNodes);
  };

  const challengeEdgeDifficulty = (
    col: any,
    randomEdge: any,
    nodeIDArray: string[]
  ) => {
    let randomEdgeDifficulty = parseInt(randomEdge.data("weight"));
    let chosenNode;
    let randomEdgeTarget = randomEdge.data("target");
    let randomEdgeSource = randomEdge.data("source");
    if (nodeIDArray.includes(randomEdgeTarget)) {
      chosenNode = randomEdgeSource;
    } else {
      chosenNode = randomEdgeTarget;
    }
    let randomEdgeID = randomEdge.data("id");
    let randomEdgeTentativas = parseInt(randomEdge.data("tentativas"));
    let randomEdgeFalhas = parseInt(randomEdge.data("falhas"));

    for (let i = 0; i < 5; i++) {
      const randomNumber = Math.floor(Math.random() * 18);
      cyRef.current
        ?.$(`#${randomEdgeID}`)
        .data({ tentativas: randomEdgeTentativas + 1 });
      if (randomNumber > randomEdgeDifficulty) {
        col.merge(randomEdge);
        col.merge(`#${chosenNode}`);
        nodeIDArray.push(chosenNode);
        return chosenNode;
      }
    }
    cyRef.current?.$(`#${randomEdgeID}`).data({ falhas: randomEdgeFalhas + 1 });
    return "fail";
  };

  const resetStyles = () => {
    cyRef.current?.elements().removeClass("highlighted");
    cyRef.current?.elements().removeClass("firstNode");
    cyRef.current?.elements().removeClass("lastNode");
    cyRef.current?.elements().removeClass("tentativasColor");
    cyRef.current?.elements().removeClass("tentativasWidth");
    cyRef.current?.elements().removeClass("falhasWidth");
    cyRef.current?.elements().removeClass("falhasColor");
    cyRef.current?.elements().removeClass("falhasTentativasWidth");
    cyRef.current?.elements().removeClass("falhasTentativasColor");
  };

  const resetNodesAtributes = () => {
    resetStyles();
    cyRef.current?.elements().data("tentativas", 0);
    cyRef.current?.elements().data("falhas", 0);
  };

  const customSearchNeighbour = (firstNode: string, lastNode: string) => {
    resetStyles();
    let nodeIDArray: string[] = [];
    let col = cyRef.current?.collection();

    col?.merge(`#${firstNode}`);
    cyRef.current?.$(`#${firstNode}`).addClass("firstNode");
    nodeIDArray.push(`${firstNode}`);
    let neighborhoodEdges: any = cyRef.current
      ?.$(`#${firstNode}`)
      .neighborhood()
      .filter(function (ele) {
        return ele.isEdge();
      });
    let randomEdge =
      neighborhoodEdges[Math.floor(Math.random() * neighborhoodEdges.length)];

    let nextNode = challengeEdgeDifficulty(col, randomEdge, nodeIDArray);

    while (nextNode !== "fail" && nextNode !== lastNode) {
      neighborhoodEdges = cyRef.current
        ?.$(`#${nextNode}`)
        .neighborhood()
        .filter(function (ele: any) {
          return ele.isEdge();
        });

      // eslint-disable-next-line no-loop-func
      neighborhoodEdges.filter(function (ele: any) {
        const nodeSource = ele.data(`source`); //2
        const nodeTarget = ele.data(`target`); //3

        const nodeSourceAlreadyInCollection = nodeIDArray.includes(nodeSource); //true
        const nodeTargetAlreadyInCollection = nodeIDArray.includes(nodeTarget); //false
        if (
          nodeTarget === nodeSource ||
          (nodeTargetAlreadyInCollection && nodeSourceAlreadyInCollection)
        ) {
          return false;
        }

        return true;
      });
      if (neighborhoodEdges.length === 0) break;

      randomEdge =
        neighborhoodEdges[Math.floor(Math.random() * neighborhoodEdges.length)];

      nextNode = challengeEdgeDifficulty(col, randomEdge, nodeIDArray);
    }

    col?.addClass("highlighted");
    cyRef.current?.$(`#${lastNode}`).addClass("lastNode");
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let file = e.target.files && e.target?.files?.[0];

    let reader = new FileReader();

    reader.onload = function (e) {
      let content: any = reader.result;

      setElements(JSON.parse(content));
    };

    reader.readAsText(file!);
  };

  const showStyles = (style: string) => {
    console.log("entrei", style);
    cyRef.current?.elements().edges().addClass(style);
  };

  return (
    <div className="wrapper">
      <div className="buttonContainer">
        <form onSubmit={handleSubmitSearch(onSubmitCustomSearch)}>
          <div className="formPathContainer">
            <div className="formInput">
              <h3>First node</h3>
              <input
                {...registerValue("firstNode")}
                type={"number"}
                required
                placeholder="First node"
              />
            </div>
            <div className="formInput">
              <h3>Last node</h3>
              <input
                {...registerValue("lastNode")}
                required
                placeholder="Last node"
                type={"number"}
              />
            </div>
            <div className="formInput">
              <h3>Number of runs </h3>
              <input
                {...registerValue("numberOfRuns")}
                required
                placeholder="Number of runs"
                type={"number"}
              />
            </div>
            <input type="submit" />
          </div>
        </form>

        <button onClick={() => resetStyles()}>Reset styles</button>
        <button onClick={() => resetNodesAtributes()}>
          Reset Node atributes
        </button>
        <button
          onClick={() => {
            setIsCreatingNode(!isCreatingNode);
            setRelationship([]);
            setIsCreatingRelationship(false);
          }}
        >
          Create Node
        </button>
        <button
          onClick={() => {
            setIsCreatingRelationship(!isCreatingRelationship);
            setRelationship([]);
          }}
        >
          Create Relationship
        </button>
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

        <input onChange={handleFileSelected} type="file" />
      </div>
      <div className="mainContainer">
        <CytoscapeComponent
          elements={[...elements]}
          style={containerStyle}
          layout={layouts.klay}
          stylesheet={[
            graphConsts.nodeLabel,
            graphConsts.edgeLabel,
            graphConsts.firstNode,
            graphConsts.lastNode,
            graphConsts.edgeTentativas,
            graphConsts.edgeTentativasColor,
            graphConsts.edgeFalhas,
            graphConsts.edgeFalhasTentativas,
            graphConsts.edgeFalhasColor,
            graphConsts.edgeFalhasTentativasColor,
            graphConsts.customPath,
          ]}
          cy={(cy) => {
            cyRef.current = cy;
            cy.on("drag ", function (evt) {
              const newNodes = cyRef.current?.elements().jsons();
              setElements(newNodes);
            });

            cy.on("tap", "node", function (event) {
              let node = event.target;

              let clickedElement = node._private.data;
              if (node._private.nodeKey === null) {
                setSelectedEdge(clickedElement);
                setPrimaryNode(undefined);
              } else if (node._private.nodeKey !== null) {
                setPrimaryNode(clickedElement);
                setRelationship([...relationship, clickedElement]);

                setSelectedEdge(undefined);
              }
            });

            cy.on("tap", "edge", function (event) {
              let node = event.target;
              let clickedElement = node._private.data;

              setSelectedEdge(clickedElement);
              setPrimaryNode(undefined);
            });
            cy.on("tap", function (event) {
              let evtTarget = event.target;
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

        {isCreatingRelationship ? (
          <div className="containerRelationship">
            <>
              <h2 className="titleRelationship">Create relationship?</h2>
              <div className="subtitle">
                <h2>
                  {relationship[0]?.id
                    ? "Source Node ID"
                    : "Select the Source Node"}
                </h2>
                <h3>{relationship[0]?.id}</h3>
              </div>
              <div className="subtitle">
                <h2>
                  {relationship[1]?.id
                    ? "Target Node ID"
                    : "Select the Target Node"}
                </h2>
                <h3>{relationship[1]?.id}</h3>
              </div>
              <div className="subtitle">
                <button
                  onClick={() => {
                    setIsCreatingRelationship(false);
                    setRelationship([]);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div
                className="subtitle"
                onClick={() => {
                  createRelationship();
                }}
              >
                <button>Confirm</button>
              </div>
            </>
          </div>
        ) : (
          <div className="container">
            <>
              {(primaryNode || selectedEdge) && !isCreatingNode && (
                <div className="header">
                  <h1>Data</h1>

                  <div
                    className="editButton"
                    onClick={() => {
                      if (primaryNode || selectedEdge) openModal();
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
            </>
            {primaryNode && !isCreatingNode && (
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

            {selectedEdge && !isCreatingNode && (
              <>
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

            {isCreatingNode && (
              <>
                <h2 className="titleRelationship">
                  Click on screen to create node
                </h2>

                <button
                  onClick={() => {
                    setIsCreatingNode(false);
                  }}
                >
                  Cancel
                </button>
              </>
            )}

            <div className="configuracao">
              <h2>Configurações</h2>
              <div className="configuracoesButtons">
                <button onClick={() => showStyles("tentativasWidth")}>
                  Tentativas Width
                </button>
                <button onClick={() => showStyles("tentativasColor")}>
                  Tentativas Color
                </button>
                <button onClick={() => showStyles("falhasTentativasColor")}>
                  % falhas/tentativas Color
                </button>
  
                <button onClick={() => showStyles("falhasWidth")}>
                  Falhas width
                </button>
                <button onClick={() => showStyles("falhasColor")}>
                  Falhas color
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalFormIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="modal-form"
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

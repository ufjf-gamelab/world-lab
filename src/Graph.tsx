import { useEffect, useRef, useState } from "react";
import { layouts } from "./layouts";
import { graphConsts } from "./graphConst";
import { GrEdit } from "react-icons/gr";
import { RiDownloadFill } from "react-icons/ri";
import { CgExport } from "react-icons/cg";
import { GrPowerReset } from "react-icons/gr";
import { BsPlusCircle } from "react-icons/bs";
import { BsEraser } from "react-icons/bs";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import CytoscapeComponent from "react-cytoscapejs";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Modal from "react-modal";
interface INode {
  id: string;
  label: string;
  churnCount: number;
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
  difficulty: number;
  attempts: number;
  failures: number;
  label?: string;
}

interface IClickedPosition {
  x: number;
  y: number;
}
type FormValues = {
  label: string;
  churnCount: number;
  attempts?: string;
  difficulty?: number;
  failures?: string;
  newAttributes: {
    attribute: string;
    value: string;
  }[];
};

interface ICustomSearchFormValues {
  firstNode: string;
  lastNode: string;
  numberOfRuns: number;
  randomNumberRange: number;
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
  const [churnRate, setChurnRate] = useState<number>(0);
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

  const onSubmitNode: SubmitHandler<FormValues> = (nodeData: FormValues) => {
    const data = {
      label: nodeData.label,
      churnCount: nodeData.churnCount,
      newAttributes: [...nodeData.newAttributes],
    };

    cyRef.current?.$(`#${primaryNode?.id}`).data(data);
    closeModal();
  };
  const onSubmitEdge: SubmitHandler<FormValues> = (edgeData: FormValues) => {
    const data = {
      label: edgeData.label,
      difficulty: edgeData.difficulty,
      attempts: edgeData.attempts,
      failures: edgeData.failures,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, cyRef]);

  useEffect(() => {
    if (clickedPosition && isCreatingNode) {
      let newId =
        parseInt(
          cyRef.current
            ?.nodes()
            .max(function (ele: any) {
              return parseInt(ele.data("id"));
            })
            .ele.id()!
        ) + 1;

      cyRef.current?.add({
        group: "nodes",
        data: {
          id: newId.toString(),
          label: `Node${newId}`,
          churnCount: 0,
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
          attempts: 0,
          failures: 0,
          difficulty: 5,
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
    let edge = randomEdge.data();
    console.log("edge", edge);
    console.log("edgeattemps", edge.attempts);
    console.log("edge taerger", edge.target);

    let chosenNode;
    let churnNode;
    let edgeTarget = edge.target;
    let edgeSource = edge.source;
    if (nodeIDArray.includes(edgeTarget)) {
      chosenNode = edgeSource;
      churnNode = edgeTarget;
    } else {
      chosenNode = edgeTarget;
      churnNode = edgeSource;
    }

    let edgeFailures = parseInt(edge.failures);

    const wonBattle = randomAbility(edge, chosenNode, col, nodeIDArray);

    if (wonBattle === "fail") {
      let oldChurnCount = parseInt(
        cyRef.current?.$(`#${churnNode}`).data("churnCount")
      );

      cyRef.current?.$(`#${churnNode}`).data({ churnCount: oldChurnCount + 1 });
      cyRef.current?.$(`#${edge.id}`).data({ failures: edgeFailures + 1 });
      return "fail";
    }

    return wonBattle;
  };

  const randomAbility = (
    edge: any,
    chosenNode: any,
    col: any,
    nodeIDArray: any
  ) => {
    let edgeDifficulty = parseInt(edge.difficulty);
    let edgeAttempts = parseInt(edge.attempts);
    for (let i = 0; i < 5; i++) {
      const randomNumber = Math.floor(Math.random() * 30);
      cyRef.current?.$(`#${edge.id}`).data({ attempts: edgeAttempts + 1 });
      if (randomNumber > edgeDifficulty) {
        col.merge();
        col.merge(`#${chosenNode}`);
        nodeIDArray.push(chosenNode);
        return chosenNode;
      }
    }

    return "Fail";
  };

  const adaptiveDifficulty = () => {
    
  };

  const resetStyles = () => {

    cyRef.current?.elements().removeClass("highlighted");
    cyRef.current?.elements().removeData("tentativas");
    cyRef.current?.elements().removeClass("firstNode");
    cyRef.current?.elements().removeClass("lastNode");
    cyRef.current?.elements().removeClass("attemptsColor");
    cyRef.current?.elements().removeClass("attemptsWidth");
    cyRef.current?.elements().removeClass("FailuresWidth");
    cyRef.current?.elements().removeClass("FailuresColor");
    cyRef.current?.elements().removeClass("FailuresAttemptsWidth");
    cyRef.current?.elements().removeClass("FailuresAttemptsColor");
    cyRef.current?.elements().removeClass("FailuresAttemptsLabel");
    cyRef.current?.elements().removeClass("churnCountColor");
  };

  const resetNodesAtributes = () => {
    resetStyles();
    cyRef.current?.elements().data("attempts", 0);
    cyRef.current?.elements().data("failures", 0);
    cyRef.current?.elements().data("churnCount", 0);
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
        })
        .filter(function (ele: any) {
          const nodeSource = ele.data(`source`);
          const nodeTarget = ele.data(`target`);

          const nodeSourceAlreadyInCollection =
            nodeIDArray.includes(nodeSource);
          const nodeTargetAlreadyInCollection =
            nodeIDArray.includes(nodeTarget);
          if (
            nodeTarget === nodeSource ||
            (nodeTargetAlreadyInCollection && nodeSourceAlreadyInCollection)
          ) {
            return false;
          }

          return true;
        });

      // eslint-disable-next-line no-loop-func

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

  const showStyles = (style: string, isEdge = true) => {
    console.log("entrei", style);
    if (isEdge) cyRef.current?.elements().edges().addClass(style);
    else {
      cyRef.current?.elements().nodes().addClass(style);
    }
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

        <GrPowerReset
          fontSize={24}
          color={"black"}
          title="Reset styles"
          onClick={() => resetStyles()}
        />

        <BsEraser
          fontSize={24}
          color={"black"}
          title="  Reset Node atributes"
          onClick={() => resetNodesAtributes()}
        />
        <BsPlusCircle
          fontSize={24}
          color={"black"}
          title="Create node"
          onClick={() => {
            setIsCreatingNode(!isCreatingNode);
            setRelationship([]);
            setIsCreatingRelationship(false);
          }}
        />

        <VscGitPullRequestCreate
          fontSize={24}
          color={"black"}
          title="Create Relationship"
          onClick={() => {
            setIsCreatingRelationship(!isCreatingRelationship);
            setRelationship([]);
          }}
        />

        <a
          className="download-link"
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(elements)
          )}`}
          download="Graph.json"
        >
          <RiDownloadFill
            fontSize={24}
            color={"black"}
            title="Download Graph"
          />
        </a>

        <CgExport fontSize={24} color={"black"} title="Insert Graph" />

        <input id="download" onChange={handleFileSelected} type="file"></input>
      </div>
      <div className="mainContainer">
        <CytoscapeComponent
          elements={[...elements]}
          style={containerStyle}
          layout={layouts.klay}
          stylesheet={[
            graphConsts.nodeLabel,
            graphConsts.edgeFailuresAttemptsLabel,
            graphConsts.edgeAttempts,
            graphConsts.edgeAttemptsColor,
            graphConsts.edgeFailures,
            graphConsts.nodeChurnCountColor,
            graphConsts.edgeFailuresAttempts,
            graphConsts.edgeFailuresColor,
            graphConsts.edgeFailuresAttemptsColor,
            graphConsts.edgeFailuresAttemptsColor,
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
                  <h2>Churn count</h2>
                  <h3>{primaryNode?.churnCount}</h3>
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
                  <h2>Difficulty</h2>
                  <h3>{selectedEdge?.difficulty}</h3>
                </div>
                <div className="subtitle">
                  <h2>attempts</h2>
                  <h3>{selectedEdge?.attempts}</h3>
                </div>
                <div className="subtitle">
                  <h2>Failures</h2>
                  <h3>{selectedEdge?.failures}</h3>
                </div>
              </>
            )}

            {isCreatingNode && (
              <>
                <h2 className="titleCreateNode">
                  Click on screen to create node
                </h2>

                <button
                  className="buttonCreateNode"
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
                <button onClick={() => showStyles("attemptsWidth")}>
                  Attempts Width
                </button>
                <button onClick={() => showStyles("attemptsColor")}>
                  Attempts Color
                </button>
                <button onClick={() => showStyles("FailuresAttemptsColor")}>
                  % failures/attempts Color
                </button>

                <button onClick={() => showStyles("FailuresWidth")}>
                  Failures width
                </button>
                <button onClick={() => showStyles("FailuresColor")}>
                  Failures color
                </button>
                <button onClick={() => showStyles("churnCountColor", false)}>
                  Node Churn Count color
                </button>
                <button onClick={() => showStyles("FailuresAttemptsLabel")}>
                  Failures / Attempts label
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
        ariaHideApp={false}
        contentLabel="modal-form"
      >
        {primaryNode && (
          <form onSubmit={handleSubmit(onSubmitNode)}>
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
                <h3>Churn Count</h3>
                <input
                  type="number"
                  {...register("churnCount", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  defaultValue={primaryNode?.churnCount}
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
                        defaultValue={field.attribute}
                      />
                      <input
                        placeholder="name"
                        {...register(
                          `newAttributes.${index}.value` as const,
                          {}
                        )}
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
                <h3>Difficulty</h3>
                <input
                  type="number"
                  {...register("difficulty", {
                    valueAsNumber: true,
                    required: true,
                  })}
                  defaultValue={selectedEdge?.difficulty}
                />
              </div>
              <div className="formInput">
                <h3>attempts</h3>
                <input
                  type="number"
                  {...register("attempts")}
                  defaultValue={selectedEdge?.attempts}
                />
              </div>
              <div className="formInput">
                <h3>failures</h3>
                <input
                  type="number"
                  {...register("failures")} // send value to hook form
                  defaultValue={selectedEdge?.failures}
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
                        defaultValue={field.attribute}
                      />
                      <input
                        placeholder="name"
                        {...register(
                          `newAttributes.${index}.value` as const,
                          {}
                        )}
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

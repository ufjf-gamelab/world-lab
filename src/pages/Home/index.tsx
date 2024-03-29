import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { Information } from "./Information";
import { Graph } from "./Graph";
import { graphConsts } from "../../graphConst";
import { Toolbar } from "./Toolbar";
import { ModalForm } from "./ModalForm";
import {
  FormValues,
  IClickedPosition,
  ICustomSearchFormValues,
  IEdge,
  INode,
} from "./types/index";

import { churnModelValues } from "../../helpers/churnModels";

import { playerModelValues } from "../../helpers/playerModels";
import { challengeModelValues } from "../../helpers/challengeModels";
import "./styles.css";

import loadingIcon from "../../assets/loadingIcon.svg";
import { MdCenterFocusWeak, MdZoomIn, MdZoomOut } from "react-icons/md";
import { calculateProbabilityEloRating } from "../../helpers";
const Home = () => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [isCreatingRelationship, setIsCreatingRelationship] = useState(false);
  const [isInitialNodes, setisInitialNodes] = useState(true);
  const [isLoadingData, setisLoadingData] = useState(false);
  const [numberOfCreatedNodes, setNumberOfCreatedNodes] = useState<number>(0);
  const [primaryNode, setPrimaryNode] = useState<INode | null>(null);
  const [relationship, setRelationship] = useState<INode[] | []>([]);
  const [clickedPosition, setClickedPosition] = useState<IClickedPosition>();
  const [elements, setElements] = useState<any>(graphConsts.defaultGraph);
  const [selectedEdge, setSelectedEdge] = useState<IEdge | null>(null);
  const [actualPlayerRating, setActualPlayerRating] = useState<number>(1600);
  const [isSimulationFinished, setIsSimulationFinished] =
    useState<boolean>(false);
  const [playerEmotion, setPlayerEmotion] = useState(50);
  const [estimatedPlayerRating, setEstimatedPlayerRating] =
    useState<number>(1600);
  const [layout, setLayout] = useState(null);

  const [simulatorData, setSimulatorData] = useState<ICustomSearchFormValues>();

  const [modalFormIsOpen, setIsModalFormOpen] = useState(false);

  function openModal() {
    setIsModalFormOpen(true);
  }

  function closeModal() {
    setIsModalFormOpen(false);
  }

  const onSubmitNode: SubmitHandler<FormValues> = (nodeData: FormValues) => {
    const data = {
      label: nodeData.label,
      churnCount: nodeData.churnCount,
      boredomChurnCount: nodeData.boredomChurnCount,
    };

    cyRef.current?.$(`#${primaryNode?.id}`).data(data);
    setPrimaryNode(null);
    closeModal();
  };
  const onSubmitEdge: SubmitHandler<FormValues> = (edgeData: FormValues) => {
    const data = {
      label: edgeData.label,
      difficulty: edgeData.difficulty,
      attempts: edgeData.attempts,
      failures: edgeData.failures,
      probabilityOfWinning: edgeData.probabilityOfWinning,
    };

    cyRef.current?.$(`#${selectedEdge?.id}`).data(data);

    setSelectedEdge(null);
    closeModal();
  };
  const onSubmitCustomSearch: SubmitHandler<ICustomSearchFormValues> = (
    data: ICustomSearchFormValues
  ) => {
    setisLoadingData(true);
    changeStyleSettings("firstNodeLabel", false);
    changeStyleSettings("lastNodeLabel", false);
    setActualPlayerRating(data.playerRating);
    setSimulatorData(data);
  };

  useEffect(() => {
    const localElements = JSON.parse(window.localStorage.getItem("elements")!);
    setElements(localElements);
    setisInitialNodes(false);
    cyRef.current?.fit();
  }, []);

  useEffect(() => {
    if (!isInitialNodes) {
      window.localStorage.setItem("elements", JSON.stringify(elements));
    }
  }, [elements]);

  useEffect(() => {
    cyRef.current?.fit();
  }, [cyRef.current]);

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
          boredomChurnCount: 0,
        },
        position: { x: clickedPosition.x, y: clickedPosition.y },
      });

      const newNodes = cyRef.current?.elements().jsons();
      setElements(newNodes);
      setNumberOfCreatedNodes((prevnodes) => prevnodes + 1);
    } else if (!isCreatingNode) {
      setNumberOfCreatedNodes(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickedPosition]);
  useEffect(() => {
    if (!isSimulationFinished) return;

    if (simulatorData?.difficultyModel === "adaptive") {
      if (simulatorData.churnModel === "flow") {
        adaptiveDifficultyFlowChanges(simulatorData.challengeModel);
      } else {
        adaptiveDifficultyChanges(simulatorData.challengeModel);
      }
    }

    setIsSimulationFinished(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulationFinished]);

  useEffect(() => {
    if (!simulatorData) return;
    setisLoadingData(true);

    for (let i = 0; i < simulatorData.numberOfRuns; i++) {
      playerSimulatorPath(simulatorData);
    }

    const newNodes = cyRef.current?.elements().jsons();
    setElements(newNodes);
    setisLoadingData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulatorData]);

  const adaptiveDifficultyChanges = (challengeModel: string) => {
    let difficultyParameter: string;

    if (challengeModel === "eloRating") {
      difficultyParameter = "difficulty";
    } else {
      difficultyParameter = "probabilityOfWinning";
    }
    let maxChurnNode = cyRef?.current?.nodes().max(function (ele: any) {
      return ele.data("churnCount");
    });

    let aresta = maxChurnNode?.ele.connectedEdges().max(function (ele: any) {
      return ele.data("failures") / ele.data("attempts");
    });
    let sourceDifficultyID = aresta?.ele.data("source");
    let targetDifficultyID = aresta?.ele.data("target");

    let sourceNodeEdges = cyRef.current
      ?.$(`#${sourceDifficultyID}`)
      .connectedEdges();
    let targetNodeEdges = cyRef.current
      ?.$(`#${targetDifficultyID}`)
      .connectedEdges();

    let elements = cyRef?.current?.elements(); // Obtenha os elementos do seu gráfico
    let sum = 0;
    let count = 0;
    let average = 0;

    let sourceNodeAverageDifficulty = 0;
    let countSourceEdges: number = 0;

    let targetNodeAverageDifficulty = 0;
    let countTargetEdges: number = 0;

    elements?.forEach(function (ele) {
      let difficulty = ele.data(difficultyParameter);

      if (difficulty) {
        sum += difficulty;
        if (!ele.isNode()) count++;
      }
    });

    if (count > 0) {
      average = sum / count;
    }

    if (sourceNodeEdges && sourceNodeEdges?.size() > 1) {
      sourceNodeEdges
        ?.filter(function (ele: any) {
          return ele.id() !== aresta?.ele.id();
        })
        .forEach(function (ele) {
          let difficulty = ele.data(difficultyParameter);

          sourceNodeAverageDifficulty += difficulty;
          countSourceEdges++;
        });
      sourceNodeAverageDifficulty /= countSourceEdges;
    } else {
      targetNodeAverageDifficulty = average;
    }
    if (targetNodeEdges && targetNodeEdges?.size() > 1) {
      targetNodeEdges
        ?.filter(function (ele: any) {
          return ele.id() !== aresta?.ele.id();
        })
        .forEach(function (ele) {
          let difficulty = ele.data(difficultyParameter);

          targetNodeAverageDifficulty += difficulty;
          countTargetEdges++;
        });

      targetNodeAverageDifficulty /= countTargetEdges;
    } else {
      targetNodeAverageDifficulty = average;
    }

    let newDifficulty =
      (targetNodeAverageDifficulty + sourceNodeAverageDifficulty + average) / 3;
    cyRef.current
      ?.$(`#${aresta?.ele.id()}`)
      .data({ difficultyParameter: newDifficulty });
  };

  const adaptiveDifficultyFlowChanges = (challengeModel: string) => {
    let difficultyParameter: string;

    if (challengeModel === "eloRating") {
      difficultyParameter = "difficulty";
    } else {
      difficultyParameter = "probabilityOfWinning";
    }

    let maxChurnNode;
    let aresta: any;
    if (playerEmotion > 60) {
      maxChurnNode = cyRef?.current?.nodes().max(function (ele: any) {
        return ele.data("churnCount");
      });
      aresta = maxChurnNode?.ele.connectedEdges().max(function (ele: any) {
        return ele.data("failures") / ele.data("attempts");
      });
    } else {
      maxChurnNode = cyRef?.current?.nodes().max(function (ele: any) {
        return ele.data("boredomChurnCount");
      });

      aresta = maxChurnNode?.ele.connectedEdges().max(function (ele: any) {
        return ele.data("attempts") / ele.data("failures");
      });
    }

    console.log("estimatedPlayerRating", estimatedPlayerRating);
    console.log("Node e Aresta", maxChurnNode?.ele.id(), aresta.ele.data());
    let sourceDifficultyID = aresta?.ele.data("source");
    let targetDifficultyID = aresta?.ele.data("target");

    let sourceNodeEdges = cyRef.current
      ?.$(`#${sourceDifficultyID}`)
      .connectedEdges();
    let targetNodeEdges = cyRef.current
      ?.$(`#${targetDifficultyID}`)
      .connectedEdges();

    let elements = cyRef?.current?.elements(); // Obtenha os elementos do seu gráfico
    let sum = 0;
    let count = 0;
    let average = 0;

    let sourceNodeAverageDifficulty = 0;
    let countSourceEdges: number = 0;

    let targetNodeAverageDifficulty = 0;
    let countTargetEdges: number = 0;

    elements?.forEach(function (ele) {
      let difficulty = ele.data(difficultyParameter);

      if (difficulty) {
        sum += difficulty;
        if (!ele.isNode()) count++;
      }
    });

    if (count > 0) {
      average = sum / count;
    }

    if (sourceNodeEdges && sourceNodeEdges?.size() > 1) {
      sourceNodeEdges
        ?.filter(function (ele: any) {
          return ele.id() !== aresta?.ele.id();
        })
        .forEach(function (ele) {
          let difficulty = ele.data(difficultyParameter);

          sourceNodeAverageDifficulty += difficulty;
          countSourceEdges++;
        });
      sourceNodeAverageDifficulty /= countSourceEdges;
    } else {
      targetNodeAverageDifficulty = average;
    }
    if (targetNodeEdges && targetNodeEdges?.size() > 1) {
      targetNodeEdges
        ?.filter(function (ele: any) {
          return ele.id() !== aresta?.ele.id();
        })
        .forEach(function (ele) {
          let difficulty = ele.data(difficultyParameter);

          targetNodeAverageDifficulty += difficulty;
          countTargetEdges++;
        });

      targetNodeAverageDifficulty /= countTargetEdges;
    } else {
      targetNodeAverageDifficulty = average;
    }

    let newDifficulty =
      (targetNodeAverageDifficulty + sourceNodeAverageDifficulty) / 2;

    newDifficulty = (newDifficulty + estimatedPlayerRating) / 2;
    cyRef.current
      ?.$(`#${aresta?.ele.id()}`)
      .data({ difficultyParameter: newDifficulty });
  };
  const createRelationship = () => {
    if (relationship.length === 2 && isCreatingRelationship) {
      cyRef.current!.add({
        data: {
          source: relationship[0] ? relationship[0]?.id : "",
          target: relationship[1] ? relationship[1]?.id : "",
          attempts: 0,
          failures: 0,
          difficulty: 1600,
          probabilityOfWinning: 50,
        },
      });
      const newNodes = cyRef.current?.elements().jsons();
      setElements(newNodes);

      setRelationship([]);
    }
  };

  const deleteElement = (selectedNode: any) => {
    cyRef.current?.remove(`#${selectedNode?.id}`);
    const newNodes = cyRef.current?.elements().jsons();
    setElements(newNodes);
  };

  const playerSimulatorPath = (simulatorData: ICustomSearchFormValues) => {
    resetStyles();
    let playerPath = playerModelPath(simulatorData);
    let playerStress = 50;
    let failedToFinish = false;
    let playerRating = simulatorData.playerRating;
    let estimatingPlayerRating = 1600;

    let simulatingPath = playerPath.filter(function (
      ele: any,
      i: any,
      eles: any
    ) {
      if (failedToFinish) return false;
      if (ele.isEdge()) return true;
      if (ele.id() === simulatorData.lastNode) return true;

      let initialNodeData = ele.data();
      let edge = eles[i + 1];
      let edgeFailures = edge.data().failures;

      let duelValues;
      let wonDuel;
      let rating;

      let nodeOperatingData = {
        edge,
        simulatorData,
        playerRating,
        estimatingPlayerRating,
        playerStress,
      };

      const chosenChallengeModel =
        simulatorData?.challengeModel as keyof typeof challengeModelValues;
      duelValues =
        challengeModelValues[chosenChallengeModel](nodeOperatingData);

      if (simulatorData.churnModel === "flow") {
        [wonDuel, estimatingPlayerRating, playerStress] = flowModel(
          duelValues,
          nodeOperatingData
        );
      } else {
        const chosenChurnModel =
          simulatorData?.churnModel as keyof typeof churnModelValues;
        wonDuel = churnModelValues[chosenChurnModel](
          duelValues,
          nodeOperatingData,
          cyRef
        );
      }

      if (!wonDuel) {
        failedToFinish = true;

        if (simulatorData.churnModel !== "flow" || playerStress >= 60) {
          cyRef.current
            ?.$(`#${initialNodeData.id}`)
            .data({ churnCount: initialNodeData.churnCount + 1 });
          cyRef.current
            ?.$(`#${edge.id()}`)
            .data({ failures: edgeFailures + 1 });
        } else if (simulatorData.churnModel === "flow" && playerStress <= 40) {
          cyRef.current
            ?.$(`#${initialNodeData.id}`)
            .data({ boredomChurnCount: initialNodeData.boredomChurnCount + 1 });
        }
      } else {
        if (simulatorData.progressionModel === "incremental") {
          estimatingPlayerRating += 100;
          playerRating += 100;
        }
      }
    });

    setEstimatedPlayerRating(estimatingPlayerRating);
    cyRef?.current?.$(`#${simulatorData.firstNode}`).addClass("firstNodeLabel");
    cyRef?.current?.$(`#${simulatorData.lastNode}`).addClass("lastNodeLabel");
    setIsSimulationFinished(true);
  };

  const resetStyles = () => {
    cyRef.current?.elements().removeClass(graphConsts.classStylesNames);
    const newNodes = cyRef.current?.elements().jsons();
    setElements(newNodes);
  };

  const resetNodesAtributes = () => {
    resetStyles();
    setActualPlayerRating(0);
    setSimulatorData(undefined);
    setEstimatedPlayerRating(1600);
    cyRef.current?.elements().data("attempts", 0);
    cyRef.current?.elements().data("failures", 0);
    cyRef.current?.elements().data("churnCount", 0);
    cyRef.current?.elements().data("boredomChurnCount", 0);
    const newNodes = cyRef.current?.elements().jsons();
    setElements(newNodes);
  };

  const flowModel = (duel: number[], data: any) => {
    let edgeData = data.edge.data();
    let edgeAttempts = edgeData.attempts;
    let edgeFailures = edgeData.failures;
    let playerHability;
    let currentStress = data.playerStress;
    let botHability = duel[1];
    let rating = data.estimatingPlayerRating;
    let differenceInDamage;

    while (currentStress > 40 && currentStress < 60) {
      data.estimatingPlayerRating = rating;
      playerHability = Math.floor(Math.random() * 100);
      cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
      edgeAttempts += 1;
      differenceInDamage = playerHability - botHability;

      currentStress = changePlayerEmotionState(
        currentStress,
        differenceInDamage
      );

      if (playerHability > botHability) {
        rating = updateEstimatedPlayerRating(data, true);
        return [true, rating, currentStress];
      }

      cyRef.current?.$(`#${edgeData.id}`).data({ failures: edgeFailures + 1 });
      edgeFailures += 1;
      rating = updateEstimatedPlayerRating(data, false);
    }
    data.estimatingPlayerRating = rating;
    return [false, rating, currentStress];
  };

  const changePlayerEmotionState = (
    playerStress: number,
    differenceInDamage: number
  ) => {
    //entre 40 e 60 é a zona do flow
    //agente ganhou

    if (differenceInDamage > 10 && differenceInDamage < 20) {
      setPlayerEmotion((prevPlayerEmotion) => prevPlayerEmotion - 2);
      return playerStress - 2;
    } else if (differenceInDamage > 20 && differenceInDamage < 30) {
      setPlayerEmotion((prevPlayerEmotion) => prevPlayerEmotion - 3);
      return playerStress - 3;
    } else if (differenceInDamage >= 30) {
      setPlayerEmotion((prevPlayerEmotion) => prevPlayerEmotion - 5);
      return playerStress - 5;
    }

    // agente perdeu
    else if (differenceInDamage < 0 && differenceInDamage > -10) {
      setPlayerEmotion((prevPlayerEmotion) => prevPlayerEmotion + 2);
      return playerStress + 2;
    } else if (differenceInDamage < -20 && differenceInDamage > -30) {
      setPlayerEmotion((prevPlayerEmotion) => prevPlayerEmotion + 3);
      return playerStress + 3;
    } else if (differenceInDamage <= -30) {
      setPlayerEmotion((prevPlayerEmotion) => prevPlayerEmotion + 5);
      return playerStress + 5;
    }

    return playerStress;
  };

  const updateEstimatedPlayerRating = (data: any, playerWon: boolean) => {
    let Ra = data.estimatingPlayerRating;

    let edgeData = data.edge.data();
    const Rb = edgeData.difficulty;

    let playerWinProbability = calculateProbabilityEloRating(Rb, Ra);

    if (playerWon === true) {
      Ra = Ra + 32 * (1 - playerWinProbability);
    } else {
      Ra = Ra + 32 * (0 - playerWinProbability);
    }

    return Ra;
  };

  const playerModelPath = (data: ICustomSearchFormValues) => {
    resetStyles();

    let playerPath;

    const chosenPlayerModel =
      simulatorData?.playerModel as keyof typeof playerModelValues;

    playerPath = playerModelValues[chosenPlayerModel](data, cyRef);

    return playerPath;
  };

  const changeStyleSettings = (className: string, applyStyle: boolean) => {
    if (applyStyle) {
      cyRef.current?.elements().addClass(className);
    } else {
      cyRef.current?.elements().removeClass(className);
    }
  };
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let file = e.target.files && e.target?.files?.[0];

    let reader = new FileReader();

    reader.onload = function (e) {
      let content: any = reader.result;

      setElements(JSON.parse(content));
    };

    reader.readAsText(file!);
    resetStyles();
  };

  return (
    <div className="wrapper">
      <Toolbar
        onSubmitCustomSearch={onSubmitCustomSearch}
        handleFileSelected={handleFileSelected}
        resetStyles={resetStyles}
        resetNodesAtributes={resetNodesAtributes}
        elements={elements}
      />
      <div className="mainContainer">
        <div className="graphContainer">
          {isLoadingData && (
            <div className="loadingIconContainer">
              <img src={loadingIcon} alt="loading" />
            </div>
          )}

          <Graph
            elements={elements}
            setSelectedEdge={setSelectedEdge}
            setElements={setElements}
            setPrimaryNode={setPrimaryNode}
            setRelationship={setRelationship}
            relationship={relationship}
            setClickedPosition={setClickedPosition}
            isCreatingNode={isCreatingNode}
            cyRef={cyRef}
            layout={layout}
          />

          <div className="graphActions">
            <MdZoomIn
              fontSize={30}
              title="zoomIn"
              onClick={() => {
                let currentZoom = cyRef?.current?.zoom();
                cyRef?.current?.zoom(currentZoom && currentZoom + 0.1);
              }}
            />
            <MdCenterFocusWeak
              fontSize={30}
              title="center"
              onClick={() => {
                cyRef.current?.fit();
              }}
            />
            <MdZoomOut
              fontSize={30}
              title="zoomOut"
              onClick={() => {
                let currentZoom = cyRef?.current?.zoom();
                cyRef?.current?.zoom(currentZoom && currentZoom - 0.1);
              }}
            />
          </div>
        </div>
        <Information
          isCreatingRelationship={isCreatingRelationship}
          relationship={relationship}
          setIsCreatingRelationship={setIsCreatingRelationship}
          setRelationship={setRelationship}
          createRelationship={createRelationship}
          primaryNode={primaryNode}
          selectedEdge={selectedEdge}
          openModal={openModal}
          isCreatingNode={isCreatingNode}
          deleteElement={deleteElement}
          setSelectedEdge={setSelectedEdge}
          setPrimaryNode={setPrimaryNode}
          setIsCreatingNode={setIsCreatingNode}
          changeStyleSettings={changeStyleSettings}
          setLayout={setLayout}
          numberOfCreatedNodes={numberOfCreatedNodes}
        />
      </div>
      <ModalForm
        modalFormIsOpen={modalFormIsOpen}
        setIsModalFormOpen={setIsModalFormOpen}
        closeModal={closeModal}
        primaryNode={primaryNode}
        onSubmitNode={onSubmitNode}
        selectedEdge={selectedEdge}
        onSubmitEdge={onSubmitEdge}
      />
    </div>
  );
};

export { Home };

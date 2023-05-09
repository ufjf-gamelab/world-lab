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
import { progressionModelValues } from "../../helpers/progressionModels";
import { layouts } from "./layouts";
const Home = () => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [isCreatingRelationship, setIsCreatingRelationship] = useState(false);
  const [isInitialNodes, setisInitialNodes] = useState(true);
  const [primaryNode, setPrimaryNode] = useState<INode | null>(null);
  const [relationship, setRelationship] = useState<INode[] | []>([]);
  const [clickedPosition, setClickedPosition] = useState<IClickedPosition>();
  const [elements, setElements] = useState<any>(graphConsts.defaultGraph);
  const [selectedEdge, setSelectedEdge] = useState<IEdge | null>(null);
  const [actualPlayerRating, setActualPlayerRating] = useState<number | null>(
    null
  );
  const [estimatedPlayerRating, setEstimatedPlayerRating] =
    useState<number>(1500);
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
    setSimulatorData(data);
    setActualPlayerRating(data.playerRating);
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
    cyRef.current?.fit();
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
  useEffect(() => {
    if (!simulatorData) return;

    for (let i = 0; i < simulatorData.numberOfRuns; i++) {
      playerSimulatorPath(simulatorData);
    }
    const newNodes = cyRef.current?.elements().jsons();
    setElements(newNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulatorData]);

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

    let failedToFinish = false;

    let playerRating = simulatorData.playerRating;
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

      let edgeData = edge.data();

      let duelValues;
      let wonDuel;
      let nodeOperatingData = {
        edge,
        playerRating,
        setEstimatedPlayerRating,
        estimatedPlayerRating,
      };

      const chosenChallengeModel =
        simulatorData?.challengeModel as keyof typeof challengeModelValues;
      duelValues =
        challengeModelValues[chosenChallengeModel](nodeOperatingData);

      const chosenChurnModel =
        simulatorData?.churnModel as keyof typeof churnModelValues;
      wonDuel = churnModelValues[chosenChurnModel](
        duelValues,
        nodeOperatingData,
        cyRef
      );

      if (!wonDuel) {
        failedToFinish = true;
        cyRef.current
          ?.$(`#${edgeData.id}`)
          .data({ failures: edgeData.failures + 1 });
        cyRef.current
          ?.$(`#${initialNodeData.id}`)
          .data({ churnCount: initialNodeData.churnCount + 1 });
      } else {
        const chosenProgressionModel =
          simulatorData?.progressionModel as keyof typeof progressionModelValues;
        playerRating =
          progressionModelValues[chosenProgressionModel](nodeOperatingData);
      }

      return true;
    });

    simulatingPath?.addClass("highlighted");

    // let edge = randomEdge.data();

    // if (col?.contains(cyRef?.current!.$(`#${edge.target}`))) {
    //   nextNode = edge.source;
    //   churnNode = edge.target;
    // } else {
    //   nextNode = edge.target;
    //   churnNode = edge.source;
    // }

    // let edgeFailuresWidth = edge.failures;
    // let nodeOperatingData = { randomEdge, nextNode, col, churnNode };
    // let difficultyOperatingData = {
    //   botDifficulty,
    //   setBotDifficulty,
    //   randomEdge,
    // };

    // const chosenChallengeModel =
    //   simulatorData?.difficultyModel as keyof typeof difficultyModelValues;
    // difficultyModelValues[chosenChallengeModel](
    //   difficultyOperatingData,
    //   cyRef
    // );

    // const duelValues = eloRatingChallenge(
    //   nodeOperatingData,
    //   actualPlayerRating
    // );

    // const chosenChurnModel =
    //   simulatorData?.churnModel as keyof typeof churnModelValues;
    // nextNode = churnModelValues[chosenChurnModel](
    //   duelValues,
    //   nodeOperatingData,
    //   cyRef
    // );

    // if (nextNode === "fail") {
    //   let oldChurnCount = parseInt(
    //     cyRef.current?.$(`#${churnNode}`).data("churnCount")
    //   );

    //   cyRef.current?.$(`#${churnNode}`).data({ churnCount: oldChurnCount + 1 });
    //   cyRef.current?.$(`#${edge.id}`).data({ failures: edgeFailuresWidth + 1 });
    // }

    // return nextNode;
  };

  const resetStyles = () => {
    cyRef.current?.fit();
    cyRef.current?.elements().removeClass(graphConsts.classStylesNames);
  };

  const resetNodesAtributes = () => {
    resetStyles();
    setActualPlayerRating(null);
    setSimulatorData(undefined);
    setEstimatedPlayerRating(1500);
    cyRef.current?.elements().data("attempts", 0);
    cyRef.current?.elements().data("failures", 0);
    cyRef.current?.elements().data("churnCount", 0);
  };

  // const playerSimulatorPath = (data: ICustomSearchFormValues) => {
  //   resetStyles();
  //   setChurnRate(0);
  //   let col = cyRef.current?.collection();
  //   col?.merge(`#${data?.firstNode}`);
  //   let neighborhoodEdges: any = getNodeEdges(cyRef, data?.firstNode, col);

  //   let randomEdge =
  //     neighborhoodEdges[Math.floor(Math.random() * neighborhoodEdges.length)];

  //   let nextNode = getNextNode(col, randomEdge);

  //   while (nextNode !== "fail" && nextNode !== data?.lastNode) {
  //     neighborhoodEdges = getNodeEdges(cyRef, nextNode, col);

  //     if (neighborhoodEdges.length === 0) break;

  //     randomEdge =
  //       neighborhoodEdges[Math.floor(Math.random() * neighborhoodEdges.length)];

  //     nextNode = getNextNode(col, randomEdge);
  //   }

  //   col?.addClass("highlighted");
  // };

  const playerModelPath = (data: ICustomSearchFormValues) => {
    resetStyles();

    let playerPath;

    const chosenPlayerModel =
      simulatorData?.playerModel as keyof typeof playerModelValues;

    playerPath = playerModelValues[chosenPlayerModel](data, cyRef);

    return playerPath;
  };
  const setInvariableGraphDifficulty = (difficulty: number = 1600) => {
    cyRef.current
      ?.elements()
      .filter(function (ele) {
        return ele.isEdge();
      })
      .data({
        difficulty: difficulty,
        attempts: 0,
        failures: 0,
        probabilityOfWinning: 50,
      });
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
  };

  return (
    <div className="wrapper">
      <h3> Player Rating ${actualPlayerRating}</h3>
      <h3> Player Rating estimation ${estimatedPlayerRating}</h3>
      <Toolbar
        onSubmitCustomSearch={onSubmitCustomSearch}
        handleFileSelected={handleFileSelected}
        resetStyles={resetStyles}
        resetNodesAtributes={resetNodesAtributes}
        setInvariableGraphDifficulty={setInvariableGraphDifficulty}
        elements={elements}
        setRelationship={setRelationship}
        setIsCreatingNode={setIsCreatingNode}
        setIsCreatingRelationship={setIsCreatingRelationship}
        isCreatingNode={isCreatingNode}
        isCreatingRelationship={isCreatingRelationship}
      />
      <div className="mainContainer">
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

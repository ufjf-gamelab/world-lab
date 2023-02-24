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
import {
  eloRatingChallenge,
  getNodeEdges,
  initializeStandardDifficulty,
} from "../../helpers";
import { churnModelValues } from "../../helpers/churnModels";
import { difficultyModelValues } from "../../helpers/difficultyModels";
import { explorerModel, playerModelValues } from "../../helpers/playerModels";

const Home = () => {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [isCreatingNode, setIsCreatingNode] = useState(false);
  const [isCreatingRelationship, setIsCreatingRelationship] = useState(false);
  const [isInitialNodes, setisInitialNodes] = useState(true);
  const [primaryNode, setPrimaryNode] = useState<INode>();
  const [relationship, setRelationship] = useState<INode[] | []>([]);
  const [clickedPosition, setClickedPosition] = useState<IClickedPosition>();
  const [elements, setElements] = useState<any>(graphConsts.defaultGraph);
  const [selectedEdge, setSelectedEdge] = useState<IEdge>();
  const [actualPlayerRating, setActualPlayerRating] = useState<number>(1500);
  const [botDifficulty, setBotDifficulty] = useState<number>(1600);
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
      probabilityOfWinning: edgeData.probabilityOfWinning,
      newAttributes: [...edgeData.newAttributes],
    };

    cyRef.current?.$(`#${selectedEdge?.id}`).data(data);
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
    console.log(
      "🚀 ~ file: index.tsx:156 ~ playerSimulatorPath ~ playerPath",
      playerPath
    );

    let failedToFinish = false;

    let simulatingPath = playerPath.filter(function (
      ele: any,
      i: any,
      eles: any
    ) {
      if (failedToFinish) return false;
      if (ele.isEdge()) return true;
      if (ele.id() === simulatorData.lastNode) return true;

      let edge = eles[i + 1]?.data();
      console.log(
        "🚀 ~ file: index.tsx:170 ~ playerSimulatorPath ~ edge",
        edge.probabilityOfWinning
      );

      let playerWinningChances = Math.random() * edge.probabilityOfWinning;
      console.log(
        "🚀 ~ file: index.tsx:175 ~ playerSimulatorPath ~ playerWinningChances",
        playerWinningChances
      );
      let playerLosingChances =
        Math.random() * (100 - edge.probabilityOfWinning);

      console.log(
        "🚀 ~ file: index.tsx:177 ~ playerSimulatorPath ~ playerLosingChances",
        playerLosingChances
      );
      if (playerWinningChances > playerLosingChances) return true;

      failedToFinish = true;
      return false;
    });

    console.log(
      "🚀 ~ file: index.tsx:167 ~ playerSimulatorPath ~ simulatingPath",
      simulatingPath
    );
    simulatingPath?.addClass("highlighted");
    // let edge = randomEdge.data();

    // if (col?.contains(cyRef?.current!.$(`#${edge.target}`))) {
    //   nextNode = edge.source;
    //   churnNode = edge.target;
    // } else {
    //   nextNode = edge.target;
    //   churnNode = edge.source;
    // }

    // let edgeFailures = edge.failures;
    // let nodeOperatingData = { randomEdge, nextNode, col, churnNode };
    // let difficultyOperatingData = {
    //   botDifficulty,
    //   setBotDifficulty,
    //   randomEdge,
    // };

    // const chosenDifficultyModel =
    //   simulatorData?.difficultyModel as keyof typeof difficultyModelValues;
    // difficultyModelValues[chosenDifficultyModel](
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
    //   cyRef.current?.$(`#${edge.id}`).data({ failures: edgeFailures + 1 });
    // }

    // return nextNode;
  };

  const resetStyles = () => {
    cyRef.current?.elements().removeClass(graphConsts.classStylesNames);
  };

  const showStyles = (style: string, isEdge = true) => {
    if (isEdge) cyRef.current?.elements().edges().addClass(style);
    else {
      cyRef.current?.elements().nodes().addClass(style);
    }
  };

  const resetNodesAtributes = () => {
    resetStyles();
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
        />

        <Information
          isCreatingRelationship={isCreatingRelationship}
          showStyles={showStyles}
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
        />
      </div>
      <ModalForm
        modalFormIsOpen={modalFormIsOpen}
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

import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import Modal from "react-modal";
import { Information } from "./Information";
import { Graph } from "./Graph";
import { graphConsts } from "../../graphConst";
import { Toolbar } from "./Toolbar";
import { ModalForm } from "./ModalForm";
interface INode {
  id: string;
  label: string;
  churnCount: number;
  newAttributes?: {
    attribute: string;
    value: string;
  }[];
}

interface ISearchParameters {
  chosenNode: string;
  col: cytoscape.CollectionReturnValue;
  randomNode: any;
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

interface ICustomSearchFormValues {
  firstNode: string;
  lastNode: string;
  challengeModel: string;
  churnModel: string;
  difficultyModel: string;
  numberOfRuns: number;
  playerRating: number;
}

interface FormValues {
  label: string;
  churnCount: number;
  attempts?: number;
  difficulty?: number;
  failures?: string;
  newAttributes: {
    attribute: string;
    value: string;
  }[];
}

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
  const [churnRate, setChurnRate] = useState<number>(0);
  const [actualPlayerRating, setActualPlayerRating] = useState<number>(1500);
  const [estimatedPlayerRating, setEstimatedPlayerRating] =
    useState<number>(1600);
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
      customSearchNeighbour(simulatorData);
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

  const challengeEdgeDifficulty = (col: any, randomEdge: any) => {
    let edge = randomEdge.data();
    let chosenNode;
    let churnNode;

    if (col?.contains(cyRef?.current!.$(`#${edge.target}`))) {
      chosenNode = edge.source;
      churnNode = edge.target;
    } else {
      chosenNode = edge.target;
      churnNode = edge.source;
    }

    let edgeFailures = edge.failures;
    let nodeOperatingData = { randomEdge, chosenNode, col, churnNode };

    const difficultyModelValues = {
      randomMode: basicDifficulty(randomEdge),
      eloRating: adaptativeDificulty(nodeOperatingData),
    };
    const chosenDifficultyModel =
      simulatorData?.challengeModel as keyof typeof difficultyModelValues;
    const difficulty = difficultyModelValues[chosenDifficultyModel];

    const challengeModelValues = {
      randomMode: randomChallenge(nodeOperatingData),
      eloRating: eloRatingChallenge(nodeOperatingData),
    };
    const chosenchallengeModel =
      simulatorData?.challengeModel as keyof typeof challengeModelValues;
    const duelValues = challengeModelValues[chosenchallengeModel];

    const churnModelValues = {
      threeAndOut: threeAndOutModel(duelValues, nodeOperatingData),
      tryhard: tryhardModel(duelValues, nodeOperatingData),
      noChoices: noChoices(duelValues, nodeOperatingData),
    };

    const chosenChurnModel =
      simulatorData?.churnModel as keyof typeof churnModelValues;
    const nextNode = churnModelValues[chosenChurnModel];

    if (nextNode === "fail") {
      let oldChurnCount = parseInt(
        cyRef.current?.$(`#${churnNode}`).data("churnCount")
      );

      cyRef.current?.$(`#${churnNode}`).data({ churnCount: oldChurnCount + 1 });
      cyRef.current?.$(`#${edge.id}`).data({ failures: edgeFailures + 1 });
      setChurnRate(churnRate + 5);
    }

    return nextNode;
  };

  const threeAndOutModel = (duel: number[], data: any) => {
    let edgeData = data.randomEdge.data();
    let edgeAttempts = edgeData.attempts;

    let playerHability;
    let botHability;

    for (let i = 0; i < 3; i++) {
      playerHability = Math.floor(Math.random() * duel[0]);
      botHability = Math.floor(Math.random() * duel[1]);
      cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
      if (playerHability > botHability) {
        data.col.merge(data.randomEdge);
        data.col.merge(`#${data.chosenNode}`);
        return data.chosenNode;
      }
    }
    return "fail";
  };
  const tryhardModel = (duel: number[], data: any) => {
    let edgeData = data.randomEdge.data();
    let edgeAttempts = edgeData.attempts;
    let playerHability;
    let botHability;
    for (let i = 0; i < 99; i++) {
      playerHability = Math.floor(Math.random() * duel[0]);
      botHability = Math.floor(Math.random() * duel[1]);
      cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
      if (playerHability > botHability) {
        data.col.merge(data.randomEdge);
        data.col.merge(`#${data.chosenNode}`);
        return data.chosenNode;
      }
    }
    return "fail";
  };
  const noChoices = (duel: number[], data: any) => {
    let edgeData = data.randomEdge.data();
    let edgeAttempts = edgeData.attempts;

    let playerHability;
    let botHability;
    for (let i = 0; i < 10; i++) {
      playerHability = Math.floor(Math.random() * duel[0]);
      botHability = Math.floor(Math.random() * duel[1]);
      cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
      if (playerHability > botHability) {
        data.col.merge(data.randomEdge);
        data.col.merge(`#${data.chosenNode}`);
        return data.chosenNode;
      }
    }
    data.col.merge(data.randomEdge);
    cyRef.current
      ?.$(`#${edgeData.id}`)
      .data({ failures: edgeData.Failures + 1 });
    return data.churnNode;
  };

  const adaptativeDificulty = (edge: any) => {
    //estimate player difficulty
    // get the diference between the values
    //based on the diference dfeine new vaue foe estaimted player difficulty
  };
  const basicDifficulty = (edge: any) => {
    let randomNumber = Math.floor(Math.random() * 3) + simulatorData?.playerRating!;
    
    cyRef.current?.$(`#${edge.id}`).data({ difficulty: randomNumber });
  
    //estimate player difficulty
    // get the diference between the values
    //based on the diference dfeine new vaue foe estaimted player difficulty
  };
  const randomChallenge = (data: any) => {
    let edgeData = data.randomEdge.data();
    let botHability = edgeData.difficulty;
    let userHability =
      Math.floor(Math.random() * 3) + simulatorData?.playerRating!;

    const duelValues = [userHability, botHability];

    return duelValues;
  };

  const probabilityEloRating = (rating1: number, rating2: number) => {
    return (
      (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 400))
    );
  };

  const eloRatingChallenge = (data: any) => {
    let edgeData = data.randomEdge.data();
    let edgeDifficulty = edgeData.difficulty;

    const Ra = actualPlayerRating;
    const Rb = edgeDifficulty;

    //const K = 32;

    let playerWinProbability = probabilityEloRating(Rb, Ra) * 100;

    let botWinProbability = probabilityEloRating(Ra, Rb) * 100;

    const duelValues = [playerWinProbability, botWinProbability];

    return duelValues;
  };

  const resetStyles = () => {
    cyRef.current?.elements().removeClass(graphConsts.classStylesNames);
  };

  const resetNodesAtributes = () => {
    resetStyles();
    cyRef.current?.elements().data("attempts", 0);
    cyRef.current?.elements().data("failures", 0);
    cyRef.current?.elements().data("churnCount", 0);
  };

  const customSearchNeighbour = (data: ICustomSearchFormValues) => {
    resetStyles();
    setChurnRate(0);
    let col = cyRef.current?.collection();
    col?.merge(`#${data?.firstNode}`);
    let neighborhoodEdges: any = cyRef.current
      ?.$(`#${data?.firstNode}`)
      .neighborhood()
      .filter(function (ele) {
        return ele.isEdge();
      });
    let randomEdge =
      neighborhoodEdges[Math.floor(Math.random() * neighborhoodEdges.length)];

    let nextNode = challengeEdgeDifficulty(col, randomEdge);

    while (nextNode !== "fail" && nextNode !== data?.lastNode) {
      neighborhoodEdges = cyRef.current
        ?.$(`#${nextNode}`)
        .neighborhood()
        .filter(function (ele: any) {
          return ele.isEdge();
        })
        .filter(function (ele: any) {
          const nodeData = ele.data();
          const nodeSource = nodeData.source;
          const nodeTarget = nodeData.target;

          const collectionIncludesSource = col?.contains(
            cyRef?.current!.$(`#${nodeSource}`)
          );

          const collectionIncludesTarget = col?.contains(
            cyRef?.current!.$(`#${nodeTarget}`)
          );

          if (
            nodeTarget === nodeSource ||
            (collectionIncludesSource && collectionIncludesTarget)
          ) {
            return false;
          }

          return true;
        });

      if (neighborhoodEdges.length === 0) break;

      randomEdge =
        neighborhoodEdges[Math.floor(Math.random() * neighborhoodEdges.length)];

      nextNode = challengeEdgeDifficulty(col, randomEdge);
    }

    col?.addClass("highlighted");
  };

  const setInvariableGraphDifficulty = (difficulty: number = 1600) => {
    cyRef.current
      ?.elements()
      .filter(function (ele) {
        return ele.isEdge();
      })
      .data({ difficulty: difficulty, attempts: 0, failures: 0 });
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
    if (isEdge) cyRef.current?.elements().edges().addClass(style);
    else {
      cyRef.current?.elements().nodes().addClass(style);
    }
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

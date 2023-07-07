import { MutableRefObject, Ref, RefObject } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { graphConsts } from "../../../graphConst";
import { containerStyle } from "./styles";
interface GraphProps {
  elements: any;
  setSelectedEdge: any;
  setElements: any;
  setPrimaryNode: any;
  setRelationship: any;
  relationship: any;
  setClickedPosition: any;
  isCreatingNode: any;
  layout: any;
  cyRef: MutableRefObject<cytoscape.Core | null>;
}

const Graph = ({
  elements,
  setSelectedEdge,
  setElements,
  setPrimaryNode,
  setRelationship,
  relationship,
  setClickedPosition,
  isCreatingNode,
  layout,
  cyRef,
}: GraphProps) => {
  let elementsNew;
  if(elements){
    elementsNew = elements
  }
  else{
    elementsNew = graphConsts.defaultGraph
  }
  
  return (
    <>
      <CytoscapeComponent
        elements={ [...elementsNew]}
        style={containerStyle}
        stylesheet={[
          graphConsts.nodeLabel,
          graphConsts.firstNodeLabel,
          graphConsts.lastNodeLabel,
          graphConsts.hideNodeLabel,
          graphConsts.edgeFailuresAttemptsLabel,
          graphConsts.edgeAttemptsFailuresLabel,
          graphConsts.edgeAttempts,
          graphConsts.edgeAttemptsLabel,
          graphConsts.edgeAttemptsColor,
          graphConsts.edgeFailuresWidth,
          graphConsts.nodeChurnCountColor,
          graphConsts.nodeChurnCountLabel,
          graphConsts.nodeBoredomChurnCountColor,
          graphConsts.nodeBoredomChurnCountLabel,
          graphConsts.edgeFailuresAttemptsWidth,
          graphConsts.edgeFailuresColor,
          graphConsts.edgeFailuresAttemptsColor,
          graphConsts.selectedNode,
          graphConsts.customPath,
          graphConsts.edgeLabel,
          graphConsts.edgeEloLabel,
          graphConsts.edgeprobabilityOfWinningLabel,
        ]}
        cy={(cy) => {
          if (!cyRef) return "";
          cyRef.current = cy;

          cy.pon("dragfree").then(function (event) {
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
    </>
  );
};

export { Graph };

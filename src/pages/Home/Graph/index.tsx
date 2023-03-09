import { MutableRefObject, Ref, RefObject } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { graphConsts } from "../../../graphConst";
import { layouts } from "../../../layouts";
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
  cyRef: MutableRefObject<cytoscape.Core | null> ;
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
  cyRef,
}: GraphProps) => {
  return (
    <>
      <CytoscapeComponent
        elements={[...elements]}
        style={containerStyle}
        layout={layouts.circle}
        stylesheet={[
          graphConsts.nodeLabel,
          graphConsts.hideNodeLabel,
          graphConsts.edgeFailuresAttemptsLabel,
          graphConsts.edgeAttempts,
          graphConsts.edgeAttemptsColor,
          graphConsts.edgeFailures,
          graphConsts.nodeChurnCountColor,
          graphConsts.edgeFailuresAttempts,
          graphConsts.edgeFailuresColor,
          graphConsts.edgeFailuresAttemptsColor,
          graphConsts.edgeFailuresAttemptsColor,
          graphConsts.selectedNode,
          graphConsts.customPath,
        ]}
        cy={(cy) => {
          if (!cyRef) return "";
          cyRef.current = cy;
          // cy.on("drag ", function (evt) {
          //   const newNodes = cyRef.current?.elements().jsons();
          //   setElements(newNodes);
          // });

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

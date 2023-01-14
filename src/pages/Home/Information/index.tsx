import { GrEdit } from "react-icons/gr";
import "./styles.css";
interface InformationProps {
  isCreatingRelationship: any;
  showStyles: any;
  relationship: any;
  setIsCreatingRelationship: any;
  setRelationship: any;
  createRelationship: any;
  primaryNode: any;
  selectedEdge: any;
  openModal: any;
  isCreatingNode: any;
  deleteElement: any;
  setSelectedEdge: any;
  setPrimaryNode: any;
  setIsCreatingNode: any;
}
interface IAttribute {
  attribute: string;
  value: string;
}

const Information = ({
  isCreatingRelationship,
  showStyles,
  relationship,
  setIsCreatingRelationship,
  setRelationship,
  createRelationship,
  primaryNode,
  selectedEdge,
  openModal,
  isCreatingNode,
  deleteElement,
  setSelectedEdge,
  setPrimaryNode,
  setIsCreatingNode,
}: InformationProps) => {
  return (
    <>
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
          <div>
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
          </div>
          <div className="dataContainer">
            <h2>Settings</h2>
            <div className="styleButtonsContainer">
              <button onClick={() => showStyles("attemptsWidth")}>
                Attempts Width
              </button>
              <button onClick={() => showStyles("attemptsColor")}>
                Attempts Color
              </button>
              <button onClick={() => showStyles("failuresAttemptsColor")}>
                % failures/attempts Color
              </button>

              <button onClick={() => showStyles("failuresWidth")}>
                Failures width
              </button>
              <button onClick={() => showStyles("failuresColor")}>
                Failures color
              </button>
              <button onClick={() => showStyles("churnCountColor", false)}>
                Node Churn Count color
              </button>
              <button onClick={() => showStyles("failuresAttemptsLabel")}>
                Failures / Attempts label
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Information };

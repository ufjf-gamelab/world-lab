import { useState } from "react";

import { BiTrash, BiEdit } from "react-icons/bi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import "./styles.css";
interface InformationProps {
  isCreatingRelationship: any;

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
  changeStyleSettings: any;
}
interface IAttribute {
  attribute: string;
  value: string;
}

const Information = ({
  isCreatingRelationship,

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
  changeStyleSettings,
  setPrimaryNode,
  setIsCreatingNode,
}: InformationProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <>
      <div className="InformationContainer">
        <div className="nodeEdgeInformation">
          <>
            {(primaryNode || selectedEdge) && !isCreatingNode && (
              <div className="informationHeader">
                <h3>Data</h3>

                <BiEdit
                  className="editButton"
                  title="Editar"
                  fontSize={24}
                  onClick={() => {
                    if (primaryNode || selectedEdge) openModal();
                  }}
                />

                <BiTrash
                  title="Apagar"
                  fontSize={24}
                  onClick={() => {
                    if (primaryNode) {
                      deleteElement(primaryNode);
                      setPrimaryNode(undefined);
                      return;
                    }
                    setSelectedEdge(undefined);

                    return deleteElement(selectedEdge);
                  }}
                />
              </div>
            )}
          </>
          {primaryNode && !isCreatingNode && (
            <>
              <div className="elementInfo">
                <h4>Node ID:</h4>
                <h3>{primaryNode?.id}</h3>
              </div>
              <div className="elementInfo">
                <h4>Node Label:</h4>
                <h3>{primaryNode?.label}</h3>
              </div>
              <div className="elementInfo">
                <h4>Churn count:</h4>
                <h3>{primaryNode?.churnCount}</h3>
              </div>

              {primaryNode?.newAttributes?.map((a: IAttribute) => {
                return (
                  <div className="elementInfo">
                    <h4>{a.attribute}:</h4>
                    <h3>{a.value}</h3>
                  </div>
                );
              })}
            </>
          )}

          {selectedEdge && !isCreatingNode && (
            <>
              <div className="elementInfo">
                <h4>Source</h4>
                <h3>{selectedEdge?.source}</h3>
              </div>
              <div className="elementInfo">
                <h4>Target</h4>
                <h3>{selectedEdge?.target}</h3>
              </div>

              <div className="elementInfo">
                <h4>Difficulty</h4>
                <h3>{selectedEdge?.difficulty}</h3>
              </div>
              <div className="elementInfo">
                <h4>attempts</h4>
                <h3>{selectedEdge?.attempts}</h3>
              </div>
              <div className="elementInfo">
                <h4>Failures</h4>
                <h3>{selectedEdge?.failures}</h3>
              </div>
              <div className="elementInfo">
                <h4>Probability of Winning</h4>
                <h3>{selectedEdge?.probabilityOfWinning}%</h3>
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
        {isCreatingRelationship && (
          <div className="containerRelationship">
            <>
              <h2 className="titleRelationship">Create relationship?</h2>
              <div className="elementInfo">
                <h2>
                  {relationship[0]?.id
                    ? "Source Node ID"
                    : "Select the Source Node"}
                </h2>
                <h3>{relationship[0]?.id}</h3>
              </div>
              <div className="elementInfo">
                <h2>
                  {relationship[1]?.id
                    ? "Target Node ID"
                    : "Select the Target Node"}
                </h2>
                <h3>{relationship[1]?.id}</h3>
              </div>
              <div className="elementInfo">
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
                className="elementInfo"
                onClick={() => {
                  createRelationship();
                }}
              >
                <button>Confirm</button>
              </div>
            </>
          </div>
        )}
        <div className="settingsContainer">
          <div
            className="titleContainer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <h3>Settings</h3>
            {isDropdownOpen ? (
              <MdKeyboardArrowDown
                fontSize={24}
                color={"black"}
                title="Open dropdown"
              />
            ) : (
              <MdKeyboardArrowUp
                fontSize={24}
                color={"black"}
                title="Open dropdown"
              />
            )}
          </div>
          <ul
            className="dropdownSettings"
            style={{ height: isDropdownOpen ? "345px" : "0" }}
          >
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Attempts Width</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("attemptsWidth", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Attempts Color</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("attemptsColor", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">% Failures/attempts Color</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "failuresAttemptsColor",
                        e.target.checked
                      )
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Failures Width</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("failuresWidth", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Failures Color</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("failuresColor", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Node Churn Count Color</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("churnCountColor", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Failures / Attemps label</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "failuresAttemptsLabel",
                        e.target.checked
                      )
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Node label</h4>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export { Information };

import { useState } from "react";

import { BiTrash, BiEdit } from "react-icons/bi";
import { FiGitPullRequest, FiPlusCircle } from "react-icons/fi";
import { GrPowerReset } from "react-icons/gr";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { layouts } from "../layouts";
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
  numberOfCreatedNodes: any;
  setLayout: any;
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
  numberOfCreatedNodes,
  setLayout,
}: InformationProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <>
      <div className="InformationContainer">
        <div className="nodeManipulation">
          <div
            className="createNode"
            onClick={() => {
              setIsCreatingRelationship(false);
              setIsCreatingNode(!isCreatingNode);
              setRelationship([]);
            }}
          >
            <FiPlusCircle fontSize={24} color={"black"} />
            <p> New node</p>
          </div>
          <div
            className="createEdge"
            onClick={() => {
              setIsCreatingNode(false);
              setIsCreatingRelationship(!isCreatingRelationship);
              setRelationship([]);
            }}
          >
            <FiGitPullRequest fontSize={24} color={"black"} /> <p>Node links</p>
          </div>
        </div>
        {isCreatingNode && (
          <div className="containerCreateNode">
            <h2 className="titleCreateNode">Click on screen to create node</h2>
            <div className="containerNumberOfNodes">
              <h4 className="numberOfNodesLabel">Number of create nodes :</h4>
              <h4 className="createdNumberOfNodes">
                {numberOfCreatedNodes}
              </h4>{" "}
            </div>
            <button
              className="buttonCreateNode"
              onClick={() => {
                setIsCreatingNode(false);
              }}
            >
              Stop creating nodes
            </button>
          </div>
        )}

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
              <div className="relationshipButtonContainer">
                <button
                  onClick={() => {
                    setIsCreatingRelationship(false);
                    setRelationship([]);
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    createRelationship();
                  }}
                >
                  Confirm
                </button>
              </div>
            </>
          </div>
        )}

        {(primaryNode || selectedEdge) && (
          <div className="nodeEdgeInformation">
            <>
              {(primaryNode || selectedEdge) && (
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

            {primaryNode && (
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
                  <h4>Stress Churn count:</h4>
                  <h3>{primaryNode?.churnCount}</h3>
                </div>
                <div className="elementInfo">
                  <h4> Boredom Churn count:</h4>
                  <h3>{primaryNode?.boredomChurnCount}</h3>
                </div>
              </>
            )}

            {selectedEdge && (
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
            style={{ height: isDropdownOpen ? "100%" : "0" }}
          >
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Attempts width (Quantity)</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("edgeAttemptsWidth", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Attempts (Quantity)</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("edgeAttemptsLabel", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Attempts color (Quantity)</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("edgeAttemptsColor", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>

            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Failures width (Quantity)</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("edgeFailuresWidth", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Elo Rating</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("edgeEloLabel", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Probability of winning %</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "edgeprobabilityOfWinningLabel",
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
                <h4 className="switchTitle">Failures color (Quantity)</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("edgeFailuresColor", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>

            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Failures / attempts %</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "edgeFailuresAttemptsLabel",
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
                <h4 className="switchTitle">Failures / attempts color </h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "edgeFailuresAttemptsColor",
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
                <h4 className="switchTitle">Failures / attempts width</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "edgeFailuresAttemptsWidth",
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
                <h4 className="switchTitle"> Successful duels %</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "edgeAttemptsFailuresLabel",
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
                <h4 className="switchTitle">Hide Node ID</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings("hideNodeLabel", e.target.checked)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            <li>
              <div className="switchContainer">
                <h4 className="switchTitle">Node Churn Color</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "nodeChurnCountColor",
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
                <h4 className="switchTitle">Node Churn Count</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "nodeChurnCountLabel",
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
                <h4 className="switchTitle">Node Boredom Churn Color</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "nodeBoredomChurnCountColor",
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
                <h4 className="switchTitle">Node Boredom Churn Count</h4>
                <label className="switch">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      changeStyleSettings(
                        "nodeBoredomChurnCountLabel",
                        e.target.checked
                      )
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </li>
            {/* <li>
              <button className="resetStylesButton">Reset styles</button>
            </li> */}
          </ul>
        </div>
     
      </div>
    </>
  );
};

export { Information };

import { useForm } from "react-hook-form";
import { BsEraser, BsPlusCircle } from "react-icons/bs";
import { CgExport } from "react-icons/cg";
import { FiSettings } from "react-icons/fi";
import { GrPowerReset } from "react-icons/gr";
import { RiDownloadFill } from "react-icons/ri";
import { BiGitCompare } from "react-icons/bi";
import "./styles.css";
import { ICustomSearchFormValues } from "../types";


interface ToolbarProps {
  onSubmitCustomSearch: any;
  handleFileSelected: any;
  resetStyles: any;
  resetNodesAtributes: any;
  setInvariableGraphDifficulty: any;
  elements: any;
  setRelationship: any;
  setIsCreatingNode: any;
  setIsCreatingRelationship: any;
  isCreatingNode: any;
  isCreatingRelationship: any;
}

const Toolbar = ({
  onSubmitCustomSearch,
  handleFileSelected,
  resetStyles,
  resetNodesAtributes,
  setInvariableGraphDifficulty,
  elements,
  setRelationship,
  setIsCreatingNode,
  setIsCreatingRelationship,
  isCreatingNode,
  isCreatingRelationship,
}: ToolbarProps) => {
  const { register: registerValue, handleSubmit: handleSubmitSearch } =
    useForm<ICustomSearchFormValues>();

  return (
    <div className="buttonContainer">
      <form onSubmit={handleSubmitSearch(onSubmitCustomSearch)}>
        <div className="formPathContainer">
          <div className="formInput">
            <h3>First node</h3>
            <input
              {...registerValue("firstNode")}
              type={"string"}
              required
              placeholder="First node"
            />
          </div>
          <div className="formInput lastNodeContainer">
            <h3>Last node</h3>
            <input
              {...registerValue("lastNode")}
              required
              placeholder="Last node"
              type={"string"}
            />
          </div>
          <div className="formInput playerRatingContainer">
            <h3>Player Rating</h3>
            <input
              type="number"
              {...registerValue("playerRating", {
                valueAsNumber: true,
                required: true,
              })}
            />
          </div>

          <div className="formInput numberOfRunsContainer">
            <h3>Number of runs </h3>
            <input
              type="number"
              {...registerValue("numberOfRuns", {
                valueAsNumber: true,
                required: true,
              })}
            />
          </div>
   
          <div className="formInput">
            <h3>Player model </h3>
            <select {...registerValue("playerModel")}>
              <option value="explorer">Explorer</option>
              <option value="story">Story</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div className="formInput">
            <h3>Challenge model </h3>
            <select {...registerValue("challengeModel")}>
              <option value="eloRating">Elo rating</option>
              <option value="randomProbability">Random</option>
            </select>
          </div>
          <div className="formInput difficultyModelContainer">
            <h3>Difficulty model </h3>
            <select {...registerValue("difficultyModel")}>
              <option value="linearDifficulty">Linear</option>
              <option value="adaptiveDifficulty">Adaptive</option>
            </select>
          </div>
          <div className="formInput">
            <h3>Progression model </h3>
            <select {...registerValue("progressionModel")}>
              <option value="fixed">Fixed</option>
              <option value="Incremental">Incremental</option>
            </select>
          </div>
          <div className="formInput">
            <h3>Churn model </h3>
            <select {...registerValue("churnModel")}>
              <option value="threeAndOut">3 and out</option>
              <option value="tryhard">Tryhard</option>
              <option value="noChoices">No choices</option>
              <option value="flow">flow</option>
            </select>
          </div>
          <input type="submit" className="submitButton" />
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
      <FiSettings
        fontSize={24}
        color={"black"}
        title="Change Node Difficulty"
        onClick={() => {
          setInvariableGraphDifficulty();
        }}
      />
      <BiGitCompare
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
        <RiDownloadFill fontSize={24} color={"black"} title="Download Graph" />
      </a>

      <label>
        <CgExport fontSize={24} color={"black"} title="Insert Graph" />

        <input id="download" onChange={handleFileSelected} type="file"></input>
      </label>
    </div>
  );
};

export { Toolbar };

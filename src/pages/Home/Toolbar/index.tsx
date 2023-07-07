import { useForm } from "react-hook-form";
import { BsEraser, BsPlusCircle } from "react-icons/bs";
import { CgExport } from "react-icons/cg";
import { FiSettings, FiDownloadCloud, FiUploadCloud } from "react-icons/fi";
import { GrPowerReset } from "react-icons/gr";
import { BiGitCompare } from "react-icons/bi";
import "./styles.css";
import { ICustomSearchFormValues } from "../types";

import logo from "../../../assets/logo.svg";

interface ToolbarProps {
  onSubmitCustomSearch: any;
  handleFileSelected: any;
  resetStyles: any;
  resetNodesAtributes: any;
  elements: any;
}

const Toolbar = ({
  onSubmitCustomSearch,
  handleFileSelected,
  resetStyles,
  resetNodesAtributes,
  elements,
}: ToolbarProps) => {
  const {
    register: registerValue,
    watch,
    handleSubmit: handleSubmitSearch,
  } = useForm<ICustomSearchFormValues>();

  const watchAllFields = watch();
  const watchShowRating = watch("challengeModel", "eloRating");
  // console.log("🚀 ~ file: index.tsx:47 ~ watchShowRating:", watchShowRating)
  // console.log("watchAllFields", watchAllFields);
  return (
    <>
      <div className="header">
        <div className="headerGroup">
          <img src={logo} alt="logo" />
          <h4>Adaptive Difficulty simulator</h4>
        </div>

        <div className="headerGroup">
          <label>
            <FiUploadCloud fontSize={24} color={"black"} title="Upload Graph" />

            <input
              id="upload"
              onChange={handleFileSelected}
              type="file"
            ></input>
          </label>

          <a
            className="download-link"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(elements)
            )}`}
            download="Graph.json"
          >
            <FiDownloadCloud
              fontSize={24}
              color={"white"}
              title="Download Graph"
            />
            Download
          </a>
        </div>
      </div>
      <div className="buttonContainer">
        <form onSubmit={handleSubmitSearch(onSubmitCustomSearch)}>
          <div className="formPathContainer">
            <div className="formInput ">
              <h3>First node</h3>
              <input
                {...registerValue("firstNode")}
                type={"number"}
                required
                placeholder="First node"
              />
            </div>
            <div className="formInput ">
              <h3>Last node</h3>
              <input
                {...registerValue("lastNode")}
                required
                placeholder="Last node"
                type={"number"}
              />
            </div>

            <div className="formInput ">
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
       
              </select>
            </div>

            <div className="formInput">
              <h3>Challenge model </h3>
              <select {...registerValue("challengeModel")}>
                <option value="eloRating">Elo rating</option>
                <option value="randomProbability">Random</option>
              </select>
            </div>
            {watchShowRating && (
              <div className="formInput ">
                <h3>Player Skill</h3>
                <input
                  type="number"
                  {...registerValue("playerRating", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            )}
            <div className="formInput ">
              <h3>Difficulty model </h3>
              <select {...registerValue("difficultyModel")}>
                <option value="linear">Linear</option>
                <option value="adaptive">Adaptive</option>
              </select>
            </div>
            <div className="formInput">
              <h3>Progression model </h3>
              <select {...registerValue("progressionModel")}>
                <option value="noProgression">No progression</option>
                <option value="incremental">Incremental</option>
              </select>
            </div>
            <div className="formInput">
              <h3>Churn model </h3>
              <select {...registerValue("churnModel")}>
                <option value="oneChance">1 Chance</option>
                <option value="twoChoices">2 Chances</option>
                <option value="threeChoices">3 Chances</option>
                <option value="flow">flow</option>
              </select>
            </div>
            <button type="submit" className="submitButton">
              Run
            </button>
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
      
        {/* <FiSettings
          fontSize={24}
          color={"black"}
          title="Change Node Difficulty"
          onClick={() => {
            setInvariableGraphDifficulty();
          }}
        />
      */}
      </div>
    </>
  );
};

export { Toolbar };

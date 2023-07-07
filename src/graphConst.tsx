export const graphConsts: Record<string, any> = {
  edgeAttempts: {
    selector: "edge.edgeAttemptsWidth",
    style: {
      width: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("attempts");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("attempts");
        }).value;
        let numAttempts = ele.data("attempts");

        let v = ((numAttempts - min) * (10 - 1)) / (max - min) + 1;

        return v;
      },
    },
  },
  edgeAttemptsLabel: {
    selector: "edge.edgeAttemptsLabel",
    style: {
      label: function (ele: any) {
        const nodeAtribute = ele.data();
        // let labelFinal = "";
        // Object.keys(nodeAtribute).map(function (key, index) {
        //   return (labelFinal += ` ${key} = ${nodeAtribute[key]} `);
        // });
        // return labelFinal;

        return nodeAtribute.attempts;
      },
    },
  },
  edgeEloLabel: {
    selector: "edge.edgeEloLabel",
    style: {
      label: function (ele: any) {
        const nodeAtribute = ele.data();
        // let labelFinal = "";
        // Object.keys(nodeAtribute).map(function (key, index) {
        //   return (labelFinal += ` ${key} = ${nodeAtribute[key]} `);
        // });
        // return labelFinal;

        return nodeAtribute.difficulty;
      },
    },
  },

  edgeprobabilityOfWinningLabel: {
    selector: "edge.edgeprobabilityOfWinningLabel",
    style: {
      label: function (ele: any) {
        const nodeAtribute = ele.data();

        return nodeAtribute.probabilityOfWinning + "%";
      },
    },
  },

  edgeFailuresWidth: {
    selector: "edge.edgeFailuresWidth",
    style: {
      width: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("failures");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("failures");
        }).value;
        let numAttempts = ele.data("failures");

        let v = ((numAttempts - min) * (10 - 1)) / (max - min) + 1;

        return v;
      },
    },
  },

  edgeFailuresAttemptsWidth: {
    selector: "edge.edgeFailuresAttemptsWidth",
    style: {
      width: function (ele: any) {
        let numAttempts = ele.data("attempts");
        let numFailures = ele.data("failures");

        // Calcula a proporção de falhas sobre tentativas
        if (numFailures === 0 && numAttempts === 0) return 1;
        else if (numFailures === 0 && numAttempts > 0) {
          return 10;
        }
        let ratio = numFailures / numAttempts;

        // Define o valor mínimo como 1 e o máximo como 10
        let width = Math.max(1, Math.min(10, ratio * 10));

        return width;
      },
    },
  },

  edgeAttemptsColor: {
    selector: "edge.edgeAttemptsColor",
    style: {
      lineColor: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("attempts");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("attempts");
        }).value;
        let attempts = ele.data("attempts");
        let hue;
        if (attempts === 0) {
          hue = 0;
        } else {
          hue = ((attempts - min) * (100 - 0)) / (max - min) + 1;
        }

        return ["hsl(", 100 - hue, ",100%,50%)"].join("");
      },
    },
  },

  edgeFailuresColor: {
    selector: "edge.edgeFailuresColor",
    style: {
      lineColor: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("failures");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("failures");
        }).value;
        let failures = ele.data("failures");

        let hue;
        if (failures === 0) {
          hue = 0;
        } else {
          hue = ((failures - min) * (100 - 0)) / (max - min) + 1;
        }

        return ["hsl(", 100 - hue, ",100%,50%)"].join("");
      },
    },
  },
  nodeChurnCountColor: {
    selector: "node.nodeChurnCountColor",
    style: {
      backgroundColor: function (ele: any) {
        let core = ele.cy();
        let max = core.elements().max(function (ele: any) {
          return ele.data("churnCount");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("churnCount");
        }).value;
        let churnCount = ele.data("churnCount");
        let hue;
        if (churnCount === 0) {
          hue = 0;
        } else {
          hue = ((churnCount - min) * (100 - 0)) / (max - min) + 1;
        }

        return ["hsl(", 100 - hue, ",100%,50%)"].join("");
      },
    },
  },
  nodeChurnCountLabel: {
    selector: "node.nodeChurnCountLabel",
    style: {
      label: function (ele: any) {
        const nodeAtribute = ele.data();
        // let labelFinal = "";
        // Object.keys(nodeAtribute).map(function (key, index) {
        //   return (labelFinal += ` ${key} = ${nodeAtribute[key]} `);
        // });
        // return labelFinal;
        return nodeAtribute.churnCount;
      },
    },
  },

  nodeBoredomChurnCountLabel: {
    selector: "node.nodeBoredomChurnCountLabel",
    style: {
      label: function (ele: any) {
        const nodeAtribute = ele.data();
        // let labelFinal = "";
        // Object.keys(nodeAtribute).map(function (key, index) {
        //   return (labelFinal += ` ${key} = ${nodeAtribute[key]} `);
        // });
        // return labelFinal;
        return nodeAtribute.boredomChurnCount;
      },
    },
  },

  nodeBoredomChurnCountColor: {
    selector: "node.nodeBoredomChurnCountColor",
    style: {
      backgroundColor: function (ele: any) {
        let core = ele.cy();
        let max = core.elements().max(function (ele: any) {
          return ele.data("boredomChurnCount");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("boredomChurnCount");
        }).value;
        let churnCount = ele.data("boredomChurnCount");
        let hue;
        if (churnCount === 0) {
          hue = 0;
        } else {
          hue = ((churnCount - min) * (100 - 0)) / (max - min) + 1;
        }

        return ["hsl(", 100 - hue, ",100%,50%)"].join("");
      },
    },
  },
  edgeFailuresAttemptsColor: {
    selector: "edge.edgeFailuresAttemptsColor",
    style: {
      lineColor: function (ele: any) {
        let numAttempts = ele.data("attempts");
        let failures = ele.data("failures");
        let hue;

        if (failures === 0 || numAttempts === 0) {
          hue = 0;
        } else {
          hue = (failures / numAttempts) * 100;
        }

        return ["hsl(", 100 - hue, ",100%,50%)"].join("");
      },
    },
  },

  nodeLabel: {
    selector: "node",
    style: {
      width: 40,
      height: 40,
      shape: "ellipse",
      "text-wrap": "wrap",
      "text-max-width": "200px",
      "font-size": "16px",
      "text-valign": "center",
      "text-halign": "center",
      color: "#000000",
      "background-color": "#B9B9B9",
      "font-family": "Poppins",
      label: function (node: any) {
        const nodeAtribute = node.data();

        return nodeAtribute.id;
      },
    },
  },

  firstNodeLabel: {
    selector: "node.firstNodeLabel",
    style: {
      width: 40,
      height: 40,
      shape: "round-rectangle",
    },
  },

  lastNodeLabel: {
    selector: "node.lastNodeLabel",
    style: {
      width: 40,
      height: 40,
      shape: "round-hexagon",
    },
  },
  hideNodeLabel: {
    selector: "node.hideNodeLabel",
    style: {
      label: function (node: any) {
        return "";
      },
    },
  },
  selectedNode: {
    selector: ":selected",
    style: {
      "line-color": "#A17DFF",
      backgroundColor: "#A17DFF",

      color: function (ele: any) {
        if (!ele.isNode()) return "black";
        else if (ele.isNode()) {
          return "white";
        }
      },
    },
  },

  edgeLabel: {
    selector: "edge",
    style: {
      "text-margin-y": "-10px",
      "text-margin-x": "-10px",
    },
  },

  edgeFailuresAttemptsLabel: {
    selector: "edge.edgeFailuresAttemptsLabel",
    style: {
      "text-wrap": "wrap",
      "text-max-width": "200px",
      "font-size": "16px",

      label: function (edge: any) {
        const edgeAtribute = edge.data();
        if (edgeAtribute.failures > 0 && edgeAtribute.attempts > 0)
          return (
            Math.trunc((edgeAtribute.failures / edgeAtribute.attempts) * 100) +
            " %"
          );
        else if (edgeAtribute.failures === 0 && edgeAtribute.attempts > 0) {
          return 100 + "%";
        }

        return 0;
      },
    },
  },

  edgeAttemptsFailuresLabel: {
    selector: "edge.edgeAttemptsFailuresLabel",
    style: {
      "text-wrap": "wrap",
      "text-max-width": "200px",
      "font-size": "16px",

      label: function (edge: any) {
        const edgeAtribute = edge.data();
        if (edgeAtribute.failures > 0 && edgeAtribute.attempts > 0)
          return (
            Math.trunc(
              100 - (edgeAtribute.failures / edgeAtribute.attempts) * 100
            ) + " %"
          );
        else if (edgeAtribute.failures === 0 && edgeAtribute.attempts > 0) {
          return 100 + "%";
        }

        return 0;
      },
    },
  },
  customPath: {
    selector: ".highlighted",
    style: {
      "background-color": "#1F075F",
      "line-color": "#1F075F",
      color: function (ele: any) {
        if (!ele.isNode()) return "black";
        else if (ele.isNode()) {
          return "white";
        }
      },
    },
  },

  classStylesNames: [
    "highlighted",
    "nodeLabel",
    // "firstNodeLabel",
    // "lastNodeLabel",
    "edgeLabel",
    "edgeAttemptsLabel",
    "hideNodeLabel",
    "edgeAttemptsColor",
    "edgeAttemptsWidth",
    "edgeFailuresWidth",
    "edgeAttemptsFailuresLabel",
    "edgeFailuresColor",
    "edgeEloLabel",
    "edgeprobabilityOfWinningLabel",
    "edgeFailuresAttemptsWidth",
    "edgeFailuresAttemptsColor",
    "edgeFailuresAttemptsLabel",
    "nodeChurnCountColor",
    "nodeChurnCountLabel",
    "nodeBoredomChurnCountLabel",
    "nodeBoredomChurnCountColor",
   
  ],

  defaultGraph: [
    {
      data: {
        id: "2",
        label: "Node 2",
        churnCount: 3522,
        difficulty: 5,
        isVisited: false,
        falhas: 0,
        attempts: 0,
        failures: 0,
        boredomChurnCount: 23,
      },
      position: { x: 598.9573676365509, y: -10.36268850391523 },
      group: "nodes",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: false,
      classes: "edgeProbabilityOfWinning edgeAttemptsLabel",
    },
    {
      data: {
        id: "29",
        label: "Node24",
        difficulty: 5,
        isVisited: false,
        falhas: 0,
        churnCount: 0,
        newAttributes: [{ attribute: "", value: "" }],
        attempts: 0,
        failures: 0,
        boredomChurnCount: 0,
      },
      position: { x: 478.96542420432377, y: -9.759769662524684 },
      group: "nodes",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: false,
      classes: "edgeProbabilityOfWinning edgeAttemptsLabel",
    },
    {
      data: {
        id: "293",
        label: "Node293",
        churnCount: 0,
        attempts: 0,
        failures: 0,
        boredomChurnCount: 0,
      },
      position: { x: 256.28227657429716, y: -10.32731638722752 },
      group: "nodes",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: false,
      classes: "edgeProbabilityOfWinning firstNodeLabel edgeAttemptsLabel",
    },
    {
      data: {
        id: "292",
        label: "teste",
        churnCount: 0,
        attempts: 0,
        failures: 0,
        newAttributes: [],
        boredomChurnCount: 0,
      },
      position: { x: 363.13794984120034, y: -10.220346641363207 },
      group: "nodes",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: false,
      classes: "edgeProbabilityOfWinning edgeAttemptsLabel",
    },
    {
      data: {
        id: "299",
        label: "Node299",
        churnCount: 0,
        attempts: 0,
        failures: 0,
        boredomChurnCount: 0,
      },
      position: { x: 700.6794770252361, y: -9.612668236087844 },
      group: "nodes",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: false,
      classes: "edgeProbabilityOfWinning lastNodeLabel edgeAttemptsLabel",
    },
    {
      data: {
        id: "300",
        label: "Node300",
        churnCount: 0,
        boredomChurnCount: 0,
        attempts: 0,
        failures: 0,
      },
      position: { x: 480.9173262893641, y: -83.98133250661223 },
      group: "nodes",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: false,
      classes: "edgeAttemptsLabel",
    },
    {
      data: {
        id: "301",
        label: "Node301",
        churnCount: 0,
        boredomChurnCount: 0,
        attempts: 0,
        failures: 0,
      },
      position: { x: 595.8270382021803, y: 76.84946030211826 },
      group: "nodes",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: false,
      classes: "edgeAttemptsLabel",
    },
    {
      data: {
        source: "293",
        target: "292",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
        id: "fc40341c-f1aa-4155-8a5f-fc0f1be38e22",
        probabilityOfSuccess: 50,
        probabilityOfWinning: 40,
        churnCount: 0,
        label: "",
        boredomChurnCount: 0,
      },
      position: { x: 0, y: 0 },
      group: "edges",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: true,
      classes: "edgeProbabilityOfWinning edgeAttemptsLabel",
    },
    {
      data: {
        source: "292",
        target: "29",
        attempts: 0,
        failures: 0,
        difficulty: 1650,
        id: "cc6b067a-054a-4c4d-b46b-c55241aba3d8",
        probabilityOfSuccess: 50,
        probabilityOfWinning: 30,
        churnCount: 0,
        label: "",
        boredomChurnCount: 0,
        difficultyParameter: 1489.4444444444443,
      },
      position: { x: 0, y: 0 },
      group: "edges",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: true,
      classes: "edgeProbabilityOfWinning edgeAttemptsLabel",
    },
    {
      data: {
        source: "29",
        target: "300",
        attempts: 0,
        failures: 0,
        difficulty: 1650,
        probabilityOfWinning: 10,
        id: "a99c9baf-3e26-4725-a209-611d1dce89c0",
        churnCount: 0,
        boredomChurnCount: 0,
        label: "",
      },
      position: { x: 0, y: 0 },
      group: "edges",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: true,
      classes: "edgeAttemptsLabel",
    },
    {
      data: {
        source: "2",
        target: "299",
        attempts: 0,
        failures: 0,
        difficulty: 1800,
        id: "c0611cbf-ec78-4df9-a952-deb42e7134a6",
        probabilityOfSuccess: 50,
        probabilityOfWinning: 10,
        churnCount: 0,
        label: "",
        boredomChurnCount: 0,
        difficultyParameter: 1478.8888888888887,
      },
      position: { x: 0, y: 0 },
      group: "edges",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: true,
      classes: "edgeProbabilityOfWinning edgeAttemptsLabel",
    },
    {
      data: {
        source: "2",
        target: "301",
        attempts: 0,
        failures: 0,
        difficulty: 1750,
        probabilityOfWinning: 10,
        id: "507f751e-dd8c-4956-93c5-279cf8ca80c3",
        churnCount: 0,
        boredomChurnCount: 0,
        label: "",
      },
      position: { x: 0, y: 0 },
      group: "edges",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: true,
      classes: "edgeAttemptsLabel",
    },
    {
      data: {
        source: "29",
        target: "2",
        attempts: 0,
        failures: 0,
        difficulty: 1666,
        probabilityOfWinning: 20,
        id: "aaf88df2-6b8c-4d77-8e3b-bb125bdeb01a",
        label: "",
        churnCount: 0,
        boredomChurnCount: 0,
        difficultyParameter: 1656.111111111111,
      },
      position: { x: 0, y: 0 },
      group: "edges",
      removed: false,
      selected: false,
      selectable: true,
      locked: false,
      grabbable: true,
      pannable: true,
      classes: "edgeAttemptsLabel",
    },
  ],
};

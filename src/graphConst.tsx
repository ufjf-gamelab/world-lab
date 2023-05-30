export const graphConsts: Record<string, any> = {
  edgeAttempts: {
    selector: ".edgeAttemptsWidth",
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

        if (ele.isNode()) return 40;

        return v;
      },
    },
  },
  edgeAttemptsLabel: {
    selector: ".edgeAttemptsLabel",
    style: {
      label: function (ele: any) {
        const nodeAtribute = ele.data();
        // let labelFinal = "";
        // Object.keys(nodeAtribute).map(function (key, index) {
        //   return (labelFinal += ` ${key} = ${nodeAtribute[key]} `);
        // });
        // return labelFinal;
        if (ele.isNode()) return ;
        return nodeAtribute.attempts;
      },
    },
  },
  edgeFailuresWidth: {
    selector: ".edgeFailuresWidth",
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
        if (ele.isNode()) return 40;
        return v;
      },
    },
  },

  edgeFailuresAttemptsWidth: {
    selector: ".edgeFailuresAttemptsWidth",
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
        if (ele.isNode()) return 40;
        return v;
      },
    },
  },

  edgeAttemptsColor: {
    selector: ".edgeAttemptsColor",
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
    selector: ".edgeFailuresColor",
    style: {
      lineColor: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("failures");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("failures");
        }).value;
        let attempts = ele.data("failures");

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
  nodeChurnCountColor: {
    selector: ".nodeChurnCountColor",
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
    selector: ".nodeChurnCountLabel",
    style: {
      label: function (ele: any) {
        const nodeAtribute = ele.data();
        // let labelFinal = "";
        // Object.keys(nodeAtribute).map(function (key, index) {
        //   return (labelFinal += ` ${key} = ${nodeAtribute[key]} `);
        // });
        // return labelFinal;
        if (!ele.isNode()) return ;
        return nodeAtribute.churnCount;
      },
    },
  },
  edgeFailuresAttemptsColor: {
    selector: ".edgeFailuresAttemptsColor",
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
      "font-family": "Poppins",
      label: function (node: any) {
        const nodeAtribute = node.data();
        // let labelFinal = "";
        // Object.keys(nodeAtribute).map(function (key, index) {
        //   return (labelFinal += ` ${key} = ${nodeAtribute[key]} `);
        // });
        // return labelFinal;
        return nodeAtribute.id;
      },
    },
  },

  
  hideNodeLabel: {
    selector: ".hideNodeLabel",
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
      backgroundColor:  "#A17DFF",

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
      'text-margin-y': '-10px',
      'text-margin-x': '-10px',
    },
  },



  edgeFailuresAttemptsLabel: {
    selector: ".edgeFailuresAttemptsLabel",
    style: {
      "text-wrap": "wrap",
      "text-max-width": "200px",
      "font-size": "16px",
  
      label: function (edge: any) {
        const edgeAtribute = edge.data();
        if (
          edgeAtribute.failures > 0 &&
          edgeAtribute.attempts > 0 &&
          !edge.isNode()
        )
          return (
            Math.trunc((edgeAtribute.failures / edgeAtribute.attempts) * 100) +
            " %"
          );
        else if (!edge.isNode()) {
          return 0;
        }
      },
    },
  },

  edgeAttemptsFailuresLabel: {
    selector: ".edgeAttemptsFailuresLabel",
    style: {
      "text-wrap": "wrap",
      "text-max-width": "200px",
      "font-size": "16px",
  
      label: function (edge: any) {
        const edgeAtribute = edge.data();
        if (
          edgeAtribute.failures > 0 &&
          edgeAtribute.attempts > 0 &&
          !edge.isNode()
        )
          return (
            Math.trunc( 100 - (edgeAtribute.failures / edgeAtribute.attempts) * 100) +
            " %"
          );
        else if (!edge.isNode()) {
          return 0;
        }
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

  defaultGraph: [
    {
      data: { id: "1", label: "Node 1", churnCount: 0 },
      position: { x: 600, y: 16000 },
    },
    {
      data: { id: "2", label: "Node 2", churnCount: 0 },
      position: { x: 550, y: 300 },
    },
    {
      data: { id: "3", label: "Node 3", churnCount: 0 },
      position: { x: 650, y: 300 },
    },
    {
      data: { id: "4", label: "Node 4", churnCount: 0 },
      position: { x: 750, y: 300 },
    },
    {
      data: { id: "5", label: "Node 5", churnCount: 0 },
      position: { x: 830, y: 300 },
    },
    {
      data: { id: "6", label: "Node 6", churnCount: 0 },
      position: { x: 570, y: 440 },
    },
    {
      data: { id: "7", label: "Node 7", churnCount: 0 },
      position: { x: 700, y: 440 },
    },
    {
      data: { id: "8", label: "Node 8", churnCount: 0 },
      position: { x: 800, y: 440 },
    },
    {
      data: { id: "9", label: "Node 9", churnCount: 0 },
      position: { x: 550, y: 570 },
    },
    {
      data: { id: "10", label: "Node 10", churnCount: 0 },
      position: { x: 740, y: 600 },
    },
    {
      data: {
        source: "1",
        target: "2",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "1",
        target: "3",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "1",
        target: "4",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "1",
        target: "5",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "2",
        target: "3",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "2",
        target: "6",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "3",
        target: "7",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "4",
        target: "5",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "6",
        target: "9",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "7",
        target: "10",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "5",
        target: "8",
        attempts: 0,
        failures: 0,
        difficulty: 20,
      },
    },
    {
      data: {
        source: "4",
        target: "8",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "8",
        target: "10",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
    {
      data: {
        source: "9",
        target: "10",
        attempts: 0,
        failures: 0,
        difficulty: 1600,
      },
    },
  ],

  classStylesNames: [
    "highlighted",
    "firstNode",
    "edgeLabel",
    "hideNodeLabel",
    "edgeAttemptsColor",
    "edgeAttemptsWidth",
    "edgeFailuresWidth",
    "edgeFailuresColor",
    "edgeFailuresAttemptsWidth",
    "edgeFailuresAttemptsColor",
    "edgeFailuresAttemptsLabel",
    "nodeChurnCountColor",
    "nodeChurnCountLabel",
  ],
};

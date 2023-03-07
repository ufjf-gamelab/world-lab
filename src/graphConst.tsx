export const graphConsts: Record<string, any> = {
  edgeAttempts: {
    selector: ".attemptsWidth",
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
  edgeFailures: {
    selector: ".failuresWidth",
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

  edgeFailuresAttempts: {
    selector: ".failuresAttemptsWidth",
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



  edgeAttemptsColor: {
    selector: ".attemptsColor",
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
    selector: ".failuresColor",
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
        console.log("🚀 ~ file: graphConst.tsx:110 ~ attempts", attempts);
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
    selector: ".churnCountColor",
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
  edgeFailuresAttemptsColor: {
    selector: ".failuresAttemptsColor",
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
      "color" : "#000000",
      "font-family" : "Poppins",
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
  selectedNode: {
    selector: ":selected",
    style: {
  
      "backgroundColor" : "#A17DFF",
      "color" : "#FFFFFF",
    },
  },
  edgeFailuresAttemptsLabel: {
    selector: ".failuresAttemptsLabel",
    style: {
      shape: "ellipse",
      "text-wrap": "wrap",
      "text-max-width": "200px",
      "font-size": "16px",

      label: function (edge: any) {
        const edgeAtribute = edge.data();
        if (edgeAtribute.failures > 0 && edgeAtribute.attempts > 0 && !edge.isNode())
          return (
            "Failures/Attempts: " +
            Math.trunc((edgeAtribute.failures / edgeAtribute.attempts) * 100) +
            " %"
          );
        else if( !edge.isNode()) {
          return "Failures/Attempts: " + 0;
        }
      },
    },
  },

  customPath: {
    selector: ".highlighted",
    style: {
      "background-color": "#1F075F",
      "line-color": "#1F075F",
      "color" : "white",
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
    "tentativas",
    "firstNode",
    "attemptsColor",
    "attemptsWidth",
    "failuresWidth",
    "failuresColor",
    "failuresAttemptsWidth",
    "failuresAttemptsColor",
    "failuresAttemptsLabel",
    "churnCountColor",
  ],
};

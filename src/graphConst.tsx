export const graphConsts: Record<string, any> = {
  edgeTentativas: {
    selector: ".tentativasWidth",
    style: {
      width: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("tentativas");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("tentativas");
        }).value;
        let numTentativas = ele.data("tentativas");

        let v = ((numTentativas - min) * (10 - 1)) / (max - min) + 1;

        return v;
      },
    },
  },
  edgeFalhas: {
    selector: ".falhasWidth",
    style: {
      width: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("falhas");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("falhas");
        }).value;
        let numTentativas = ele.data("falhas");

        let v = ((numTentativas - min) * (10 - 1)) / (max - min) + 1;

        return v;
      },
    },
  },
  nodeChurnCountWidth: {
    selector: ".churnCountWidth",
    style: {
      width: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("churnCount");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("churnCount");
        }).value;
        let churnCount = ele.data("churnCount");

        let v = ((churnCount - min) * (10 - 1)) / (max - min) + 1;

        return v;
      },
    },
  },
  edgeFalhasTentativas: {
    selector: ".falhasTentativasWidth",
    style: {
      width: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("tentativas");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("tentativas");
        }).value;
        let numTentativas = ele.data("tentativas");

        let v = ((numTentativas - min) * (10 - 1)) / (max - min) + 1;

        return v;
      },
    },
  },

  customPath: {
    selector: ".highlighted",
    style: {
      "background-color": "#61bffc",
      "line-color": "#61bffc",
    },
  },

  edgeTentativasColor: {
    selector: ".tentativasColor",
    style: {
      lineColor: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("tentativas");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("tentativas");
        }).value;
        let tentativas = ele.data("tentativas");
        let hue;
        if (tentativas === 0) {
          hue = 0;
        } else {
          hue = ((tentativas - min) * (100 - 0)) / (max - min) + 1;
        }

        return ["hsl(", 100 - hue, ",100%,50%)"].join("");
      },
    },
  },

  edgeFalhasColor: {
    selector: ".falhasColor",
    style: {
      lineColor: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("falhas");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("falhas");
        }).value;
        let tentativas = ele.data("falhas");
        let hue;
        if (tentativas === 0) {
          hue = 0;
        } else {
          hue = ((tentativas - min) * (100 - 0)) / (max - min) + 1;
        }

        return ["hsl(", 100 - hue, ",100%,50%)"].join("");
      },
    },
  },
  nodeChurnCountColor: {
    selector: ".nodeChurnCountColor",
    style: {
      lineColor: function (ele: any) {
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
  edgeFalhasTentativasColor: {
    selector: ".falhasTentativasColor",
    style: {
      lineColor: function (ele: any) {
        let numTentativas = ele.data("tentativas");
        let falhas = ele.data("falhas");
        let hue;

        if (falhas === 0 || numTentativas === 0) {
          hue = 0;
        } else {
          hue = (falhas / numTentativas) * 100;
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
  edgeFalhasTentativasLabel: {
    selector: ".falhasTentativasLabel",
    style: {
      shape: "ellipse",
      "text-wrap": "wrap",
      "text-max-width": "200px",
      "font-size": "16px",

      label: function (edge: any) {
        const edgeAtribute = edge.data();
        if (edgeAtribute.falhas > 0 && edgeAtribute.tentativas > 0)
          return (
            "Falhas/Tentativas: " +
            Math.trunc((edgeAtribute.falhas / edgeAtribute.tentativas) * 100) +
            " %"
          );
        else {
          return   "Falhas/Tentativas: " + 0;
        }
      },
    },
  },

  defaultGraph: [
    {
      data: { id: "1", label: "Node 1", churnCount : 0 },
      position: { x: 600, y: 150 },
    },
    {
      data: { id: "2", label: "Node 2", churnCount : 0 },
      position: { x: 550, y: 300 },
    },
    {
      data: { id: "3", label: "Node 3", churnCount : 0 },
      position: { x: 650, y: 300 },
    },
    {
      data: { id: "4", label: "Node 4", churnCount : 0 },
      position: { x: 750, y: 300 },
    },
    {
      data: { id: "5", label: "Node 5", churnCount : 0 },
      position: { x: 830, y: 300 },
    },
    {
      data: { id: "6", label: "Node 6", churnCount : 0 },
      position: { x: 570, y: 440 },
    },
    {
      data: { id: "7", label: "Node 7", churnCount : 0 },
      position: { x: 700, y: 440 },
    },
    {
      data: { id: "8", label: "Node 8", churnCount : 0 },
      position: { x: 800, y: 440 },
    },
    {
      data: { id: "9", label: "Node 9", churnCount : 0 },
      position: { x: 550, y: 570 },
    },
    {
      data: { id: "10", label: "Node 10", churnCount : 0 },
      position: { x: 740, y: 600 },
    },
    {
      data: {
        source: "1",
        target: "2",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "1",
        target: "3",
        tentativas: 0,
        falhas: 0,
        weight: 30,
      },
    },
    {
      data: {
        source: "1",
        target: "4",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "1",
        target: "5",
        tentativas: 0,
        falhas: 0,
        weight: 5,
      },
    },
    {
      data: {
        source: "2",
        target: "3",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "2",
        target: "6",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "3",
        target: "7",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "4",
        target: "5",
        tentativas: 0,
        falhas: 0,
        weight: 5,
      },
    },
    {
      data: {
        source: "6",
        target: "9",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "7",
        target: "10",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "5",
        target: "8",
        tentativas: 0,
        falhas: 0,
        weight: 20,
      },
    },
    {
      data: {
        source: "4",
        target: "8",
        tentativas: 0,
        falhas: 0,
        weight: 2,
      },
    },
    {
      data: {
        source: "8",
        target: "10",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
    {
      data: {
        source: "9",
        target: "10",
        tentativas: 0,
        falhas: 0,
        weight: 15,
      },
    },
  ],
};

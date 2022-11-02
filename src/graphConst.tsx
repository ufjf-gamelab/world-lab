export const graphConsts: Record<string, any> = {
  edgeTentativas: {
    selector: ".tentativas",
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
        let numTentativas = ele.data("tentativas");

        let v = numTentativas / max - min;
        let hue = ((1 - v) * 120).toString(10);
        return ["hsl(", hue, ",100%,50%)"].join("");
      },
    },
  },
  firstNode: {
    selector: "node#1",
    style: {
      "background-color": "red",
      color: "red",
    },
  },
  nodeLabel: {
    selector: "node",
    style: {
      width: 20,
      height: 20,
      shape: "ellipse",
      "text-wrap": "wrap",
      "text-max-width": "200px",
      label: function (node: any) {
        const nodeAtribute = node.data();
        // let labelFinal = "";
        // Object.keys(nodeAtribute).map(function (key, index) {
        //   return (labelFinal += ` ${key} = ${nodeAtribute[key]} `);
        // });
        // return labelFinal;
        return `id = ${nodeAtribute.id}`;
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

  defaultGraph: [
    {
      data: { id: "1", label: "Node 1", difficulty: 5, isVisited: false },
      position: { x: 600, y: 150 },
    },
    {
      data: { id: "2", label: "Node 2", difficulty: 5, isVisited: false },
      position: { x: 550, y: 300 },
    },
    {
      data: { id: "3", label: "Node 3", difficulty: 5, isVisited: false },
      position: { x: 650, y: 300 },
    },
    {
      data: { id: "4", label: "Node 4", difficulty: 5, isVisited: false },
      position: { x: 750, y: 300 },
    },
    {
      data: { id: "5", label: "Node 5", difficulty: 5, isVisited: false },
      position: { x: 830, y: 300 },
    },
    {
      data: { id: "6", label: "Node 6", difficulty: 5, isVisited: false },
      position: { x: 570, y: 440 },
    },
    {
      data: { id: "7", label: "Node 7", difficulty: 5, isVisited: false },
      position: { x: 700, y: 440 },
    },
    {
      data: { id: "8", label: "Node 8", difficulty: 5, isVisited: false },
      position: { x: 800, y: 440 },
    },
    {
      data: { id: "9", label: "Node 9", difficulty: 5, isVisited: false },
      position: { x: 550, y: 570 },
    },
    {
      data: { id: "10", label: "Node 10", difficulty: 5, isVisited: false },
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

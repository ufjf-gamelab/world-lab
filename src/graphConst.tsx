export const graphStyles: Record<string, any> = {
  edgeTentativas: {
    selector: "edge",
    style: {
      width: function (ele: any) {
        return 4 + ele.data("tentativas") *0.75;
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
};

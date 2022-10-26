export const graphStyles: Record<string, any> = {
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
        if (numTentativas > max) numTentativas = max;
        var v = (numTentativas - min) / (max - min) +5;

        return 4 +v;
      },
    },
  },
  edgeTentativasColor: {
    selector: ".tentativasColor",
    style: {
      backgroundColor: function (ele: any) {
   

        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("tentativas");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("tentativas");
        }).value;
        let numTentativas = ele.data("tentativas");
        if (numTentativas > max) numTentativas = max;
        var v = (numTentativas - min) / (max - min);
        var hue = ((1 - v) * 120).toString(10);
        return ["hsl(", hue, ",100%,50%)"].join("");
      },
      lineColor: function (ele: any) {
        let core = ele.cy();

        let max = core.elements().max(function (ele: any) {
          return ele.data("tentativas");
        }).value;
        let min = core.elements().min(function (ele: any) {
          return ele.data("tentativas");
        }).value;
        let numTentativas = ele.data("tentativas");
        if (numTentativas > max) numTentativas = max;
        var v = (numTentativas - min) / (max - min);
        var hue = ((1 - v) * 120).toString(10);
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
};

export const graphStyles: Record<string, any> = {
  edgeTentativas: {
    selector: ".tentativas",
    style: {
      width: function (ele: any) {
        return 4 + ele.data("tentativas") * 0.5;
      },
    },
  },
  edgeTentativasColor: {
    selector: ".tentativasColor",
    style: {
      backgroundColor: function (ele: any) {
        console.log("entrei");
        const numTentativas = ele.data("tentativas");

        if (numTentativas < 10) return "blue";
        else if (numTentativas < 50) {
          return "yellow";
        } else if (numTentativas > 50) {
          return "red";
        } else {
          return "#grey";
        }
      },
      lineColor: function (ele: any) {
        console.log("entrei");
        const numTentativas = ele.data("tentativas");

        if (numTentativas < 10) return "blue";
        else if (numTentativas < 50) {
          return "yellow";
        } else if (numTentativas > 50) {
          return "red";
        } else {
          return "#grey";
        }
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

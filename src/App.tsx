import { useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { ElementDefinition } from "cytoscape";

function App() {
  const cyRef = useRef<cytoscape.Core | undefined>();

  const gerarGrafo = (n = 8, m = n * 2) => {
    function randint(min: number, max: number): number {
      return min + Math.floor(Math.random() * (max - min));
    }

    const ids = [];
    for (let i = 0; i < n; i++) {
      ids.push(String.fromCharCode("a".charCodeAt(0) + i));
    }

    const elementos: ElementDefinition[] = [];

    ids.forEach((id) => {
      elementos.push({
        data: { id, label: id },
        position: {
          x: 300 + Math.random() * 500,
          y: 100 + Math.random() * 500,
        },
      });
    });

    for (let i = 0; i < m; i++) {
      const idIndex1 = randint(0, ids.length);
      let id1 = ids[idIndex1];
      const id2 = ids[randint(false ? idIndex1 + 1 : 0, ids.length)];

      if (id1 === id2) {
        id1 = ids[randint(0, ids.length)];
      }
      elementos.push({ data: { source: id1, target: id2 } });
    }
    return elementos;
  };

  const [elementos, setElementos] = useState(() => gerarGrafo(8));
  console.log("elemnt", elementos);
  return (
    <div className="container">
      <div className="buttonContainer">
        <button onClick={() => setElementos(gerarGrafo())}>new graph</button>
      </div>
      <CytoscapeComponent
        elements={elementos}
        style={{
          width: "1200px",
          height: "700px",
          border: "1px solid black",
        }}
        // layout={{
        //   name: "grid",
        //   rows: 3,
        // }}

        stylesheet={[
          {
            selector: "node",
            style: {
              width: 20,
              height: 20,
              shape: "ellipse",
              "text-wrap": "wrap",
              "text-max-width": "200px",
              label: function (node: any) {
                console.log("node", JSON.stringify(node.data()));
                const nodeAtribute = node.data();
                let labelFinal = "";
                Object.keys(nodeAtribute).map(function (key, index) {
                  labelFinal += ` ${key} = ${nodeAtribute[key]} `;
                });

                console.log("atributeDepois", nodeAtribute);
                return labelFinal;
              },
            },
          },
          {
            selector: "edge",
            style: {
              width: 5,
            },
          },
        ]}
        cy={(cy) => {
          console.log(cy);
          cyRef.current = cy;
          cy.on("tap", "node", function (evt) {
            var node = evt.target;
            let data = node.data();
            console.log("tapped " + JSON.stringify(data));
          });
        }}
      />
    </div>
  );
}

export default App;

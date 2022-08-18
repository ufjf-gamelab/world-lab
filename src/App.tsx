import { useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { ElementDefinition } from "cytoscape";
import { layouts } from "./layouts";

function App() {
  const cyRef = useRef<cytoscape.Core | undefined>();
  const [layout, setLayout] = useState(layouts.klay);
  const randomGraph = (n = 8, m = n * 2) => {
    function randint(min: number, max: number): number {
      return min + Math.floor(Math.random() * (max - min));
    }

    const ids = [];
    for (let i = 0; i < n; i++) {
      ids.push(String(i));
    }

    const nodes: ElementDefinition[] = [];

    ids.forEach((id) => {
      nodes.push({
        data: { id, label: id },
        position: {
          x: 200 + randint(100, 800),
          y: 100 + randint(100, 600),
        },
      });
    });

    for (let i = 0; i < m; i++) {
      const idIndex1 = randint(0, ids.length);
      let id1 = ids[idIndex1];
      const id2 = ids[randint(false ? idIndex1 + 1 : 0, ids.length)];

      id1 !== id2 && nodes.push({ data: { source: id1, target: id2 } });
    }
    return nodes;
  };
  const [elements, setElements] = useState(() => randomGraph(8));
  console.log("elemnt", elements);
  console.log(layouts.random);
  return (
    <div className="container">
      <div className="buttonContainer">
        <button onClick={() => setElements(randomGraph())}>new graph</button>
        <button onClick={() => setLayout(layouts.random)}>Random layout</button>
        <button onClick={() => setLayout(layouts.grid)}>Grid layout</button>
        <button onClick={() => setLayout(layouts.circle)}>Circle layout</button>
      </div>
      <CytoscapeComponent
        elements={elements}
        style={{
          width: "1200px",
          height: "700px",
          border: "1px solid black",
        }}
        layout={layout}
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

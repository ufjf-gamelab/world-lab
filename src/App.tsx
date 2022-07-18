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
        position: { x: 100 + Math.random() * 5, y: 100 + Math.random() * 4 },
      });
    });

    for (let i = 0; i < m; i++) {
      const idIndex1 = randint(0, ids.length);
      const id1 = ids[idIndex1];
      const id2 = ids[randint(false ? idIndex1 + 1 : 0, ids.length)];
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
        <button onClick={() => setElementos(gerarGrafo())}>new graph</button>
      </div>
      <CytoscapeComponent
        elements={[
          {
            data: { id: "1", label: "Node 1" },
            position: { x: 0, y: 0 },
          },
          { data: { id: "2", label: "Node 2" }, position: { x: 100, y: 0 } },
          {
            data: { id: "3", label: "Node 3" },
            position: { x: 100, y: 200 },
          },
          {
            data: { id: "4", label: "Node 3" },
            position: { x: 300, y: 100 },
          },
          {
            data: { id: "5", label: "Node 5" },
            position: { x: 400, y: 50 },
          },
          {
            data: { id: "6", label: "Node 5" },
            position: { x: 400, y: 50 },
          },
          {
            data: {
              source: "1",
              target: "2",
              label: "Edge from Node1 to Node2",
            },
          },
          {
            data: {
              source: "3",
              target: "4",
              label: "Edge from Node3 to Node4",
            },
          },
          {
            data: {
              source: "4",
              target: "5",
              label: "Edge from Node4 to Node5",
            },
          },
          {
            data: {
              source: "6",
              target: "2",
              label: "Edge from Node5 to Node2",
            },
          },
          {
            data: {
              source: "1",
              target: "3",
              label: "Edge from Node5 to Node2",
            },
          },
        ]}
        style={{
          width: "800px",
          height: "500px",
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
                  console.log(
                    "🚀 ~ file: App.tsx ~ line 95 ~ labelFinal",
                    labelFinal
                  );
                  console.log(
                    "🚀 ~ file: App.tsx ~ line 95 ~ nodeAtribute[key]",
                    nodeAtribute[key]
                  );
                  console.log("🚀 ~ file: App.tsx ~ line 104 ~ key", key);
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

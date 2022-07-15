import CytoscapeComponent from "react-cytoscapejs";

function App() {
  const teste = {
    id: "n1",
  };
  return (
    <>
      <CytoscapeComponent
        elements={[
          {
            data: { id: "1", label: "Node 1", obj: teste },
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
          border: "1px solid black",
          width: "100%",
          height: "500px",
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
          cy.on("tap", "node", function (evt) {
            var node = evt.target;
            let data = node.data();
            console.log("tapped " + JSON.stringify(data));
      
          });
        }}
      />
    </>
  );
}

export default App;

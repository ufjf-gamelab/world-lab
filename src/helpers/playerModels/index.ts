export const playerModelValues = {
  explorer: (nodeOperatingData: any, cyRef: any) =>
    explorerModel(nodeOperatingData, cyRef),
  story: (nodeOperatingData: any, cyRef: any) =>
    storyModel(nodeOperatingData, cyRef),
};

export const explorerModel = (data: any, cyRef: any) => {
  let dfs = cyRef?.current?.elements().bfs({
    roots: `#${data.firstNode}`,
    visit: function (v: any, e: any, u: any, i: any, depth: any) {},
    directed: false,
  });

  if (dfs.path.length === 0) return "";
  let pathCollection = dfs.path;

  let lastNodePostion;

  // Percorra cada caminho na coleção de caminhos
  pathCollection.forEach(function (ele: any, i: string, eles: any) {
    if (ele.id() === data.lastNode) lastNodePostion = i;
  });

  let filteredPath = pathCollection.slice([0], [lastNodePostion]);

  return filteredPath;

  // let filteredPathCollection = pathCollection?.filter(function (ele: any) {
  //   if (
  //     ele.data("source") === data.lastNode ||
  //     ele.data("target") === data.lastNode
  //   ) {
  //     return false;
  //   }

  //   return ele.data("id") !== data.lastNode;
  // });

  // const lastPlayerPosition =
  //   filteredPathCollection[filteredPathCollection.length - 1];

  // const lastPlayerPositionID = lastPlayerPosition?.data("id");

  // let aStar = cyRef.current?.elements()?.aStar({
  //   root: `#${lastPlayerPositionID}`,
  //   goal: `#${data.lastNode}`,
  // });

  // let nodePathAstar = aStar.path;

  // let col = cyRef.current.collection();
  // let fullSearch = col.merge(filteredPathCollection).merge(nodePathAstar);

  // return fullSearch;
};

export const storyModel = (data: any, cyRef: any) => {
  let difficultyModel: string;

  if (data.challengeModel === "eloRating") {
    difficultyModel = "difficulty";
  } else {
    difficultyModel = "probabilityOfWinning";
  }
  let aStar = cyRef.current?.elements()?.aStar({
    root: `#${data.firstNode}`,
    goal: `#${data.lastNode}`,
    weight: function (edge: any) {
      let difficulty = edge.data(difficultyModel);
      if (data.challengeModel !== "eloRating") return 1 / difficulty;
      return difficulty;
    },
  });
  let nodePaths = aStar.path;
  let col = cyRef.current.collection();

  return col.merge(nodePaths);
};

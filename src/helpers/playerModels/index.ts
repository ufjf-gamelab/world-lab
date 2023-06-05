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

  let filteredPathCollection = pathCollection?.filter(function (ele: any) {
    if (
      ele.data("source") === data.lastNode ||
      ele.data("target") === data.lastNode
    ) {
      return false;
    }

    return ele.data("id") !== data.lastNode;
  });



  const lastPlayerPosition =
  filteredPathCollection[filteredPathCollection.length - 1];

  const lastPlayerPositionID = lastPlayerPosition?.data("id");

  let aStar = cyRef.current?.elements()?.aStar({
    root: `#${lastPlayerPositionID}`,
    goal: `#${data.lastNode}`,
  });


  let nodePathAstar = aStar.path;

  let col = cyRef.current.collection();
  let fullSearch = col.merge(filteredPathCollection).merge(nodePathAstar);

 
  return fullSearch;
};

export const storyModel = (data: any, cyRef: any) => {
  let aStar = cyRef.current?.elements()?.aStar({
    root: `#${data.firstNode}`,
    goal: `#${data.lastNode}`,
  });

  let nodePaths = aStar.path;
  let col = cyRef.current.collection();

  return col.merge(nodePaths);
};

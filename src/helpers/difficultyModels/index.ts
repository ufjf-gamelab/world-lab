export const difficultyModelValues = {
  lineary: (nodeOperatingData: any, cyRef: any) =>
    linearDifficulty(nodeOperatingData, cyRef),
  adaptative: (nodeOperatingData: any, cyRef: any) =>
    adaptativeDificulty(nodeOperatingData, cyRef),
};

export const adaptativeDificulty = (data: any, cyRef: any) => {
  let edgeData = data.randomEdge.data();

  cyRef.current?.$(`#${edgeData.id}`).data({ difficulty: data.botDifficulty });
  data.setBotDifficulty(data.botDifficulty + 10);
  return;
};

export const linearDifficulty = (data: any, cyRef: any) => {
  let edgeData = data.randomEdge.data();

  cyRef.current?.$(`#${edgeData.id}`).data({ difficulty: data.botDifficulty });

  //estimate player difficulty
  // get the diference between the values
  //based on the diference dfeine new vaue foe estaimted player difficulty
  return;
};

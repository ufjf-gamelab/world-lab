export const difficultyModelValues = {
  lineary: (nodeOperatingData: any, cyRef: any) =>
    linearDifficulty(nodeOperatingData, cyRef),
  adaptative: (nodeOperatingData: any, cyRef: any) =>
    adaptativeDificulty(nodeOperatingData, cyRef),
};

export const adaptativeDificulty = (data: any, cyRef: any) => {
  

  // pegar os valore sde attempts e failures de todos os nos, fazer uma media e ver o % de failures/attempts

  // pegar o que tiver a maior diferenca, se a diferenca pro outros for gritante, mais de 10%, ajustar.

  // quando descobrir qual a aresta, pegar os dois nos e ver os neighbourhood se tiver, pegar a media de dificuldade de todas as arestas e somar +5%
  return;
};

export const linearDifficulty = (data: any, cyRef: any) => {
  let edgeData = data.randomEdge.data();

  // cyRef.current?.$(`#${edgeData.id}`).data({ difficulty: data.botDifficulty });

  //estimate player difficulty
  // get the diference between the values
  //based on the diference dfeine new vaue foe estaimted player difficulty
  return;
};

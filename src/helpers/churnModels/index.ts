export const churnModelValues = {
  threeAndOut: (val: number[], val2: any, cyRef: any) =>
    threeAndOutModel(val, val2, cyRef),
  tryhard: (val: number[], val2: any, cyRef: any) =>
    tryhardModel(val, val2, cyRef),
  noChoicesModel: (val: number[], val2: any, cyRef: any) =>
    noChoicesModel(val, val2, cyRef),
  flow: (val: number[], val2: any, cyRef: any) => flowModel(val, val2, cyRef),
};

const threeAndOutModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.randomEdge.data();
  let edgeAttempts = edgeData.attempts;

  let playerHability;
  let botHability;

  for (let i = 0; i < 10; i++) {
    playerHability = Math.floor(Math.random() * duel[0]);

    botHability = Math.floor(Math.random() * duel[1]);

    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      data.col.merge(data.randomEdge);
      data.col.merge(`#${data.nextNode}`);
      return data.nextNode;
    }
  }
  return "fail";
};
const tryhardModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.randomEdge.data();
  let edgeAttempts = edgeData.attempts;
  let playerHability;
  let botHability;
  for (let i = 0; i < 99; i++) {
    playerHability = Math.floor(Math.random() * duel[0]);
    botHability = Math.floor(Math.random() * duel[1]);
    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      data.col.merge(data.randomEdge);
      data.col.merge(`#${data.nextNode}`);
      return data.nextNode;
    }
  }
  return "fail";
};
const noChoicesModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.randomEdge.data();
  let edgeAttempts = edgeData.attempts;
  let playerHability;
  let botHability;
  for (let i = 0; i < 10; i++) {
    playerHability = Math.floor(Math.random() * duel[0]);
    botHability = Math.floor(Math.random() * duel[1]);
    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      data.col.merge(data.randomEdge);
      data.col.merge(`#${data.nextNode}`);
      return data.nextNode;
    }
  }

  cyRef.current?.$(`#${edgeData.id}`).data({ failures: edgeData.failures + 1 });
  return data.churnNode;
};

const flowModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.randomEdge.data();
  let edgeAttempts = edgeData.attempts;
  let playerHability;
  let botHability;
  for (let i = 0; i < 10; i++) {
    playerHability = Math.floor(Math.random() * duel[0]);
    botHability = Math.floor(Math.random() * duel[1]);
    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      data.col.merge(data.randomEdge);
      data.col.merge(`#${data.nextNode}`);
      return data.nextNode;
    }
  }

  cyRef.current?.$(`#${edgeData.id}`).data({ failures: edgeData.failures + 1 });
  return data.churnNode;
};

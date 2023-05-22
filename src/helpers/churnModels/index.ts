import { changePlayerEmotionState, updateEstimatedPlayerRating } from "..";

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
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;

  let playerHability;
  let botHability;

  for (let i = 0; i < 3; i++) {
    playerHability = Math.floor(Math.random() * duel[0]);

    botHability = Math.floor(Math.random() * duel[1]);

    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      updateEstimatedPlayerRating(data, true);
      return true;
    }
    updateEstimatedPlayerRating(data, false);
  }
  return false;
};
const tryhardModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;
  let playerHability;
  let botHability;
  for (let i = 0; i < 99; i++) {
    playerHability = Math.floor(Math.random() * duel[0]);
    botHability = Math.floor(Math.random() * duel[1]);
    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      updateEstimatedPlayerRating(data, true);
      return true;
    }
    updateEstimatedPlayerRating(data, false);
  }
  return false;
};
const noChoicesModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;
  let playerHability;
  let botHability;
  for (let i = 0; i < 10; i++) {
    playerHability = Math.floor(Math.random() * duel[0]);
    botHability = Math.floor(Math.random() * duel[1]);
    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      return true;
    }
  }

  return false;
};

const flowModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;
  let playerHability;
  let botHability;

  let differenceInDamage;
  let playerEmotion = data.playerEmotion;

  while (playerEmotion > 40 && playerEmotion < 60) {
    playerHability = Math.floor(Math.random() * duel[0]);
    botHability = Math.floor(Math.random() * duel[1]);
    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    differenceInDamage = playerHability - botHability;
    playerEmotion = changePlayerEmotionState(playerEmotion, differenceInDamage);
    if (playerHability > botHability) {
      return true;
    }
  }
  return false;
};

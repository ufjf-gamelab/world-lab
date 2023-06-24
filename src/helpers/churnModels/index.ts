import { updateEstimatedPlayerRating } from "..";

export const churnModelValues = {
  oneChance: (val: number[], val2: any, cyRef: any) =>
    oneChanceModel(val, val2, cyRef),
  oneHundredChoices: (val: number[], val2: any, cyRef: any) =>
    oneHundredChoicesModel(val, val2, cyRef),
  tenChoices: (val: number[], val2: any, cyRef: any) =>
    tenChoicesModel(val, val2, cyRef),
};

const oneChanceModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;
  let edgeFailures = edgeData.failures;
  let playerHability;
  let botHability;
  botHability = duel[1];
  
  for (let i = 0; i < 1; i++) {
    playerHability = Math.floor(Math.random() * 100);

    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
  
    if (playerHability > botHability) {
      let newRating = updateEstimatedPlayerRating(data, true);
      data.changePlayerRating(newRating);
      return true;
    }
    
    let newRating = updateEstimatedPlayerRating(data, false);
    data.changePlayerRating(newRating);
  }
  return false;
};
const oneHundredChoicesModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;
  let edgeFailures = edgeData.failures;
  let playerHability;
  let botHability;
  botHability = duel[1];
  for (let i = 0; i < 100; i++) {
    playerHability = Math.floor(Math.random() * 100);

    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      let newRating = updateEstimatedPlayerRating(data, true);
      data.changePlayerRating(newRating);

      return true;
    }
    let newRating = updateEstimatedPlayerRating(data, false);
    data.changePlayerRating(newRating);
    
  }
  return false;
};
const tenChoicesModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;
  let edgeFailures = edgeData.failures;
  let playerHability;
  let botHability;
  botHability = duel[1];
  for (let i = 0; i < 2; i++) {
    playerHability = Math.floor(Math.random() * 100);

    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      let newRating = updateEstimatedPlayerRating(data, true);
      data.changePlayerRating(newRating);
      return true;
    }
    let newRating = updateEstimatedPlayerRating(data, false);
    data.changePlayerRating(newRating);

  }

  return false;
};

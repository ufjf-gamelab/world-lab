import { updateEstimatedPlayerRating } from "..";

export const churnModelValues = {
  oneChance: (val: number[], val2: any, cyRef: any) =>
    oneChanceModel(val, val2, cyRef),
  threeChoices: (val: number[], val2: any, cyRef: any) =>
    threeChoicesModel(val, val2, cyRef),
  twoChoices: (val: number[], val2: any, cyRef: any) =>
    twoChoicesModel(val, val2, cyRef),
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
      data.estimatingPlayerRating = newRating;
      return true;
    }
    
    let newRating = updateEstimatedPlayerRating(data, false);
    data.estimatingPlayerRating = newRating;
  }
  return false;
};
const threeChoicesModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;
  let edgeFailures = edgeData.failures;
  let playerHability;
  let botHability;
  botHability = duel[1];
  for (let i = 0; i < 3; i++) {
    playerHability = Math.floor(Math.random() * 100);

    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      let newRating = updateEstimatedPlayerRating(data, true);
      data.estimatingPlayerRating = newRating;

      return true;
    }
    let newRating = updateEstimatedPlayerRating(data, false);
    data.changePlayerRating(newRating);
    
  }
  return false;
};
const twoChoicesModel = (duel: number[], data: any, cyRef: any) => {
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
      data.estimatingPlayerRating = newRating;

      return true;
    }
    let newRating = updateEstimatedPlayerRating(data, false);
    data.estimatingPlayerRating = newRating;

  }

  return false;
};

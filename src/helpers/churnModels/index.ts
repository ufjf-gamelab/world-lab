import { updateEstimatedPlayerRating } from "..";

export const churnModelValues = {
  oneChance: (val: number[], val2: any, cyRef: any) =>
    oneChanceModel(val, val2, cyRef),
  oneHundredChoices: (val: number[], val2: any, cyRef: any) =>
    oneHundredChoicesModel(val, val2, cyRef),
  tenChoices: (val: number[], val2: any, cyRef: any) =>
    tenChoicesModel(val, val2, cyRef)

};

const oneChanceModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;
  let edgeFailures = edgeData.failures;
  let playerHability;
  let botHability;

  for (let i = 0; i < 1; i++) {
    playerHability = Math.floor(Math.random() * duel[0]);

    botHability = Math.floor(Math.random() * duel[1]);

    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      updateEstimatedPlayerRating(data, true);
      return true;
    }
    cyRef.current?.$(`#${edgeData.id}`).data({ failures: edgeFailures + 1 });
    updateEstimatedPlayerRating(data, false);
  }
  return false;
};
const oneHundredChoicesModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;
  let edgeFailures = edgeData.failures;
  let playerHability;
  let botHability;
  for (let i = 0; i < 100; i++) {
    playerHability = Math.floor(Math.random() * duel[0]);
    botHability = Math.floor(Math.random() * duel[1]);
    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      updateEstimatedPlayerRating(data, true);
      return true;
    }
    updateEstimatedPlayerRating(data, false);
    cyRef.current?.$(`#${edgeData.id}`).data({ failures: edgeFailures + 1 });
  }
  return false;
};
const tenChoicesModel = (duel: number[], data: any, cyRef: any) => {
  let edgeData = data.edge.data();
  let edgeAttempts = edgeData.attempts;
  let edgeFailures = edgeData.failures;
  let playerHability;
  let botHability;
  for (let i = 0; i < 10; i++) {
    playerHability = Math.floor(Math.random() * duel[0]);
    botHability = Math.floor(Math.random() * duel[1]);
    cyRef.current?.$(`#${edgeData.id}`).data({ attempts: edgeAttempts + 1 });
    if (playerHability > botHability) {
      return true;
    }
    cyRef.current?.$(`#${edgeData.id}`).data({ failures: edgeFailures + 1 });
  }

  return false;
};


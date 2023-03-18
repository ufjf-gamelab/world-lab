import { eloRatingChallenge } from "..";

export const progressionModelValues = {
  fixed: (nodeOperatingData: any) => fixedProgression(nodeOperatingData),
  incremental: (nodeOperatingData: any) =>
    incrementalProgression(nodeOperatingData),
};

export const fixedProgression = (data: any) => {
  return data.playerRating;
};

export const incrementalProgression = (data: any) => {

  let probabilityOfDuel;
 
  const Ra = data.playerRating;
  const K = 32;
  probabilityOfDuel= eloRatingChallenge(data);

  const playerNewRating = Ra + 15

  return playerNewRating;
};

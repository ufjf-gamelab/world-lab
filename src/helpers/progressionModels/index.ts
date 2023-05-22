import { randomFill } from "crypto";
import { calculateProbabilityEloRating, eloRatingChallenge } from "..";

export const progressionModelValues = {
  fixed: (nodeOperatingData: any) => fixedProgression(nodeOperatingData),
  incremental: (nodeOperatingData: any) =>
    incrementalProgression(nodeOperatingData),
};

export const fixedProgression = (data: any) => {
  return data.playerRating;
};

export const incrementalProgression = (data: any) => {
  let Ra = data.playerRating;
  const K = 32;

  
  let edgeData = data.edge.data();
  const Rb = edgeData.difficulty;


  let playerWinProbability = calculateProbabilityEloRating(
    Rb,
    data.estimatedPlayerRating
  );

    Ra = Ra + K * (1 - playerWinProbability);
  
    return Ra;
  

};

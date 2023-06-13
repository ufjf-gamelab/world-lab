import { calculateProbabilityEloRating } from "./../index";
export const challengeModelValues = {
  eloRating: (nodeOperatingData: any) => eloRatingModel(nodeOperatingData),
  randomProbability: (nodeOperatingData: any) => randomModel(nodeOperatingData),
};

export const eloRatingModel = (data: any) => {
  let edgeData = data.edge.data();

  const Ra = data.playerRating;


  const Rb = edgeData.difficulty;


  let playerWinProbability = calculateProbabilityEloRating(Rb, Ra) * 100;
 
  let botWinProbability = calculateProbabilityEloRating(Ra, Rb) * 100;


  const duelValues = [playerWinProbability, botWinProbability];


  return duelValues;
};

export const randomModel = (data: any) => {
  let edge = data.edge.data();
  let playerWinProbability =  edge.probabilityOfWinning;

  let botWinProbability =  (100 - edge.probabilityOfWinning);


  const duelValues = [playerWinProbability, botWinProbability];

  return duelValues;
};

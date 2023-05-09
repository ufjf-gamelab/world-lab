export const calculateProbabilityEloRating = (
  rating1: number,
  rating2: number
) => {
  return (
    (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 400))
  );
};

export const eloRatingChallenge = (data: any) => {
  let edgeData = data.edge.data();
  const Ra = data.playerRating;

  const Rb = edgeData.difficulty;

  let playerWinProbability = calculateProbabilityEloRating(Rb, Ra) * 100;
  let botWinProbability = calculateProbabilityEloRating(Ra, Rb) * 100;

  const duelValues = [playerWinProbability, botWinProbability];
  return duelValues;
};

export const updateEstimatedPlayerRating = (data: any, playerWon: boolean) => {


  let Ra = data.playerRating;
  console.log("🚀 ~ file: index.ts:27 ~ updateEstimatedPlayerRating ~ Ra:", Ra)
  let edgeData = data.edge.data();
  const Rb = edgeData.difficulty;
  console.log("🚀 ~ file: index.ts:30 ~ updateEstimatedPlayerRating ~ Rb:", Rb)

  let playerWinProbability = calculateProbabilityEloRating(Rb, Ra) 
  let botWinProbability = calculateProbabilityEloRating(Ra, Rb);

  if (playerWon === true) {
    Ra = Ra + 32 * (1 - playerWinProbability);
    data.setEstimatedPlayerRating(Ra)

  }

  else {
    Ra = Ra + 31 * (0 - playerWinProbability);
    data.setEstimatedPlayerRating(Ra)
  }

  console.log("Updated Ratings:-");
  console.log("Ra = " + Math.round(Ra * 1000000.0) / 1000000.0);
};

export const getNodeEdges = (cyRef: any, nextNode: string, col: any) => {
  return cyRef.current
    ?.$(`#${nextNode}`)
    .neighborhood()
    .filter(function (ele: any) {
      return ele.isEdge();
    })
    .filter(function (ele: any) {
      const nodeData = ele.data();
      const nodeSource = nodeData.source;
      const nodeTarget = nodeData.target;

      const collectionIncludesSource = col?.contains(
        cyRef?.current!.$(`#${nodeSource}`)
      );

      const collectionIncludesTarget = col?.contains(
        cyRef?.current!.$(`#${nodeTarget}`)
      );

      if (
        nodeTarget === nodeSource ||
        (collectionIncludesSource && collectionIncludesTarget)
      ) {
        return false;
      }

      return true;
    });
};

export const initializeStandardDifficulty = (progressionModel: string) => {
  let initialDifficulty;
  switch (progressionModel) {
    case "easy":
      initialDifficulty = 1300;
      break;
    case "medium":
      initialDifficulty = 1500;
      break;
    case "hard":
      initialDifficulty = 1700;
      break;
    case "extreme":
      initialDifficulty = 1800;
      break;
    default:
      initialDifficulty = 1600;
  }

  return initialDifficulty;
};

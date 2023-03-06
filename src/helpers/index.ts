export const calculateProbabilityEloRating = (
  rating1: number,
  rating2: number
) => {
  return (
    (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 400))
  );
};

export const eloRatingChallenge = (data: any, playerRating: number) => {
  let edgeData = data.randomEdge.data();

  const Ra = playerRating;

  const Rb = edgeData.difficulty;

  const K = 32;

  let playerWinProbability = calculateProbabilityEloRating(Rb, Ra) * 100;
  let botWinProbability = calculateProbabilityEloRating(Ra, Rb) * 100;

  const duelValues = [playerWinProbability, botWinProbability];

  return duelValues;
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

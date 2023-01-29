export const calculateProbabilityEloRating = (
  rating1: number,
  rating2: number
) => {
  return (
    (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 400))
  );
};

export const eloRatingChallenge = (data: any, actualPlayerRating: number) => {
  let edgeData = data.randomEdge.data();
  let edgeDifficulty = edgeData.difficulty;

  const Ra = actualPlayerRating;
  const Rb = edgeDifficulty;

  //const K = 32;

  let playerWinProbability = calculateProbabilityEloRating(Rb, Ra) * 100;

  let botWinProbability = calculateProbabilityEloRating(Ra, Rb) * 100;

  const duelValues = [playerWinProbability, botWinProbability];

  return duelValues;
};

export const getNodeEdges = (cyRef: any, nextNode:string, col:any) => {

    cyRef.current
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


const Glicko2 = (userRating: number, initialRd: number, initialVol: number, initialTau: number) => {

  

  const updateRating = (result: number, opponentRating: number, opponentRd: number, ) => {
    const g = (rd: number) => 1 / Math.sqrt(1 + 3 * rd * rd / Math.PI * Math.PI);
    const delta = g(initialRd) * (result - expectedScore(userRating , opponentRating, opponentRd));
    const a = Math.log(initialVol * initialVol);
    const dSquared = initialRd * initialRd + initialVol * initialVol;
    const v = 1 / (1 / dSquared + 1 / initialVol / initialVol);
    const w = v * (delta * delta - dSquared - v);
    const t = Math.exp(a - v / 2);
    // let A = a;
    // if (w > -1 * Math.log(10) * 2 / 2) {
    //     A = Math.max(0, a - v / 2 - w / 2);
    // }
    const newVol = 1 / Math.sqrt((1 / v) + (1 / initialTau / initialTau));
    const newRd = Math.sqrt(1 / (1 / initialRd / initialRd + 1 / newVol / newVol));
    const newRating = userRating + t * newRd * g(initialRd) * (result - expectedScore(userRating, opponentRating, opponentRd));
    return { rating: newRating, rd: newRd, vol: newVol };
  }
  


  return { updateRating }
}

const expectedScore = (userRating:number, opponentRating: number, opponentRd: number) => {

  const g = (rd: number) => 1 / Math.sqrt(1 + 3 * rd * rd / Math.PI * Math.PI);
  return 1 / (1 + Math.exp(-1 * g(opponentRd) * (userRating - opponentRating)));
}
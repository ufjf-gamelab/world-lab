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




type Player = {
  rating: number;
  rd: number;
  volatility: number;
};

type Game = {
  player: Player;
  opponent: Player;
  result: 'win' | 'loss';
};

const systemConstant = 0.5;
const q = Math.log(10) / 400;

const calculateWinProbability = (player: Player, opponent: Player) => {
  const g = (rd: number) => 1 / Math.sqrt(1 + (3 * rd * 2) / (Math.PI * 2));
  return 1 / (1 + 10 ** (-g(opponent.rd) * (player.rating - opponent.rating) / 400));
};

const updatePlayer = (player: Player, games: Game[]) => {
  const newRd = Math.sqrt(player.rd * 2 + player.volatility * 2);

  let sumWinProbabilityMinusHalf = 0;
  for (const game of games) {
    if (game.player !== player) {
      continue;
    }

    const winProbability = calculateWinProbability(game.player, game.opponent);
    sumWinProbabilityMinusHalf += game.result === 'win' ? winProbability - 0.5 : -0.5;
  }
  const g = (rd: number) => 1 / Math.sqrt(1 + (3 * rd * 2) / (Math.PI * 2));
  const I = (g(newRd) ** 2) * sumWinProbabilityMinusHalf;
  const newRating = player.rating + (q / (1 / (newRd ** 2) + 1 / I)) * sumWinProbabilityMinusHalf;

  // return {
  //   rating: newRating,
  //   rd: newRd,
  //   volatility: player.volatility,
  // };
};
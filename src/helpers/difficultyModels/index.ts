export const adaptativeDificulty = (edge: any) => {
  //estimate player difficulty
  // get the diference between the values
  // cyRef.current?.$(`#${edge.id}`).data({ difficulty: estimatedPlayerRating });
};

export const basicDifficulty = (edge: any) => {
  // let randomNumber =
  //   Math.floor(Math.random() * 3) + simulatorData?.playerRating!;
  // cyRef.current?.$(`#${edge.id}`).data({ difficulty: randomNumber });
  //estimate player difficulty
  // get the diference between the values
  //based on the diference dfeine new vaue foe estaimted player difficulty
};


const calculateNewRatings = (player: any, npc: any, outcome: number) => {
  // The Glicko2 rating system uses a formula to calculate the new ratings
  // outcome should be 1 for win, 0.5 for draw, and 0 for loss
  // tau is a constant that determines the volatility of the ratings
  const tau = 0.5;
  const RD_p = player.deviation;
  const RD_e = npc.deviation;
  const sigma_p = player.volatility;
  const sigma_e = npc.volatility;
  const g_p = 1 / (Math.sqrt(1 + (3 * sigma_p ** 2) / (Math.PI ** 2)));
  const E = 1 / (1 + Math.exp(-g_p * (npc.rating - player.rating) / RD_p));
  const d_squared = 1 / (g_p ** 2 * E * (1 - E)) + (1 / (RD_p ** 2) + 1 / (RD_e ** 2));
  const v = 1 / d_squared;
  const delta = v * (outcome - E);
  const new_rating = player.rating + (RD_p ** 2) * g_p * delta;
  const new_rd = Math.sqrt(1 / (1 / (RD_p ** 2) + 1 / v));
  const new_vol = 1 / (1 / sigma_p + 1 / v);
  return {
    rating: new_rating,
    deviation: new_rd,
    volatility: new_vol,
  }
}
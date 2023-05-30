


export const progressionModelValues = {
  noProgression: (nodeOperatingData: any) => noProgression(nodeOperatingData),
  incremental: (nodeOperatingData: any) =>
    incrementalProgression(nodeOperatingData),
};

export const noProgression = (data: any) => {
  return data.playerRating;
};

export const incrementalProgression = (data: any) => {
  
  
    return data.playerRating + 50;
  

};

export type INode  = {
    id: string;
    label: string;
    churnCount: number;
    newAttributes?: {
      attribute: string;
      value: string;
    }[];
  }
  
  export type ISearchParameters  = {
    chosenNode: string;
    col: cytoscape.CollectionReturnValue;
    randomNode: any;
  }
  
  export type IEdge  = {
    id?: string;
    target: string;
    source: string;
    difficulty: number;
    attempts: number;
    failures: number;
    label?: string;
  }
  
  export type IClickedPosition  = {
    x: number;
    y: number;
  }
  
  export type ICustomSearchFormValues  = {
    firstNode: string;
    lastNode: string;
    challengeModel: string;
    churnModel: string;
    difficultyModel: string;
    numberOfRuns: number;
    playerRating: number;
  }
  
  export type FormValues  = {
    label: string;
    churnCount: number;
    attempts?: number;
    difficulty?: number;
    failures?: string;
    newAttributes: {
      attribute: string;
      value: string;
    }[];
  }
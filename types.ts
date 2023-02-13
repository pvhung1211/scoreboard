type ItemValue =
  | 'plus'
  | 'extra'
  | 'bonus'
  | 'shield'
  | 'nope'
  | 'attack'
  | 'strike'
  | 'double_bet'
  | 'rescue'
  | 'swap';

interface Item {
  avatar: string;
  desc: string;
  value: ItemValue;
  label: string;
  gif: string;
}
interface Answer {
  usedItem: Item | null;
  earnedPoint: number;
  status?: {
    'beAttacked': {
      by: Player;
      point: number;
    } | null;
    'beStriked': {
      by: Player;
      point: number;
    } | null;
    'beSwapped': {
      with: Player;
      srcItem: Item;
      desItem: Item;
    } | null;
  };
}
interface Player {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  prevRank: number;
  point: number; // point === 0 -> lose
  answers: Answer[];
  itemsLeft: Item[];
}

export enum BroadCastTypes {
  'GET_PLAYERS' = 'GET_PLAYERS',
  'UPDATE_ITEM_IN_USE' = 'UPDATE_ITEM_IN_USE',
  'APP_PROGRESS' = 'APP_PROGRESS',
  'NEW_CONNECTION' = 'NEW_CONNECTION',
  'GET_DATA_FOR_NEW_CONNECTION' = 'GET_DATA_FOR_NEW_CONNECTION',
}

interface GetPlayersEvent {
  type: BroadCastTypes.GET_PLAYERS;
  data: Player[];
}



export interface UpdateItemInUse {
  type: BroadCastTypes.UPDATE_ITEM_IN_USE;
  data: {
    playerId: string;
    item: Item | null;
  };
}

export interface UpdateAppProgess {
  type: BroadCastTypes.APP_PROGRESS;
  data: {
    playing: boolean;
    setting: boolean;
    currentQuest: number;
  };
}

export type BroadCast =
  | GetPlayersEvent
  | UpdateItemInUse
  | UpdateAppProgess;



// SOCKET CHANNEL
export interface ServerToClientEvents {
  [BroadCastTypes.GET_PLAYERS]: (data: GetPlayersEvent['data']) => void;
  [BroadCastTypes.APP_PROGRESS]: (data: UpdateAppProgess['data']) => void;
  [BroadCastTypes.UPDATE_ITEM_IN_USE]: (data: UpdateItemInUse['data']) => void;
  [BroadCastTypes.NEW_CONNECTION]: () => void;
}
export interface ClientToServerEvents {
  [BroadCastTypes.GET_PLAYERS]: (data: GetPlayersEvent['data']) => void;
  [BroadCastTypes.APP_PROGRESS]: (data: UpdateAppProgess['data']) => void;
  [BroadCastTypes.UPDATE_ITEM_IN_USE]: (data: UpdateItemInUse['data']) => void;
  [BroadCastTypes.NEW_CONNECTION]: () => void;
  [BroadCastTypes.GET_DATA_FOR_NEW_CONNECTION]: (data: {
    players: GetPlayersEvent['data'];
    progress: UpdateAppProgess['data'] | null;
    itemInUse: UpdateItemInUse['data'] | null;
  }) => void;
}


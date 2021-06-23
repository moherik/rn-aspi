import {RegisterPayload} from '../App';

export type PacketType = {
  id: number;
  name: string;
  price: number;
  speed: number;
  description: string;
  type: string;
};

export type AuthContextState = {
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (payload: RegisterPayload) => Promise<void>;
  state: any;
};

export type AuthReducerState = {
  isLoading: boolean;
  isSignOut: boolean;
  userToken: any;
};

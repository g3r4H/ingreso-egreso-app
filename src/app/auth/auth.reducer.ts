import { Action, createReducer, on } from '@ngrx/store';
import { setUser, unsetUser } from './auth.actions';
import { User } from '../models/user.model';

export interface State {
  user: User | null;
}

export const initialState: State = {
  user: null,
};

const _authReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => ({ ...state, user: { ...user } })),
  on(unsetUser, (state) => ({ ...state, user: null }))
);

export function authReducer(state: State | undefined, action: Action) {
  return _authReducer(state, action);
}

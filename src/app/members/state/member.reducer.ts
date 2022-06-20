import { createReducer, on, State } from '@ngrx/store';
import { IMember, IResults } from '../Member';

import { MemberApiActions, MemberPageActions } from './actions';

// State for this feature ( Cat )
export interface MemberState {
  results: IResults | null;
  currentMemberId: number | null;
  members: IMember[];
  error: string;
}

const initialState: MemberState = {
  results: null,
  currentMemberId: null,
  members: [],
  error: '',
};

export const memberReducer = createReducer(
  initialState,
  on(
    MemberPageActions.setCurrentMember,
    (state, action): MemberState => {
      return {
        ...state,
        currentMemberId: action.currentMemberId,
      };
    }
  ),
  on(
    MemberPageActions.initializeCurrentMember,
    (state): MemberState => {
      return {
        ...state,
        currentMemberId: 0,
      };
    }
  ),
  on(
    MemberApiActions.LoadMembersSuccess,
    (state, action): MemberState => {
      return {
        ...state,
        results: action.results,
        members: action.results.results,
        error: '',
      };
    }
  ),
  on(
    MemberApiActions.loadMembersFailure,
    (state, action): MemberState => {
      return {
        ...state,
        members: [],
        error: action.error,
      };
    }
  )
);

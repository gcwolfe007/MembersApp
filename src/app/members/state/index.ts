import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as AppState from '../../state/app.state';
import { MemberState } from './member.reducer';


export interface State extends AppState.State {
  members: MemberState;
}
// Selector functions
const getMembersFeatureState = createFeatureSelector<MemberState>('members');

export const getMembers = createSelector(
  getMembersFeatureState,
  state => state.members
);

export const getCurrentMemberId = createSelector(
  getMembersFeatureState,
  state => state.currentMemberId
);

export const getCurrentMember = createSelector(
  getMembersFeatureState,
  getCurrentMemberId,
  (state, currentMemberId) => {
    if (currentMemberId === 0){
      return {
        id: null,
        location: null,
        login: null,
        gender: '',
        email: '',
        dob: null,
        registered: null,
        phone: '',
        cell: '',
        picture: null,
        nat: ''
      };
    } else {
      return currentMemberId ? state.members.find(c => c.id.value === null) : null;
    }
  }
);

export const getError = createSelector(
  getMembersFeatureState,
  state => state.error
);

import { IMember } from '../../Member';

/* NgRx */
import { createAction, props } from '@ngrx/store';


export const setCurrentMember = createAction(
  '[Member Page] Set Current Member',
  props<{currentMemberId: number}>()
);

export const initializeCurrentMember = createAction(
  '[Member Page] Initialize Current Member',
);

export const loadMembers = createAction(
  '[Member Page] Load',
);




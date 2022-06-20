import { IMember, IResults } from '../../Member';

import { createAction, props} from '@ngrx/store';

export const LoadMembersSuccess = createAction(
  '[Member API Success]',
  props<{ results: IResults}>()
);

export const loadMembersFailure = createAction(
  '[Member API] Load Fail',
  props<{ error: string }>()
);




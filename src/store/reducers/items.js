import qs from 'query-string';

import { actions } from '../../constants';

const getQuery = (url) => {
  if (url) {
    return qs.parseUrl(url).query;
  }

  return null;
};

const initialState = {
  data: [],
  isLoading: false,
  hasFailedToLoad: false,
  hasLoaded: false,
  nextQuery: null,
};

const actionFactory = {
  [actions.ITEMS_RESET]: () => ({ ...initialState }),
  [actions.ITEMS_SET]: (state, { data }) => ({
    ...state,
    hasLoaded: true,
    hasFailedToLoad: false,
    isLoading: false,
    data: data.data,
    nextQuery: data.nextQuery,
  }),
  [actions.ITEMS_GET_REQUEST]: (state) => ({
    ...state,
    isLoading: true,
    hasFailedToLoad: false,
    hasLoaded: false,
  }),
  [actions.ITEMS_GET_SUCCESS]: (state, { result }) => {
    const data = [...state.data, ...result.data.results];
    const nextQuery = getQuery(result.data.next);

    return {
      ...state,
      isLoading: false,
      hasFailedToLoad: false,
      data,
      hasLoaded: true,
      nextQuery,
    };
  },
  [actions.ITEMS_GET_FAILURE]: (state) => ({
    ...state,
    data: [],
    isLoading: false,
    hasFailedToLoad: true,
    hasLoaded: false,
  }),
};

export default (state = initialState, action) => {
  if (actionFactory[action.type]) {
    return actionFactory[action.type](state, action);
  }

  return state;
};

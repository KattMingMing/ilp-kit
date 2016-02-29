import * as types from '../actionTypes';

// TODO shouldn't ask for transfer link
export function toggleJson(id, transfer) {
  return (dispatch, getState) => {
    const payment = getState().history.history.filter((item) => {
      return item.id === id;
    })[0];

    // Hide the json
    if (payment.showJson) {
      return dispatch({
        type: types.PAYMENT_JSON_HIDE,
        id
      });
    } else if (payment.json) { // Show the json
      return dispatch({
        type: types.PAYMENT_JSON_SHOW,
        id
      });
    }

    // Load the json
    return dispatch({
      types: [types.PAYMENT_JSON_LOADING, types.PAYMENT_JSON_SUCCESS, types.PAYMENT_JSON_FAIL],
      promise: (client) => client.get(transfer),
      id
    });
  };
}

export function load() {
  return {
    types: [types.HISTORY_LOAD, types.HISTORY_LOAD_SUCCESS, types.HISTORY_LOAD_FAIL],
    promise: (client) => client.get('/payments')
  };
}

// TODO separate module for WS stuff?
export function addPayment(data) {
  return (dispatch, getState) => {
    const duplicate = getState().history.history.filter((item) => {
      return item.id === data.id;
    })[0];

    if (duplicate) return false;

    const change = getState().auth.user.account === data.destination_account
      ? Number(data.destination_amount)
      : -Number(data.destination_amount);

    dispatch({
      type: types.UPDATE_BALANCE,
      change: change
    });

    return dispatch({
      type: types.WS_PAYMENT,
      result: data
    });
  };
}

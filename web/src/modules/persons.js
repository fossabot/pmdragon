/* eslint-disable no-param-reassign */
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const state = {
  username: null,
  first_name: null,
  last_name: null,
  tokens: {
    access: {
      data: null,
      expired_at: null,
    },
    refresh: {
      data: null,
      expired_at: null,
    },
  },
};

const getters = {
  ACCESS_TOKEN: (thisState) => thisState.tokens.access,
  REFRESH_TOKEN: (thisState) => thisState.tokens.refresh,
  USERNAME: (thisState) => thisState.username,
  FIRST_NAME: (thisState) => thisState.first_name,
  LAST_NAME: (thisState) => thisState.last_name,
};

const mutations = {
  SET_ACCESS_TOKEN: (thisState, payload) => {
    thisState.tokens.access = payload;
  },
  SET_REFRESH_TOKEN: (thisState, payload) => {
    thisState.tokens.refresh = payload;
  },
  SET_USERNAME: (thisState, payload) => {
    thisState.username = payload;
  },
  SET_FIRST_NAME: (thisState, payload) => {
    thisState.first_name = payload;
  },
  SET_LAST_NAME: (thisState, payload) => {
    thisState.last_name = payload;
  },
};

const actions = {
  async fetchTokens({ commit }, credentials) {
    const response = await fetch('/api/auth/obtain/', {
      method: 'POST',
      headers,
      body: JSON.stringify(credentials),
    });

    const json = await response.json();
    if (response.status !== 200) {
      throw await response.json();
    }

    commit('SET_ACCESS_TOKEN', json.access);
    commit('SET_REFRESH_TOKEN', json.refresh);
    commit('SET_USERNAME', json.username);
    commit('SET_FIRST_NAME', json.first_name);
    commit('SET_LAST_NAME', json.last_name);
  },

  async fetchAccessToken({ commit, thisState }) {
    const response = await fetch('api/auth/refresh', {
      method: 'POST',
      headers,
      body: JSON.stringify({ access: thisState.refresh.data }),
    });

    const json = await response.json();
    if (response.status !== 200) {
      throw await response.json();
    }

    commit('SET_ACCESS_TOKEN', json.access);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};

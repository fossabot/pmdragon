import { API_URL } from 'src/.env'
import axios from 'axios'
import $store from 'src/store'
import $router from 'src/router'
import { HandleResponse, ErrorWrapper, ResponseWrapper } from 'src/services/util'

// Inspired by https://github.com/zmts/beauty-vuejs-boilerplate/blob/master/src/services/auth.service.js
export class AuthService {
  static async login (credentials) {
    /**
     * Login by sending login and password
     * @param credentials Object { username: '', password: ''}
     */
    try {
      const response = await axios.post(
        `${API_URL}/auth/obtain/`,
        credentials
      )
      HandleResponse.compare(200, response.status)

      const tokens = response.data.tokens
      _setAuthData(tokens.access, tokens.refresh)
      _setUserData(response.data)

      return new ResponseWrapper(response, response.data)
    } catch (error) {
      throw new ErrorWrapper(error)
    }
  }

  static async refresh () {
    /** Refresh access amd refresh token by sending refresh token */
    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh/`,
        { refresh: $store.getters['auth/REFRESH_TOKEN'] }
      )

      HandleResponse.compare(200, response.status)

      const tokens = response.data

      _setAuthData(tokens.access, tokens.refresh)

      return response
    } catch (error) {
      console.log(error)
      $router.push({ name: 'login' })
        .catch(() => {})
    }
  }

  static async logout () {
    /** Logout by removing auth data on the page 
     * @returns {null} 
     * */
    _resetAuthData()
  }

  static getAccessToken() {
    return $store.getters['auth/ACCESS_TOKEN']
  }

  /**
   * Get Header Text for using in axios
   * @returns {string} 
   **/
  static getBearer () {
    return `Bearer ${this.getAccessToken()}`
  }

  static isAcceKessTokenExpired () {
    /**
     * @returns {boolean|*}
     */
    return !$store.getters['auth/IS_ACCESS_TOKEN_VALID']
  }

  static isRefreshTokenExpired () {
    /**
     * @returns {boolean|*}
     */
    return !$store.getters['auth/IS_REFRESH_TOKEN_VALID']
  }

  /**
   * Is Refresh token exists and still valid
   * @returns {boolean|*}
   */
  static isRefreshToken () {
    return Boolean($store.getters['auth/REFRESH_TOKEN']) && !this.isRefreshTokenExpired()
  }

  /**
   * If access token expired and refresh token exists and still valid
   * @returns {*|boolean}
   */
  static authNeedUpdate () {
    return Boolean(this.isAccessTokenExpired() && this.isRefreshToken())
  }
}

/**
 * Set Auth Data (to Vuex store), parsing details from it
 * @private
 * @param access
 * @param refresh
 */
function _setAuthData (access, refresh) {
  $store.commit('auth/SET_ACCESS_TOKEN', access)
  $store.commit('auth/SET_REFRESH_TOKEN', refresh)
}

/**
 * Set User Data (to Vuex store).
 * @param data Is response of API (/api/auth/obtain),
 * at least first_name and last name should exists
 * @private
 */
function _setUserData (data) {
  $store.commit('auth/SET_FIRST_NAME', data.first_name)
  $store.commit('auth/SET_LAST_NAME', data.last_name)
}

/**
 * Reset auth data from Vuex store
 * @private
 */
function _resetAuthData () {
  $store.commit('auth/LOGOUT')
}

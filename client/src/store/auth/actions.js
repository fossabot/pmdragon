import { AuthService } from 'src/services/auth'
import { Api } from 'src/services/api'
import { ErrorWrapper, HandleResponse } from 'src/services/util'

export async function LOGIN ({ commit }, credentials) {
  return await AuthService.login(credentials)
}

export async function REFRESH ({ commit }, refreshToken) {
  return await AuthService.refresh(refreshToken)
}

export async function LOGOUT ({ dispatch }) {
  await AuthService.logout()
}

export async function USER_UPDATE ({ commit }, payload) {
  try {
    const response = await new Api({ auth: true })
      .put('/auth/me/', payload)

    HandleResponse.compare(200, response.status)

    commit('SET_FIRST_NAME', response.data.first_name)
    commit('SET_LAST_NAME', response.data.last_name)
    commit('SET_USERNAME', response.data.username)
  } catch (error) {
    throw new ErrorWrapper(error)
  }
}

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isAuthenticated: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
setUser: (state, action) => {
      // CRITICAL: Always use deep cloning to avoid reference issues
      const userData = JSON.parse(JSON.stringify(action.payload))
      // Extract role from the user data structure
      if (userData && userData.accounts && userData.accounts[0]) {
        userData.role_c = userData.accounts[0].role || 'user'
      }
      state.user = userData
      state.isAuthenticated = !!action.payload
    },
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
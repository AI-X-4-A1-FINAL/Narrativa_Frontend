import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/userTypes';

// action.type 선언(해당 방식으로 해야 오타 쉽게 찾을 수 o)
export const TOGGLE_MODAL = "TOGGLE_MODAL";
export const CLOSE_MODAL = "CLOSE_MODAL";
export const OPEN_MODAL = "OPEN_MODAL";

// 초깃값
const initialState: User = {
  username: '',
  email: '',
  profile: '',
  profileUrl: '',
}

// 유저 상태를 관리하는 슬라이스
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      setUser: (state, action: PayloadAction<User>) => {
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.profile = action.payload.profile;
        state.profileUrl = action.payload.profileUrl;
      },
      updateUsername: (state, action: PayloadAction<string>) => {
        state.username = action.payload;
      },
      updateEmail: (state, action: PayloadAction<string>) => {
        state.email = action.payload;
      },
      updateProfile: (state, action: PayloadAction<string>) => {
        state.profile = action.payload;
      },
      updateProfileUrl: (state, action: PayloadAction<string>) => {
        state.profileUrl = action.payload;
      },
    },
  });
  
  export const { setUser, updateUsername, updateEmail, updateProfile, updateProfileUrl } = userSlice.actions;
  
  export default userSlice.reducer;
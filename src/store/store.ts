import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../reducer/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,  // 유저 상태를 관리하는 리듀서 등록
  },
});

export type RootState = ReturnType<typeof store.getState>; // RootState 타입 정의
export type AppDispatch = typeof store.dispatch; // dispatch 타입 정의
// types.ts (상태 타입 정의)
export interface User {
    username: string;
    email: string;
    profile: string;
    profileUrl: string;
}
  
export interface RootState {
    user: User;
}
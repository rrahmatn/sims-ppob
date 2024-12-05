import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../../../types';

const initialState: UserState = {
  email: '',
  first_name: '',
  last_name: '',
  profile_image: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserState>) => {
      const { email, first_name, last_name, profile_image } = action.payload;
      state.email = email;
      state.first_name = first_name;
      state.last_name = last_name;
      state.profile_image = profile_image;
    },
    
    clearUserData: (state) => {
      state.email = '';
      state.first_name = '';
      state.last_name = '';
      state.profile_image = '';
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;

export default userSlice.reducer;

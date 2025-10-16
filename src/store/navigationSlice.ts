import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NavigationState {
  activeIndex: number;
}

const initialState: NavigationState = {
  activeIndex: 0,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveIndex: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },
    nextPage: (state) => {
      state.activeIndex = (state.activeIndex + 1) % 5; // 5 pages total
    },
  },
});

export const { setActiveIndex, nextPage } = navigationSlice.actions;
export default navigationSlice.reducer;

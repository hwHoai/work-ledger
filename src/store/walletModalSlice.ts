import { createSlice } from '@reduxjs/toolkit';

interface WalletModalState {
  isOpen: boolean;
}

const initialState: WalletModalState = {
  isOpen: false,
};

const walletModalSlice = createSlice({
  name: 'walletModal',
  initialState,
  reducers: {
    openWalletModal: (state) => {
      state.isOpen = true;
    },
    closeWalletModal: (state) => {
      state.isOpen = false;
    },
    toggleWalletModal: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openWalletModal, closeWalletModal, toggleWalletModal } = walletModalSlice.actions;
export default walletModalSlice.reducer;

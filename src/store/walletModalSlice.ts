import { createSlice } from '@reduxjs/toolkit';

interface WalletModalState {
  isOpen: boolean;
  connectedWallet?: string;
}

const initialState: WalletModalState = {
  isOpen: false,
  connectedWallet: undefined,
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
    setConnectedWallet(state, action) {
      state.connectedWallet = action.payload; // ok with RTK
      console.log('walletModal.setConnectedWallet ->', action.payload);
    },
  },
});

export const { openWalletModal, closeWalletModal, toggleWalletModal, setConnectedWallet } =
  walletModalSlice.actions;
export default walletModalSlice.reducer;

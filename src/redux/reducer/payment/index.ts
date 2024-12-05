import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Services } from "../../../types";


const initialState: Services = {
  service_icon : '',
  service_code: "",
  service_name : '',
  service_tariff : 0,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPayment: (state, action: PayloadAction<Services>) => {
      const { service_code,service_icon ,service_name ,service_tariff} = action.payload;
      state.service_icon = service_icon ;
      state.service_code = service_code;
      state.service_name = service_name
      state.service_tariff = service_tariff
    },

    clearPayment: (state) => {
        state.service_icon = ''
        state.service_code = ""
        state.service_name = ''
        state.service_tariff = 0
    },
  },
});

export const { setPayment, clearPayment } = paymentSlice.actions;

export default paymentSlice.reducer; 
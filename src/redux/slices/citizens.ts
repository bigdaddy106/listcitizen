import { createSlice } from "@reduxjs/toolkit";
import { Citizen } from "../../types/citizen";

const citizensSlice = createSlice({
  name: "citizensSlice",
  initialState: {
    pageSize: 10,
    pageNumber: 0,
    data: [] as Citizen[],
  },
  reducers: {
    setPage: (state, action) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    updateData: (state, action) => {
      const { from, range, updates } = action.payload;
      const temp = [...state.data];

      for (let i = from; i < from + range && i < temp.length; i++) {
        temp[i] = updates[i - from];
      }

      state.data = temp;
    },
    pushData: (state, action) => {
      state.data.push(...action.payload);
    },
  },
});
const citizensReducer = citizensSlice.reducer;

export const CitizensServices = { actions: citizensSlice.actions };
export default citizensReducer;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Title from "../components/typographs/Title";
import { CustomNoRowsOverlay } from "../components/datagrid/NoRowOverlay";
import { AppDispatch, AppState } from "../redux/store";
import { CitizensServices } from "../redux/slices/citizens";
import {
  decodeLogsToCitizens,
  fetchEventLogsFromInitFromBlocks,
  getNoteByIdRange,
} from "../utils/web3";

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    minWidth: 90,
    flex: 1,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "age",
    headerName: "AGE",
    type: "number",
    width: 100,
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  { field: "city", headerName: "CITY", minWidth: 160, flex: 4 },
  { field: "name", headerName: "FULL NAME", width: 160, flex: 2 },
  { field: "someNote", headerName: "SOME NOTE", minWidth: 320, flex: 4 },
];

export default function Citizens() {
  const [loading, setLoading] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { pageNumber, pageSize, data } = useSelector(
    (state: AppState) => state.citizens
  );

  useEffect(() => {
    if (!data.length) {
      fetchInitialData();
    }
  }, []);

  useEffect(() => {
    if (data.length && !data[(pageNumber + 1) * pageSize]?.someNote) {
      updatedData();
    }
  }, [pageNumber, pageSize]);

  async function fetchInitialData() {
    setLoading(true);
    const logs = await fetchEventLogsFromInitFromBlocks();
    const citizens = await decodeLogsToCitizens(logs);
    const someNotes = await getNoteByIdRange(1, pageSize);
    someNotes.forEach((someNote, index) => {
      citizens[index].someNote = someNote;
    });
    dispatch(CitizensServices.actions.setData(citizens));
    setLoading(false);
  }
  async function updatedData() {
    setLoading(true);
    const someNotes = await getNoteByIdRange(
      pageNumber * pageSize + 1,
      pageSize
    );
    const citizens = someNotes.map((someNote, index) => {
      return { ...data[pageNumber * pageSize + index], someNote };
    });

    dispatch(
      CitizensServices.actions.updateData({
        from: pageNumber * pageSize,
        range: pageSize,
        updates: citizens,
      })
    );
    setLoading(false);
  }

  return (
    <Stack spacing={4}>
      <Title>Citizens</Title>
      <DataGrid
        autoHeight
        aria-label="Citizens"
        rows={data}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { page: pageNumber, pageSize } },
        }}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          loadingOverlay: LinearProgress,
        }}
        pageSizeOptions={[10]}
        disableColumnMenu
        loading={loading}
        onPaginationModelChange={(params) => {
          dispatch(CitizensServices.actions.setPage(params.page));
          dispatch(CitizensServices.actions.setPageSize(params.pageSize));
        }}
      />
    </Stack>
  );
}

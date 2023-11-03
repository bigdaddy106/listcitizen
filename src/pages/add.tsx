import { useEffect, useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContractWrite, useWaitForTransaction } from "wagmi";
import Title from "../components/typographs/Title";
import Alert from "../components/modals/Alert";
import { AddCitizenForm } from "../types/citizen";
import { address } from "../constants/contract";
import FETestTaskABI from "../abis/FETestTask .json";

const addCitizenFormSchema = Yup.object().shape({
  age: Yup.number()
    .required("Please enter your age")
    .moreThan(17)
    .lessThan(150),
  city: Yup.string().required("Please enter your city name"),
  name: Yup.string().required("Please enter your full name"),
  someNote: Yup.string().required("Please write down some notes"),
});

export default function Add() {
  const hookForm = useForm<AddCitizenForm>({
    resolver: yupResolver(addCitizenFormSchema),
  });
  const { formState, handleSubmit, register } = hookForm;
  const { errors } = formState;
  const [openError, setOpenError] = useState(false);
  const [openTrxError, setOpenTrxError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const {
    data: addData,
    isError,
    write,
  } = useContractWrite({
    address,
    abi: FETestTaskABI,
    functionName: "addCitizen",
  });
  const {
    isLoading,
    isError: isTrxError,
    isSuccess,
  } = useWaitForTransaction({
    hash: addData?.hash,
  });

  useEffect(() => setOpenError(isError), [isError]);
  useEffect(() => setOpenTrxError(isTrxError), [isTrxError]);
  useEffect(() => setOpenSuccess(isSuccess), [isSuccess]);

  async function onSubmit(input: AddCitizenForm) {
    write({
      args: [input.age, input.city, input.name, input.someNote],
    });
  }

  return (
    <div>
      <Title>Add a Citizen</Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} maxWidth={400} m="auto">
          <TextField
            required
            error={errors.age ? true : false}
            label="Age"
            {...register("age", { required: true })}
            type="number"
            defaultValue={18}
            size="small"
            disabled={isLoading}
            helperText={errors.age?.message}
          />
          <TextField
            required
            error={errors.city ? true : false}
            label="City"
            {...register("city", { required: true })}
            size="small"
            disabled={isLoading}
            helperText={errors.city?.message}
          />
          <TextField
            required
            error={errors.name ? true : false}
            label="Full Name"
            {...register("name", { required: true })}
            size="small"
            disabled={isLoading}
            helperText={errors.name?.message}
          />
          <TextField
            required
            error={errors.someNote ? true : false}
            label="Some Notes"
            {...register("someNote", { required: true })}
            variant="outlined"
            size="small"
            disabled={isLoading}
            helperText={errors.someNote?.message}
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <LoadingButton
              loading={isLoading}
              loadingPosition="start"
              startIcon={<AddIcon />}
              variant="contained"
              type="submit"
            >
              Add
            </LoadingButton>
            <Button variant="contained" disabled={isLoading}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </form>
      <Alert open={openError} onClose={() => setOpenError(false)}>
        Error happened! Please check wallet connect.
      </Alert>
      <Alert open={openTrxError} onClose={() => setOpenTrxError(false)}>
        Error happened! Please try later.
      </Alert>
      <Alert open={openSuccess} onClose={() => setOpenSuccess(false)}>
        Successfully Added!
      </Alert>
    </div>
  );
}

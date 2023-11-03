import { Modal, Box, Typography } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface AlertProps {
  children: string;
  open: boolean;
  onClose: () => void;
}

export default function Alert(props: AlertProps) {
  const { children, open, onClose } = props;

  return (
    <Modal
      keepMounted
      open={open}
      onClose={onClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <Box sx={style}>
        <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
          Alert
        </Typography>
        <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
          {children}
        </Typography>
      </Box>
    </Modal>
  );
}

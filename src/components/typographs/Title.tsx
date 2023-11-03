import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";

interface TableTitleProps {
  children: string;
}

export default function Title(props: TableTitleProps) {
  return (
    <Box
      mt={2}
      mb={2}
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">{props.children}</Typography>
    </Box>
  );
}

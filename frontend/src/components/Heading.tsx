import { Box, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { ADMIN_SIDE_BAR_LIST_ONE, ADMIN_SIDE_BAR_LIST_TWO, OWNER_SIDE_BAR_LIST_ONE, OWNER_SIDE_BAR_LIST_TWO } from "@/constants/DrawerConstansts";
import { HEADING_HEIGHT } from '@/constants/headingConstants';

type HeadingProps = {
  role: string;
  // TODO: check the below type definition correctness
  lists: typeof ADMIN_SIDE_BAR_LIST_ONE & typeof ADMIN_SIDE_BAR_LIST_TWO | typeof OWNER_SIDE_BAR_LIST_TWO & typeof OWNER_SIDE_BAR_LIST_ONE,
}
const Heading = ({role, lists}: HeadingProps) => {
  const location = useLocation();
  const activeRoute = lists.filter(list => list.to === location.pathname)[0];
  return (
    <Box
          sx={{
            boxSizing: 'border-box',
            display: "flex",
            alignItems: "center",
            bgcolor: "white",
            pl: 4,
            borderRadius: 4,
            height: HEADING_HEIGHT,
          }}
        >
          <Typography fontWeight="bold" fontSize="22px" lineHeight={"24px"} >{role}</Typography>
          <Typography color='gray' fontWeight="light" fontSize="22px" lineHeight={"24px"} >/{activeRoute.text}</Typography>
        </Box>
  )
}

export default Heading
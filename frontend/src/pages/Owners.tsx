import { DRAWER_WIDTH } from "@/constants/DrawerConstansts";
import { HEADING_HEIGHT } from "@/constants/headingConstants";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Dialog,
  DialogContent,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbar,
  GridRowId,
  GridRenderCellParams,
  GridRowParams,
} from "@mui/x-data-grid";
import { useState, useEffect, useCallback, useMemo } from "react";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

interface Owner {
  id: string;
  fullName: string;
  email: string;
  location: string;
  phoneNumber: string;
  approved: boolean;
  _count?: number;
}

const Owners = () => {
  const [open, setOpen] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [formData, setFormData] = useState<Owner | null>(null);
  const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>(
    {}
  );

  const axiosPrivate = useAxiosPrivate();

  const handleChange = async (id: string, checked: boolean) => {
    try {
      const response = await axiosPrivate.post(`/owners/${id}`, {
        approved: checked,
      });
      console.log(response);

      // Update the specific row's checked state
      setCheckedState((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = useCallback(
    (id: GridRowId) => async () => {
      try {
        const response = await axiosPrivate.delete(`/owners/${id}`);
        console.log(response.data);
        setOwners(response.data.allOwners);
      } catch (err) {
        console.error(err);
      }
    },
    [owners]
  );

  const viewOwnerDetail = useCallback(
    (id: GridRowId) => () => {
      const filterOwner = owners.find((owner) => owner.id === id);
      filterOwner && setFormData(filterOwner);
      setOpen(true);
    },
    [owners]
  );

  const columns = useMemo<GridColDef<(typeof owners)[number]>[]>(() => [
    { field: "id", headerName: "ID"
    },
    {
      field: "fullName",
      headerName: "Owner",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return '';
        }
        return value.split(' ').map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
      },
      width: 200,
    },
    {
      field: "_count",
      headerName: "Upload",
      valueFormatter: (value) => {
        if (value == null) {
          return '';
        }
        return `${value} Books`;
      },
    },
    {
      field: "location",
      headerName: "Location",
      valueFormatter: (value?: string) => {
        if (value == null) {
          return '';
        }
        return value.split(' ').map(word => {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
      },
      width: 150,
    },
    {
      field: "approved",
      headerName: "Status",
      headerAlign: "center",
      width: 200,
      editable: true,
      renderCell: (params: GridRenderCellParams<Owner>) => {
        const isApproved = params.row?.approved as boolean;
        const id = params.row?.id as string;
        const checked =
          checkedState[id] !== undefined ? checkedState[id] : isApproved;

        return (
          <Button
            fullWidth
            startIcon={checked ? <CheckIcon /> : <ClearIcon />}
            color={checked ? "success" : "error"}
            sx={{
              textTransform: "none",
              borderRadius: 6,
              p: 0,
              bgcolor: "#F0F2FF",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={checked}
                  onChange={(event) => handleChange(id, event.target.checked)}
                  color={checked ? "success" : "error"}
                />
              }
              label={checked ? "Active" : "InActive"}
              labelPlacement="start"
            />
          </Button>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 150,
      getActions: (params: GridRowParams<Owner>) => [
        <GridActionsCellItem
          icon={<VisibilityIcon sx={{ color: "black" }} />}
          label="View Owner"
          onClick={viewOwnerDetail(params.id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon sx={{ color: "red" }} />}
          label="Delete Owner"
          onClick={deleteUser(params.id)}
        />,
      ],
    },
  ],[handleChange, viewOwnerDetail, deleteUser ]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getBooks = async () => {
      try {
        const response = await axiosPrivate.get("/owners", {
          signal: controller.signal,
        });
        console.log(response.data);
        if (isMounted) {
          setOwners(response.data.allOwners);
          // Initialize the checked state for each book
          const initialCheckedState: { [key: string]: boolean } = {};
          response.data.allOwners.forEach((owner: any) => {
            initialCheckedState[owner.id] = owner.approved;
          });
          setCheckedState(initialCheckedState);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getBooks();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        width: `calc(100vw - ${DRAWER_WIDTH + 48}px)`,
        height: `calc(100vh - ${HEADING_HEIGHT + 48}px)`,
        borderRadius: 1,
        bgcolor: "white",
      }}
    >
      <Box sx={{ width: "95%", height: "100%" }}>
        <DataGrid
          rows={owners}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              csvOptions: { disableToolbarButton: true },
              printOptions: { disableToolbarButton: true },
              showQuickFilter: true,
            },
          }}
        />
      </Box>
      <Dialog
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <TextField
            margin="dense"
            value={formData?.fullName}
            label="Name"
            fullWidth
          />
          <TextField
            margin="dense"
            value={formData?.email}
            label="Email address"
            fullWidth
          />
          <TextField
            margin="dense"
            value={formData?.location}
            label="Location"
            fullWidth
          />
          <TextField
            margin="dense"
            value={formData?.phoneNumber}
            label="Phone Number"
            fullWidth
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Owners;

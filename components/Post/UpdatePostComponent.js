import React, { useEffect } from 'react'
import { Menu } from '@headlessui/react'
import DropDown from '../DropDown/DropDown'
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch } from 'react-redux';
import { useUpdatePostStatusMutation } from '../../Redux/services/servicesApi';
import { resetServerRequest, setServerError, setServerLoading } from '../../Redux/slices/serverRequestSlice';
import { CircularProgress } from '@mui/material';

const statusMenu = [
    {
        id: 1,
        value: "active",
        name: "Active"
    },
    {
        id: 2,
        value: "silent",
        name: "Silent"
    },
    {
        id: 3,
        value: "deactivated",
        name: "Deactivate"
    },
    {
        id: 4,
        value: "blocked",
        name: "Block"
    },
]

const UpdatePostComponent = ({ post, updateSelectedPost }) => {
    const dispatch = useDispatch();

    //CHANGE POST STATUS
    const [
        updatePostStatus,
        {
            data,
            error,
            isSuccess,
            isError,
            isLoading,
        },
    ] = useUpdatePostStatusMutation();;

    //CHANGE POST STATUS
    const changeStatus = (status) => {
        const statusObj = statusMenu.filter(obj => obj.id === status)[0];
        const body = {
            post_id: post._id,
            action: statusObj.value,
        };

        updatePostStatus(body);
    }

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetServerRequest())
            updateSelectedPost(data.post)
        }

        if (isError) {
            dispatch(setServerError({
                error: true,
                errorMsg: error?.data?.message?.action || error?.data?.message?.general
            }))
        }
    }, [isSuccess, isError])


  return (
      <div className='flex justify-start items-center gap-1 mb-2'>
          <span>
              Status:{" "}
              <span className={`${post?.status == "active" && "font-bold text-red-600"}`}>
                  {post?.status.charAt(0).toUpperCase()}{post?.status.slice(1)}
              </span>
          </span>
          <DropDown menus={statusMenu} position="origin-bottom-right" buttonClicked={changeStatus}>
              <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-800 hover:text-gray-900 outline-none pt-[0.3rem]">
                  {isLoading ? <CircularProgress size={15} color="inherit" /> : <SettingsIcon size={15} className="text-[1.1rem]" />}
              </Menu.Button>
          </DropDown>
      </div>
  )
}

export default UpdatePostComponent
import React, { useEffect } from 'react'
import { Menu } from '@headlessui/react';
import { CircularProgress } from '@mui/material';
import SettingsIcon from "@mui/icons-material/Settings";
import { useDispatch } from 'react-redux';
import { useUpdatePostRecommendStatusMutation } from '../../Redux/services/servicesApi';
import DropDown from '../DropDown/DropDown'
import { resetServerRequest } from '../../Redux/slices/serverRequestSlice';


const recommendMenu = [
    {
        id: 1,
        value: true,
        name: "True"
    },
    {
        id: 2,
        value: false,
        name: "False"
    },
]

const UpdateVerifiedComponent = ({ post, updateSelectedPost }) => {
    const dispatch = useDispatch();

    const [
        updatePostRecommendStatus,
        {
            data,
            error,
            isSuccess,
            isError,
            isLoading,
        }
    ] = useUpdatePostRecommendStatusMutation();

    const changeRecommendStatus = (status) => {
        const statusObj = recommendMenu.filter(obj => obj.id === status)[0];
        const body = {
            post_id: post._id,
            action: statusObj.value,
            type: "verify_coordinates"
        };

        updatePostRecommendStatus(body);
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
    }, [isSuccess, isError]);

  return (
      <div className='flex justify-start items-center gap-1 mb-2'>
          <span>
              Verified Coordinates:{" "}
              <span className={`${post?.verified_coordinates && "font-bold text-red-600"}`}>
                  {post?.verified_coordinates ? "True" : "False"}
              </span>
          </span>
          <DropDown menus={recommendMenu} position="origin-bottom-right" buttonClicked={changeRecommendStatus}>
              <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-800 hover:text-gray-900 outline-none pt-[0.3rem]">
                  {isLoading ? <CircularProgress size={15} color="inherit" /> : <SettingsIcon size={15} className="text-[1.1rem]" />}
              </Menu.Button>
          </DropDown>
      </div>
  )
}

export default UpdateVerifiedComponent
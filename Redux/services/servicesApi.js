import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}`,
    credentials: "include",
  }),
  tagTypes: ["Team", "JoinRequest", "Place"],
  keepUnusedDataFor: 10,
  endpoints: (builder) => ({
    //==================QUERIES FOR TEAMS==================
    //LOGIN TEAM
    loginTeam: builder.mutation({
      query: (body) => {
        return {
          url: `/admin/login`,
          method: "POST",
          body,
        };
      },
    }),
    //LOGOUT TEAM
    logoutTeam: builder.query({
      query: (body) => ({
        url: `/admin/logout`,
        method: "GET",
      }),
    }),
    //UPDATE PASSWORD
    updatePassword: builder.mutation({
      query: (body) => ({
        url: `/admin/updatePassword`,
        method: "POST",
        body,
      }),
    }),

    //==================QUERIES FOR JOIN REQUEST==================
    viewJoinRequest: builder.query({
      query: (body) => {
        return {
          url: `/join/joinRequest`,
          method: "GET",
        };
      },
      providesTags: ["JoinRequest"],
    }),
    joinRequestAction: builder.mutation({
      query: (body) => {
        return {
          url: `/join/joinRequest`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["JoinRequest"],
    }),
    //==================QUERIES FOR USER==================
    allUsers: builder.query({
      query: () => {
        return {
          url: `/user`,
          method: "GET",
        };
      },
    }),
    //Total Users
    totalUsers: builder.query({
      query: () => {
        return {
          url: `/user/total-users`,
          method: "GET",
        };
      },
    }),

    changeUserStatus: builder.mutation({
      query: (body) => {
        return {
          url: `/user`,
          method: "POST",
          body,
        };
      },
    }),

    calculateContribution: builder.mutation({
      query: (body) => {
        return {
          url: `/user/contribution`,
          method: "POST",
          body,
        };
      },
    }),

    updateMeetupProfileHiddenStatus: builder.mutation({
      query: (body) => {
        return {
          url: `/user/meetup-profile`,
          method: "POST",
          body,
        };
      },
    }),

    //==================QUERIES FOR POSTS==================
    userPostStatus: builder.query({
      query: (body) => {
        return {
          url: "/post",
          method: "GET",
        };
      },
    }),
    userPosts: builder.query({
      query: (body) => {
        return {
          url: `/post/user/${body.user_id}`,
          method: "GET",
        };
      },
    }),

    updatePostStatus: builder.mutation({
      query: (body) => {
        return {
          url: `/post/${body.post_id}`,
          method: "POST",
          body,
        };
      },
    }),

    updatePostRecommendStatus: builder.mutation({
      query: (body) => {
        return {
          url: `/post/${body.post_id}`,
          method: "PATCH",
          body,
        };
      },
    }),

    updateCoordinate: builder.mutation({
      query: (body) => {
        return {
          url: `/post/updateCoors/${body.post_id}`,
          method: "POST",
          body,
        };
      },
    }),

    viewPostDetails: builder.query({
      query: (body) => {
        return {
          url: `/post/${body.post_id}`,
          method: "GET",
        };
      },
    }),

    updatePostLoaction: builder.mutation({
      query: (body) => {
        return {
          url: `/post/updateLocation/${body.post_id}`,
          method: "POST",
          body,
        };
      },
    }),

    changePostPlace: builder.mutation({
      query: (body) => {
        return {
          url: `/post/change-place`,
          method: "POST",
          body,
        };
      },
    }),

    getAllPostWithCoordinates: builder.mutation({
      query: (body) => {
        return {
          url: `/post/all-post-with-coordinates`,
          method: "POST",
          body,
        };
      },
    }),

    getAllPost: builder.mutation({
      query: (body) => {
        return {
          url: `/post/all-post`,
          method: "POST",
          body,
        };
      },
    }),

    //==================QUERIES FOR PLACES==================
    //GET ALL PLACES
    getAllPlaces: builder.query({
      query: (body) => {
        return {
          url: `/place`,
          method: "GET",
        };
      },
    }),

    //GET PLACE BY ID
    getPlace: builder.query({
      query: (body) => {
        return {
          url: `/place/${body.place_id}`,
          method: "GET",
        };
      },
      providesTags: ["Place"],
    }),

    //CHANGE PLACE NAME
    changePlaceName: builder.mutation({
      query: (body) => {
        return {
          url: `/place/${body.place_id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //CHANGE PLACE COORDINATES
    updatePlaceCoors: builder.mutation({
      query: (body) => {
        return {
          url: `/place/${body.place_id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //CHANGE PLACE AddRESS
    updatePlaceAddress: builder.mutation({
      query: (body) => {
        return {
          url: `/place/changeAddress/${body.place_id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //CHANGE PLACE DISPLAY ADDRESS
    updatePlaceDisplayAddress: builder.mutation({
      query: (body) => {
        return {
          url: `/place/changeDisplayAddress/${body.place_id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //COPY ADDRESS TO DISPLAY ADDRESS
    mergePlaceDisplayAddress: builder.mutation({
      query: (body) => {
        return {
          url: `/place/changeDisplayAddress/${body.place_id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //CHANGE PLACE Address
    updatePlaceType: builder.mutation({
      query: (body) => {
        return {
          url: `/place/type/${body.place_id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //CHANGE PLACE ALIAS
    updatePlaceAlias: builder.mutation({
      query: (body) => {
        return {
          url: `/place/alias/${body.place_id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //SET ORIGINAL PLACE TO DUPLICATE PLACE
    setOriginalPlace: builder.mutation({
      query: (body) => {
        return {
          url: `/place/originalPlace/${body.place_id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //REMOVE DUPLICATE PLACE FROM ORIGINAL PLACE
    removeDuplicatePlace: builder.mutation({
      query: (body) => {
        return {
          url: `/place/originalPlace/${body.place_id}`,
          method: "DELETE",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //TOGGLE SHOW DESTINATION
    toggleShowDestination: builder.mutation({
      query: (body) => {
        return {
          url: `/place/showDestination/${body.place_id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //TOGGLE DESTINATION
    toggleDestination: builder.mutation({
      query: (body) => {
        return {
          url: `/place/destination/${body.place_id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //UPDATE SEARCH RANK
    updateSearchRank: builder.mutation({
      query: (body) => {
        return {
          url: `/place/search-rank/${body.place_id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //UPDATE EDITOR RATING
    updateEditorRating: builder.mutation({
      query: (body) => {
        return {
          url: `/place/editor-rating/${body.place_id}`,
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //CHNAGE PLACE COVER PHOTO
    changePlaceCover: builder.mutation({
      query(body) {
        const formData = new FormData();
        formData.append("coverPhoto", body.file);
        return {
          url: `/place/change-cover/${body.place_id}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Place"],
    }),

    //====================QUERIES FOR TYPES====================
    //GET ALL TYPES
    getAllTypes: builder.query({
      query: (body) => {
        return {
          url: "/type",
          method: "GET",
        };
      },
    }),
    //ADD TYPES
    addType: builder.mutation({
      query: (body) => {
        return {
          url: "/type",
          method: "POST",
          body,
        };
      },
    }),

    //EDIT TYPES
    editType: builder.mutation({
      query: (body) => {
        return {
          url: `/type/${body.type_id}`,
          method: "PUT",
          body,
        };
      },
    }),

    //EDIT TYPES
    deleteType: builder.mutation({
      query: (body) => {
        return {
          url: `/type/${body.type_id}`,
          method: "DELETE",
          body,
        };
      },
    }),

    //==================QUERIES FOR TRIP PLAN==================
    //GET ALL PLANS
    getAllTripPlans: builder.query({
      query: () => {
        return {
          url: "/trip-plan",
          method: "GET",
        };
      },
    }),

    //UPDATE PLAN STATUS
    updateTripPlanStatus: builder.mutation({
      query: (body) => {
        return {
          url: `/trip-plan/${body.trip_id}`,
          method: 'PATCH',
          body
        }
      }
    }),
    

    //==================QUERIES FOR USER USAGE DATA==========
    //GET USERS SESSOION
    getSessions: builder.mutation({
      query: (body) => {
        return {
          url: `/usage/session`,
          method: "POST",
          body
        }
      }
    })

    //==================QUERIES ENDS HERE==================
  }),
});

export const {
  //TEAM
  useLoginTeamMutation,
  useLogoutTeamQuery,
  useUpdatePasswordMutation,
  //JOIN REQUEST
  useViewJoinRequestQuery,
  useJoinRequestActionMutation,
  //USER
  useAllUsersQuery,
  useChangeUserStatusMutation,
  useCalculateContributionMutation,
  useTotalUsersQuery,
  useUpdateMeetupProfileHiddenStatusMutation,
  //POSTS
  useUserPostStatusQuery,
  useUserPostsQuery,
  useViewPostDetailsQuery,
  useUpdatePostStatusMutation,
  useUpdateCoordinateMutation,
  useUpdatePostLoactionMutation,
  useChangePostPlaceMutation,
  useGetAllPostWithCoordinatesMutation,
  useGetAllPostMutation,
  useUpdatePostRecommendStatusMutation,
  //PLACES
  useGetAllPlacesQuery,
  useGetPlaceQuery,
  useChangePlaceNameMutation,
  useUpdatePlaceCoorsMutation,
  useUpdatePlaceAddressMutation,
  useUpdatePlaceTypeMutation,
  useUpdatePlaceAliasMutation,
  useUpdatePlaceDisplayAddressMutation,
  useMergePlaceDisplayAddressMutation,
  useSetOriginalPlaceMutation,
  useRemoveDuplicatePlaceMutation,
  useToggleShowDestinationMutation,
  useToggleDestinationMutation,
  useUpdateSearchRankMutation,
  useUpdateEditorRatingMutation,
  useChangePlaceCoverMutation,
  //TYPES
  useGetAllTypesQuery,
  useAddTypeMutation,
  useEditTypeMutation,
  useDeleteTypeMutation,
  //TRIP PLANS
  useGetAllTripPlansQuery,
  useUpdateTripPlanStatusMutation,
  //USAGES
  useGetSessionsMutation,

  useTestDashboardQuery,
} = serviceApi;

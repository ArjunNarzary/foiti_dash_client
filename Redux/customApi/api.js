import axios from "axios";

//GET FOLLOWERS POSTS
export const logoutTeam = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/logout`,
      {
        method: "GET",
      }
    );

    // return {res.data};
    return {
      data: res,
      status: res.status,
    };
  } catch (error) {
    return {
      error: true,
      status: error.response.status,
    };
  }
};

//GET SEARCH RESULTS
export const searchApi = async (body) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/place/search?place=${body.text}&count=10`,
      {
        withCredentials: true,
      }
    );

    if (res.data.results.length > 0) {
      return res.data;
    } else {
      return {
        results: [],
      };
    }
  } catch (error) {
    return {
      results: [],
    };
  }
};


// //GET SEARCH RESULTS
// export const searchCreatedPlace = async (body) => {
//   try {
//     const res = await axios.get(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/place/search?place=${body.text}&count=10`,
//       {
//         withCredentials: true,
//       }
//     );

//     if (res.data.results.length > 0) {
//       return res.data;
//     } else {
//       return {
//         results: [],
//       };
//     }
//   } catch (error) {
//     return {
//       results: [],
//     };
//   }
// };

export function requireAuthentication(gssp) {
  //   return function Authentication(props) {
  //     const { isAuthenticated, isLoading, isError } = useAuthentication();
  //     if (isLoading) {
  //       return <div>Loading...</div>;
  //     }
  //     if (isError) {
  //       return <div>Error</div>;
  //     }
  //     if (!isAuthenticated) {
  //       return <Redirect to="/login" />;
  //     }
  //     return <Component {...props} />;
  //   };
  return async (context) => {
    const { req, res } = context;
    const user = req.cookies.user;

    if (!user) {
      //Redirect to login page
      return {
        redirect: {
          destination: "/login",
          statusCode: 302,
        },
      };
    }
    return await gssp(context);
  };
}

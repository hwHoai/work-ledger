import axios from 'axios';

const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // timeout: 10000, // 10 seconds timeout
};

// Axios interceptor
// axios.interceptors.request.use(
//   (config) => {
//     if (config.url === 'URL_WITHOUT_INTERCEPTOR') {
//       return config;
//     }

//     const accessToken = CookieService.getCookie('accessToken');
//     const refreshToken = CookieService.getCookie('refreshToken');
//     if (accessToken && !TokenService.isTokenExpired(accessToken) && !TokenService.isTokenExpired(refreshToken)) {
//       return config;
//     }

//     if ((!accessToken || TokenService.isTokenExpired(accessToken)) && !TokenService.isTokenExpired(refreshToken)) {
//       (async () => {
//         await UserAuthenticationService.reNewToken(CookieService.getCookie('refreshToken'))
//           .then(async (res) => {
//             const accessTokenPayload = TokenService.decodeToken(res.data.accessToken);
//             const refreshTokenPayload = TokenService.decodeToken(res.data.refreshToken);
//             await CookieService.setCookie('accessToken', res.data.accessToken, new Date(accessTokenPayload.exp * 1000));
//             await CookieService.setCookie(
//               'refreshToken',
//               res.data.refreshToken,
//               new Date(refreshTokenPayload.exp * 1000)
//             );
//             config.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
//             return config;
//           })
//           .catch((error) => {
//             // Handle token renewal error
//             logger.error('Token renewal failed:', error);
//           });
//         return config;
//       })();
//     }
//   },
//   (error) => {
//     // Handle request errors
//     return Promise.reject(error);
//   }
// );

export const axiosInstance = axios.create(axiosConfig);

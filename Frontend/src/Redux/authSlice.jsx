import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../Components/Api';

// Async Thunks
export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('auth/forgot-password/', data);
            console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ uidb64, token, password }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`auth/reset-password/${uidb64}/${token}/`, {
                password,
                confirm_password: password
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);




export const login = createAsyncThunk(
    'auth/login',
    async (userData, thunkAPI) => {
        try {
            console.log('User Data:', userData); // Log the user data
            const response = await axiosInstance.post('auth/login/', userData);
            console.log('Login response:', response.data);

            // Assuming the response data directly contains user information
            const { refresh, access, username, email, id, is_authenticated, message } = response.data;

            // Store tokens and user info if successful
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('access', access);
            localStorage.setItem('user', JSON.stringify({ username, email, id, is_authenticated }));

            console.log('Logged in user:', { username, email, id, is_authenticated });

            // Return the full response or just the relevant data
            return response.data; // Or return { username, email, id, is_authenticated } if you want to simplify it
        } catch (error) {
            console.error("Error response data:", error.response?.data || error.message); // Log detailed error info
            return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);



export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, thunkAPI) => {
        try {
            const response = await axiosInstance.post('auth/signup/', userData); 
            console.log('userdata:',userData);
            
            // localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data;
        } catch (error) {
            console.error("Signup error:", error.response);
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


export const checkAuthStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, thunkAPI) => {
        const access = localStorage.getItem('access');
        const user = JSON.parse(localStorage.getItem('user'));
        if (access && user) {
            // Optionally, verify the token with the server here
            return { access, user };
        }
        return thunkAPI.rejectWithValue('No valid session');
    }
);

// Authentication Slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        // token: null,
        access: null,
        refresh:null,
        isLoading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.access = null;
            state.refresh=null
            state.error = null; // Clear error on logout
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(forgotPassword.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(forgotPassword.fulfilled, (state) => {
            state.isLoading = false;
          })
          .addCase(forgotPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          .addCase(resetPassword.pending, (state) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(resetPassword.fulfilled, (state) => {
            state.isLoading = false;
          })
          .addCase(resetPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          .addCase(login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.access = action.payload.access;
          })
          .addCase(login.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload?.error || 'Login failed';
         })
         
          .addCase(signup.pending, (state) => {
            state.isLoading = true;
        })
    

        .addCase(signup.fulfilled, (state, action) => {
            state.isLoading = false;
            // Ensure action.payload has user and access
            state.user = action.payload.user;
            state.access = action.payload.access;
            state.error = null; 
        })

        .addCase(signup.rejected, (state, action) => {
            state.isLoading = false;
            // Use a more informative error message if available
            state.error = action.payload?.error || 'Signup failed. Please try again.';
        })
          .addCase(checkAuthStatus.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(checkAuthStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            // state.token = action.payload.token;
            state.access = action.payload.access;
          })
          .addCase(checkAuthStatus.rejected, (state) => {
            state.isLoading = false;
            state.user = null;
            // state.token = null;
            state.access = null;
          });
      },
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
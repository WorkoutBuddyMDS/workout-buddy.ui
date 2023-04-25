import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { accountActions } from '@/store/reducers/account';
import {
  AccountCircleOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { StyledLink } from '@/styles/styled-components';
import { useRouter } from 'next/router';
import BackButton from '@/components/Buttons/BackButton';

interface Validator {
  [key: string]: {
    validator: (el: string) => boolean;
    error: string;
  }[];
}

const INPUT_VALIDATORS: Validator = {
  email: [
    {
      validator: (val: string) => val.length > 10,
      error: 'Your email should be at least 10 characters long',
    },
    {
      validator: (val: string) =>
        new RegExp('^[\\w-.]+@([\\w-]+.)+[\\w-]{2,4}$').test(val),
      error: 'This input is not following an email pattern.',
    },
  ],
  password: [
    {
      validator: (val: string) => val.length >= 12,
      error: 'Your password should be at least 12 characters long',
    },
    {
      validator: (val) => new RegExp('(?=.[0-9])').test(val),
      error: 'Your password should contain at least one number',
    },
    {
      validator: (val) => new RegExp('(?=.[-!@#$%^&])').test(val),
      error:
        'Your password should contain at least one special character(-_!@#$%^&)',
    },
    {
      validator: (val) => new RegExp('(?=.*[A-Z])').test(val),
      error: 'Your password should contain at least one uppercase letter',
    },
  ],
};

interface LoginModel extends Record<string, string | boolean> {
  email: string;
  password: string;
  areCredentialsInvalid: boolean;
  isDisabled: boolean;
}

const loginModelInitialState: LoginModel = {
  email: '',
  password: '',
  areCredentialsInvalid: false,
  isDisabled: false,
};

const Login = () => {
  const dispatcher = useDispatch();
  const router = useRouter();

  const [loginModel, setLoginModel] = useState<LoginModel>(
    loginModelInitialState
  );
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState({
    email: '',
    password: '',
  });

  const [load, setLoad] = useState(false);

  useEffect(() => {
    setLoad(true);
    setTimeout(() => {
      setLoad(false);
    }, 2000);
  }, []);

  const handleFormSubmit = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    const loginData: LoginModel = { ...loginModel };

    for (let key of Object.keys(loginData)) {
      if (typeof loginData[key] !== 'string') {
        delete loginData[key];
      }
    }

    let isOk = true;
    for (const [key, value] of Object.entries(
      loginData as Record<string, string>
    )) {
      for (const el of INPUT_VALIDATORS[key]) {
        if (!el.validator(value)) {
          setError((prevState) => ({
            ...prevState,
            [key]: el.error,
          }));
          isOk = false;
          break;
        }
      }
    }

    if (!isOk) {
      return;
    }

    const res = await axios({
      method: 'post',
      url: 'https://localhost:7132/UserAccount/login',
      data: loginModel,
    });
    dispatcher(accountActions.login(res.data));

    await router.push('/');
  };

  const updateForm = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setError({
      ...error,
      [id]: '',
    });
    setLoginModel({
      ...loginModel,
      [id]: value,
    });
  };

  return (
    <>
      <BackButton
        sx={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px 10px 10px',
        }}
        onClick={router.back}
      />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: 'secondary.main',
              height: '60px',
              width: '60px',
            }}
          >
            <AccountCircleOutlined height="40px" width="40px" />
          </Avatar>
          <Typography
            component="h1"
            variant="h3"
            sx={{
              marginBottom: '45px',
              width: '200%',
              textAlign: 'center',
              marginTop: '10px',
            }}
          >
            Sign in into your account
          </Typography>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={loginModel.email}
                  onChange={updateForm}
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              {error.email && (
                <Grid xs={12} sx={{ padding: '10px 0 10px 16px !important' }}>
                  <Typography sx={{ color: 'red' }} variant="caption">
                    {error.email}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  value={loginModel.password}
                  onChange={updateForm}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position={'start'}>
                        {showPassword ? (
                          <VisibilityOff
                            sx={{ cursor: 'pointer' }}
                            onClick={() =>
                              setShowPassword((prevState) => !prevState)
                            }
                          />
                        ) : (
                          <Visibility
                            sx={{ cursor: 'pointer' }}
                            onClick={() =>
                              setShowPassword((prevState) => !prevState)
                            }
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {error.password && (
                <Grid xs={12} sx={{ padding: '10px 0 10px 16px !important' }}>
                  <Typography sx={{ color: 'red' }} variant="caption">
                    {error.password}
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="center" sx={{ marginTop: '5px' }}>
              <Grid item>
                <StyledLink href="/register">
                  Don't have an account? Let's get started
                </StyledLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Login;

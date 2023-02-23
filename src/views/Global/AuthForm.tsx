import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/redux-hooks";
import { setLogin } from "../../state/authSlice";
import { useState } from "react";

const loginSchema = yup.object().shape({
  email: yup.string().email("Niepoprawny email").required("Podaj email."),
  password: yup.string().required("Podaj hasło."),
});

interface FormValues {
  email: string;
  password: string;
}

const initialValuesLogin: FormValues = {
  email: "",
  password: "",
};

export const AuthForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

  const handleLoginForm = async (
    values: FormValues,
    onSubmitProps: FormikHelpers<FormValues>
  ) => {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      setIsError(true);
      throw new Error("Wrong credentials");
    }

    const loggedIn = await res.json();

    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.userName,
          token: loggedIn.token,
        })
      );
      navigate("/products-admin");
    }
  };

  return (
    <Formik
      onSubmit={handleLoginForm}
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Paper
            sx={{
              display: "flex",
              margin: "0 auto",
              padding: "20px",
              flexDirection: "column",
              maxWidth: "400px",
              gap: "20px",
            }}
          >
            <Box display="flex" flexDirection="column" gap="20px">
              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              <TextField
                label="Hasło"
                type="password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={Boolean(touched.password) && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
            </Box>
            <Typography variant="caption" sx={{ color: "red" }}>
              {isError && "Podaj poprawne dane logowania"}
            </Typography>
            {/* BUTTONS */}
            <Box>
              <Button type="submit" variant="contained" fullWidth>
                LOGIN
              </Button>
            </Box>
          </Paper>
        </form>
      )}
    </Formik>
  );
};

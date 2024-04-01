/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { authUtils } from "../../firebase/auth.utils";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import logo from "../../public/assets/logo3.png";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  LinearProgress,
  CircularProgress,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
  InputAdornment,
} from "@mui/material";
import photo from "../../public/assets/rosterbot.png";
import pictureBackground from "../../public/assets/uvodni.jpg";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

const CHECK_USER_MEMBERSHIP = gql`
  query CheckUserMembershipInvite(
    $teamId: String!
    $currentUserEmail: String!
  ) {
    checkUserMembershipInvite(
      teamId: $teamId
      currentUserEmail: $currentUserEmail
    )
  }
`;

const CREATE_USER_TO_TEAM_MUTATION = gql`
  mutation createUserToTeam(
    $Name: String!
    $Surname: String!
    $Email: String!
    $IdUser: String!
    $IdTeam: [String]!
    $DateOfBirth: String!
    $postalCode: String!
    $city: String!
    $street: String!
    $streetNumber: String!
    $phoneNumber: String!
  ) {
    createUserToTeam(
      input: {
        Name: $Name
        Surname: $Surname
        Email: $Email
        IdUser: $IdUser
        IdTeam: $IdTeam
        DateOfBirth: $DateOfBirth
        postalCode: $postalCode
        city: $city
        street: $street
        streetNumber: $streetNumber
        phoneNumber: $phoneNumber
      }
    ) {
      Name
      Surname
      IdUser
      IdTeam
      Email
      DateOfBirth
    }
  }
`;

const RegistrationPage: React.FC = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [verificationSuccess, setverificationSuccess] = useState(false);
  const [verificationSuccess2, setverificationSuccess2] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const { id, email: initialEmail } = router.query;
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null); // Nový stav pro datum narození
  const userEmail: string = (initialEmail as string) || "";
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState(false);
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [streetError, setStreetError] = useState(false);
  const [streetNumberError, setStreetNumberError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [createUser] = useMutation(CREATE_USER_TO_TEAM_MUTATION);

  const isEmailValid = email.includes("@");
  const isPasswordValid = password.length >= 6;

  useEffect(() => {
    // Předvyplnění e-mailu, pokud je k dispozici v URL
    if (initialEmail) {
      setEmail(initialEmail as string);
    }
  }, [initialEmail]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (verificationSuccess2) {
      let value = 0;
      const increment = 100 / 10; // Increment by 10% every second

      // Increment progress every second until it reaches 100
      timer = setInterval(() => {
        value += increment;
        setProgress(Math.min(value, 100));

        if (value >= 100) {
          clearInterval(timer);
          if (id) {
            router.push(`/`);
          }
        }
      }, 500);
    }

    return () => {
      // Clear the interval if the component unmounts or if login is unsuccessful
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [verificationSuccess2, id, router]);

  const {
    loading: loadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery(CHECK_USER_MEMBERSHIP, {
    variables: { teamId: router.query.id, currentUserEmail: initialEmail },
  });

  if (loadingUser)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  if (errorUser) {
    console.error("Error checking user membership:", errorUser);
    return <p>Error checking user membership</p>;
  }

  const isUserMember = dataUser.checkUserMembershipInvite;
  if (isUserMember == false) {
    return (
      <Box>
        <Alert severity="error">
          Tato akce neni dostupná
          <br />
          <Link href="/">
            <Button sx={{ backgroundColor: "red" }}>
              <Typography sx={{ color: "#fff" }}>Zpět</Typography>
            </Button>
          </Link>
        </Alert>
      </Box>
    );
  }


  const handleRegister = async () => {
    try {
      if (!isEmailValid || !isPasswordValid) {
        throw new Error("Neplatný e-mail nebo heslo.");
      }

      if (password !== confirmPassword) {
        throw new Error("Hesla se neshodují.");
      }

      await authUtils.register(email, password);

      const user = authUtils.getCurrentUser();

      if (user) {
        setRegistrationSuccess(true);
        setError(null);
      } else {
        throw new Error("Chyba při vytváření uživatele.");
      }
    } catch (error: any) {
      setError(error.message);
      setRegistrationSuccess(false);
    }
  };

  const handleEmailVerification = async () => {
    try {
      await authUtils.sendEmailVerification();
      const user = authUtils.getCurrentUser();
      setverificationSuccess(true);

      if (user) {
        await user.reload();

        if (user.emailVerified) {
          const response = await createUser({
            variables: {
              Name: name,
              Surname: surname,
              Email: email,
              IdUser: "fefefef",
              IdTeam: [id as string],
              DateOfBirth: dateOfBirth?.toISOString() || "",
              postalCode: postalCode,
              city: city,
              street: street,
              streetNumber: streetNumber,
              phoneNumber: phoneNumber.replace(/\s/g, ""),
            },
          });
          setverificationSuccess(true);

          router.push(`/`);
        } else {
          await authUtils.deleteUser();
          throw new Error("E-mailová adresa není ověřena.");
        }
      } else {
        throw new Error("Uživatel nebyl nalezen.");
      }
    } catch (error: any) {
      setError(error.message);
      await authUtils.deleteUser();
    }
  };

  const validatePostalCode = (postalCode: string) => {
    const postalCodeRegex = /^\d{3}\s\d{2}$/;
    return postalCodeRegex.test(postalCode);
  };

  const validatePhoneNumber = (phoneNumber: string) => {
    const phoneNumberRegex = /^\d{9}$/; // Předpokládáme, že telefonní číslo má 9 číslic
    return phoneNumberRegex.test(phoneNumber);
  };

  const handlePhoneNumberChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setPhoneNumber(value.replace(/\s/g, "")); // Remove whitespace from phone number
    console.log(phoneNumber);
    setPhoneNumberError(!validatePhoneNumber(value));
  };

  const handlePostalCodeChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setPostalCode(value);
    setPostalCodeError(!validatePostalCode(value));
  };

  const handleCityChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setCity(value);
    setCityError(value.length === 0);
  };

  const handleStreetChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setStreet(value);
    setStreetError(value.length === 0);
  };

  const handleStreetNumberChange = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setStreetNumber(value);
    setStreetNumberError(value.length === 0);
  };

  const isSmallView = window.innerWidth <= 1000;

  return (
    <Box
      sx={{
        backgroundColor: "#F0F2F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)",
          borderRadius: "15px",
          margin: "0 1rem",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Box
            sx={{
              width: "90%",
              display: isSmallView ? "none" : "",
              position: "relative",
              zIndex: "1", // Ensure content is above the background image
              borderRadius: "0 0 15px 15px",
            }}
          >
            <img
              src={pictureBackground.src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.85,
                borderRadius: "15px 0 0px 15px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: "2", // Set a higher z-index for content
              }}
            >
              <Box
                sx={{ marginLeft: "10%", marginRight: "10%", zIndex: "999" }}
              >
                <Box sx={{ paddingTop: "0.5em" }}>
                  <img src={logo.src} alt="logo" width="120" height="auto" />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    margin: "1rem",
                    marginTop: "0em",
                    marginBottom: "",
                    fontSize: "4vw",
                    fontFamily: "Roboto",
                    marginLeft: "5%",
                    fontWeight: "bold",
                    color: "white",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  Aplikace pro klubovou správu
                </Typography>
              </Box>
              <Box
                sx={{
                  marginLeft: "10%",
                  marginRight: "10%",
                  zIndex: "999",
                  marginTop: "2em",
                  position: "relative",
                }}
              >
                <img src={photo.src} alt="logo" width="100%" height="auto" />
              </Box>
            </Box>
          </Box>
          <Box>
          {isSmallView && (
              <Box
                sx={{
                  backgroundColor: "#b71dde",
                  height: "5em",
                  borderRadius: "15px 15px 0 0",
                }}
              >
                <Box sx={{ marginLeft: "2em", paddingTop: "0.8em" }}>
                  <img src={logo.src} alt="logo" width="150" height="auto" />
                </Box>
              </Box>
            )}
            <Box
              sx={{
                width: "75%", // Set the desired width for the box
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "2em",
                  textAlign: "block",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    margin: "1rem",
                    marginTop: "1em",
                    fontFamily: "Roboto",
                    fontWeight: "500",
                  }}
                >
                  Registrace uživatele a přidání do týmu
                </Typography>
              </Box>

              <Box sx={{ widht: "10%" }}>
                {!registrationSuccess && (
                  <>
                    <TextField
                      type="text"
                      label="Jméno"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      type="text"
                      label="Přijmení"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="Datum narození"
                      type="date"
                      value={
                        dateOfBirth
                          ? dateOfBirth.toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => setDateOfBirth(new Date(e.target.value))}
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      type="email"
                      label="E-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      margin="normal"
                      disabled={!!initialEmail}
                    />
                     <TextField
                      label="Telefonní číslo"
                      variant="outlined"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      fullWidth
                      margin="normal"
                      error={phoneNumberError}
                      helperText={
                        phoneNumberError ? "Neplatné telefonní číslo" : ""
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+420</InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="PSČ"
                      variant="outlined"
                      value={postalCode}
                      onChange={handlePostalCodeChange}
                      fullWidth
                      margin="normal"
                      error={postalCodeError}
                      helperText={postalCodeError ? "Neplatné PSČ" : ""}
                    />
                    <TextField
                      label="Město"
                      variant="outlined"
                      value={city}
                      onChange={handleCityChange}
                      fullWidth
                      margin="normal"
                      error={cityError}
                      helperText={cityError ? "Město není vyplněno" : ""}
                    />
                    <TextField
                      label="Ulice"
                      variant="outlined"
                      value={street}
                      onChange={handleStreetChange}
                      fullWidth
                      margin="normal"
                      error={streetError}
                      helperText={streetError ? "Ulice není vyplněna" : ""}
                    />
                    <TextField
                      label="Číslo popisné/orientační"
                      variant="outlined"
                      value={streetNumber}
                      onChange={handleStreetNumberChange}
                      fullWidth
                      margin="normal"
                      error={streetNumberError}
                      helperText={
                        streetNumberError ? "Číslo popisné není vyplněno" : ""
                      }
                    />
                    <Box sx={{ display: "flex" }}>
                      <TextField
                        type={showPassword ? "text" : "password"}
                        label="Heslo"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                       <Box sx={{ marginTop: "auto", marginBottom: "auto" }}>
                        <Button
                          variant="contained"
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{
                            marginRight: "auto",
                            marginLeft: "0.5em",
                            display: "block",
                            backgroundColor: "#FFE0FE",
                            color: "black",
                            fontFamily: "Roboto",
                            fontWeight: "700",
                            border: "1px solid #ff96fc",
                            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                            padding: "0.3em",
                            borderRadius: "4px",
                            "&:hover": { backgroundColor: "#b71dde" },
                          }}
                        >
                          {showPassword ? "Skrýt" : "Zobrazit"}
                        </Button>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex" }}>
                      <TextField
                        type={showConfirmPassword ? "text" : "password"}
                        label="Potvrzení hesla"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                     <Box sx={{ marginTop: "auto", marginBottom: "auto" }}>
                        <Button
                          variant="contained"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          sx={{
                            marginRight: "auto",
                            marginLeft: "0.5em",
                            display: "block",
                            backgroundColor: "#FFE0FE",
                            color: "black",
                            fontFamily: "Roboto",
                            fontWeight: "700",
                            border: "1px solid #ff96fc",
                            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                            padding: "0.3em",
                            borderRadius: "4px",
                            "&:hover": { backgroundColor: "#b71dde" },
                          }}
                        >
                          {showConfirmPassword ? "Skrýt" : "Zobrazit"}
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
                <Box>
                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        width: "auto",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "1rem",
                        textAlign: "center",
                        color: "white",
                      }} // Set background color to red
                    >
                      <Typography
                        variant="body1"
                        color="error"
                        sx={{ marginTop: "1rem" }}
                      >
                        {error}
                      </Typography>
                    </Alert>
                  )}
                  {registrationSuccess && !verificationSuccess2 && (
                    <Alert
                      severity="success"
                      sx={{
                        width: "auto",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginTop: "1rem",
                        textAlign: "right",
                      }} // Set background color to orange
                    >
                      <Typography
                        variant="body1"
                        color="success"
                        sx={{ marginTop: "1rem" }}
                      >
                        Registrace úspěšná. Ověřte svůj e-mail, abyste mohli
                        pokračovat.
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleEmailVerification}
                        sx={{ marginTop: "1rem" }}
                      >
                        Ověřit E-mail
                      </Button>
                    </Alert>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                      marginLeft: "auto",
                      marginRight: "auto",
                      maxWidth: "300px", // Adjust the width as needed
                    }}
                  >
                    {!registrationSuccess && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                        sx={{
                          marginTop: "1rem",
                          marginLeft: "auto",
                          marginRight: "auto",
                          display: "block",
                          backgroundColor: "#FFE0FE",
                          color: "black",
                          fontFamily: "Roboto",
                          fontWeight: "700",
                          border: "1px solid #ff96fc",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                          padding: "0.7em",
                          borderRadius: "4px",
                        }}
                      >
                        Registrovat
                      </Button>
                    )}
                  </Box>
                  {verificationSuccess2 && (
                    <Box
                      sx={{
                        width: "100%",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      <Box
                        sx={{
                          marginBottom: "1em",
                          marginTop: "1em",
                          textAlign: "center",
                        }}
                      >
                        <Alert severity="info">
                          <Typography>Jste směrovány na hlavní stránku.</Typography>
                        </Alert>
                      </Box>
                      <LinearProgress variant="determinate" value={progress} />
                    </Box>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  marginTop: "1em",
                  marginBottom: "2em",
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: "700",
                    color: "#b71dde",
                  }}
                >
                  <Link
                    href={`/RegisterToTeam/${id}`}
                    sx={{
                      marginRight: "1rem",
                      marginTop: "1rem",
                      color: "#b71dde",
                      textDecoration: "none",
                    }}
                  >
                    Zkusit znovu
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegistrationPage;

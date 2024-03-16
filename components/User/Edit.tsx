/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PhotoProvider from "./PhotoProvider";
import { gql, useMutation, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

const GET_USER_INFO = gql`
  query GetUserInfo($email: String!) {
    getUserByNameAndSurname(email: $email) {
      Name
      Surname
      Id
      DateOfBirth
      Picture
      city
      street
      streetNumber
      postalCode
      phoneNumber
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($email: String!, $input: UpdateUserInput!) {
    updateUser(email: $email, input: $input)
  }
`;
interface EditProps {
  onEditModeChange: (editMode: boolean) => void; 
}

const Edit: React.FC<EditProps> = ({ onEditModeChange }) => {
  const user = authUtils.getCurrentUser();
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [postalCodeError, setPostalCodeError] = useState(false);
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [streetError, setStreetError] = useState(false);
  const [streetNumberError, setStreetNumberError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [updateUser] = useMutation(UPDATE_USER);


  const {
    loading: userInfoLoading,
    error: userInfoError,
    data: userInfoData,
  } = useQuery(GET_USER_INFO, {
    variables: { email: user?.email || "" },
    skip: !user,
  });

  if (userInfoLoading)
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

  if (userInfoError) return <Typography>Chyba</Typography>;

  useEffect(() => {
    if (!userInfoLoading && !userInfoError && userInfoData) {
      const user = userInfoData.getUserByNameAndSurname;
      setPostalCode(user.postalCode);
      setCity(user.city);
      setStreet(user.street);
      setStreetNumber(user.streetNumber);
      setPhoneNumber(user.phoneNumber);
    }
  }, [userInfoData]);

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

  const isFormValid = !phoneNumberError && !postalCodeError && !cityError && !streetError && !streetNumberError;

  const handleUpdateUser = async () => {
    try {
    const res = await updateUser({
      variables: {
        email: user?.email,
        input: {
          Name: userInfoData?.getUserByNameAndSurname.Name,
          Surname: userInfoData?.getUserByNameAndSurname.Surname,
          DateOfBirth: userInfoData?.getUserByNameAndSurname.DateOfBirth,
          postalCode,
          city,
          street,
          streetNumber,
          phoneNumber,
        },
      },
    });
    if (res.data.updateUser) {
      console.log("Uživatel byl úspěšně upraven");
      onEditModeChange(false);
    }
    }
    catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  return (
    <Box>
      <Typography variant="h4">Úprava profilu:</Typography>
      <TextField
        label="Telefonní číslo"
        variant="outlined"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        fullWidth
        margin="normal"
        error={phoneNumberError}
        helperText={phoneNumberError ? "Neplatné telefonní číslo" : ""}
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
        helperText={streetNumberError ? "Číslo popisné není vyplněno" : ""}
      />
      <PhotoProvider />
      <Button 
        variant="contained" 
        color="primary" 
        disabled={!isFormValid} 
        onClick={handleUpdateUser}
      >
        Aktualizovat uživatele
      </Button>
      
    </Box>
  );
};

export default Edit;

exports.validateForm = (body) => {
  var valid = true;
  var errors = {};

  const isValidEmail = (value) => {
    const trimEmail = value.trim();
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(trimEmail);
  };

  const isValidName = (value) => {
    const trimName = value.trim();
    const regex = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
    return regex.test(trimName);
  };

  //Validation conditioins from Name
  if (body.hasOwnProperty("email")) {
    if (!body.email.trim() || !isValidEmail(body.email)) {
      errors.email = "Please provide a valid email address";
      valid = false;
    }
  }

  //Validation conditioins from Name
  if (body.hasOwnProperty("password")) {
    if (!body.password.trim()) {
      errors.password = "Please enter your password";
      valid = false;
    }

    if (body.password.length < 8) {
      errors.password = "Password must be minimum of 8 characters.";
      valid = false;
    }
  }

  //Vladidate confirm Password
  if (body.hasOwnProperty("confirmPassword")) {
    if (!body.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
      valid = false;
    }
  }

  //Validate Password and Confirm Password equality
  if (
    body.hasOwnProperty("confirmPassword") &&
    body.hasOwnProperty("password")
  ) {
    if (body.confirmPassword.trim() !== body.password.trim()) {
      errors.confirmPassword = "Password does not match";
      valid = false;
    }
  }

  //Validate name
  if (body.hasOwnProperty("name")) {
    if (!body.name.trim() || body.name == "") {
      errors.name = "Please enter your name";
      valid = false;
    }

    if (body.name.length < 4 && body.name != "") {
      errors.name = "Name must contain atleast 4 characters";
      valid = false;
    }
    if (!isValidName(body.name)) {
      errors.name = "Please enter valid name";
      valid = false;
    }
    if (body.name.length > 30 && body.name != "") {
      errors.name = "Bio must be within 30 characters";
      valid = false;
    }
  }

  //Validate bio
  if (body.hasOwnProperty("bio") && body.bio != undefined) {
    if (body.bio.length > 200) {
      errors.bio = "Bio must be within 200 characters";
      valid = false;
    }
  }

  //Validate website
  if (body.hasOwnProperty("website") && body.website != undefined) {
    if (body.website.length > 50) {
      errors.website = "Website must be within 50 characters";
      valid = false;
    }
  }

  //Validate username
  if (body.hasOwnProperty("username")) {
    if (body.username.trim().length < 5) {
      errors.username = "Username must be atleast 5 characters";
      valid = false;
    }
    if (body.username.trim().length > 30) {
      errors.username = "Username must be less than 30 characters";
      valid = false;
    }
    if (!body.username.trim()) {
      errors.username = "Please enter username";
      valid = false;
    }
  }

  //Validate phone number
  if (body.hasOwnProperty("phoneNumber")) {
    if (body.phoneNumber.trim().length != 10) {
      errors.phoneNumber = "Please enter a 10 digit phone number";
      valid = false;
    }
    if (!/^[0-9]*$/.test(body.phoneNumber)) {
      errors.phoneNumber = "No spaces are allowed in phone numberss";
      valid = false;
    }
    if (!body.phoneNumber.trim()) {
      errors.phoneNumber = "Please enter phone number";
      valid = false;
    }
  }

  //Validate feedback
  if (body.hasOwnProperty("feedback")) {
    if (!body.feedback.trim()) {
      errors.feedback = "Please write your feedback";
      valid = false;
    }
    if (body.feedback.length != 0) {
      if (body.feedback.length < 50) {
        errors.feedback =
          "Please write your feedback with more than 50 characters";
        valid = false;
      }
      if (body.feedback.length > 4000) {
        errors.feedback = "Please write your feedback within 4000 characters";
        valid = false;
      }
    }
  }

  //Validate Rating
  if (body.hasOwnProperty("rating")) {
    if (!body.rating) {
      errors.rating = "Rating is required";
      valid = false;
    }

    if (typeof body.rating != "number") {
      errors.rating = "Please enter a valid rating";
      valid = false;
    }
  }

  //Validate Rating
  if (body.hasOwnProperty("review")) {
    if (!body.rating.length > 5000) {
      errors.rating = "Please write your review within 5000 characters";
      valid = false;
    }
  }

  return {
    valid: valid,
    errors: errors,
  };
};

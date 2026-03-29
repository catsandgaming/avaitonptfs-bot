export const validator = {
  isValidPlaneModel(model) {
    // Check if the model is valid from planes.json
    return planesList.includes(model);
  },

  isValidUser(user) {
    // Check if the user exists in the database
    return userDB.includes(user);
  }
};
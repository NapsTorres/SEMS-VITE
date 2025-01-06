const { errorException } = require("../../helpers/errorException");
const { handleResponse } = require("../../helpers/handleResponse");
const { userRegistration, userLogin, updateUser, fetchUserList, coachHandle } = require("./user.services");

module.exports = {
  Registration: async (req, res) => {
    try {
      const data = req.body;
      const result = await userRegistration(data);
      return handleResponse(res, result);
    } catch (error) {
      return errorException(error, res);
    }
  },
  Login: async (req, res) => {
    try {
      const data = req.body;
      const result = await userLogin(data);
      return handleResponse(res, result);
    } catch (error) {
      return errorException(error, res);
    }
  },
  UserList: async (req, res) => {
    try {
      const result = await fetchUserList();
      return handleResponse(res, result);
    } catch (error) {
      return errorException(error, res);
    }
  },
  UpdateUser: async (req, res) => {
    try {
      const data = req.body;
      const result = await updateUser(data);
      return handleResponse(res, result);
    } catch (error) {
      return errorException(error, res);
    }
  },
  CoachManagement: async (req, res) => {
    try {
      const { coachId } = req.params;
      const result = await coachHandle(coachId);
      return handleResponse(res, result);
    } catch (error) {
      return errorException(error, res);
    }
  }
};

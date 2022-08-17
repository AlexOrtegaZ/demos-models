/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const spaceMember = require('./space-member.middleware');


const spaceRoles = (roles, retry = 0) => async (req, res, next) => {
  const { member } = req;
  if (!member) {
    if (retry === 3) {
      return next(
        new ApiError(
          httpStatus.BAD_REQUEST,
          'Memeber not found.'
        )
      );
    }
    return setTimeout(() =>  spaceRoles(roles, retry ++)(req, res, next), 500);
  }
  if (roles.every((r) => member.role !== r)) {
    return next(
      new ApiError(
        httpStatus.BAD_REQUEST,
        'This user do not have the correct role on this space to do the current operation.'
      )
    );
  }

  return next();
};

const combineSpaceRolesValidation = (...roles) => {
  return [spaceMember, spaceRoles(roles)];
};

module.exports = combineSpaceRolesValidation;

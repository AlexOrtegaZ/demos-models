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
const manifestoCommentRepository = require('../repositories/manifesto-comment.repository');
const ApiError = require('../utils/ApiError');

const deleteComment = async (req, _, next) => {
  const { memberId } = req.member;
  const { manifestoCommentId } = req.params;

  const manifestoComment = await manifestoCommentRepository.findById(manifestoCommentId);
  if (!manifestoComment) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Manifesto comment not found'));
  }

  if (manifestoComment.deleted) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Comment is deleted'));
  }

  if (manifestoComment.createdByMember !== memberId) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Comment does not belong to this member'));
  }

  return next();
};

module.exports = deleteComment;

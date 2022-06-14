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
const manifestoCommentVoteRepository = require('../repositories/manifesto-comment-vote.repository');
const ApiError = require('../utils/ApiError');

const canCreateCommentVote = async (req, _, next) => {
  const { manifestoCommentId } = req.params;
  const { userId } = req.user;

  const manifestoCommentVote = await manifestoCommentVoteRepository.findByManifestoCommentIdAndUserId(
    manifestoCommentId,
    userId
  );

  if (manifestoCommentVote) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'You cannot vote more than 1 time'));
  }

  return next();
};

module.exports = canCreateCommentVote;

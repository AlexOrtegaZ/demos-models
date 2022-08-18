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

const CacheRepository = require('../repositories/cache.repository');
const { PUBLISHED } = require('../constants/event-names');
const { SUGGESTIONS } = require('../constants/entity-names');
const notifyEachActiveMemberOn = require('./utils/utils');


const createSuggestionsCache = (eventName, userId, data) => {
  return CacheRepository.createCache(SUGGESTIONS, eventName, userId, data);
};

/**
 * Notifies all members that a new suggestion has been created
 * @param {string} spaceId 
 * @param {string} suggestionId 
 * @param {string} exceptForUserId 
 * @return {void}
 */
const suggestionUpdated = async (spaceId, suggestionId, exceptForUserId) => {
  notifyEachActiveMemberOn(async member => {
    const data = { spaceId, suggestionId };
    const { userId } = member;
    await createSuggestionsCache(PUBLISHED, userId, data);
  }, spaceId, exceptForUserId);
};

module.exports = {
  suggestionUpdated
};
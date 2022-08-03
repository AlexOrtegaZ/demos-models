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

const DbHelper = require('./db.helper');
const SuggestionParticipation = require('../models/suggestion-participation.model');

class SuggestionParticipationRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = SuggestionParticipation.name;
    this.tableName = 'suggestion_participation';
    this.colId = 'suggestion_participation_id';
  }

  createSuggestionParticipation(suggestionId, userId, memberId) {
    const newSuggestionParticipation = new SuggestionParticipation();
    newSuggestionParticipation.suggestionId = suggestionId;
    newSuggestionParticipation.userId = userId;
    newSuggestionParticipation.memberId = memberId;

    return this.create(newSuggestionParticipation);
  } 
}

module.exports = new SuggestionParticipationRepository;
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
const Suggestion = require('../models/suggestion.model');

class SuggestionRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Suggestion.name;
    this.tableName = 'suggestion';
    this.colId = 'suggestion_id';
  }
  /**
   * Creates a suggestion 
   * @param {string} manifestoId 
   * @param {number} status 
   * @param {string} userId 
   * @returns {Promise<Suggestion>}
   */
  async createSuggestion(manifestoId, status, userId) {
    const newSuggestion = new Suggestion();
    newSuggestion.manifestoId = manifestoId;
    newSuggestion.status = status;
    newSuggestion.createdBy = userId;
    newSuggestion.updatedBy = userId;

    return this.create(newSuggestion);
  }
}

module.exports = new SuggestionRepository();
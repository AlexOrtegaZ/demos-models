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
const ManifestoComment = require('../models/manifesto-comment.model');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');

class ManifestoCommentRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = ManifestoComment.name;
    this.tableName = 'manifesto_comment';
    this.colId = 'manifesto_comment_id';
  }

  /**
   * Create manifesto comment
   * @param {string} content
   * @param {string} manifestoCommentParentId
   * @param {string} memberId
   * @param {string} manifesto_id
   * @returns {Promise<ManifestoComment>}
   */
  async createManifestoComment(content, manifestoCommentParentId, memberId, manifestoId) {
    const newComment = new ManifestoComment();
    newComment.content = content;
    newComment.manifestoCommentParentId = manifestoCommentParentId;
    newComment.createdByMember = memberId;
    newComment.manifestoId = manifestoId;

    return this.create(newComment);
  }

  /**
   * Find all manifestos by manifestoIds
   * @param {string[]} manifestoIds
   * @returns {Promise<ManifestoComment[]>}
   */
  async findAllByManifestoIds(manifestoIds) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        manifesto_id: manifestoIds,
      })
      .build();

    const result = await excuteQuery(query);
    return result;
  }
}

module.exports = new ManifestoCommentRepository();

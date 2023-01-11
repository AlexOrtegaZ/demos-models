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
const Space = require('../models/space.model');
const MemberRepository = require('./member.repository');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery, convertPropNameToColumnNotation } = require('./db.utils');

class SpaceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Space.name;
    this.tableName = 'spaces';
    this.colId = 'space_id';
  }

  async findAllByUserId(userId) {
    const spaceColumnNames = Object.keys(new Space()).map((key) => convertPropNameToColumnNotation(key));

    const query = SqlQuery.select
      .from(this.tableName)
      .select(spaceColumnNames)
      .from(MemberRepository.tableName, this.colId, this.tableName, this.colId)
      .where({ user_id: userId })
      .order('t1.created_at', 'A')
      .groupBy(`t1.${this.colId}`)
      .build();
    return excuteQuery(query);
  }

  async updateNameAndDescriptionAndPercentages(spaceId, name, description, approvalPercentage, participationPercentage) {
    const updateInfo = this._getUpdateInfoObject(name, description, approvalPercentage, participationPercentage);

    const query = SqlQuery.update
      .into(this.tableName)
      .set(updateInfo)
      .where({ space_id: spaceId })
      .build();
    return excuteQuery(query);
  }

  _getUpdateInfoObject(name, description, approvalPercentage, participationPercentage) {
    const updateInfo = {};

    if (!!name) {
      updateInfo.name = name;
    }
    if (description != null) {
      updateInfo.description = description;
    }

    if(!!approvalPercentage) {
      updateInfo['approval_percentage'] = approvalPercentage;
    }

    if(!!participationPercentage) {
      updateInfo['participation_percentage'] = participationPercentage;
    }
    return updateInfo;
  }

  async updatePictureKey(spaceId, pictureKey) {
    const query = SqlQuery.update.into(this.tableName).set({ picture_key: pictureKey }).where({ space_id: spaceId }).build();
    return excuteQuery(query);
  }

  createSpace(newSpace, currentUser) {
    const space = new Space();
    space.name = newSpace.name;
    space.description = newSpace.description;
    space.approvalPercentage = newSpace.approvalPercentage;
    space.participationPercentage = newSpace.participationPercentage;
    space.ownerId = currentUser.userId;
    return this.create(space);
  }

  async saveChatId(spaceId, chatId) {
    const query = SqlQuery.update.into(this.tableName).set({ telegram_chat_id: chatId }).where({ space_id: spaceId }).build();
    return excuteQuery(query);
  }
}

module.exports = new SpaceRepository();

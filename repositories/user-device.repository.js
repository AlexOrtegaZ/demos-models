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
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');
const { UserDevice } = require('../models');
const invitationStatusEnum = require('../enums/invitation-status.enum');
const MemberRepository = require('./member.repository');

class UserDeviceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = UserDevice.name;
    this.tableName = 'user_devices';
    this.colId = 'user_device_id';
  }

  /**
   * Find All by user id
   * @param {string} userId
   * @returns {Promise<UserDevice[]>}
   */
  async findAllByUserId(userId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        user_id: userId,
      })
      .build();

    return await excuteQuery(query);
  }

  /**
   * Find All UserDevice by spaceId
   * @param {string} spaceId
   * @returns {Promise<UserDevice[]>}
   */
  async findAllBySpaceId(spaceId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .select('device_id', 'user_id')
      .from(MemberRepository.tableName, 'user_id', 'user_id', { joinType: 'inner' })
      .where({ space_id: spaceId, deleted: false, invitation_status: invitationStatusEnum.ACCEPTED, })
      .build();
    const result = await excuteQuery(query);
    return result;
  }
  /**
   * Find One UserDevice by deviceId
   * @param {string} deviceId
   * @returns {Promise<UserDevice>}
   */
  async findOneByDeviceId(deviceId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        device_id: deviceId,
      })
      .limit(1)
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }

  /**
   * Check if the deviceId is already register, otherwise is created
   * @param {string} userId
   * @param {string} deviceId
   * @returns {Promise<UserDevice>}
   */
  async createOrUpdate(userId, deviceId) {
    const userDeviceByDeviceId = await this.findOneByDeviceId(deviceId);
    if (userDeviceByDeviceId !== undefined) {
      return this.update(userDevice.userDeviceId, userId, deviceId);
    }
    return this.createUserDevice(userId, deviceId);
  }

  /**
   * Create a UserDevice
   * @param {string} userId
   * @param {string} deviceId
   * @returns {Promise<UserDevice>}
   */
  createUserDevice(userId, deviceId) {
    const userDevice = new UserDevice();
    userDevice.userId = userId;
    userDevice.deviceId = deviceId;
    return this.create(userDevice);
  }

  /**
   * Update a UserDevice
   * @param {string} userId
   * @param {string} deviceId
   * @returns {Promise<UserDevice>}
   */
  async update(userDeviceId, userId, deviceId) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({
        user_id: userId,
        device_id: deviceId,
      })
      .where({ [this.colId]: userDeviceId })
      .build();

    await excuteQuery(query);
    return this.findById(userDeviceId);
  }
}

module.exports = new UserDeviceRepository();

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

class UserDeviceRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = UserDevice.name;
    this.tableName = 'user_devices';
    this.colId = 'user_device_id';
  }

  /**
 * Find
 * @param {string} userId
 * @returns {Promise<UserDevice[]>}
 */
  async findAllByUserId(userId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        user_id: userId
      })
      .build();

    return await excuteQuery(query);
  }

  async findOneByDeviceId(deviceId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        device_id: deviceId
      })
      .limit(1)
      .build();

      const result = await excuteQuery(query);
      return result[0];
  }

  async createOrUpdate(userId, deviceId) {
    const userDevice = await this.findOneByDeviceId(deviceId);
    if (userDevice !== undefined) {
      return this.update(userDevice.userDeviceId, userId, deviceId);
    }
    return this.createUserDevice(userId, deviceId);
  }

  createUserDevice(userId, deviceId) {
    const userDevice = new UserDevice();
    userDevice.userId = userId;
    userDevice.deviceId = deviceId;
    return this.create(userDevice);
  }

  async update(userDeviceId, userId, deviceId) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({
        user_id: userId,
        device_id: deviceId 
      })
      .where({ [this.colId]: userDeviceId })
      .build();

    await excuteQuery(query);
    return this.findById(userDeviceId);
  }
}

module.exports = new UserDeviceRepository();

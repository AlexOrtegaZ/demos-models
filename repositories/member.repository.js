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
const Member = require('../models/member.model');
const { invitationStatusEnum } = require('../enums');
const SqlQuery = require('../utils/sqlQuery');
const { excuteQuery } = require('./db.utils');
const UserRepository = require('./user.repository');

class MemberRepository extends DbHelper {
  constructor() {
    super();
    this.entityName = Member.name;
    this.tableName = 'members';
    this.colId = 'member_id';
    this.hasDeletedColumn = true;
  }

  async findAnyMemberById(memberId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({ [this.colId]: memberId })
      .limit(1)
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }

  async findMemberPhoneNumbers(spaceId) {
    const invitationStatusToIgnore = [
      invitationStatusEnum.CANCELED,
      invitationStatusEnum.REJECTED,
      invitationStatusEnum.EXPIRED,
    ];
    const query = SqlQuery.select
      .from(this.tableName)
      .select('member_id', UserRepository.colId)
      .from(UserRepository.tableName, UserRepository.colId, UserRepository.colId, { joinType: 'inner' })
      .select('phone_number')
      .where({ space_id: spaceId, deleted: false, invitation_status: SqlQuery.sql.not_in(invitationStatusToIgnore) })
      .build();
    const result = await excuteQuery(query);
    return result;
  }

  async findByUserIdAndSpaceId(userId, spaceId) {
    const invitationStatusToIgnore = [
      invitationStatusEnum.CANCELED,
      invitationStatusEnum.REJECTED,
      invitationStatusEnum.EXPIRED,
    ];

    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        user_id: userId,
        space_id: spaceId,
        deleted: false,
        invitation_status: SqlQuery.sql.not_in(invitationStatusToIgnore),
      })
      .build();

    const result = await excuteQuery(query);
    return result[0];
  }

  async findUsersSpaceIdAndInvitationStatusAcceptedOrReceived(spaceId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        space_id: spaceId,
        deleted: false,
        invitation_status: [invitationStatusEnum.ACCEPTED, invitationStatusEnum.RECEIVED],
      })
      .build();

    const result = await excuteQuery(query);
    return result;
  }

  async findBySpaceIdAndInvitationStatusAccepted(spaceId) {
    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        space_id: spaceId,
        deleted: false,
        invitation_status: invitationStatusEnum.ACCEPTED,
      })
      .order('created_at', 'A')
      .build();

    const result = await excuteQuery(query);
    return result;
  }

  async findBySpaceIdAndInvitationStatusSendedOrReceived(spaceId) {
    const invitationStatusToIgnore = [
      invitationStatusEnum.ACCEPTED,
      invitationStatusEnum.CANCELED,
      invitationStatusEnum.REJECTED,
      invitationStatusEnum.EXPIRED
    ];

    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        space_id: spaceId,
        deleted: false,
        invitation_status: SqlQuery.sql.not_in(invitationStatusToIgnore)
      })
      .order('created_at', 'A')
      .build();

    const result = await excuteQuery(query);
    return result;
  }

  async findAllBySpaceIds(spaceIds) {
    const invitationStatusToIgnore = [invitationStatusEnum.CANCELED, invitationStatusEnum.REJECTED];

    const query = SqlQuery.select
      .from(this.tableName)
      .where({
        space_id: spaceIds,
        deleted: false,
        invitation_status: SqlQuery.sql.not_in(invitationStatusToIgnore),
      })
      .build();

    const result = await excuteQuery(query);
    return result;
  }

  createMember(spaceId, userId, invitationStatus, role, createdBy) {
    const member = new Member();
    member.spaceId = spaceId;
    member.userId = userId;
    member.invitationStatus = invitationStatus;
    member.role = role;
    member.createdBy = createdBy;
    member.updatedBy = createdBy;
    if (invitationStatus === invitationStatusEnum.SENDED) {
      const today = new Date();
      const expiredDate = new Date();
      expiredDate.setDate(today.getDate() + 7);
      member.expiredAt = expiredDate.toISOString();
    }
    return this.create(member);
  }

  async update(memberId, name, role, updatedBy) {
    const updateObject = {};
    if (name) {
      updateObject.name = name;
    }
    if (role) {
      updateObject.role = role;
    }

    const query = SqlQuery.update
      .into(this.tableName)
      .set({ ...updateObject, updated_by: updatedBy })
      .where({ member_id: memberId })
      .build();
    return excuteQuery(query);
  }

  async updateInvitationStatus(memberId, invitationStatus, updatedBy) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({ invitation_status: invitationStatus, updated_by: updatedBy })
      .where({ member_id: memberId })
      .build();
    return excuteQuery(query);
  }

  async delete(memberId, updatedBy) {
    const query = SqlQuery.update
      .into(this.tableName)
      .set({ deleted: true, updated_by: updatedBy })
      .where({ member_id: memberId })
      .build();
    return excuteQuery(query);
  }
}

module.exports = new MemberRepository();

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
const createPgClient = require('../utils/createPgClient');

function convertPropNameToColumnNotation(fieldName) {
  return fieldName
    .replace(/\.?([A-Z])/g, function (x, y) {
      return `_${y.toLowerCase()}`;
    })
    .replace(/^_/, '');
}

function isPropertyEmpty(value) {
  return value === '' || value === null || value === undefined;
}

function getColumnsAndValues(object) {
  const columns = [];
  const values = [];
  Object.keys(object).forEach((key) => {
    if (!isPropertyEmpty(object[key])) {
      const columnName = convertPropNameToColumnNotation(key);
      const value = object[key];
      columns.push(columnName);
      values.push(value);
    }
  });

  return [columns, values];
}

function convertPropNameToCamelCase(name) {
  return name.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

function mapObjectToCamelCased(object) {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    const property = convertPropNameToCamelCase(key);
    const value = object[key];
    newObject[property] = value;
  });

  return newObject;
}

async function excuteQueryWithValuesDeprecated(query, values) {
  const client = createPgClient();
  await client.connect();
  const res = await client.query(query, values);
  await client.end();
  return res.rows.map((rowObject) => mapObjectToCamelCased(rowObject));
}

async function excuteQuery(query) {
  const client = createPgClient();
  await client.connect();
  const res = await client.query(
    query.replaceAll('`', '').replaceAll("\\'", "''").replaceAll('\\"', '"').replaceAll('\\\\n', '\\n')
  );
  await client.end();
  return res.rows.map((rowObject) => mapObjectToCamelCased(rowObject));
}

module.exports = {
  convertPropNameToColumnNotation,
  getColumnsAndValues,
  convertPropNameToCamelCase,
  mapObjectToCamelCased,
  excuteQueryWithValuesDeprecated,
  excuteQuery,
};

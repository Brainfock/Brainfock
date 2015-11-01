/**
 * Brainfock - community & issue management software
 * Copyright (c) 2015, Sergii Gamaiunov (“Webkadabra”)  All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @link http://www.brainfock.com/
 * @copyright Copyright (c) 2015 Sergii Gamaiunov <hello@webkadabra.com>
 */
/**
 * Helper to populate options for UI form scheme of topics based on field key (name)
 *
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
export default class FieldsHandler {
  static populateFormField(item) {
    return new Promise(
      function (resolve, reject) {
        if (1==1) {

          let propName = item.key+'FieldProps';
          if (item.key+'FieldProps' in FieldsHandler) {
            FieldsHandler[propName](item).then(function(res){
              resolve(res);
            })
          } else {
            resolve({
              key: item.key,
              type: '__NOT_IMPLEMENTED__'
            });
          }
        } else {
          reject({error:'Error'}); // failure
        }
      });
  }

  /**
   * configure form field for `contextTopicId`
   *
   * @param data:
   * @property contextTopic object
   * @property group object
   * @property group.parentGroup object
   * @property group.parentGroup object
   *
   * @returns {Promise}
   */
  static contextTopicIdFieldProps(data) {
    return new Promise(
      function(resolve, reject) {
        data.group.parentGroup(function(err,parentGroup){
        if (err)
          throw err;

        if (parentGroup) {
          resolve({
            label: parentGroup.name,
            // `name` is used for form inputs to identify model's attribute
            name: data.key,
            type: 'select', // todo: hasOne rather
            // pre-populate default option
            // TODO: preload more options? options loaded should be somewhat predicted to be actual for user to select
            options:[{
              value: data.contextTopic.id,
              label: data.contextTopic.summary
            }],
            // use REST to get options (handles access control):
            endpoint: '/api/topics/?filter[where][groupKey]='+parentGroup.groupKey,
            endpointQueryString: 'filter[where][summary][like]'
          });
        } else {
          resolve(null);
        }
      });
      }
    );
  }

  static workspaceIdFieldProps(data) {
    return new Promise(
      function(resolve, reject) {
        resolve({
          // TODO: l10n
          label: 'Workspace',
          name: data.key,
          type: 'select', // todo: hasOne rather
          options:[],
          // use REST to get options (handles access control):
          endpoint: '/api/workspaces?',
          endpointQueryString: 'filter[where][name][like]',
        });
      }
    );
  }

  static typeIdFieldProps(data) {
    return new Promise(
      function(resolve, reject) {
        resolve({
          label: 'Type',
          // `name` is used for form inputs to identify model's attribute
          name: data.key,
          type: 'select', // todo: hasOne rather
          options:data.options || [],
          value: data.value || null,
        });
      }
    );
  }

  static summaryFieldProps(data) {
    return new Promise(
      function (resolve, reject) {
        resolve({
          label: 'Summary',
          name: data.key,
          type: 'text'
        });
      }
    );
  }

  static textFieldProps(data) {
    return new Promise(
      function(resolve, reject) {
        resolve({
          label: data.name || 'Details',
          name: data.key,
          type: 'textarea'
        });
      }
    );
  }

  static contextTopicKeyFieldProps(data) {
    return new Promise(
      function(resolve, reject) {
        resolve({
          label: data.name,
          name: data.key,
          type: 'text'
        });
      }
    );
  }

  static assigneeFieldProps(data) {
    return new Promise(
      function(resolve, reject) {
        resolve({
          label: 'Assignee',
          name: data.key,
          type: 'select', // todo: hasOne rather
          // todo: pre-load options (not full list, tops 100); this has to take into account topic access, of course
          options:[],
          endpoint: `/api/topics/${data.contextTopic.id}/participants`,
        });
      }
    )
  }

  static linked_issuesFieldProps(data) {
    return new Promise(
      function (resolve, reject) {
        resolve({
          label: 'Related Issues',
          name: data.key,
          type: 'multiselect', // todo: hasMany rather
          // todo: pre-load options (not full list, tops 100); this has to take into account topic access, of course
          options:[],
          endpoint: `/api/topics?filter[where][groupKey]=${data.group.groupKey}`,
        });
      }
    )
  }

  static dueDateFieldProps(data) {
    return new Promise(
      function (resolve, reject) {
        resolve({
          label: 'Due Date',
          name: data.key,
          type: 'datetime',
        });
      }
    )
  }

  static labelsFieldProps(data) {
    return new Promise(
      function (resolve, reject) {
        resolve({
          label: 'Labels',
          name: data.key,
          type: 'multiselect', // todo: hasMany rather
          // todo: pre-load options (not full list, tops 100); this has to take into account topic access, of course
          options:[],
          endpoint: `/api/topics/${data.contextTopic.id}/labels`,
        });
      }
    )
  }

  static priorityFieldProps(data) {
    return new Promise(
      function (resolve, reject) {
        resolve({
          label: 'Priority',
          name: data.key,
          type: 'select',
          // todo: pre-load options (not full list, tops 100); this has to take into account topic access, of course
          options:[],
          endpoint: `/api/topics/${data.contextTopic.id}/labels`,
        });
      }
    )
  }

};
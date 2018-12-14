/**
 * Brainfock, <http://www.brainfock.org>
 *
 * Copyright (C) 2015-present Sergii Gamaiunov <hello@webkadabra.com>
 * All rights reserved.
 *
 * This source code is licensed under the GPL-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
import app from '../../server/main';
/**
 * Helper to populate options for UI form scheme of topics based on field key (name)
 *
 * @author sergii gamaiunov <hello@webkadabra.com>
 */
export default class FieldsHandler {
  static populateFormField(item) {
    return new Promise(
      function (resolve, reject) {
        const isDebug = process.env.NODE_ENV === 'development';
        let propName = item.key+'FieldProps';
        if (item.key+'FieldProps' in FieldsHandler) {
          FieldsHandler[propName](item).then(function(res){
            if (!isDebug)
              return resolve(res);
            if (res === null)
              return resolve({
                key: item.key,
                type: '__NO_DATA__'
              });
            else {
              return resolve(res);
            }
          })
          .catch(e => {
              if (isDebug)
                console.log('>> error, ', e)
              return resolve({
                key: item.key,
                type: '__NO_DATA__'
              });
            })
        } else {
          if (!isDebug) {
            return resolve(null);
          } else {
            return resolve({
              key: item.key,
              type: '__NOT_IMPLEMENTED__'
            });
          }
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

  /**
   * configure form field for `parentTopicId`
   *
   * @param data:
   * @property contextTopic object
   * @property group object
   * @property group.parentGroup object
   * @property group.parentGroup object
   *
   * @returns {Promise}
   */
  static parentTopicIdFieldProps(data) {

    return new Promise(
      function(resolve, reject) {

        data.group.parentGroup(function(err,parentGroup){
        if (err)
          throw err;

        if (parentGroup) {
          resolve({
            label: `File under ${parentGroup.name}`,
            label: `Select category`,
            // `name` is used for form inputs to identify model's attribute
            name: data.key,
            type: 'select', // todo: hasOne rather
            // pre-populate default option
            // TODO: preload more options? options loaded should be somewhat predicted to be actual for user to select
            //options:[{
            //  value: data.contextTopic.id,
            //  label: data.contextTopic.summary
            //}],
            // use REST to get options (handles access control):
            endpoint: '/api/topics/?filter[where][groupKey]='+parentGroup.groupKey
            + '&filter[where][contextTopicId]='+data.contextTopic.id,
            endpointQueryString: 'filter[where][summary][like]'
          });
        } else {
          resolve(null);
        }
      });
      }
    );
  }

  /**
   * configure form field for `parentTopicId`
   *
   * @param data:
   * @property contextTopic object
   * @property group object
   * @property group.parentGroup object
   * @property group.parentGroup object
   *
   * @returns {Promise}
   */
  static contextTopicParentIdFieldProps(data) {

    return new Promise(
      function(resolve, reject) {

        resolve({
          label: 'File under',
          name: 'parentTopicId',
          type: 'select', // todo: belongsTo rather
          // todo: pre-load options (not full list, tops 100); this has to take into account topic access, of course
          options:[],
          endpoint: `/api/topics?filter[where][groupKey]=${data.group.groupKey}`
          + '&filter[where][contextTopicId]='+data.contextTopic.id,
          // todo: add topicType IDs into filter query and only show topics that have type with enabled sub-topic option
          endpointIncludeValues: [
            {'workspaceId': 'filter[where][workspaceId]='}
          ]
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
        if (data.contextTopic) {
          resolve(null);
        } else {
          resolve({
            label: data.name,
            name: data.key,
            type: 'text'
          });
        }
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

  static priorityIdFieldProps(data) {
    return new Promise(
      function (resolve, reject) {

        if (!process.env.IS_BROWSER) {
          app.models.Term.prepareFormOptions('priority', 1000, (err, options) => {

            resolve({
              label: 'Priority',
              name: data.key,
              type: 'select',
              options: options,
            });
          })
        } else {

          resolve({
            label: 'Priority',
            name: data.key,
            type: 'select',
            options:[],
            endpoint: `/api/terms/values/priority`,
          });
        }
      }
    )
  }

};
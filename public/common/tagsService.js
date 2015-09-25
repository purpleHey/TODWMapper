angular.module('newApp')
.factory('remoteTags', function (createRemote) {

  function isOnlyTagWithContent (content, tags) {
    return tags.filter(function (tag) {
      return tag.content === content;
    }).length === 1;
  }

  function assign (tag, activity, tags) {
    var newTag;
    var matchingTag = utils.find(tags, { content: tag.content, activityId: activity.id });

    function extendWithActivity (tag) {
      return utils.extend(tag, {
        activityId: activity.id,
        activityType: activity.type
      });
    }

    if (matchingTag) return;

    if (isOnlyTagWithContent(tag.content, tags) && !tag.activityId) {
      return this.id(tag._id).update(extendWithActivity(tag));
    } else {
      newTag = extendWithActivity(utils.pick(tag, ['content', 'courseId', 'unitId']));
      return this.create(newTag).then(function (response) {
        tags.push(response.data);
      });
    }
  }

  function unassign (tag, tags) {
    var remoteTag = this.id(tag._id);
    if (isOnlyTagWithContent(tag.content, tags)) {
      return remoteTag.update(utils.extend(tag, {
        activityId: null,
        activityType: null
      }));
    } else {
      return remoteTag.delete().then(function () {
        tags.splice(tags.indexOf(tag), 1);
      });
    }
  }

  return utils.extend(createRemote('tags'), {
    assign: assign,
    unassign: unassign
  });
});

'use strict';

var fields = [
    'id',
    'first-name',
    'last-name',
    'maiden-name',
    'formatted-name',
    'phonetic-first-name',
    'phonetic-last-name',
    'formatted-phonetic-name',
    'headline',
    'location',
    'industry',
    'current-share',
    'num-connections',
    'num-connections-capped',
    'summary',
    'picture-url',
    'site-standard-profile-request',
    'api-standard-profile-request',
    'public-profile-url',
    'last-modified-timestamp',
    'proposal-comments',
    'associations',
    'interests',
    'publications',
    'patents',
    'languages',
    'skills  ',
    'certifications',
    'educations',
    'courses',
    'volunteer',
    'positions',
    'three-current-positions',
    'three-past-positions',
    'num-recommenders',
    'recommendations-received',
    'following',
    'job-bookmarks',
    'suggestions',
    'date-of-birth',
    'member-url-resources',
    'related-profile-views',
    'honors-awards'
];


module.exports = function getUrlFields(){
    return '~:('+fields.join(',')+')';
};
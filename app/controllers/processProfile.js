'use strict';

var _  = require('lodash');
var fmt = require('util').format;
var db = require('knex')._db;
var moment = require('moment');

function getDateInfo(d) {
    return _.isObject(d) && d.year && d.month  ? moment(fmt('%d-%d', 
                                                        d.month, d.year), 'MM-YYYY')._d 
                                               : null;
}

function processProfileHandler(req, res, next){

    var profile = req.param('profile', null);

    if (profile === null || _.isObject(profile) === false) {
        res.status(404).json({
            message: 'missing profile, request cannot be completed'
        });
        return;
    }

    require('fs').writeFileSync('./profile.json', JSON.stringify(profile), {encoding:'utf8', flag: 'w+'});

    
    var hasLocation = !!profile.location && profile.location.hasOwnProperty('name') && _.isObject(profile.location.country);
    var hasSkills = !!profile.skills && profile.skills.hasOwnProperty('values');
    var hasRecommendations = !!profile.recommendationsReceived && profile.recommendationsReceived.hasOwnProperty('values');
    var hasPublications = !!profile.publications && profile.publications.hasOwnProperty('values');
    var hasVolunteerExpereiences = !!profile.volunteer && profile.volunteer.hasOwnProperty('volunteerExperiences');
    var haspositions = !!profile.positions && profile.positions.hasOwnProperty('values');
    var haseducations = !!profile.educations && profile.educations.hasOwnProperty('values');
    var haspatents = !!profile.patents && profile.patents.hasOwnProperty('values');
    var haslanguages = !!profile.languages && profile.languages.hasOwnProperty('values');

    //console.log(profile.languages);


    var userProfile = {
        first_name: profile.given_name,
        last_name: profile.family_name,
        l_headline: profile.headline,
        location_name: hasLocation ? profile.location.name : null,
        location_country: hasLocation ? profile.location.country.code : null,
        industry: profile.industry,
        number_connections: profile.numConnections,
        number_connections_capped: profile.numConnectionsCapped,
        summary: profile.summary,
        profileid: profile.user_id,
        email: profile.email,

        total_pubs: hasPublications ? profile.publications._total 
                                    : null,

        total_reccs: hasRecommendations ? profile.recommendationsReceived._total
                                        : null,

        total_skills: hasSkills ? profile.skills._total
                                : null,

        total_volunteers: hasVolunteerExpereiences ? profile.volunteer.VolunteerExpereiences._total
                                                 : null,
        total_positions: haspositions ? profile.positions._total
                                      : null,
        total_educations: haseducations ? profile.educations._total
                                        : null,
        total_patents: haspatents ? profile.patents._total
                                  : null,
        total_languages: haslanguages ? profile.languages._total
                                  : null
    };

/*
    {
        "first_name": "give_name"
    }

    function parser (schema, obj) {
        var out = {}
        _.each(schema, function (keyOut, keyIn) {
            out[keyOut] = pathParser(obj, keyIn) || null
        })
    } */

    var publications;

    if (hasPublications) {
        publications = profile.publications.values.map(function(pub){
            var _pub = {
                title: pub.title,
                profileid: profile.user_id,
                publication_id: pub.id,
                publication_date: null
            };

            if (_.isObject(pub.date)) {
                _pub.publication_date = moment(fmt('%d-%d-%d', 
                                                    pub.date.year, 
                                                    pub.date.month,
                                                    pub.date.day), 
                                               'YYYY-MM-DD')._d;
            }

            return _pub;
        });
    }

    var recommendations;
    if (hasRecommendations) {
        recommendations = profile.recommendationsReceived.values.map(
            function(recc){
                return {
                    recommendation_text: recc.recommendationText,
                    recommendation_type: recc.recommendationType.code,
                    recommendation_id: recc.id,
                    profileid:profile.user_id
                };
            }
        );
    }


    var skills;
    if (hasSkills){
        skills = profile.skills.values.map(
            function(skill){
                return {
                    skills_id: skill.id,
                    skill_name: skill.skill.name,
                    profileid:profile.user_id
                };
            }
        );
    }
    

    var volunteers;
    if (hasVolunteerExpereiences) {
        volunteers = profile.volunteer.volunteerExperiences.values.map(
            function(vol){
                return {
                    vid: vol.id,
                    vrole: vol.role,
                    organization_name:vol.organization.name,
                    profileid:profile.user_id
                };
            }
        );
    }

/*
    {
        "fields": [
            "positions": {
                "fields": {
                    "profileid": {
                        "path": "profile.user_id"
                    }, 
                    "positionsid": {
                        "value": "id"
                    },
                    "start_date": {
                        "value": "startDate",
                        "formatter": "getDateInfo"
                    }
                }
            }
        ]
    }

    var formatters = {
        "getDateInfo": getDateInfo,
        "year": function (val) {
            return moment(val).format('YYYY')
        } 
    };

    function parser (schema, data) {
        var out = {};

        _.each(schema.fields, function (fieldSchema, fieldName) {
            _.defaults(fieldSchema, {
                path: 'profile.' + fieldName + '.values',
                fieldName: fieldName
            })

            var parentSchema = fieldSchema;

            out[fieldName] = {};

            _.each(fieldSchema.fields, function (fieldSchema, fieldName){
                _.defaults(fieldSchema, {
                    path: parentSchema.path + '.' + fieldSchema.value
                });

                var val  = pathParser(fieldSchema.path, data);

                if (!val) {
                    return;
                }

                if(fieldSchema.formatter) {
                    val = formatters[fieldSchema.formatter](val)
                }

                out[parentSchema.fieldName][fieldName] = val;
            })
        })
    }

    function pathParser = function (path, obj) {
        var path = path.split('.');

        return _.reduce(path, function (pathPart) {
            return obj[pathPart] || false;
        }, obj);
    } */

    var positions; 
    if (haspositions) {
        positions = profile.positions.values.map(
            function(pos){
                return {
                  profileid:profile.user_id,  
                  positionsid: pos.id,
                  company: pos.company.name,
                  is_current: pos.iscurrent, 
                  summary: pos.summary,
                  title: pos.title,
                  start_date: getDateInfo(pos.startDate),
                  end_date: getDateInfo(pos.endDate)
                };
        });
    }

    var educations;
    if (haseducations) {
        educations = profile.educations.values.map(
            function(edu){
                return {
                    eid: edu.id,
                    school_name: edu.schoolName,
                    field_of_study: edu.fieldOfStudy,
                    start_date: moment(edu.startDate.year, 'YYYY')._d,
                    end_date: moment(edu.endDate.year, 'YYYY')._d,
                    degree: edu.degree,
                    activities: edu.activities,
                    notes: edu.notes,
                    profileid: profile.user_id
                };
            }
        );
    }

    var patents;
    if (haspatents) {
        patents = profile.patents.values.map(
            function(pat){
                return {
                    patentid: pat.id,
                    title: pat.title,
                    patent_date: getDateInfo(pat.date),
                    profileid: profile.user_id
                };
            }
        );
    }

    var languages;
    if (haslanguages) {
        languages = profile.languages.values.map(
            function(lang){
                return {
                    lid: lang.id,
                    language_name: lang.language.name,
                    profileid: profile.user_id
                };
            }
        );
    }


    db('profile')
        .insert(userProfile)
        .then(function profileSaveSuccess(){
            console.log('before publications');
            if (publications) {
                return db('publications').insert(publications);
            }

            return;
        }, function profileSaveFailure(err){
            if (err && err.code === '23505') {
                res.status(400).json({
                    message: 'you have already submitted your profile'
                });
                return;
            }
            throw err;
        })
        .then(function publicationsSavedSuccessfully(){
            console.log('before recommendations');
            if (recommendations){
                return db('recommendations').insert(recommendations);
            }
            return;
        })
        .then(function skillsSavedSuccessfully(){
            console.log('before skills');

            if (skills){
                return db('skills').insert(skills);
            }
            return;
        })
        .then(function volunteersSavedSuccessfully(){
            console.log('before volunteers');
            if (volunteers) {
                return db('volunteers').insert(volunteers);
            }

            return;
        }).then(function PositionsSavedSuccessfully(){
            console.log('before positions');
            if (positions) {
                return db('positions').insert(positions);
            }

            return;
        }).then(function EducationsSavedSuccessfully(){
            console.log('before education');
            if (educations) {
                return db('education').insert(educations);
            }

            return;
        }).then(function PatentsSavedSuccessfully(){
            console.log('before patents');
            if (patents) {
                return db('patents').insert(patents);
            }

            return;
        })
        .then(function LanguagesSavedSuccessfully(){
            console.log('before languages');
            if (languages) {
                return db('language').insert(languages);
            }

            return;
        })
        .then(function allSuccess(){
            res.json({
                message: 'your information was saved successfully'
            });
        })
        .catch(function databaseSaveError(err){
            console.error(err);
            res.status(500).json({
                message: 'there was an issue saving the profile information'
            });
        });
    
}

module.exports = processProfileHandler;
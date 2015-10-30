Profile Mapping
===============

PROFILE TABLE
=============
"given_name"="profile.first_name"
"family_name"="profile.last_name"
"headline"="profile.headline"
"location.name"="profile.location_name"
"location.country.code"="profiles.location_country"
"industry"="profile.industry"
"numConnections"="profile.number_connections"
"numConnectionsCapped"="profile.number_connections_capped"
"summary"="profile.summary"
"user_id"="profile.profileid"
"publications._total"="profile.total_pubs"
"recommendationsReceived._total"="profile.total_reccs"
"skills._total"="profile.total_skills"
"volunteer.volunteerExperiences._total"="profile.total_volunteers" --total number of organizations the individual is volunteering at
"positions._total"="profile.total_positions" --max value of 3, since api call can only call r_basicprofile, sad panda
"educations._total"="profile.total_educations"
"patents._total="profile.patents._total"
"languages._total"="profile.languages._total"
"email"="profile.email"

PUBLICATIONS TABLE
==================
"publications.values.title="publications.title"
"publications.values.id="publications.publication_id"
"publications.values.date="publications.publication_date"


RECOMMENDATIONS TABLE
=====================
"recommendationsReceived.values.id.[].recommendationText"="recommendations.recommendation_text"
"recommendationsReceived.values.id.[].recommendationType.code"="recommendations.recommendation_type"
"recommendationsReceived.values.id"="recommendations.recommendation_id"


SKILLS TABLE
============
"skills.values.id.[].skill.name"="skills.skill_name"
"skills.values.id"="skills.skills_id"

//VOLUNTEER TABLE
//===============
//"volunteer.volunteerExperiences.values.id.[].role"="volunteers.vrole"
//"volunteer.volunteerExperiences.values.id.[].organization.name"="volunteers.organization_name"
//"volunteer.volunteerExperiences.values.id.[].cause"="volunteers.cause" 

EDUCATION TABLE
===============
"educations.values.id.[].activities"="education.activites"
"educations.values.id.[].degree="education.degree"
"educations.values.id.[].endDate.year"="education.end_date"
"educations.values.id.[].startDate.year"="education.start_date"
"educations.values.id.[].fieldOfStudy"="education.field_of_study"
"educations.values.id.[].notes"="education.notes"
"educations.values.id.[].schoolName"="education.school_name"

//LANGUAGE TABLE --NEED TO VERIFY FORMAT
//======================================
//"languages.values.id.[].language_name"="language.language_name"
//"languages.values.id.[].proficiency.name"="language.proficiency"
//"languages._total"="language.languages_spoken"


//PATENTS TABLE--NEED TO VERIFY FORMAT
//====================================
//"patent.values.id.[].title"="patents.title"
//"patent.values.id.[].summary"="patents.summary"
//"patent.values.id.[].status"="patents.status_id"
//"patent.values.id.[].office"="patents.office_name"
//"patent.values.id.[].inventors.name"="patents.inventor_name"
//"patent.values.id.[].number"="patents.number_patent"
//"patent.values.id.[].summary"="patents.summary"

POSITIONS TABLE
===============
"Positions.values.company.id.[].name"="positions.company"
"Positions.values.id.[].iscurrent"="positions.is_current"
"Positions.values.id.[].startdate="positions.start_date"
"Positions.values.summary"="positions.summary"
"Positions.values.title"="positions.title"
"threeCurrentPositions.values.company.id.[].name"="positions.company"
"threeCurrentPositions.values.id.[].iscurrent"="positions.is_current"
"threeCurrentPositions.values.id.[].startDate="positions.start_date"
"threeCurrentPositions.values.id.[].endDate="positions.end_date"
"threeCurrentPositions.values.summary"="positions.summary"
"threeCurrentPositions.values.title"="positions.title"
"threePastPositions.values.company.id.[].name"="positions.company"
"threePastPositions.values.id.[].iscurrent"="positions.is_current"
"threePastPositions.values.id.[].startdate="positions.start_date"
"threePastPositions.values.id.[].endDate="positions.end_date"
"threePastPositions.values.summary"="positions.summary"
"threePastPositions.values.title"="positions.title"






























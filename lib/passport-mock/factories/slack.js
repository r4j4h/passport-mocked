var utils = require('./utils');
var faker = require('faker');

module.exports = function Slack (params) {
    params = params || {};

    var slackName = faker.company.companyName();
    var slackNameSlug = faker.helpers.slugify( slackName );
    var slackTeamUrl = "https://" + slackNameSlug + '.slack.com';

    var json = {
        ok: true,
        url: slackTeamUrl,
        team: slackName,
        user: params.user || faker.helpers.slugify( faker.name.firstName() ),
        team_id: faker.helpers.replaceSymbolWithNumber('#########'),
        user_id: faker.helpers.replaceSymbolWithNumber('#########')
    };

    return {
        provider: 'Slack',
        id: json.user_id,
        displayName: json.user,
        _raw: JSON.stringify(json),
        _json: json
    };
};
//
//{
//    provider: 'Slack',
//    id: 'U03UMNS8J',
//    displayName: 'deci_belle',
//    _raw: '{"ok":true,"url":"https:\\/\\/madladz.slack.com\\/","team":"MAD_LADz","user":"deci_belle","team_id":"T03UMNS8G","user_id":"U03UMNS8J"}',
//    _json:
//    {
//        ok: true,
//        url: 'https://madladz.slack.com/',
//        team: 'MAD_LADz',
//        user: 'deci_belle',
//        team_id: 'T03UMNS8G',
//        user_id: 'U03UMNS8J'
//    }
//}
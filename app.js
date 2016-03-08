#!/usr/bin/env node

const ticketDB = require('./lib/ticket.js');
const cdncia = require('./lib/makecdncia.js');
const inquirer = require('inquirer');
const async = require('async');
const tmp = require('tmp');

const basePath = process.cwd() + '/';
const path = basePath + process.argv[2];
const tmpdir = tmp.dirSync();
const tmpdirName = tmpdir.name;

function listTitleId(tickets) {
    var ticks = JSON.parse(tickets);
    var titleIDs = [];
    for (var i = 0; i < ticks.length; i++) {
        titleIDs.push(ticks[i].titleId);
    }
    return titleIDs;
}

function getInfos(titleId, tickets) {
    var ticks = JSON.parse(tickets);
    for (var i = 0; i < ticks.length; i++) {
        if (ticks[i].titleId = titleId) {
            return [ticks[i].titleId, ticks[i].ticketData];
        }
    }
}

ticketDB.parse(path, (err, res) => {
    var titleIDs = listTitleId(res);

    var q = async.queue(function(titleId, callback) {
        var ticket = getInfos(titleId, res);
        var newTitleId = ticket[0].titleId;
        var newTicketData = new Buffer(ticket[1], 'hex');

        cdncia.dlCdn(tmpdirName, newTitleId, newTicketData, (err) => {
            if (err) throw err;
            cdncia.makeCia(tmpdirName, basePath, newTitleId, (err) => {
                if (err) throw err;
                tmp.setGracefulCleanup();
                callback();
            });
        });
    }, 1);

    inquirer.prompt([
        {
            type: "checkbox",
            message: "Choose the game you want to download.",
            name: "TitleIDs",
            choices: titleIDs,
            validate: function(answer) {
                if (answer.length < 1) {
                    return "You must choose at least one TitleID.";
                }
                return true;
            }
        }
    ], function(answers) {
        for (var i = 0; answers.TitleIDs.length > i; i++) {
            var titleId = answers.TitleIDs[i];
            q.push([{ titleId: titleId }], (err) => {
                if (err) throw err;
            });
        }
    });

    q.drain = () => { process.exit(0) };
});
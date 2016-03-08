const fs = require('fs');
const async = require('async');
const exec = require('child_process').exec;
const ddl = require('./download.js')
const magic = new Buffer('00010004919EBE464AD0F552CD1B72E7884910CF55A9F02E50789641D896683DC005BD0AEA87079D8AC284C675065F74C8BF37C88044409502A022980BB8AD48383F6D28A79DE39626CCB2B22A0F19E41032F094B39FF0133146DEC8F6C1A9D55CD28D9E1C47B3D11F4F5426C2C780135A2775D3CA679BC7E834F0E0FB58E68860A71330FC95791793C8FBA935A7A6908F229DEE2A0CA6B9B23B12D495A6FE19D0D72648216878605A66538DBF376899905D3445FC5C727A0E13E0E2C8971C9CFA6C60678875732A4E75523D2F562F12AABD1573BF06C94054AEFA81A71417AF9A4A066D0FFC5AD64BAB28B1FF60661F4437D49E1E0D9412EB4BCACF4CFD6A3408847982000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000526F6F742D43413030303030303033000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000158533030303030303063000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000137A0894AD505BB6C67E2E5BDD6A3BEC43D910C772E9CC290DA58588B77DCC11680BB3E29F4EABBB26E98C2601985C041BB14378E689181AAD770568E928A2B98167EE3E10D072BEEF1FA22FA2AA3E13F11E1836A92A4281EF70AAF4E462998221C6FBB9BDD017E6AC590494E9CEA9859CEB2D2A4C1766F2C33912C58F14A803E36FCCDCCCDC13FD7AE77C7A78D997E6ACC35557E0D3E9EB64B43C92F4C50D67A602DEB391B06661CD32880BD64912AF1CBCB7162A06F02565D3B0ECE4FCECDDAE8A4934DB8EE67F3017986221155D131C6C3F09AB1945C206AC70C942B36F49A1183BCD78B6E4B47C6C5CAC0F8D62F897C6953DD12F28B70C5B7DF751819A9834652625000100010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010003704138EFBBBDA16A987DD901326D1C9459484C88A2861B91A312587AE70EF6237EC50E1032DC39DDE89A96A8E859D76A98A6E7E36A0CFE352CA893058234FF833FCB3B03811E9F0DC0D9A52F8045B4B2F9411B67A51C44B5EF8CE77BD6D56BA75734A1856DE6D4BED6D3A242C7C8791B3422375E5C779ABF072F7695EFA0F75BCB83789FC30E3FE4CC8392207840638949C7F688565F649B74D63D8D58FFADDA571E9554426B1318FC468983D4C8A5628B06B6FC5D507C13E7A18AC1511EB6D62EA5448F83501447A9AFB3ECC2903C9DD52F922AC9ACDBEF58C6021848D96E208732D3D1D9D9EA440D91621C7A99DB8843C59C1F2E2C7D9B577D512C166D6F7E1AAD4A774A37447E78FE2021E14A95D112A068ADA019F463C7A55685AABB6888B9246483D18B9C806F474918331782344A4B8531334B26303263D9D2EB4F4BB99602B352F6AE4046C69A5E7E8E4A18EF9BC0A2DED61310417012FD824CC116CFB7C4C1F7EC7177A17446CBDE96F3EDD88FCD052F0B888A45FDAF2B631354F40D16E5FA9C2C4EDA98E798D15E6046DC5363F3096B2C607A9D8DD55B1502A6AC7D3CC8D8C575998E7D796910C804C495235057E91ECD2637C9C1845151AC6B9A0490AE3EC6F47740A0DB0BA36D075956CEE7354EA3E9A4F2720B26550C7D394324BC0CB7E9317D8A8661F42191FF10B08256CE3FD25B745E5194906B4D61CB4C2E000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000526F6F7400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001434130303030303030330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007BE8EF6CB279C9E2EEE121C6EAF44FF639F88F078B4B77ED9F9560B0358281B50E55AB721115A177703C7A30FE3AE9EF1C60BC1D974676B23A68CC04B198525BC968F11DE2DB50E4D9E7F071E562DAE2092233E9D363F61DD7C19FF3A4A91E8F6553D471DD7B84B9F1B8CE7335F0F5540563A1EAB83963E09BE901011F99546361287020E9CC0DAB487F140D6626A1836D27111F2068DE4772149151CF69C61BA60EF9D949A0F71F5499F2D39AD28C7005348293C431FFBD33F6BCA60DC7195EA2BCC56D200BAF6D06D09C41DB8DE9C720154CA4832B69C08C69CD3B073A0063602F462D338061A5EA6C915CD5623579C3EB64CE44EF586D14BAAA8834019B3EEBEED3790001000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000', 'hex');

const makecdncia = require('path').dirname(require.main.filename) + '/build/Release/makecdncia';

const host = 'ccs.cdn.c.shop.nintendowifi.net';
const basePath = '/ccs/download/';

function cetkGen(dir, ticketData, cb) {
    var cetkLength = magic.length + ticketData.length;
    var cetk = Buffer.concat([ticketData, magic], cetkLength);

    fs.writeFile(dir + '/cetk', cetk, (err) => {
        if (err) { throw err };
        console.log('CETK has been created.')
        cb(null);
    });
}

function tmdGen(dir, titleId, cb) {
    ddl.get(host, basePath + titleId + '/' + 'tmd', dir + '/tmd', 'Downloading TMD ', (err, size) => {
        console.log('TMD has been downloaded');
        cb(null);
    });
}

function contentGen(dir, titleId, cb) {
    fs.readFile(dir + '/tmd', (err, data) => {

        if (err) cb(err);
        var attempt = 0;

        var q = async.queue(function(contents, callback) {
            ddl.get(host, basePath + titleId + '/' + contents.cId, dir + '/' + contents.cId, 'Downloading Content ' + contents.cId, (err, size) => {
                if (err) {
                    if (attempt < 2) {
                        q.unshift([{ cId: contents.cId, size: contents.size }], (err) => {
                            console.log("\nSomething happened, we need to redownload the file !");
                            if (err) throw err;
                            attempt++;
                        });
                    } else if (attempt > 2) {
                        console.log("\nThe file couldn't be downloaded, we can't continue sadly :/");
                        process.exit(1);
                    }
                }
                if (size != contents.size) {
                    console.log('\nThe file has not the expected size, redownloading the file.');
                    if (attempt < 2) {
                        q.unshift([{ cId: contents.cId, size: contents.size }], (err) => {
                            if (err) throw err;
                            attempt++;
                        });
                    } else if (attempt > 2) {
                        console.log("\nThe file couldn't be downloaded, we can't continue sadly :/");
                        process.exit(1);
                    }
                } else {
                    console.log('Content ' + contents.cId + ' has been downloaded');
                }
                callback();
            });
        }, 1);

        var contentCount = parseInt(data.slice(0x1DE, 0x1E0).toString('hex'), 16);

        for (var i = 0; i < contentCount; i++) {
            var cOffs = 0xB04 + 0x30 * i;
            var cId = data.slice(cOffs, cOffs + 0x04).toString('hex');
            var size = parseInt(data.slice(cOffs + 0x08, cOffs + 0x10).toString('hex'), 16);
            q.push([{ cId: cId, size: size }], (err) => {
                if (err) throw err;
            });
        }

        q.drain = () => { cb(null) };
    });
}

var MakeCdnCia = function() { };

MakeCdnCia.prototype.dlCdn = function(dir, titleId, ticketData, cb) {
    cetkGen(dir, ticketData, (err) => {
        if (err) throw cb(err);
        tmdGen(dir, titleId, (err) => {
            if (err) throw cb(err);
            contentGen(dir, titleId, (err) => {
                if (err) throw err;
                cb(null);
            });
        });
    });
}

MakeCdnCia.prototype.makeCia = function(cdnDir, ciaDir, ciaFile) {
    exec(makecdncia + ' ' + cdnDir + ' ' + ciaDir + ciaFile + '.cia', (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        return console.log(ciaFile + '.cia has been created!');
    });
}

module.exports = new MakeCdnCia();
const fs = require('fs');
const RE2 = require('re2');
const reOffset = new RE2('Root-CA00000003-XS0000000c', 'g');

const offsetTable = {
    check: 0x1bc,
    encKeyStart: 0x1bf,
    encKeyEnd: 0x1cf,
    consoleIdStart: 0x1d8,
    consoleIdEnd: 0x1dc,
    titleIdStart: 0x1dc,
    titleIdEnd: 0x1e4,
    commonKeyIndex: 0x1f1,
}

const typeList = {
    eshopApp: '0000',
    downloadplayChild: '0001',
    demo: '0002',
    updatePatch: '000e',
    dlc: '008c',
    dsiware: '8004',
    dsiSysApp: '8005',
    dsiSysDataArch: '800f'
}

function ticket (ticketData, titleId, type, eShop) {
    this.ticketData = ticketData;
    this.titleId = titleId;
    this.type = type;
    this.eShop = eShop;
}

function removeDuplicate (arr, prop) {
    var new_arr = [];
    var lookup = {};
    for (var i in arr) {
        lookup[arr[i][prop]] = arr[i];
    }
    for (i in lookup) {
        new_arr.push(lookup[i]);
    }
    return new_arr;
}

var TicketDB = function() { };

TicketDB.prototype.parse = function(file, cb) {
    fs.readFile(file, (err, res) => {
        if (err) throw err;

        var ticketOffsets = [];
        var tickets = [];

        while (reOffset.exec(res) !== null) {
            ticketOffsets.push(reOffset.lastIndex - 26);
        };

        if (ticketOffsets.length == 0) {
            var err1 = new Error('No tickets found. Did you input the correct file?');
            cb(err1);
        }

        for (var i = 0; i < ticketOffsets.length; i++) {
            var ticketData = res.slice(ticketOffsets[i] - 320, ticketOffsets[i] + 528);

            var ticks = {
                data: ticketData.toString('hex'),
                encKey: ticketData.slice(offsetTable.encKeyStart, offsetTable.encKeyEnd).toString('hex'),
                titleId: ticketData.slice(offsetTable.titleIdStart, offsetTable.titleIdEnd).toString('hex'),
                consoleId: ticketData.slice(offsetTable.consoleIdStart, offsetTable.consoleIdEnd).toString('hex'),
                commonKeyIndex: ticketData[offsetTable.commonKeyIndex]
            }

            var typecheck = ticks.titleId.slice(4, 8).toString('hex');

            if (ticketData[offsetTable.check] == 0x1 && ticks.commonKeyIndex < 5
                && ticks.encKey != '00000000000000000000000000000000'
                && ticketData.slice(0, 4).toString('hex') == '00010004'
                && !(parseInt(typecheck, 16) & 0x10)
                && typecheck != typeList.dsiSysApp
                && typecheck != typeList.dsiSysDataArch) {

                var eshop, type;

                if (ticks.consoleId == '00000000') { eshop = false; } else { eshop = true; }

                switch (typecheck) {
                    case typeList.eshopApp:
                        type = 'eShop Application';
                        break;
                    case typeList.downloadplayChild:
                        type = 'Download Play Child';
                        break;
                    case typeList.demo:
                        type = 'Demo';
                        break;
                    case typeList.updatePatch:
                        type = 'Update Patch';
                        break;
                    case typeList.dlc:
                        type = 'DLC';
                        break;
                    case typeList.dsiware:
                        type = 'DSiware';
                        break;
                    default:
                        type = 'Unknown';
                        break;
                }
                tickets.push(new ticket(ticks.data, ticks.titleId, type, eshop));
            }
        }
        return cb(null, JSON.stringify(removeDuplicate(tickets, 'titleId')));
    });
}

module.exports = new TicketDB();
const pafe = require('/node/index.js');
const fs = require('fs');
module.exports = class PasoriReader {
    constructor() {
        this.membersData = JSON.parse(fs.readFileSync('./data/member.json', 'utf-8'));
        this.timeout = 300;
        this.latestIdm = null;
        this.pasori = new pafe.Pasori();
        process.on("exit", () => {
            if (this.pasori) {
                this.pasori.close();
                this.pasori = undefined;
            }
        });
        process.on("message", (message) => {
            if (message.command === "close") {
                this.pasori.close();
                this.pasori = undefined;
            }
        });
    }

    async _run() {
        const DATA = {
            POLLING_TIMESLOT: 0,
            SYSTEM_CODE: 0xFFFF // any code
        };
        if (this.pasori === undefined) {
            console.log("this.pasori === undefined");
            process.exit();
        }
        this.pasori.setTimeout(this.timeout);
        this.pasori.polling(
            DATA.SYSTEM_CODE,
            DATA.POLLING_TIMESLOT,
            (felica) => {
                const close = () => {
                    if (felica != null)
                        felica.close();
                    return;
                };
                if(!felica){
                    return close();
                }
                const idm = felica.getIDm();
                if (this.latestIdm == idm) {
                    return close();
                }
                this.latestIdm = idm;
                const memberId = this.membersData.cards.filter((card) => card.idm === idm).map((card) => card.member_id).shift();
                if (memberId === undefined) {
                    console.log("NoRegister,NoRegister,"+idm);
                    return close();
                }
                const member = this.membersData.members.filter((member) => member.id === memberId).shift();
                if (member === undefined) {
                    console.log("NoMember,NoMember,"+idm);
                    return close();
                }
                console.log(member.first_name+","+member.last_name+","+idm);
            }
        );
        sleep(this.timeout).then(() => { this._run(); }).catch(() => { process.exit() });
    }

    run() {
        this._run();
    }
}

function sleep(time) {
    return new Promise((p, _) => {
        setTimeout(() => {
            p()
        }, time);
    });
}
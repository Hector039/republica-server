import { Client } from 'whatsapp-web.js';

export const client = new Client({
    webVersionCache: {
        type: "remote",
        remotePath:
            "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
    },
});


export default class UtilsController {
    constructor(utilsService) {
        this.utilsService = utilsService;
    }


    getAdminNotifications = async (req, res, next) => {
        try {
            const { merchReq, inscReq } = await this.utilsService.getAdminNotifications();
            res.status(200).send({ merchReq: merchReq, inscReq: inscReq })
        } catch (error) {
            next(error)
        }
    }

    getDayTotalPayments = async (req, res, next) => {
        const { day } = req.params;

        try {
            const dayPayments = await this.utilsService.getDayTotalPayments(day);
            res.status(200).send(dayPayments);
        } catch (error) {
            next(error)
        }
    }

    getQr = async (req, res, next) => {
        try {
            
            client.on('qr', qr => {
                res.status(200).send({ qrCode: qr });
                //QRCode.generate(qr, { small: true });
                //const qrCodeData = QRCode.toDataURL(qr);
            });
            client.on('ready', () => {
                console.log('Client is ready!');
            });
            client.initialize();
            
        } catch (error) {
            next(error)
        }
    }

}
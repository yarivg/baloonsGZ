import { Request, Response, Router } from "express";
import { tokens } from "../routes/alon"
import * as uuid from "uuid";

const _ = require('lodash')
const request = require('request')
const seeVUToken = "thisisatoken"
const reporterID = 56

const reportRouter: Router = Router();
reportRouter.get("/", (req: Request, res: Response) => {
    res.send('ok').end()
})

reportRouter.post("/", (req: Request, res: Response) => {
    console.log('send req to seeVU')
    let phoneNumber = (_.invert(tokens))[req.body.userToken]
    if(phoneNumber) {
        let reqBody = {
            phone: phoneNumber,
            name: req.body.name,
            lng: req.body.lng,
            lat: req.body.lat,
            image: req.body.imageBase64.split('base64,')[1],
            heading: req.body.azimuth,
            category: req.body.category,
            description: req.body.description,
            pitch: '0',
            token: seeVUToken,
            user_id: '1'
        }
        
        request.post({
            headers: { 'content-type': 'application/json' },
            url: 'http://dev.res-cue.com:8082/web/report/image',
            body: JSON.stringify(reqBody)
        }, (error, response, body) => {
            if (response && response.statusCode == 200) {
                console.log('ok res')
                res.send(body).status(200).end()
            } else {
                console.log(error)
                res.send("bad res").status(400).end()
            }
        }
        );
    } else {
        console.log('no phone number detected')
        res.send("Call 107").status(200)
        res.end()
    }

});

export { reportRouter }
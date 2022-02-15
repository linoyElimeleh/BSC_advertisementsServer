const express = require('express');
const router = express.Router();
const {mongo, loginService} = require('../services');
const constants = require('../utils/consts');
const serverCount = require('../server')

router.post("/admin/create", function(req, res) {
    let ad = req.body;
    const isValidRequest = validateRequest(ad);
    if(isValidRequest){
        let added = mongo.adminCrudAction({
            type: constants.CREATE_NEW_AD,
            ad:ad
        });
        added.then(data => {
            if(data){
                res.status(200);
                res.send("ad successfully created");
            }
            else
            {
                res.status(500);
                res.send("Error while inserting ad to database")
            }
        })
    }
    else{
        res.status(400);
        res.send("Could not add new ad! \nyou're missing either ids, title, textFields or templateSrc fields")
    }
});

router.post("/admin/update", function(req, res) {
    let ad = req.body;
    const isValidRequest = validateRequest(ad);
    const messageName = ad.messageName;
    if(isValidRequest){
        let updated = mongo.adminCrudAction({
            type: constants.REPLACE_AD,
            messageName : messageName,
            ad:ad
        });
        updated.then(data => {
            if(data){
                res.status(200);
                res.send("ad successfully updated");
            }
            else
            {
                res.status(500);
                res.send("Error while updating ad")
            }
        })
    }
    else{
        res.status(400);
        res.send("Could not add new ad! \nyou're missing either ids, title, textFields or templateSrc fields")
    }
});

router.get('/admin/delete', (req,res) =>{
    let messageName = req.query.messageName;
    let deleted = mongo.adminCrudAction({
        type: constants.DELETE_AD,
        messageName: messageName
    })
    deleted.then(data => {
        if (data) {
            res.status(200);
            res.send("ad successfully deleted");
        } else {
            res.status(404);
            res.send("no such ad")
        }
    })
});

router.get('/admin/active-users', (req, res) => {
    let usersCount = mongo.getAllUsers();
    usersCount.then(data => {
        res.send(data.count.toString());
    })
        .catch(function (e) {
            res.status(500, {
                error: e
            });
        });
});

router.get('/admin/messages', function (req, res) {
    let messages = mongo.getAllMessages();
    messages.then(data => {
        let cleanMessages = data.map(({_id,photoHash,...other})=>other);
        res.send(cleanMessages);
    })
        .catch(function (e) {
            res.status(500, {
                error: e
            });
        });
});

function validateRequest(ad) {
    if (!('ids' in ad) || !('title' in ad) || !('textFields' in ad) || !('templateSrc' in ad)) {
        return false;
    }
    return true;
}

module.exports = router;
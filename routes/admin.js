const express = require('express');
const router = express.Router();
const {mongo, loginService} = require('../services');
const constants = require('../consts');

router.post("/admin/create", function(req, res) {
    const isValidRequest = validateRequest(req.body.ad);
    if(isValidRequest){
        let added = mongo.adminCrudAction({
            type: constants.CREATE_NEW_AD,
            ad:req.body.ad
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
    const isValidRequest = validateRequest(req.body.ad);
    const messageName = req.body.messageName;
    if(isValidRequest){
        let updated = mongo.adminCrudAction({
            type: constants.REPLACE_AD,
            messageName : messageName,
            ad:req.body.ad
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

router.get('/admin/delete/:messageName', (req,res) =>{
    let messageName = req.params.messageName;
    let deleted = mongo.adminCrudAction({
        type: constants.DELETE_AD,
        messageName: messageName
    })
    deleted.then(data => {
        if(data){
            res.status(200);
            res.send("ad successfully deleted");
        }
        else
        {
            res.status(404);
            res.send("no such ad")
        }
    })
});

function validateRequest(ad) {
    if(!('ids' in ad) || !('title' in ad) || !('textFields' in ad) || !('templateSrc' in ad)){
        return false;
    }
    return true;
}

module.exports = router;
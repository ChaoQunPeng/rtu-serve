var express = require('express');
var router = express.Router();
const { exec } = require('../db/mysql');
const { SuccessModel, ErrorModel } = require('../model/response-body');

router.get('/:skillId', (req, res, next) => {
  const skillId = req.params.skillId;
  let sql = `select * from experience where SkillID=${skillId}`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  });
});

router.post('/record', (req, res, next) => {
  const body = req.body;
  let sql = `
  insert into experience 
  (Title,Content,SkillID,Exp,SpendTime,CreateDate) 
  values ('${body.title}','${body.content}',${body.skillId},${body.exp},${body.spendTime},now())`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(req.query);
  let sql = `delete from experience where ExperienceID=${id}`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  });
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  let sql = `update experience set Title='${req.body.Title}',SpendTime='${req.body.SpendTime}',Exp='${req.body.Exp}',Content='${req.body.Content}' where ExperienceID=${id}`

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  });
});


module.exports = router;
var express = require('express');
var router = express.Router();
const { exec } = require('../db/mysql');
const { SuccessModel, ErrorModel } = require('../model/response-body');

router.get('/', function (req, res, next) {
  // s.SortIndex desc ,s.CreateDate
  let sql = `
  select 
    s.SkillID,Name,Theme,s.SortIndex,s.CreateDate,sum(Exp) as TotalExp 
  from 
    skill as s left join experience as e on e.SkillID=s.SkillID  
  and 
    e.IsDelete=0
  group by 
    s.SkillID
  order by 
    TotalExp desc;
  `;

  // 返回 promise
  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.get('/list/:id', function (req, res, next) {
  // res.send('skill list');
  const id = req.params.id;
  let sql = `select * from skill where SkillID=${id}`;
  // 返回 promise
  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.post('/', (req, res, next) => {
  const body = req.body;
  let sql = `insert into skill (Name,CreateDate) values ('${body.Name}',now());`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  let sql = `update skill set Name='${req.body.Name}' where SkillID=${id};`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});


router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  let sql = `delete from skill where SkillID=${id}`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
})

module.exports = router;

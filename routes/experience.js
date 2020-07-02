var express = require('express');
var router = express.Router();
const { exec } = require('../db/mysql');
const { SuccessModel, ErrorModel } = require('../model/response-body');

// 这个路由必需放上面，动态路由放下面，不然express会找不到
router.get('/recycle', (req, res, err) => {
  let sql = `
  select 
    s.Name, e.ExperienceID,e.Title,e.Content,e.Exp,e.CreateDate from experience as e 
  left join 
    skill as s 
  on 
    e.SkillID = s.SkillID 
  where 
    e.IsDelete=1`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.get('/info', (req, res, next) => {
  let sql = `select count(*) as recycleCount from experience where IsDelete=1;`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.get('/total', (req, res, next) => {
  const skillId = req.query.skillId;
  const year = req.query.year;
  const month = req.query.month;

  // ,SkillID,CreateDate,
  // DATE_FORMAT(CreateDate,'%Y') as years ,
  // DATE_FORMAT(CreateDate,'%c') as months,

  // let sql = `
  // select 
  //   sum(Exp) as Exp,
  //   DATE_FORMAT(CreateDate,'%Y-%m-%d') as days
  // from 
  //   experience 
  // where 
  //   SkillID = ${skillId} and 
  //   IsDelete = 0 and
  //   DATE_FORMAT(CreateDate,'%Y') = ${year} and 
  //   DATE_FORMAT(CreateDate,'%c') = ${month}
  // group by 
  //   DATE_FORMAT(CreateDate,'%Y-%m-%d')
  // `;

  let sql = `
  select 
    sum(Exp) as Exp,
    DATE_FORMAT(CreateDate,'%Y-%m-%d') as days
  from 
	  experience 
  where 
     
    IsDelete = 0 and
    DATE_FORMAT(CreateDate,'%Y') = ${year} and 
    DATE_FORMAT(CreateDate,'%c') = ${month}
  `;

  let whereSkillId = ` and SkillID = ${skillId}`;

  let groupBy = `DATE_FORMAT(CreateDate,'%Y-%m-%d')`;

  if (skillId) {
    sql = sql.concat(' ', whereSkillId);
  }

  sql = sql.concat(' group by ', groupBy);

 

  return exec(sql).then(result => {
    console.log(result);
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.get('/:skillId', (req, res, next) => {
  const skillId = req.params.skillId;
  let sql = `select * from experience where SkillID=${skillId} and IsDelete=0 order by CreateDate desc`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.post('/record', (req, res, next) => {
  const body = req.body;
  body.content = body.content.replace(/'/g, "\"");
  let sql = `
  insert into experience 
  (Title,Content,SkillID,Exp,StartTime,EndTime,CreateDate) 
  values ('${body.title}','${body.content}',${body.skillId},${body.exp},'${body.startTime}','${body.endTime}',now())`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(req.query);
  // let sql = `delete from experience where ExperienceID=${id}`;
  let sql = `update experience set IsDelete = 1 where ExperienceID=${id}`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.delete('/real/:id', (req, res, next) => {
  const id = req.params.id;

  let sql = `delete from experience where ExperienceID=${id}`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  let sql = `update experience set 
  Title='${req.body.title}',
  Exp='${req.body.exp}',
  Content='${req.body.content}',
  StartTime='${req.body.startTime}',
  EndTime='${req.body.endTime}'
  where ExperienceID=${id}`

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.put('/restore/:id', (req, res, next) => {
  const id = req.params.id;
  let sql = `update experience set IsDelete = 0 where ExperienceID=${id}`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.put('/modify/:id', (req, res, next) => {
  const id = req.params.id;
  let sql = `update experience set SkillID = ${req.body.SkillID} where ExperienceID=${id}`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});

router.get('/detail/:experienceId', (req, res, next) => {
  const experienceId = req.params.experienceId;

  let sql = `select * from experience where ExperienceId=${experienceId}`;

  return exec(sql).then(result => {
    res.json(new SuccessModel(res.statusCode, '', result));
  }).catch(err => {
    next(err);
  });
});



module.exports = router;
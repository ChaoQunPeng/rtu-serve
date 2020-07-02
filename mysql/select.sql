use rtu;
select * from experience;

select 
    s.SkillID,Name,Theme,s.SortIndex,s.CreateDate,sum(Exp) as TotalExp 
  from 
    skill as s left join experience as e on e.SkillID=s.SkillID  
  and 
    e.IsDelete=0
  group by 
    s.SkillID
  order by 
    TotalExp desc,s.SortIndex desc ,s.CreateDate;

select * from experience;
select Exp,DATE_FORMAT(CreateDate,'%Y-%m-%d') days from experience  where SkillID = 25 group by days;

select 
	-- Exp,
    sum(Exp) as Exp,
    DATE_FORMAT(CreateDate,'%Y-%m-%d') as days
--     SkillID,CreateDate,
-- 	DATE_FORMAT(CreateDate,'%Y') as years ,
-- 	DATE_FORMAT(CreateDate,'%c') as months,
--  DATE_FORMAT(CreateDate,'%e') as days
from 
	experience 
where 
	-- SkillID = 25 and 
	IsDelete=0 and DATE_FORMAT(CreateDate,'%Y') = 2020 and DATE_FORMAT(CreateDate,'%c') = 6 
group by 
	DATE_FORMAT(CreateDate,'%Y-%m-%d');
    
    
select * from experience where IsDelete=0 and date_format(CreateDate,'%c')=6;
    
    

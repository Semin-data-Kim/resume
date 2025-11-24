SELECT ai.animal_id, ai.name
from animal_ins ai
join animal_outs ao on ao.animal_id = ai.animal_id
order by datediff(ao.datetime, ai.datetime) desc
limit 2
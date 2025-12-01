SELECT ai.name, ai.datetime
from animal_ins ai
where not exists (
    select *
    from animal_outs ao
    where ai.animal_id = ao.animal_id)
order by ai.datetime asc
limit 3
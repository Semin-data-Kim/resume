select distinct(h.car_id)
from car_rental_company_rental_history h
join car_rental_company_car r on h.car_id = r.car_id
where r.car_type = '세단'
and h.start_date between '2022-10-01' and '2022-10-31'
order by h.car_id desc
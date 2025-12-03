select fp.product_id, fp.product_name, sum(fp.price*fo.amount) as total_sales
from food_product fp
join food_order fo on fp.product_id = fo.product_id
where date_format(fo.produce_date, '%Y-%m') = '2022-05'
group by fp.product_id, fp.product_name
order by sum(fp.price*fo.amount) desc, fp.product_id asc
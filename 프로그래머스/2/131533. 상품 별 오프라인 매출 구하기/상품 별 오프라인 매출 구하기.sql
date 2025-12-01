select p.PRODUCT_CODE,
sum(p.price*ol.sales_amount) as sales
from product p
join offline_sale ol on ol.PRODUCT_ID = p.PRODUCT_ID 
group by p.PRODUCT_CODE
order by sales desc, product_code asc
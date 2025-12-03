select u.user_id,
    u.nickname,
    concat(u.city, ' ', u.street_address1, ' ',u.street_address2) as '전체주소', 
    concat(substr(u.TLNO,1,3), '-',
          substr(u.TLNO,4,4), '-',
          substr(u.TLNO,8,4)) as '전화번호'
from USED_GOODS_BOARD b
join USED_GOODS_user u on b.writer_id = u.user_id 
group by b.writer_id
having count(*) > 2
order by u.user_id desc
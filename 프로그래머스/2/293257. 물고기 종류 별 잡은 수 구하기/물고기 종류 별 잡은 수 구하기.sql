select count(*) as fish_count, fn.fish_name
from fish_info fi
join fish_name_info fn on fi.fish_type = fn.fish_type
group by fn.fish_name
order by count(*) desc
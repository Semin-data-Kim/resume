SELECT 
    CONCAT('/home/grep/src/', ug.board_id, '/', ug.file_id, ug.file_name, ug.file_ext) AS file_path
FROM used_goods_file AS ug
JOIN (
    SELECT board_id
    FROM used_goods_board
    ORDER BY views DESC, board_id ASC   -- 조회수 내림차순, 동률이면 board_id 오름차순
    LIMIT 1
) AS top_board ON ug.board_id = top_board.board_id
ORDER BY ug.file_id desc
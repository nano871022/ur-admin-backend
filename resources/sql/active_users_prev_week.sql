SELECT
    COUNT(DISTINCT user_pseudo_id) as active_users,
    FORMAT_DATE("%Y%m%d",DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK))  as start_dt,
    FORMAT_DATE("%Y%m%d",CURRENT_DATE()) as end_dt
FROM
    `torressansebastian.analytics_437683494.events_*`
WHERE
    _TABLE_SUFFIX  BETWEEN FORMAT_DATE("%Y%m%d",DATE_SUB(CURRENT_DATE(), INTERVAL 1 WEEK)) AND FORMAT_DATE("%Y%m%d",CURRENT_DATE())

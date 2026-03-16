class ActiveUserStats {
    /**
     * @param {number} activeUsers
     * @param {string} startDate
     * @param {string} endDate
     */
    constructor(activeUsers, startDt,endDt) {
        this.activeUsers = activeUsers;
        this.startDate = startDt;
        this.endDate = endDt;
    }

    /**
     * Maps a BigQuery row to an ActiveUserStats instance.
     * @param {Object} row
     * @returns {ActiveUserStats}
     */
    static fromBigQuery(row) {
        return new ActiveUserStats(
            row.active_users || 0,
            row.start_dt ? row.start_dt.value : null,
            row.end_dt ? row.end_dt.value : null
        );
    }
}

module.exports = { ActiveUserStats };

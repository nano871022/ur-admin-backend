class ActiveUserStats {
    /**
     * @param {number} activeUsers
     * @param {string} referenceDate
     */
    constructor(activeUsers, referenceDate) {
        this.activeUsers = activeUsers;
        this.referenceDate = referenceDate;
    }

    /**
     * Maps a BigQuery row to an ActiveUserStats instance.
     * @param {Object} row
     * @returns {ActiveUserStats}
     */
    static fromBigQuery(row) {
        return new ActiveUserStats(
            row.active_users || 0,
            row.reference_date ? row.reference_date.value : null
        );
    }
}

module.exports = { ActiveUserStats };

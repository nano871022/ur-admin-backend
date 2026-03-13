const { getActiveUserStats } = require('./bigquerySvc');

describe('getActiveUserStats', () => {
    let getActiveUserStatsLocal;
    const mockBqClient = {
        query: jest.fn()
    };
    const mockFs = {
        readFileSync: jest.fn()
    };
    const mockLoadEnv = jest.fn();

    beforeEach(() => {
        jest.resetModules();
        getActiveUserStatsLocal = require('./bigquerySvc').getActiveUserStats;
        jest.clearAllMocks();
        mockFs.readFileSync.mockReturnValue('SELECT * FROM `__TABLE_NAME__`');
        mockLoadEnv.mockReturnValue('test_project.test_dataset.test_table');
    });

    it('should fetch data from BigQuery when cache is empty', async () => {
        const mockRows = [{
            active_users: 100,
            reference_date: { value: '2023-10-01' }
        }];
        mockBqClient.query.mockResolvedValue([mockRows]);

        const stats = await getActiveUserStatsLocal({
            bq: mockBqClient,
            fs: mockFs,
            loadEnv: mockLoadEnv
        });

        expect(stats.activeUsers).toBe(100);
        expect(stats.referenceDate).toBe('2023-10-01');
        expect(mockBqClient.query).toHaveBeenCalledWith(expect.objectContaining({
            query: 'SELECT * FROM `test_project.test_dataset.test_table`'
        }));
    });

    it('should throw error when no data is returned from BigQuery', async () => {
        mockBqClient.query.mockResolvedValue([[]]);

        await expect(getActiveUserStatsLocal({
            bq: mockBqClient,
            fs: mockFs,
            loadEnv: mockLoadEnv
        })).rejects.toThrow('No data returned from BigQuery');
    });
});

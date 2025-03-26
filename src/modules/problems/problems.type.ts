export interface TestCaseResult {
	testcase: number;
	status: 'AC' | 'WA' | 'TLE' | 'RE' | 'CE';
	runtime: number;
	memory: number;
}

export interface SubmissionResult {
	status: 'AC' | 'WA' | 'TLE' | 'RE' | 'CE';
	runtime: number;
	memory: number;
	totalTestCases: number;
	passedTestCases: number;
	failedTestCase?: TestCaseResult;
}
